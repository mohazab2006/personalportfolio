/**
 * Helper functions for fetching projects and personal files from Supabase
 * Includes caching for better performance
 */

import { supabase } from './supabase'
import { Project, PERSONAL, PROJECTS as LOCAL_PROJECTS } from './data'

// Cache configuration
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour
let projectsCache: { data: Project[]; timestamp: number } | null = null
let personalInfoCache: { data: { resumeUrl: string; profileImageUrl: string }; timestamp: number } | null = null

const HERO_FILE = /^hero\.(jpe?g|png|webp)$/i

/** Try these when DB says `hero.*` but the extension in storage differs. */
const HERO_NAME_FALLBACKS = ['hero.jpg', 'hero.png', 'hero.webp', 'hero.jpeg'] as const

function pushUnique(list: string[], seen: Set<string>, name: string) {
  if (!seen.has(name)) {
    list.push(name)
    seen.add(name)
  }
}

/**
 * Ordered filenames to try for the project card (fixes hero.jpg in DB vs hero.png in bucket).
 */
export function heroImageTryList(screenshots: string[]): string[] {
  const ordered: string[] = []
  const seen = new Set<string>()
  const heroFromData = screenshots.find((name) => HERO_FILE.test(name))
  if (heroFromData) pushUnique(ordered, seen, heroFromData)
  if (screenshots[0]) pushUnique(ordered, seen, screenshots[0])
  for (const f of HERO_NAME_FALLBACKS) pushUnique(ordered, seen, f)
  return ordered
}

/** For one gallery filename: if it's a hero asset, try common extensions after the exact name. */
export function imageTryListForSlot(fileName: string): string[] {
  const base = fileName.replace(/\.[^.]+$/i, '').toLowerCase()
  if (base !== 'hero') return [fileName]
  const ordered: string[] = []
  const seen = new Set<string>()
  pushUnique(ordered, seen, fileName)
  for (const f of HERO_NAME_FALLBACKS) pushUnique(ordered, seen, f)
  return ordered
}

/** First image to show on cards / gallery when only hero assets exist in storage. */
export function primaryProjectScreenshot(screenshots: string[]): string {
  const hero = screenshots.find((name) => HERO_FILE.test(name))
  return hero ?? screenshots[0] ?? 'hero.jpg'
}

/** All screenshots for the project detail page, order preserved, deduped. */
export function galleryScreenshots(screenshots: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const name of screenshots) {
    const n = name?.trim()
    if (n && !seen.has(n)) {
      seen.add(n)
      out.push(n)
    }
  }
  return out.length > 0 ? out : ['hero.jpg']
}

/**
 * Get the public URL for a project image
 */
/**
 * Split project copy without a DB column: put the punchy card line first, then a line with only `---`, then the full overview.
 * If there is no `---` separator, the whole string is the overview and cards use the first sentence as before.
 */
export function splitProjectDescription(raw: string): { hook: string | null; body: string } {
  const t = raw.trim()
  if (!t) return { hook: null, body: '' }
  const m = t.match(/^([\s\S]*?)\r?\n\s*---\s*\r?\n([\s\S]+)$/)
  if (!m) return { hook: null, body: t }
  const hook = m[1].trim()
  const body = m[2].trim()
  if (!body) return { hook: null, body: t }
  return { hook: hook || null, body }
}

/** One-line / first-sentence value prop for cards (per docs/project-strategy.md). */
export function projectValueLine(description: string, maxLen = 200): string {
  const t = description.trim()
  const i = t.indexOf('. ')
  if (i > 0 && i < maxLen) return t.slice(0, i + 1)
  const j = t.indexOf('.')
  if (j > 0 && j < maxLen) return t.slice(0, j + 1)
  if (t.length <= maxLen) return t
  const cut = t.slice(0, maxLen - 1)
  const sp = cut.lastIndexOf(' ')
  return (sp > 40 ? cut.slice(0, sp) : cut) + '…'
}

/** Card / TL;DR line: DB `summary`, else part before `---` in `description`, else null. */
export function projectHook(project: Project): string | null {
  const s = project.summary?.trim()
  if (s) return s
  return splitProjectDescription(project.description).hook
}

/** Long overview for the detail page when using columns: `description`. Legacy: body after `---` or full `description`. */
export function projectOverviewText(project: Project): string {
  if (project.summary?.trim()) return project.description.trim()
  const { hook, body } = splitProjectDescription(project.description)
  return hook ? body : project.description.trim()
}

/** Card blurb: hook from `summary` or `---` split; else first sentence of `description`. */
export function projectCardBlurb(project: Project): string {
  const hook = projectHook(project)
  if (hook) return /[.!?…]$/.test(hook) ? hook : `${hook}.`
  const t = project.description.trim()
  const i = t.indexOf('.')
  if (i > 0) return `${t.slice(0, i + 1).trim()}`
  return projectValueLine(t, 220)
}

export function getProjectImageUrl(slug: string, imageName: string): string {
  const { data } = supabase.storage
    .from('project-images')
    .getPublicUrl(`${slug}/${imageName}`)
  
  return data.publicUrl
}

/**
 * Get the public URL for a personal file (resume, profile photo)
 */
export function getPersonalFileUrl(fileName: string): string {
  const { data } = supabase.storage
    .from('personal-files')
    .getPublicUrl(fileName)
  
  return data.publicUrl
}

/**
 * Fetch personal info (resume URL, profile image URL)
 * Uses in-memory cache to reduce API calls
 */
export async function getPersonalInfo(): Promise<{
  resumeUrl: string
  profileImageUrl: string
} | null> {
  // Check cache
  if (personalInfoCache && Date.now() - personalInfoCache.timestamp < CACHE_DURATION) {
    return personalInfoCache.data
  }

  const { data, error } = await supabase
    .from('personal_info')
    .select('resume_url, profile_image_url')
    .limit(1)
    .single()

  if (error || !data) {
    console.error('Error fetching personal info:', error)
    // Return cached data if available, even if expired
    if (personalInfoCache) return personalInfoCache.data
    // Return defaults if database fetch fails
    return {
      resumeUrl: PERSONAL.resumePdf,
      profileImageUrl: '/profile.jpg',
    }
  }

  // Convert storage file names to full URLs
  const info = {
    resumeUrl: getPersonalFileUrl(data.resume_url),
    profileImageUrl: getPersonalFileUrl(data.profile_image_url)
  }

  // Update cache
  personalInfoCache = {
    data: info,
    timestamp: Date.now(),
  }

  return info
}

/**
 * Fetch all projects from Supabase, ordered by order_index
 * Uses in-memory cache to reduce API calls
 */
export async function getProjects(): Promise<Project[]> {
  // Check cache
  if (projectsCache && Date.now() - projectsCache.timestamp < CACHE_DURATION) {
    return projectsCache.data
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching projects:', error)
    // Return cached data if available, even if expired
    if (projectsCache) return projectsCache.data
    throw new Error('Failed to fetch projects')
  }

  // Transform database rows to Project type
  const projects = (data || []).map((row) => ({
    slug: row.slug,
    title: row.title,
    github: row.github,
    demo: row.demo || undefined,
    summary: row.summary?.trim() ? row.summary.trim() : undefined,
    description: row.description,
    stack: row.stack,
    screenshots: row.screenshots,
  }))

  // Update cache
  projectsCache = {
    data: projects,
    timestamp: Date.now(),
  }

  return projects
}

/**
 * Merge Supabase project rows with local `PROJECTS` (remote fields win; local fills gaps).
 * Preserves `order_index` from remote; appends any local-only slugs at the end.
 */
export function mergeProjectsWithLocal(remote: Project[]): Project[] {
  const localMap = new Map(LOCAL_PROJECTS.map((p) => [p.slug, p]))
  if (!remote.length) {
    return [...LOCAL_PROJECTS]
  }
  const seen = new Set<string>()
  const merged: Project[] = []
  for (const r of remote) {
    const local = localMap.get(r.slug)
    merged.push(
      local
        ? {
            ...local,
            ...r,
            demo: r.demo ?? local.demo,
            github: r.github || local.github,
            summary: r.summary ?? local.summary,
          }
        : r
    )
    seen.add(r.slug)
  }
  for (const p of LOCAL_PROJECTS) {
    if (!seen.has(p.slug)) merged.push(p)
  }
  return merged
}

function rowToProject(data: {
  slug: string
  title: string
  github: string
  demo: string | null
  summary?: string | null
  description: string
  stack: string[]
  screenshots: string[]
}): Project {
  return {
    slug: data.slug,
    title: data.title,
    github: data.github,
    demo: data.demo || undefined,
    summary: data.summary?.trim() ? data.summary.trim() : undefined,
    description: data.description,
    stack: data.stack,
    screenshots: data.screenshots,
  }
}

/**
 * Fetch a single project by slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const local = LOCAL_PROJECTS.find((p) => p.slug === slug) ?? null

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single()

    if (!error && data) {
      const remote = rowToProject(data)
      return local
        ? {
            ...local,
            ...remote,
            demo: remote.demo ?? local.demo,
            github: remote.github || local.github,
            summary: remote.summary ?? local.summary,
          }
        : remote
    }

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching project:', error)
    }
  } catch (e) {
    console.error('Error fetching project:', e)
  }

  return local
}

/**
 * Get all project slugs (useful for static generation)
 */
export async function getAllProjectSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('slug')
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching project slugs:', error)
    throw new Error('Failed to fetch project slugs')
  }

  return (data || []).map((row) => row.slug)
}


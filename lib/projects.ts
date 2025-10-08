/**
 * Helper functions for fetching projects and personal files from Supabase
 * Includes caching for better performance
 */

import { supabase } from './supabase'
import { Project } from './data'

// Cache configuration
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour
let projectsCache: { data: Project[]; timestamp: number } | null = null
let personalInfoCache: { data: { resumeUrl: string; profileImageUrl: string }; timestamp: number } | null = null

/**
 * Get the public URL for a project image
 */
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
      resumeUrl: '/resume.pdf',
      profileImageUrl: '/profile.jpg'
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
 * Fetch a single project by slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null
    }
    console.error('Error fetching project:', error)
    throw new Error('Failed to fetch project')
  }

  if (!data) {
    return null
  }

  // Transform database row to Project type
  return {
    slug: data.slug,
    title: data.title,
    github: data.github,
    demo: data.demo || undefined,
    description: data.description,
    stack: data.stack,
    screenshots: data.screenshots,
  }
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


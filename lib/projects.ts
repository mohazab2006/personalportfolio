/**
 * Helper functions for fetching projects and personal files from Supabase
 */

import { supabase } from './supabase'
import { Project } from './data'

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
 */
export async function getPersonalInfo(): Promise<{
  resumeUrl: string
  profileImageUrl: string
} | null> {
  const { data, error } = await supabase
    .from('personal_info')
    .select('resume_url, profile_image_url')
    .limit(1)
    .single()

  if (error || !data) {
    console.error('Error fetching personal info:', error)
    // Return defaults if database fetch fails
    return {
      resumeUrl: '/resume.pdf',
      profileImageUrl: '/profile.jpg'
    }
  }

  // Convert storage file names to full URLs
  return {
    resumeUrl: getPersonalFileUrl(data.resume_url),
    profileImageUrl: getPersonalFileUrl(data.profile_image_url)
  }
}

/**
 * Fetch all projects from Supabase, ordered by order_index
 */
export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching projects:', error)
    throw new Error('Failed to fetch projects')
  }

  // Transform database rows to Project type
  return (data || []).map((row) => ({
    slug: row.slug,
    title: row.title,
    github: row.github,
    demo: row.demo || undefined,
    description: row.description,
    stack: row.stack,
    screenshots: row.screenshots,
  }))
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


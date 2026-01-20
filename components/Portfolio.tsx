'use client'

import { useState, useEffect } from 'react'
import { getProjects } from '@/lib/projects'
import { Project } from '@/lib/data'
import Section from './Section'
import ProjectCard from './ProjectCard'
import TechChips from './TechChips'

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getProjects()
        setProjects(data)
      } catch (err) {
        console.error('Error fetching projects:', err)
        setError('Failed to load projects')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <Section
      id="portfolio"
      title="Portfolio"
      subtitle="Featured projects showcasing my work and skills"
      className="bg-light-bg dark:bg-transparent"
    >
      <div className="space-y-20">
        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {loading && (
            <div className="col-span-full flex justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/40 border-t-white"></div>
            </div>
          )}

          {error && (
            <div className="col-span-full text-center py-20">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {!loading && !error && projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>

        {/* Tech Stack Section */}
        <div className="mx-auto max-w-4xl">
          <h3 className="mb-8 text-center text-3xl font-bold text-light-text dark:text-dark-text">
            Tech Stack
          </h3>
          <TechChips />
        </div>
      </div>
    </Section>
  )
}


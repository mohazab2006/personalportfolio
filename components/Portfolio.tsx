'use client'

import { PROJECTS } from '@/lib/data'
import Section from './Section'
import ProjectCard from './ProjectCard'
import TechChips from './TechChips'

export default function Portfolio() {
  return (
    <Section
      id="portfolio"
      title="Portfolio"
      subtitle="Featured projects showcasing my work and skills"
      className="bg-light-bg dark:bg-dark-bg"
    >
      <div className="space-y-20">
        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, index) => (
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


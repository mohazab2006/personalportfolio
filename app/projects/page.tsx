'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getProjects, mergeProjectsWithLocal } from '@/lib/projects'
import { Project, PROJECTS as LOCAL_PROJECTS } from '@/lib/data'
import { ProjectGridCard } from '@/components/FeaturedWork'
import ProjectPageHeader from '@/components/ProjectPageHeader'
import { SectionHeader } from '@/components/Section'
import SiteFooter from '@/components/SiteFooter'

function ProjectsIndexSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="ops-panel">
          <div className="ops-head">
            <span className="h-2 w-24 animate-pulse bg-white/[0.08]" />
          </div>
          <div className="aspect-[16/10] animate-pulse bg-white/[0.04]" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-4/5 animate-pulse bg-white/[0.06]" />
            <div className="h-3 w-full animate-pulse bg-white/[0.04]" />
          </div>
        </div>
      ))}
    </div>
  )
}

type Filter = 'all' | 'live' | 'source'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    async function fetchProjects() {
      try {
        const remote = await getProjects()
        setProjects(mergeProjectsWithLocal(remote))
      } catch {
        setProjects(LOCAL_PROJECTS)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const visible = projects.filter((p) => (filter === 'all' ? true : filter === 'live' ? !!p.demo : !p.demo))
  const counts = { all: projects.length, live: projects.filter((p) => p.demo).length, source: projects.filter((p) => !p.demo).length }

  return (
    <div className="relative z-[1] min-h-screen text-dark-text">
      <ProjectPageHeader />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8">
        <SectionHeader
          index="01"
          command="ls -l ~/projects"
          title="All projects"
          subtitle="everything i've shipped, same order as the home page."
        />

        {/* Filter, as flags */}
        <div className="-mt-4 mb-8 flex flex-wrap gap-2 font-mono text-[12.5px]" role="group" aria-label="Filter projects">
          {(['all', 'live', 'source'] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`min-h-[40px] border px-3 transition-colors ${
                filter === f
                  ? 'border-dark-accent bg-dark-accent/10 text-dark-accent'
                  : 'border-ops-line-strong text-dark-text/70 hover:border-dark-accent/50 hover:text-dark-accent'
              }`}
            >
              --{f} <span className="text-ops-dim">({counts[f]})</span>
            </button>
          ))}
        </div>

        {loading ? (
          <ProjectsIndexSkeleton />
        ) : visible.length === 0 ? (
          <p className="font-mono text-sm text-ops-dim">ls: no matches</p>
        ) : (
          <motion.div
            key={filter}
            className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            {visible.map((project, i) => (
              <ProjectGridCard key={project.slug} project={project} index={i - 1} /* no featured card here, so start at [01] */ />
            ))}
          </motion.div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}

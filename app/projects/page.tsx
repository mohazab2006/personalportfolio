'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getProjects, mergeProjectsWithLocal } from '@/lib/projects'
import { PERSONAL, Project, PROJECTS as LOCAL_PROJECTS } from '@/lib/data'
import { ProjectGridCard } from '@/components/FeaturedWork'

function ProjectsIndexSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="mb-10 h-10 max-w-sm animate-pulse rounded-lg bg-white/[0.06]" />
      <div className="grid gap-6 sm:grid-cols-2 sm:gap-7 xl:grid-cols-3 xl:gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-white/[0.06] bg-dark-surface"
          >
            <div className="aspect-[16/10] animate-pulse bg-white/[0.04]" />
            <div className="space-y-3 p-6">
              <div className="h-5 w-4/5 animate-pulse rounded bg-white/[0.06]" />
              <div className="h-3 w-full animate-pulse rounded bg-white/[0.04]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="relative min-h-screen text-dark-text">
      <header className="sticky top-0 z-[42] border-b border-white/[0.06] bg-[#070708]/88 py-3 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-[#070708]/76">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 sm:gap-3 sm:px-6 lg:px-8">
          <Link
            href="/#projects"
            className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-dark-accent transition-colors hover:text-white sm:gap-2 sm:px-2.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5 shrink-0"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>Back</span>
          </Link>
          <span className="h-5 w-px shrink-0 bg-white/[0.12]" aria-hidden />
          <Link
            href="/"
            className="min-w-0 shrink truncate rounded-md px-1.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/78 transition-colors hover:text-dark-accent sm:px-2 sm:text-xs"
            style={{ fontFamily: 'var(--font-logo)' }}
          >
            {PERSONAL.name}
          </Link>
          <span className="shrink-0 text-white/20" aria-hidden>
            /
          </span>
          <span className="min-w-0 truncate text-sm font-medium text-white/90">Projects</span>
        </div>
      </header>

      {loading ? (
        <ProjectsIndexSkeleton />
      ) : (
        <motion.main
          className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
        >
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">All projects</h1>
          <p className="mb-10 max-w-2xl text-sm leading-relaxed text-dark-muted sm:text-base">
            Full list of work — same order as on the home page.
          </p>
          {projects.length === 0 ? (
            <p className="text-dark-muted">No projects to show.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 sm:gap-7 xl:grid-cols-3 xl:gap-8">
              {projects.map((project, i) => (
                <ProjectGridCard key={project.slug} project={project} index={i} />
              ))}
            </div>
          )}
        </motion.main>
      )}

      <footer className="border-t border-white/5 pb-[max(2.5rem,env(safe-area-inset-bottom,0px)+1rem)] pt-10 text-center">
        <p className="text-xs text-white/35">© 2026 Mohamed Azab</p>
        <Link href="/" className="mt-2 inline-block text-xs text-dark-accent hover:text-white">
          ← Back to home
        </Link>
      </footer>
    </div>
  )
}

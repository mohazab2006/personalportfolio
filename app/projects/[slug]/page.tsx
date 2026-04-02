'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect, use } from 'react'
import { motion } from 'framer-motion'
import { getProjectBySlug, galleryScreenshots, projectHook, projectOverviewText } from '@/lib/projects'
import type { Project } from '@/lib/data'
import ProjectPageHeader from '@/components/ProjectPageHeader'
import ProjectDetailGallery from '@/components/ProjectDetailGallery'

const TAG_CLASS =
  'rounded-md border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-xs font-medium leading-tight tracking-wide text-dark-muted'

type Props = {
  params: Promise<{ slug: string }>
}

function ProjectDetailSkeleton() {
  return (
    <div className="min-h-screen text-dark-text">
      <div className="h-[52px] border-b border-white/[0.06] bg-white/[0.03]" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="mb-6 h-4 w-40 animate-pulse rounded bg-white/[0.08]" />
        <div className="mb-8 h-14 max-w-xl animate-pulse rounded-lg bg-white/[0.1]" />
        <div className="mb-10 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-16 animate-pulse rounded-md bg-white/[0.06]" />
          ))}
        </div>
        <div className="h-12 w-44 animate-pulse rounded-lg bg-white/[0.08]" />
        <div className="mx-auto mt-16 max-w-5xl space-y-6">
          <div className="h-64 animate-pulse rounded-2xl bg-white/[0.05]" />
          <div className="h-48 animate-pulse rounded-2xl bg-white/[0.04]" />
        </div>
      </div>
    </div>
  )
}

export default function ProjectPage({ params }: Props) {
  const { slug } = use(params)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProject() {
      try {
        const data = await getProjectBySlug(slug)
        setProject(data)
      } catch (err) {
        console.error('Error fetching project:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [slug])

  if (loading) {
    return <ProjectDetailSkeleton />
  }

  if (!project) {
    notFound()
  }

  const shots = galleryScreenshots(project.screenshots)
  const hook = projectHook(project)
  const overviewText = projectOverviewText(project)

  return (
    <div className="relative min-h-screen text-dark-text">
      <ProjectPageHeader title={project.title} />

      <motion.article
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        {/* Hero */}
        <header className="border-b border-white/[0.05] bg-gradient-to-b from-dark-bg-secondary/50 to-transparent">
          <div className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pb-14 sm:pt-10 lg:px-8">
            <Link
              href="/projects"
              className="group mb-6 inline-flex min-h-[44px] items-center gap-2 text-sm text-dark-accent transition-colors hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              All projects
            </Link>

            <h1 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {project.title}
            </h1>

            <div className="mb-8 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span key={tech} className={TAG_CLASS}>
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-white/12 bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:border-dark-accent/35 hover:bg-dark-accent/10 hover:text-dark-accent"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Source
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-dark-accent px-5 py-2.5 text-sm font-semibold text-[#050508] transition-colors duration-200 hover:bg-[#5eead4]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                  Live demo
                </a>
              )}
            </div>
          </div>
        </header>

        <nav
          className="border-b border-white/[0.05] bg-[#070708]/50"
          aria-label="On this page"
        >
          <div className="mx-auto flex max-w-5xl gap-8 px-4 py-3 sm:px-6 lg:px-8">
            <a
              href="#overview"
              className="text-sm font-medium text-dark-muted transition-colors hover:text-dark-accent"
            >
              Overview
            </a>
            {shots.length > 0 ? (
              <a
                href="#gallery"
                className="text-sm font-medium text-dark-muted transition-colors hover:text-dark-accent"
              >
                Gallery
              </a>
            ) : null}
          </div>
        </nav>

        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <section id="overview" className="scroll-mt-28">
            {hook ? (
              <>
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-dark-muted">TL;DR</p>
                <div className="mb-8 rounded-2xl border border-dark-accent/20 bg-dark-accent/[0.06] p-6 sm:p-8">
                  <p className="max-w-prose text-base leading-[1.7] text-white/88 sm:text-lg sm:leading-relaxed">
                    {hook}
                  </p>
                </div>
              </>
            ) : null}
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-dark-muted">Overview</p>
            <div className="rounded-2xl border border-white/[0.06] bg-dark-bg-secondary/40 p-6 sm:p-8">
              <p className="max-w-prose whitespace-pre-line text-base leading-[1.7] text-white/78 sm:text-lg sm:leading-relaxed">
                {overviewText}
              </p>
            </div>
          </section>

          {shots.length > 0 ? (
            <section id="gallery" className="mt-12 scroll-mt-28 sm:mt-16">
              <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-dark-muted">Gallery</h2>
              <p className="mb-8 max-w-prose text-sm leading-relaxed text-dark-muted">
                Interface captures from this project. Tap or click an image for full-screen; use the on-screen
                controls or keyboard arrows to move between shots.
              </p>
              <ProjectDetailGallery slug={project.slug} title={project.title} shots={shots} />
            </section>
          ) : null}
        </div>
      </motion.article>

      <footer className="border-t border-white/5 pb-[max(2.5rem,env(safe-area-inset-bottom,0px)+1rem)] pt-10 text-center">
        <p className="text-xs text-white/35">© 2026 Mohamed Azab</p>
        <Link href="/projects" className="mt-2 inline-block text-xs text-dark-accent hover:text-white">
          ← All projects
        </Link>
      </footer>
    </div>
  )
}

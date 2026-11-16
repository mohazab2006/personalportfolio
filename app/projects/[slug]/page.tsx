'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect, use } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { getProjectBySlug, galleryScreenshots, projectHook, projectOverviewText } from '@/lib/projects'
import { PROJECTS, type Project } from '@/lib/data'
import ProjectPageHeader from '@/components/ProjectPageHeader'
import ProjectDetailGallery from '@/components/ProjectDetailGallery'
import SiteFooter from '@/components/SiteFooter'
import { Poneglyph } from '@/components/fx/QuestBits'

type Props = {
  params: Promise<{ slug: string }>
}

function ProjectDetailSkeleton() {
  return (
    <div className="min-h-screen text-dark-text">
      <div className="h-14 border-b border-ops-line" aria-hidden />
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <div className="mb-6 h-3 w-48 animate-pulse bg-white/[0.08]" />
        <div className="mb-8 h-12 max-w-md animate-pulse bg-white/[0.1]" />
        <div className="mb-10 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-6 w-16 animate-pulse bg-white/[0.06]" />
          ))}
        </div>
        <div className="ops-panel h-56 animate-pulse" />
      </div>
    </div>
  )
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="ops-head">
      <span className="text-dark-text/70">{children}</span>
    </div>
  )
}

export default function ProjectPage({ params }: Props) {
  const { slug } = use(params)
  const reduce = useReducedMotion()
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

  if (loading) return <ProjectDetailSkeleton />
  if (!project) notFound()

  const shots = galleryScreenshots(project.screenshots)
  const hook = projectHook(project)
  const overviewText = projectOverviewText(project)
  const live = !!project.demo

  // Neighbours in the portfolio order, for "cd" between projects
  const order = PROJECTS.map((p) => p.slug)
  const at = order.indexOf(project.slug)
  const prev = at > 0 ? PROJECTS[at - 1] : null
  const next = at >= 0 && at < order.length - 1 ? PROJECTS[at + 1] : null

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay: reduce ? 0 : delay, ease: [0.16, 1, 0.3, 1] as const },
  })

  return (
    <div className="relative z-[1] min-h-screen text-dark-text">
      <ProjectPageHeader title={project.title} slug={project.slug} />

      <article>
        {/* Hero */}
        <header className="border-b border-ops-line">
          <div className="mx-auto max-w-5xl px-4 pb-12 pt-10 sm:px-6 sm:pt-14 lg:px-8">
            <motion.p className="mb-4 font-mono text-xs text-ops-dim sm:text-[13px]" {...rise(0)}>
              <span className="text-ops-ok">$</span> cat ./{project.slug}/README.md
            </motion.p>

            <motion.h1
              className="phosphor-soft mb-5 font-display text-4xl font-extrabold tracking-tight text-dark-text sm:text-5xl lg:text-6xl"
              {...rise(0.05)}
            >
              {project.title}
            </motion.h1>

            <motion.p className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[12.5px]" {...rise(0.1)}>
              <span className={`flex items-center gap-1.5 ${live ? 'text-ops-ok' : 'text-dark-accent'}`}>
                <span
                  className={`status-dot ${live ? 'animate-status-pulse bg-ops-ok shadow-[0_0_8px_rgba(124,228,149,0.8)]' : 'bg-dark-accent'}`}
                />
                {live ? 'live' : project.github ? 'source available' : 'private'}
              </span>
              {project.demo && <span className="truncate text-ops-dim">{project.demo.replace(/^https?:\/\//, '')}</span>}
            </motion.p>

            <motion.ul className="mb-8 flex flex-wrap gap-1.5" aria-label="Stack" {...rise(0.15)}>
              {project.stack.map((tech) => (
                <li key={tech} className="border border-ops-line bg-dark-bg/40 px-2 py-0.5 font-mono text-[12px] lowercase text-dark-muted">
                  {tech}
                </li>
              ))}
            </motion.ul>

            <motion.div className="flex flex-wrap gap-2.5" {...rise(0.2)}>
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="ops-btn ops-btn-primary">
                  open live ↗
                </a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="ops-btn">
                  git clone ↗
                </a>
              )}
              {shots.length > 0 && (
                <a href="#gallery" className="ops-btn">
                  ls ./screenshots
                </a>
              )}
            </motion.div>
          </div>
        </header>

        <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <section id="overview" className="scroll-mt-24 space-y-6">
            {hook && (
              <div className="ops-panel ops-ticks">
                <PanelLabel>tl;dr</PanelLabel>
                <p className="max-w-prose p-5 text-base leading-[1.7] text-dark-text/90 sm:p-7 sm:text-lg">{hook}</p>
              </div>
            )}
            <div className="ops-panel">
              <PanelLabel>overview.md</PanelLabel>
              <p className="max-w-prose whitespace-pre-line p-5 text-[15px] leading-[1.75] text-dark-text/80 sm:p-7 sm:text-base">
                {overviewText}
              </p>
            </div>
          </section>

          {shots.length > 0 && (
            <section id="gallery" className="scroll-mt-24">
              <p className="mb-5 font-mono text-xs text-ops-dim sm:text-[13px]">
                <span className="text-ops-ok">$</span> ls ./screenshots <span className="text-ops-dim">({shots.length})</span>
              </p>
              <ProjectDetailGallery slug={project.slug} title={project.title} shots={shots} />
            </section>
          )}

          <p className="-mb-4 text-right">
            <Poneglyph index={2} />
          </p>

          {/* cd between projects */}
          <nav className="grid gap-3 border-t border-ops-line pt-8 font-mono text-[13px] sm:grid-cols-2" aria-label="More projects">
            {prev ? (
              <Link
                href={`/projects/${prev.slug}`}
                className="ops-panel group block p-4 transition-colors hover:border-dark-accent/50"
              >
                <span className="text-ops-dim">← cd ../{prev.slug}</span>
                <span className="mt-1 block truncate text-dark-text transition-colors group-hover:text-dark-accent">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={`/projects/${next.slug}`}
                className="ops-panel group block p-4 text-right transition-colors hover:border-dark-accent/50"
              >
                <span className="text-ops-dim">cd ../{next.slug} →</span>
                <span className="mt-1 block truncate text-dark-text transition-colors group-hover:text-dark-accent">{next.title}</span>
              </Link>
            )}
          </nav>
        </div>
      </article>

      <SiteFooter />
    </div>
  )
}

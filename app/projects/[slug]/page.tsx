'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect, use } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { getProjectBySlug, galleryScreenshots, heroImageTryList, projectHook, projectOverviewText } from '@/lib/projects'
import { PROJECTS, type Project } from '@/lib/data'
import ProjectPageHeader from '@/components/ProjectPageHeader'
import ProjectDetailGallery from '@/components/ProjectDetailGallery'
import ProjectStorageImage from '@/components/ProjectStorageImage'
import SiteFooter from '@/components/SiteFooter'
import { Poneglyph } from '@/components/fx/QuestBits'
import { useLatency } from '@/lib/health'

type Props = {
  params: Promise<{ slug: string }>
}

const BLUR =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iIzExMTExNCIvPjwvc3ZnPg=='

function ProjectDetailSkeleton() {
  return (
    <div className="min-h-screen text-dark-text">
      <div className="h-14 border-b border-ops-line" aria-hidden />
      <div className="h-[46vh] animate-pulse bg-white/[0.03]" />
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="mb-6 h-12 max-w-md animate-pulse bg-white/[0.08]" />
        <div className="ops-panel h-56 animate-pulse" />
      </div>
    </div>
  )
}

/** The "manifest": everything you'd want at a glance, sticky beside the write-up on desktop. */
function Manifest({ project, index, total }: { project: Project; index: number; total: number }) {
  const ms = useLatency(project.demo)
  const live = !!project.demo
  return (
    <aside className="ops-panel ops-ticks font-mono text-[13px] lg:sticky lg:top-24">
      <div className="ops-head">
        <span className="text-dark-text/70">manifest</span>
        <span className="ml-auto tabular-nums text-ops-dim">
          [{String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}]
        </span>
      </div>
      <dl>
        <div className="grid grid-cols-[5.5rem_1fr] gap-3 border-b border-dashed border-ops-line px-4 py-3">
          <dt className="text-ops-dim">status</dt>
          <dd className={live ? 'text-ops-ok' : 'text-dark-accent'}>
            <span className="flex items-center gap-2">
              <span className={`status-dot ${live ? 'animate-status-pulse bg-ops-ok shadow-[0_0_8px_rgba(124,228,149,0.8)]' : 'bg-dark-accent'}`} />
              {live ? 'live' : project.github ? 'source available' : 'private'}
            </span>
          </dd>
        </div>
        {live && (
          <div className="grid grid-cols-[5.5rem_1fr] gap-3 border-b border-dashed border-ops-line px-4 py-3">
            <dt className="text-ops-dim">latency</dt>
            <dd className="tabular-nums text-dark-text/90">{ms !== null ? `${ms}ms from you` : 'measuring…'}</dd>
          </div>
        )}
        <div className="grid grid-cols-[5.5rem_1fr] gap-3 border-b border-dashed border-ops-line px-4 py-3">
          <dt className="text-ops-dim">stack</dt>
          <dd className="flex flex-wrap gap-1.5">
            {project.stack.map((t) => (
              <span key={t} className="border border-ops-line bg-dark-bg/40 px-1.5 py-0.5 text-[11.5px] lowercase text-dark-muted">
                {t}
              </span>
            ))}
          </dd>
        </div>
      </dl>
      <div className="flex flex-col gap-2 p-4">
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noopener noreferrer" className="ops-btn ops-btn-primary w-full">
            open live ↗
          </a>
        )}
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="ops-btn w-full">
            git clone ↗
          </a>
        )}
      </div>
    </aside>
  )
}

export default function ProjectPage({ params }: Props) {
  const { slug } = use(params)
  const reduce = useReducedMotion()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const { scrollY } = useScroll()
  const bannerY = useTransform(scrollY, [0, 600], [0, 120])
  const bannerFade = useTransform(scrollY, [0, 500], [1, 0.35])

  useEffect(() => {
    async function fetchProject() {
      try {
        setProject(await getProjectBySlug(slug))
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

  const order = PROJECTS.map((p) => p.slug)
  const at = Math.max(0, order.indexOf(project.slug))
  const prev = at > 0 ? PROJECTS[at - 1] : null
  const next = at < order.length - 1 ? PROJECTS[at + 1] : null

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: reduce ? 0 : delay, ease: [0.16, 1, 0.3, 1] as const },
  })

  return (
    <div className="relative z-[1] min-h-screen text-dark-text">
      <ProjectPageHeader title={project.title} slug={project.slug} />

      <article>
        {/* Banner: the product, full width, with the title laid over it */}
        <header className="relative h-[52vh] min-h-[320px] overflow-hidden border-b border-ops-line sm:h-[58vh]">
          <motion.div className="absolute inset-0" style={reduce ? undefined : { y: bannerY, opacity: bannerFade }}>
            <ProjectStorageImage
              slug={project.slug}
              tryList={heroImageTryList(project.screenshots)}
              alt={`${project.title} screenshot`}
              className="object-cover object-top"
              sizes="100vw"
              priority
              placeholder="blur"
              blurDataURL={BLUR}
            />
          </motion.div>
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,11,8,0.35)_0%,rgba(10,11,8,0.55)_45%,#0A0B08_100%)]" aria-hidden />
          <div
            className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_2px,rgba(0,0,0,0.18)_3px)] opacity-60"
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8">
            <motion.p className="mb-3 font-mono text-xs text-dark-text/70 sm:text-[13px]" {...rise(0)}>
              <span className="text-ops-ok">$</span> cat ./{project.slug}/README.md
            </motion.p>
            <motion.h1
              className="phosphor-soft font-display text-4xl font-extrabold tracking-tight text-dark-text sm:text-6xl lg:text-7xl"
              {...rise(0.08)}
            >
              {project.title}
            </motion.h1>
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1fr_320px] lg:gap-12 lg:px-8">
          <div className="min-w-0 space-y-10">
            {hook && (
              <motion.p
                className="border-l-2 border-dark-accent pl-5 text-xl leading-relaxed text-dark-text sm:text-2xl sm:leading-relaxed"
                {...rise(0.15)}
              >
                {hook}
              </motion.p>
            )}

            {/* Manifest sits here on phones, beside the text on desktop */}
            <div className="lg:hidden">
              <Manifest project={project} index={at} total={order.length} />
            </div>

            <section id="overview" className="scroll-mt-24">
              <p className="mb-4 font-mono text-xs text-ops-dim sm:text-[13px]">
                <span className="text-dark-accent">##</span> overview
              </p>
              <p className="max-w-prose whitespace-pre-line text-[15.5px] leading-[1.8] text-dark-text/80 sm:text-[17px]">{overviewText}</p>
            </section>

            {shots.length > 0 && (
              <section id="gallery" className="scroll-mt-24">
                <p className="mb-5 font-mono text-xs text-ops-dim sm:text-[13px]">
                  <span className="text-dark-accent">##</span> screenshots <span className="text-ops-dim">({shots.length})</span>
                </p>
                <ProjectDetailGallery slug={project.slug} title={project.title} shots={shots} />
              </section>
            )}

            <p className="-mb-6 text-right">
              <Poneglyph index={2} />
            </p>

            <nav className="grid gap-3 border-t border-ops-line pt-8 font-mono text-[13px] sm:grid-cols-2" aria-label="More projects">
              {prev ? (
                <Link href={`/projects/${prev.slug}`} className="ops-panel group block p-4 transition-colors hover:border-dark-accent/50">
                  <span className="text-ops-dim">← previous</span>
                  <span className="mt-1 block truncate text-dark-text transition-colors group-hover:text-dark-accent">{prev.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link href={`/projects/${next.slug}`} className="ops-panel group block p-4 text-right transition-colors hover:border-dark-accent/50">
                  <span className="text-ops-dim">next →</span>
                  <span className="mt-1 block truncate text-dark-text transition-colors group-hover:text-dark-accent">{next.title}</span>
                </Link>
              )}
            </nav>
          </div>

          <div className="hidden lg:block">
            <Manifest project={project} index={at} total={order.length} />
          </div>
        </div>
      </article>

      <SiteFooter />
    </div>
  )
}

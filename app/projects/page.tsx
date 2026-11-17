'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { getProjects, mergeProjectsWithLocal, heroImageTryList, projectHook, projectValueLine } from '@/lib/projects'
import { Project, PROJECTS as LOCAL_PROJECTS } from '@/lib/data'
import { ProjectGridCard } from '@/components/FeaturedWork'
import ProjectPageHeader from '@/components/ProjectPageHeader'
import { SectionHeader } from '@/components/Section'
import SiteFooter from '@/components/SiteFooter'
import ProjectStorageImage from '@/components/ProjectStorageImage'
import { useLatency } from '@/lib/health'

type Filter = 'all' | 'live' | 'source'
type View = 'list' | 'grid'

const BLUR =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iIzExMTExNCIvPjwvc3ZnPg=='

function Status({ project }: { project: Project }) {
  const ms = useLatency(project.demo)
  if (project.demo)
    return (
      <span className="flex items-center gap-1.5 text-ops-ok">
        <span className="status-dot animate-status-pulse bg-ops-ok shadow-[0_0_8px_rgba(124,228,149,0.8)]" />
        live{ms !== null && <span className="tabular-nums text-ops-dim">{ms}ms</span>}
      </span>
    )
  return (
    <span className="flex items-center gap-1.5 text-dark-accent">
      <span className="status-dot bg-dark-accent" />
      {project.github ? 'source' : 'private'}
    </span>
  )
}

/** One registry row. On pointer devices hovering it drives the floating preview. */
function Row({ project, index, onHover }: { project: Project; index: number; onHover: (p: Project | null) => void }) {
  const hook = projectHook(project)
  const line = projectValueLine(hook ?? project.description, 140)
  return (
    <li>
      <Link
        href={`/projects/${project.slug}`}
        onMouseEnter={() => onHover(project)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(project)}
        onBlur={() => onHover(null)}
        className="group grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 border-b border-ops-line px-1 py-5 transition-colors hover:bg-dark-accent/[0.04] sm:px-3 lg:grid-cols-[3rem_9rem_1.1fr_1.4fr_auto] lg:gap-x-6"
      >
        {/* thumb (phones) / index (desktop) */}
        <span className="relative row-span-2 h-16 w-24 overflow-hidden border border-ops-line bg-dark-bg lg:row-span-1 lg:h-auto lg:w-auto lg:border-0 lg:bg-transparent">
          <span className="lg:hidden">
            <ProjectStorageImage
              slug={project.slug}
              tryList={heroImageTryList(project.screenshots)}
              alt=""
              className="object-cover"
              sizes="96px"
              placeholder="blur"
              blurDataURL={BLUR}
            />
          </span>
          <span className="hidden font-mono text-[12px] tabular-nums text-ops-dim lg:inline">{String(index + 1).padStart(2, '0')}</span>
        </span>

        <span className="hidden font-mono text-[12px] lg:block">
          <Status project={project} />
        </span>

        <span className="min-w-0">
          <span className="block truncate font-display text-lg font-bold tracking-tight text-dark-text transition-colors group-hover:text-dark-accent sm:text-xl">
            {project.title}
          </span>
          <span className="mt-1 block font-mono text-[11.5px] lg:hidden">
            <Status project={project} />
          </span>
        </span>

        <span className="col-span-2 line-clamp-2 text-[13.5px] leading-relaxed text-dark-text/65 lg:col-span-1 lg:line-clamp-1">{line}</span>

        <span className="hidden items-center gap-3 font-mono text-[11.5px] text-ops-dim lg:flex">
          <span className="hidden xl:inline">{project.stack.slice(0, 3).join(' · ').toLowerCase()}</span>
          <span className="text-dark-accent transition-transform group-hover:translate-x-1">→</span>
        </span>
      </Link>
    </li>
  )
}

export default function ProjectsPage() {
  const reduce = useReducedMotion()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')
  const [view, setView] = useState<View>('list')
  const [hover, setHover] = useState<Project | null>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const listRef = useRef<HTMLDivElement>(null)

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
  const stacks = new Set(projects.flatMap((p) => p.stack.map((s) => s.toLowerCase()))).size

  return (
    <div className="relative z-[1] min-h-screen text-dark-text">
      <ProjectPageHeader />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8">
        <SectionHeader index="~" command="systemctl list-units --type=project" title="All projects" subtitle="everything i've shipped, running or archived." />

        {/* Fleet stats */}
        <dl className="-mt-4 mb-8 grid grid-cols-3 border border-ops-line font-mono sm:max-w-xl">
          {[
            ['services', counts.all],
            ['live', counts.live],
            ['technologies', stacks],
          ].map(([k, v]) => (
            <div key={k} className="border-r border-ops-line px-4 py-3 last:border-r-0">
              <dt className="text-[10.5px] text-ops-dim">{k}</dt>
              <dd className="mt-0.5 text-2xl font-extrabold tabular-nums text-dark-text">{loading ? '—' : v}</dd>
            </div>
          ))}
        </dl>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 font-mono text-[12.5px]">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects">
            {(['all', 'live', 'source'] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`min-h-[40px] border px-3 transition-colors ${
                  filter === f ? 'border-dark-accent bg-dark-accent/10 text-dark-accent' : 'border-ops-line-strong text-dark-text/70 hover:border-dark-accent/50 hover:text-dark-accent'
                }`}
              >
                --{f} <span className="text-ops-dim">({counts[f]})</span>
              </button>
            ))}
          </div>
          <div className="flex gap-1" role="group" aria-label="View">
            {(['list', 'grid'] as View[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`min-h-[40px] border px-3 transition-colors ${
                  view === v ? 'border-dark-text/60 text-dark-text' : 'border-ops-line text-ops-dim hover:text-dark-text'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 animate-pulse border-b border-ops-line bg-white/[0.02]" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <p className="font-mono text-sm text-ops-dim">ls: no matches</p>
        ) : view === 'grid' ? (
          <motion.div key={`grid-${filter}`} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {visible.map((project, i) => (
              <ProjectGridCard key={project.slug} project={project} index={i - 1} />
            ))}
          </motion.div>
        ) : (
          <div
            ref={listRef}
            className="relative"
            onMouseMove={(e) => {
              const r = listRef.current?.getBoundingClientRect()
              if (r) setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
            }}
          >
            {/* column labels (desktop) */}
            <div className="hidden grid-cols-[3rem_9rem_1.1fr_1.4fr_auto] gap-x-6 border-b border-ops-line-strong px-3 pb-2 font-mono text-[10.5px] uppercase tracking-wider text-ops-dim lg:grid">
              <span>#</span>
              <span>status</span>
              <span>service</span>
              <span>what it does</span>
              <span />
            </div>
            <motion.ol key={`list-${filter}`} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
              {visible.map((p, i) => (
                <Row key={p.slug} project={p} index={i} onHover={setHover} />
              ))}
            </motion.ol>

            {/* Floating preview that follows the cursor (pointer devices only) */}
            <AnimatePresence>
              {hover && (
                <motion.div
                  key={hover.slug}
                  className="pointer-events-none absolute z-20 hidden aspect-[16/10] w-[340px] overflow-hidden border border-dark-accent/50 bg-dark-bg shadow-[0_24px_60px_-12px_rgba(0,0,0,0.9)] [@media(hover:hover)]:lg:block"
                  style={{ left: Math.min(pos.x + 28, (listRef.current?.clientWidth ?? 1200) - 360), top: pos.y - 110 }}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: reduce ? 0 : 0.16 }}
                  aria-hidden
                >
                  <ProjectStorageImage
                    slug={hover.slug}
                    tryList={heroImageTryList(hover.screenshots)}
                    alt=""
                    className="object-cover"
                    sizes="340px"
                    placeholder="blur"
                    blurDataURL={BLUR}
                  />
                  <span className="absolute bottom-0 left-0 bg-dark-bg/85 px-2 py-1 font-mono text-[11px] text-dark-accent">svc/{hover.slug}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}

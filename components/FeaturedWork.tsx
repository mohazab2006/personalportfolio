'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  getProjects,
  mergeProjectsWithLocal,
  heroImageTryList,
  projectValueLine,
  projectHook,
} from '@/lib/projects'
import { Project, PROJECTS as LOCAL_PROJECTS, FEATURED_SLUGS_ORDERED } from '@/lib/data'
import Section from './Section'
import ProjectStorageImage from './ProjectStorageImage'
import ProjectLinks from './ProjectLinks'
import { useLatency } from '@/lib/health'

/** Grid cards shown below the hero on narrow viewports; rest link to /projects */
const MOBILE_GRID_VISIBLE = 4

const HERO_SLUG = FEATURED_SLUGS_ORDERED[0]

const cardHover =
  'transition-[border-color,box-shadow] duration-300 ease-out hover:border-dark-accent/45 hover:shadow-[0_0_0_1px_rgb(var(--accent)/0.12),0_28px_56px_-24px_rgba(0,0,0,0.8),0_0_40px_-18px_rgb(var(--accent)/0.35)]'

const tagClass =
  'border border-ops-line bg-dark-bg/40 px-2 py-0.5 font-mono text-[11.5px] lowercase leading-snug text-dark-muted'

/** Honest status derived from what actually exists: a live URL, a public repo, or neither. */
function serviceStatus(project: Project) {
  if (project.demo)
    return { label: 'live', dot: 'bg-ops-ok shadow-[0_0_8px_rgba(124,228,149,0.8)]', text: 'text-ops-ok' }
  if (project.github) return { label: 'source', dot: 'bg-dark-accent', text: 'text-dark-accent' }
  return { label: 'private', dot: 'bg-ops-dim', text: 'text-ops-dim' }
}

function PanelHead({ project, index }: { project: Project; index: number }) {
  const status = serviceStatus(project)
  const latency = useLatency(project.demo)
  return (
    <div className="ops-head">
      <span className={`flex items-center gap-1.5 ${status.text}`}>
        <span className={`status-dot ${status.dot} ${status.label === 'live' ? 'animate-status-pulse' : ''}`} />
        {status.label}
        {latency !== null && <span className="tabular-nums text-ops-dim">{latency}ms</span>}
      </span>
      <span className="text-ops-dim">│</span>
      <span className="truncate text-dark-text/70">svc/{project.slug}</span>
      <span className="ml-auto tabular-nums text-ops-dim">[{String(index + 1).padStart(2, '0')}]</span>
    </div>
  )
}

/** Screenshot treatment: slightly desaturated + scanlines at rest, full colour on hover. */
const imageClass =
  'object-cover grayscale-[40%] sepia-[15%] transition-[transform,filter] duration-500 ease-out group-hover:scale-[1.02] group-hover:grayscale-0 group-hover:sepia-0'

function ImageScanlines() {
  return (
    <div
      className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_2px,rgba(0,0,0,0.18)_3px)] opacity-70 transition-opacity duration-500 group-hover:opacity-20"
      aria-hidden
    />
  )
}

function ProjectsSkeleton() {
  return (
    <div className="space-y-10 lg:space-y-12">
      <div className="overflow-hidden ops-panel lg:grid lg:grid-cols-[1.15fr_1fr]">
        <div className="aspect-[16/10] bg-white/[0.04] motion-safe:animate-pulse lg:aspect-auto lg:min-h-[380px]" />
        <div className="flex flex-col justify-center space-y-4 p-6 lg:p-10">
          <div className="h-9 w-2/3 max-w-xs bg-white/[0.06] motion-safe:animate-pulse" />
          <div className="h-3.5 w-full bg-white/[0.04] motion-safe:animate-pulse" />
          <div className="h-3.5 w-[92%] bg-white/[0.04] motion-safe:animate-pulse" />
          <div className="flex flex-wrap gap-2 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-7 w-16 bg-white/[0.05] motion-safe:animate-pulse" />
            ))}
          </div>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 sm:gap-7 xl:grid-cols-3 xl:gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="overflow-hidden ops-panel"
          >
            <div className="aspect-[16/10] bg-white/[0.04] motion-safe:animate-pulse" />
            <div className="space-y-3 p-6">
              <div className="h-5 w-4/5 bg-white/[0.06] motion-safe:animate-pulse" />
              <div className="h-3 w-full bg-white/[0.04] motion-safe:animate-pulse" />
              <div className="h-3 w-5/6 bg-white/[0.04] motion-safe:animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FeaturedHeroCard({ project }: { project: Project }) {
  const hook = projectHook(project)
  const line = hook ? projectValueLine(hook, 280) : projectValueLine(project.description, 280)

  return (
    <motion.div
      className={`ops-panel ops-ticks group overflow-hidden ${cardHover}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
    >
      <PanelHead project={project} index={0} />
      <div className="grid lg:grid-cols-[1.2fr_1fr]">
        <div className="relative aspect-[16/10] overflow-hidden border-b border-ops-line bg-dark-bg lg:aspect-auto lg:min-h-[400px] lg:border-b-0 lg:border-r">
          <ProjectStorageImage
            slug={project.slug}
            tryList={heroImageTryList(project.screenshots)}
            alt={`${project.title} preview`}
            className={imageClass}
            sizes="(max-width: 1024px) 100vw, 58vw"
            priority
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iIzExMTExNCIvPjwvc3ZnPg=="
          />
          <ImageScanlines />
          <span className="absolute left-3 top-3 bg-dark-accent px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-dark-bg">
            featured
          </span>
        </div>

        <div className="relative flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <p className="mb-3 font-mono text-xs text-ops-dim">
            <span className="text-ops-ok">$</span> cat ./{project.slug}/README.md
          </p>
          <h3 className="phosphor-soft mb-4 font-display text-3xl font-extrabold tracking-tight text-dark-text lg:text-4xl xl:text-5xl">
            {project.title}
          </h3>
          <p className="mb-7 max-w-prose text-[15px] leading-relaxed text-dark-text/70 line-clamp-4 lg:text-base lg:line-clamp-5">
            {line}
          </p>
          <div className="mb-7 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 8).map((tech) => (
              <span key={tech} className={tagClass}>
                {tech}
              </span>
            ))}
          </div>
          <ProjectLinks project={project} variant="hero" />
        </div>
      </div>
    </motion.div>
  )
}

export function ProjectGridCard({ project, index }: { project: Project; index: number }) {
  const hook = projectHook(project)
  const line = hook ? projectValueLine(hook, 150) : projectValueLine(project.description, 150)

  return (
    <motion.article
      className={`ops-panel group flex h-full flex-col overflow-hidden ${cardHover}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.45, delay: Math.max(0, Math.min(index * 0.04, 0.36)) }}
    >
      <PanelHead project={project} index={index + 1} />
      <div className="relative aspect-[16/10] overflow-hidden border-b border-ops-line bg-dark-bg">
        <ProjectStorageImage
          slug={project.slug}
          tryList={heroImageTryList(project.screenshots)}
          alt={`${project.title} preview`}
          className={imageClass}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iIzExMTExNCIvPjwvc3ZnPg=="
        />
        <ImageScanlines />
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
        <h3 className="mb-2 font-display text-xl font-bold tracking-tight text-dark-text transition-colors group-hover:text-dark-accent">
          {project.title}
        </h3>
        <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-dark-text/65">{line}</p>
        <div className="mb-5 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 6).map((tech) => (
            <span key={tech} className={tagClass}>
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-auto border-t border-dashed border-ops-line pt-4">
          <ProjectLinks project={project} variant="grid" />
        </div>
      </div>
    </motion.article>
  )
}

export default function FeaturedWork() {
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

  const hero = projects.find((p) => p.slug === HERO_SLUG)
  const gridProjects = hero ? projects.filter((p) => p.slug !== hero.slug) : projects
  const mobileMoreCount =
    gridProjects.length > MOBILE_GRID_VISIBLE ? gridProjects.length - MOBILE_GRID_VISIBLE : 0

  if (loading) {
    return (
      <Section
        id="projects"
        index="01"
        command="ls ./projects --sort=impact"
        title="Projects"
        subtitle="selected work — systems, products, and client builds."
      >
        <ProjectsSkeleton />
      </Section>
    )
  }

  if (projects.length === 0) {
    return null
  }

  return (
    <Section
      id="projects"
      index="01"
      command="ls ./projects --sort=impact"
      title="Projects"
      subtitle="selected work — systems, products, and client builds."
    >
      <div className="space-y-10 lg:space-y-14">
        {hero && <FeaturedHeroCard project={hero} />}
        {gridProjects.length > 0 && (
          <div
            className={
              hero
                ? 'border-t border-dashed border-ops-line pt-10 lg:pt-14'
                : ''
            }
          >
            <div className="grid gap-6 sm:grid-cols-2 sm:gap-7 xl:grid-cols-3 xl:gap-8">
              {gridProjects.map((project, i) => (
                <div
                  key={project.slug}
                  className={i >= MOBILE_GRID_VISIBLE ? 'hidden lg:contents' : 'contents'}
                >
                  <ProjectGridCard project={project} index={i} />
                </div>
              ))}
            </div>
            {mobileMoreCount > 0 && (
              <div className="mt-8 flex justify-center lg:hidden">
                <Link
                  href="/projects"
                  className="ops-btn"
                >
                  ls ./projects --all
                  <span className="text-dark-muted">(+{mobileMoreCount})</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 w-4"
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </Section>
  )
}

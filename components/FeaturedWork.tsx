'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getProjects, mergeProjectsWithLocal, heroImageTryList, projectValueLine } from '@/lib/projects'
import { Project, PROJECTS as LOCAL_PROJECTS, FEATURED_SLUGS_ORDERED } from '@/lib/data'
import Section from './Section'
import ProjectStorageImage from './ProjectStorageImage'
import ProjectLinks from './ProjectLinks'

/** Grid cards shown below the hero on narrow viewports; rest link to /projects */
const MOBILE_GRID_VISIBLE = 4

const HERO_SLUG = FEATURED_SLUGS_ORDERED[0]

const cardHover =
  'transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-white/[0.11] hover:shadow-[0_28px_56px_-20px_rgba(0,0,0,0.65),0_0_0_1px_rgba(45,212,191,0.05)]'

const tagClass =
  'rounded-md border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-xs font-medium leading-tight tracking-wide text-dark-muted'

function ProjectsSkeleton() {
  return (
    <div className="space-y-10 lg:space-y-12">
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-dark-surface lg:grid lg:grid-cols-[1.15fr_1fr]">
        <div className="aspect-[16/10] min-h-[220px] bg-white/[0.04] motion-safe:animate-pulse lg:min-h-[380px]" />
        <div className="flex flex-col justify-center space-y-4 p-6 lg:p-10">
          <div className="h-9 w-2/3 max-w-xs rounded-md bg-white/[0.06] motion-safe:animate-pulse" />
          <div className="h-3.5 w-full rounded bg-white/[0.04] motion-safe:animate-pulse" />
          <div className="h-3.5 w-[92%] rounded bg-white/[0.04] motion-safe:animate-pulse" />
          <div className="flex flex-wrap gap-2 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-7 w-16 rounded-md bg-white/[0.05] motion-safe:animate-pulse" />
            ))}
          </div>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 sm:gap-7 xl:grid-cols-3 xl:gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-white/[0.06] bg-dark-surface"
          >
            <div className="aspect-[16/10] bg-white/[0.04] motion-safe:animate-pulse" />
            <div className="space-y-3 p-6">
              <div className="h-5 w-4/5 rounded bg-white/[0.06] motion-safe:animate-pulse" />
              <div className="h-3 w-full rounded bg-white/[0.04] motion-safe:animate-pulse" />
              <div className="h-3 w-5/6 rounded bg-white/[0.04] motion-safe:animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FeaturedHeroCard({ project }: { project: Project }) {
  const line = projectValueLine(project.description, 280)

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-dark-surface shadow-[0_32px_64px_-28px_rgba(0,0,0,0.75)] ring-1 ring-inset ring-white/[0.03] ${cardHover}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid lg:grid-cols-[1.15fr_1fr]">
        <div className="relative aspect-[16/10] min-h-[220px] overflow-hidden bg-[#0a0a0c] lg:aspect-auto lg:min-h-[380px]">
          <ProjectStorageImage
            slug={project.slug}
            tryList={heroImageTryList(project.screenshots)}
            alt={`${project.title} preview`}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 58vw"
            priority
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iIzExMTExNCIvPjwvc3ZnPg=="
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-dark-surface/50 hidden lg:block" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark-surface via-dark-surface/15 to-transparent lg:hidden" />
        </div>

        <div className="relative flex flex-col justify-center p-6 sm:p-8 lg:p-10 lg:pl-8 xl:pl-12">
          <h3 className="mb-3 text-2xl font-bold tracking-tight text-white lg:text-3xl xl:text-4xl">
            {project.title}
          </h3>
          <p className="mb-7 max-w-prose text-sm leading-relaxed text-dark-muted lg:text-base lg:leading-relaxed line-clamp-4 lg:line-clamp-5">
            {line}
          </p>
          <div className="mb-7 flex flex-wrap gap-2">
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
  const line = projectValueLine(project.description, 150)

  return (
    <motion.article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-dark-surface ring-1 ring-inset ring-white/[0.02] ${cardHover}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.36) }}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0a0a0c]">
        <ProjectStorageImage
          slug={project.slug}
          tryList={heroImageTryList(project.screenshots)}
          alt={`${project.title} preview`}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iIzExMTExNCIvPjwvc3ZnPg=="
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark-surface via-transparent to-transparent opacity-85" />
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
        <h3 className="mb-2 text-lg font-semibold tracking-tight text-white">{project.title}</h3>
        <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-dark-muted">{line}</p>
        <div className="mb-5 flex flex-wrap gap-2">
          {project.stack.slice(0, 5).map((tech) => (
            <span key={tech} className={tagClass}>
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-auto border-t border-white/[0.06] pt-5">
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
        title="Projects"
        subtitle="Selected work — systems, products, and client builds."
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
      title="Projects"
      subtitle="Selected work — systems, products, and client builds."
    >
      <div className="space-y-10 lg:space-y-14">
        {hero && <FeaturedHeroCard project={hero} />}
        {gridProjects.length > 0 && (
          <div
            className={
              hero
                ? 'border-t border-white/[0.06] pt-10 lg:pt-14'
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
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-dark-accent/35 hover:bg-dark-accent/10 hover:text-dark-accent"
                >
                  More projects
                  <span className="text-dark-muted">({mobileMoreCount})</span>
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

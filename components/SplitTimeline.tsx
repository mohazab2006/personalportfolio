'use client'

import Image from 'next/image'
import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  buildLeadershipTimeline,
  buildWorkTimeline,
  timelineKey,
  type TimelineEntry,
} from '@/lib/experienceTimeline'
import { logoUrl } from '@/lib/logoUrl'

const viewport = { once: true, amount: 0.22, margin: '0px 0px -12% 0px' } as const

const easeSmooth = [0.16, 1, 0.3, 1] as const

const TYPE_LABEL: Record<TimelineEntry['kind'], string> = {
  work: 'Work',
  education: 'Education',
  leadership: 'Leadership',
}

function listForEntry(entry: TimelineEntry): string[] {
  if (entry.kind === 'education') {
    const lines: string[] = []
    if (entry.gpa) lines.push(entry.gpa)
    if (entry.tags?.length) lines.push(...entry.tags)
    else if (entry.courses?.length) lines.push(...entry.courses.slice(0, 8))
    return lines
  }
  return entry.bullets
}

function TimelineCard({ entry }: { entry: TimelineEntry }) {
  const isEducation = entry.kind === 'education'
  const title = isEducation ? entry.school : entry.org
  const subtitle = isEducation ? entry.degree : entry.role
  const period = isEducation ? entry.years : entry.dates
  const logo = entry.logo
  const logoFillsCircle = 'org' in entry && entry.org === 'KOVA'
  const highlights = listForEntry(entry)

  return (
    <article className="relative rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] backdrop-blur-sm transition-colors hover:border-white/[0.12] sm:p-7">
      <div className="mb-5 flex items-start gap-4 sm:gap-5">
        {logo && (
          <div
            className={
              logoFillsCircle
                ? 'relative h-[3.25rem] w-[3.25rem] shrink-0 overflow-hidden rounded-full bg-white shadow-[0_2px_16px_-4px_rgba(0,0,0,0.45)] ring-1 ring-white/15 sm:h-16 sm:w-16'
                : 'relative h-[3.25rem] w-[3.25rem] shrink-0 overflow-hidden rounded-full bg-gradient-to-b from-white/[0.09] to-white/[0.03] shadow-[0_2px_16px_-4px_rgba(0,0,0,0.45)] ring-1 ring-white/10 sm:h-16 sm:w-16'
            }
          >
            <Image
              src={logoUrl(logo)}
              alt=""
              fill
              className={logoFillsCircle ? 'object-cover object-center' : 'object-contain p-1.5 sm:p-2'}
              sizes="(max-width: 640px) 52px, 64px"
              unoptimized
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/50">
              {TYPE_LABEL[entry.kind]}
            </span>
            <span className="text-xs text-white/45">{period}</span>
          </div>
          <h3 className="font-display text-lg font-semibold tracking-tight text-white sm:text-xl">{title}</h3>
          <p className="mt-1 text-sm leading-snug text-white/58 sm:text-[0.9375rem]">{subtitle}</p>
        </div>
      </div>
      <ul className="space-y-2.5 border-t border-white/[0.06] pt-5">
        {highlights.map((h, i) => (
          <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-white/68 sm:text-[0.9375rem]">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-400/70" />
            <span>{h}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

function ColumnHeader({ label, subtitle }: { label: string; subtitle: string }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className="mb-6 sm:mb-8"
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: easeSmooth }}
      viewport={viewport}
    >
      <h3 className="font-display text-lg font-semibold tracking-tight text-white sm:text-xl">{label}</h3>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-white/42">{subtitle}</p>
    </motion.div>
  )
}

function TimelineReveal({
  side,
  index,
  children,
}: {
  side: 'left' | 'right'
  index: number
  children: React.ReactNode
}) {
  const reduceMotion = useReducedMotion()
  const fromX = reduceMotion ? 0 : side === 'left' ? -22 : 22

  return (
    <motion.div
      className="w-full"
      initial={
        reduceMotion
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, x: fromX, y: 26 }
      }
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.58,
        delay: reduceMotion ? 0 : index * 0.07,
        ease: easeSmooth,
      }}
      viewport={viewport}
    >
      {children}
    </motion.div>
  )
}

function Column({
  label,
  subtitle,
  entries,
  side,
}: {
  label: string
  subtitle: string
  entries: TimelineEntry[]
  side: 'left' | 'right'
}) {
  return (
    <div className="relative min-w-0">
      <ColumnHeader label={label} subtitle={subtitle} />
      <ul className="flex flex-col gap-8 sm:gap-9">
        {entries.map((entry, index) => (
          <li key={timelineKey(entry, index)}>
            <TimelineReveal side={side} index={index}>
              <TimelineCard entry={entry} />
            </TimelineReveal>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SectionIntro() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className="mb-12 text-center sm:mb-16"
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.5, ease: easeSmooth }}
      viewport={{ once: true, amount: 0.6 }}
    >
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-emerald-400/80">Experience</p>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Work & leadership
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-sm text-white/50">
        Professional roles and campus leadership. Degree and coursework live in Education below. Newest first
        in each column.
      </p>
    </motion.div>
  )
}

export default function SplitTimeline() {
  const workEntries = useMemo(() => buildWorkTimeline(), [])
  const leadershipEntries = useMemo(() => buildLeadershipTimeline(), [])

  return (
    <section className="relative py-16 sm:py-24" id="experience">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionIntro />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-0">
          <div className="lg:pr-10 xl:pr-14">
            <Column
              side="left"
              label="Work"
              subtitle="Co-op, founding, and client-facing engineering."
              entries={workEntries}
            />
          </div>

          <div className="lg:border-l lg:border-white/[0.07] lg:pl-10 xl:pl-14">
            <Column
              side="right"
              label="Leadership"
              subtitle="Organizations and initiatives outside of coursework."
              entries={leadershipEntries}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

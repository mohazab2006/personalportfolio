'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  buildLeadershipTimeline,
  buildWorkTimeline,
  timelineKey,
  type TimelineEntry,
} from '@/lib/experienceTimeline'
import { logoUrl } from '@/lib/logoUrl'
import { SectionHeader } from '@/components/Section'
import { PowerSwitch } from '@/components/fx/QuestBits'
import ShowMore, { collapsible } from '@/components/ShowMore'

const viewport = { once: true, amount: 0.22, margin: '0px 0px -12% 0px' } as const

const easeSmooth = [0.16, 1, 0.3, 1] as const

const TYPE_LABEL: Record<TimelineEntry['kind'], string> = {
  work: 'work',
  education: 'edu',
  leadership: 'lead',
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
  const highlights = listForEntry(entry)
  const isUpcoming = 'upcoming' in entry && !!entry.upcoming

  return (
    <article className="ops-panel group transition-colors hover:border-ops-line-strong">
      {/* Log line: timestamp, unit, level */}
      <div className="ops-head">
        <span className="tabular-nums text-dark-accent">{period}</span>
        {isUpcoming && (
          <span className="flex items-center gap-1.5 text-ops-ok">
            <span className="status-dot animate-status-pulse bg-ops-ok shadow-[0_0_8px_rgba(124,228,149,0.8)]" />
            upcoming
          </span>
        )}
        <span className="ml-auto text-ops-dim">[{TYPE_LABEL[entry.kind]}]</span>
      </div>
      <div className="p-5 sm:p-6">
        <div className="mb-4 flex items-start gap-4">
          {logo && (
            // Logos sit straight on the panel — no plate — with a faint glow so they feel lit, not pasted.
            <div className="relative h-12 w-12 shrink-0 sm:h-14 sm:w-14">
              <Image
                src={logoUrl(logo)}
                alt=""
                fill
                className="object-contain drop-shadow-[0_0_14px_rgba(236,232,218,0.08)] transition-transform duration-300 group-hover:scale-105"
                sizes="56px"
                unoptimized
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg font-bold tracking-tight text-dark-text sm:text-xl">{title}</h3>
            <p className="mt-1 text-sm leading-snug text-dark-text/60">{subtitle}</p>
          </div>
        </div>
        <ul className="space-y-2 border-t border-dashed border-ops-line pt-4">
          {highlights.map((h, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-dark-text/70">
              <span className="shrink-0 font-mono text-ops-ok" aria-hidden>
                ›
              </span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

function ColumnHeader({ label, subtitle }: { label: string; subtitle: string }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className="mb-6 flex items-baseline gap-3 border-b border-ops-line pb-3 font-mono sm:mb-8"
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: easeSmooth }}
      viewport={viewport}
    >
      <h3 className="text-base font-bold lowercase text-dark-text">
        <span className="text-dark-accent">unit:</span> {label}
      </h3>
      <p className="truncate text-xs text-ops-dim">{'// '}{subtitle}</p>
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
  const [all, setAll] = useState(false)
  const LIMIT = 2 // phones: the two most recent, the rest behind "show all"
  return (
    <div className="relative min-w-0">
      <ColumnHeader label={label} subtitle={subtitle} />
      <ul className="flex flex-col gap-8 sm:gap-9">
        {entries.map((entry, index) => (
          <li key={timelineKey(entry, index)} className={collapsible(index, LIMIT, all)}>
            <TimelineReveal side={side} index={index}>
              <TimelineCard entry={entry} />
            </TimelineReveal>
          </li>
        ))}
      </ul>
      <ShowMore expanded={all} hidden={Math.max(0, entries.length - LIMIT)} onToggle={() => setAll((v) => !v)} className="mt-6" />
    </div>
  )
}

export default function SplitTimeline() {
  const workEntries = useMemo(() => buildWorkTimeline(), [])
  const leadershipEntries = useMemo(() => buildLeadershipTimeline(), [])

  return (
    <section className="relative py-14 sm:py-20 lg:py-section" id="experience">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="02"
          command="journalctl -u experience --reverse"
          title="Experience"
          subtitle="work and campus leadership, newest first. degree and coursework live in education."
        />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-10 xl:gap-14">
          <Column
            side="left"
            label="work"
            subtitle="co-op, founding, client engineering"
            entries={workEntries}
          />
          <Column
            side="right"
            label="leadership"
            subtitle="orgs and initiatives"
            entries={leadershipEntries}
          />
        </div>
        <div className="mt-6 flex justify-end">
          <PowerSwitch />
        </div>
      </div>
    </section>
  )
}

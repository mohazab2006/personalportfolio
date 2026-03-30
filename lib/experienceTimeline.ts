import { EDUCATION, EXPERIENCE, LEADERSHIP, ExperienceItem, EducationItem } from './data'

export type TimelineKind = 'work' | 'education' | 'leadership'

export type TimelineEntry = (
  | (ExperienceItem & { kind: 'work' | 'leadership' })
  | (EducationItem & { kind: 'education' })
) & { kind: TimelineKind }

const MONTH: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
}

/**
 * First segment before en/em dash — start of the range.
 */
function firstSegment(raw: string): string {
  return raw.split(/\u2013|\u2014|--/)[0]?.trim() ?? raw.trim()
}

/**
 * Parse start instant for sorting (newest-first = larger ms first).
 * Education "2024 – 2028" → Sept 1 of start year (typical fall intake).
 */
export function getTimelineStartMs(entry: TimelineEntry): number {
  const raw = entry.kind === 'education' ? entry.years : entry.dates
  if (!raw) return 0

  const seg = firstSegment(raw)

  const yearAlone = seg.match(/^(\d{4})\b/)
  if (yearAlone) {
    const y = parseInt(yearAlone[1], 10)
    return new Date(y, 8, 1).getTime()
  }

  const monthYear = seg.match(/^([A-Za-z]+)\s+(\d{4})\b/)
  if (monthYear) {
    const monKey = monthYear[1].toLowerCase()
    const month = MONTH[monKey] ?? 0
    const y = parseInt(monthYear[2], 10)
    return new Date(y, month, 1).getTime()
  }

  const yearFallback = seg.match(/(\d{4})/)
  if (yearFallback) {
    return new Date(parseInt(yearFallback[1], 10), 0, 1).getTime()
  }

  return 0
}

export function getTimelineYear(entry: TimelineEntry): number {
  return new Date(getTimelineStartMs(entry)).getFullYear()
}

/** Reverse-chronological (most recent / upcoming start first). */
export function buildSortedTimeline(): TimelineEntry[] {
  const rows: TimelineEntry[] = [
    ...EXPERIENCE.map((item) => ({ ...item, kind: 'work' as const })),
    ...EDUCATION.map((item) => ({ ...item, kind: 'education' as const })),
    ...LEADERSHIP.map((item) => ({ ...item, kind: 'leadership' as const })),
  ]

  return rows.sort((a, b) => getTimelineStartMs(b) - getTimelineStartMs(a))
}

/** Right column: leadership only, newest first. (Education is a separate section below.) */
export function buildLeadershipTimeline(): TimelineEntry[] {
  const rows: TimelineEntry[] = LEADERSHIP.map((item) => ({ ...item, kind: 'leadership' as const }))
  return rows.sort((a, b) => getTimelineStartMs(b) - getTimelineStartMs(a))
}


/** Work / co-op entries only, newest first (Experience section, left column). */
export function buildWorkTimeline(): TimelineEntry[] {
  const rows = EXPERIENCE.map((item) => ({ ...item, kind: 'work' as const }))
  return rows.sort((a, b) => getTimelineStartMs(b) - getTimelineStartMs(a))
}

export function timelineKey(entry: TimelineEntry, index: number): string {
  const id =
    entry.kind === 'education'
      ? `${entry.school}-${entry.years}`
      : `${entry.org}-${entry.dates}`
  return `${entry.kind}-${id}-${index}`
}

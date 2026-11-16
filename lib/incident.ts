'use client'

import { useEffect, useState } from 'react'

/**
 * "Incident mode": the visitor breaks the site on purpose (never automatically), fights the attack,
 * reboots, and watches the box come back up. Recruiters who never press anything never see it.
 */
export type IncidentCause = 'button' | 'ddos' | 'forkbomb' | 'shutdown' | 'oncall'

export const INCIDENT_EVENT = 'azab-incident'
export const INCIDENT_RESOLVED_EVENT = 'azab-incident-resolved'
const STATS_KEY = 'azab-incidents'

/** What the post-mortem log says happened, per trigger. Terse, lowercase, a little ominous. */
export const CAUSES: Record<IncidentCause, { title: string; log: string[] }> = {
  button: {
    title: 'someone pressed the button',
    log: [
      'event: big red button actuated by visitor',
      'it said do not press.',
      'upstream: 48,113 req/s and climbing',
      'nginx: worker_connections exhausted',
      'kernel: out of memory. killing process 1 (azab.dev)',
    ],
  },
  ddos: {
    title: 'volumetric attack',
    log: [
      'ingress: 2.1 Gbps from 9,412 sources',
      'syn backlog full. dropping handshakes',
      'cloudflare: challenge rate 100%',
      'origin unreachable',
      'azab.dev: down',
    ],
  },
  forkbomb: {
    title: 'fork bomb',
    log: [
      ':(){ :|:& };:',
      'pid table: 32768/32768',
      'fork: resource temporarily unavailable',
      'fork: resource temporarily unavailable',
      'everything is a child process now. azab.dev: down',
    ],
  },
  shutdown: {
    title: 'unauthorised shutdown',
    log: [
      'broadcast message from visitor@azab:',
      'the system is going down NOW',
      'stopping snaggy.service … done',
      'unmounting /projects … done',
      'power off. azab.dev: down',
    ],
  },
  oncall: {
    title: 'cascading failure',
    log: [
      'on-call shift ended below 40% uptime',
      'retries amplified load 9x',
      'circuit breakers: open',
      'the outage spread to production',
      'azab.dev: down',
    ],
  },
}

export function triggerIncident(cause: IncidentCause) {
  window.dispatchEvent(new CustomEvent<IncidentCause>(INCIDENT_EVENT, { detail: cause }))
}

export type IncidentStats = { survived: number; fastestMs: number | null }

export function readIncidentStats(): IncidentStats {
  try {
    const raw = localStorage.getItem(STATS_KEY)
    return raw ? (JSON.parse(raw) as IncidentStats) : { survived: 0, fastestMs: null }
  } catch {
    return { survived: 0, fastestMs: null }
  }
}

export function recordRecovery(ms: number): IncidentStats {
  const prev = readIncidentStats()
  const next = { survived: prev.survived + 1, fastestMs: prev.fastestMs === null ? ms : Math.min(prev.fastestMs, ms) }
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(INCIDENT_RESOLVED_EVENT))
  return next
}

export function useIncidentStats(): IncidentStats {
  const [stats, setStats] = useState<IncidentStats>({ survived: 0, fastestMs: null })
  useEffect(() => {
    setStats(readIncidentStats())
    const on = () => setStats(readIncidentStats())
    window.addEventListener(INCIDENT_RESOLVED_EVENT, on)
    return () => window.removeEventListener(INCIDENT_RESOLVED_EVENT, on)
  }, [])
  return stats
}

'use client'

import { useEffect, useState } from 'react'

/**
 * Real latency to each live project, measured from the visitor's browser.
 * `no-cors` gives an opaque response but still times the round trip honestly.
 * Failures return null and the UI simply omits the number (we never claim a project is down).
 */
const cache = new Map<string, Promise<number | null>>()

function ping(url: string): Promise<number | null> {
  const hit = cache.get(url)
  if (hit) return hit
  const p = (async () => {
    const ctrl = new AbortController()
    const timeout = window.setTimeout(() => ctrl.abort(), 6000)
    const t = performance.now()
    try {
      await fetch(url, { mode: 'no-cors', cache: 'no-store', signal: ctrl.signal })
      return Math.round(performance.now() - t)
    } catch {
      return null
    } finally {
      window.clearTimeout(timeout)
    }
  })()
  cache.set(url, p)
  return p
}

export function useLatency(url?: string): number | null {
  const [ms, setMs] = useState<number | null>(null)
  useEffect(() => {
    if (!url) return
    let alive = true
    // Wait until the page has settled so pings never compete with first paint.
    const start = () => ping(url).then((v) => alive && setMs(v))
    const id = window.setTimeout(start, 1800)
    return () => {
      alive = false
      window.clearTimeout(id)
    }
  }, [url])
  return ms
}

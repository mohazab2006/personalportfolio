'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { findEgg } from '@/lib/eggs'
import { TOAST_EVENT } from './QuestBits'
import { SCREEN_GLITCH_EVENT } from '@/lib/events'
import GlitchText from './GlitchText'

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
export const LOGO_TAP_EVENT = 'azab-logo-tap'

type Toast = { id: number; title: string; sub: string; special?: boolean }

/**
 * Site-wide effects:
 *  - Konami code on the page (or tapping the MA logo 7× quickly on a phone) → egg + screen tear
 *  - full-screen RGB tear whenever something dispatches SCREEN_GLITCH_EVENT
 *  - a small toast whenever an easter egg is found
 */
export default function GlobalFx() {
  const reduce = useReducedMotion()
  const [tearKey, setTearKey] = useState(0)
  const [toasts, setToasts] = useState<Toast[]>([])
  const seq = useRef<string[]>([])
  const taps = useRef<number[]>([])

  const toast = (t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random()
    setToasts((list) => [...list, { ...t, id }])
    window.setTimeout(() => setToasts((list) => list.filter((x) => x.id !== id)), 3600)
  }

  const konami = () => {
    if (!reduce) setTearKey((k) => k + 1)
    // First time: EggUnlock plays the full intrusion. Repeats get a small nod.
    if (!findEgg('konami')) toast({ title: 'player 2 is already here', sub: 'konami: found earlier' })
  }

  // Tab icon follows the phosphor: theme changes, egg unlocks, incidents (red). Chrome/Edge/Firefox
  // pick it up live; Safari mostly keeps the cached /icon.svg, which is fine.
  useEffect(() => {
    const root = document.documentElement
    let last = ''
    const apply = (force = false) => {
      const rgb = getComputedStyle(root).getPropertyValue('--accent').trim() || '255 181 71'
      if (rgb === last && !force) return
      last = rgb
      const c = `rgb(${rgb.split(/\s+/).join(',')})`
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#0A0B08"/><rect x="0.5" y="0.5" width="31" height="31" rx="5.5" fill="none" stroke="${c}" stroke-opacity="0.35"/><path d="M8 10.5 13.5 16 8 21.5" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="square"/><rect x="16.5" y="19" width="7.5" height="3" fill="${c}"/></svg>`
      const href = `data:image/svg+xml,${encodeURIComponent(svg)}`
      // Recolour Next's own icon links in place (React owns them, so never remove them) and keep one
      // of ours last in <head>, which browsers prefer.
      document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]').forEach((l) => (l.href = href))
      let ours = document.getElementById('theme-favicon') as HTMLLinkElement | null
      if (!ours) {
        ours = document.createElement('link')
        ours.id = 'theme-favicon'
        ours.rel = 'icon'
        ours.type = 'image/svg+xml'
      }
      ours.href = href
      document.head.appendChild(ours)
    }
    apply()
    // Next can insert its metadata icon links after hydration; catch those too.
    const late = window.setTimeout(() => apply(true), 1500)
    const mo = new MutationObserver(() => apply())
    mo.observe(root, { attributes: true, attributeFilter: ['data-theme', 'data-incident'] })
    return () => {
      window.clearTimeout(late)
      mo.disconnect()
    }
  }, [])

  // ii — for whoever opens the console.
  useEffect(() => {
    const w = window as unknown as { __azabMuttered?: boolean }
    if (w.__azabMuttered) return
    w.__azabMuttered = true
    console.info(
      '%cazab.dev%c  you opened the console. good instinct.\n\nii :: tbebfrv\n\n(caesar never moved more than thirteen places.)',
      'color:#0a0b08;background:#ffb547;padding:2px 6px;font-weight:700;font-family:monospace',
      'color:#8e9182;font-family:monospace'
    )
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
      seq.current = [...seq.current, k].slice(-KONAMI.length)
      if (seq.current.join() === KONAMI.join()) {
        seq.current = []
        konami()
      }
    }
    const onTap = () => {
      const now = Date.now()
      taps.current = [...taps.current.filter((t) => now - t < 2500), now]
      if (taps.current.length >= 7) {
        taps.current = []
        konami()
      }
    }
    const onGlitch = () => {
      if (!reduce) setTearKey((k) => k + 1)
    }
    const onToast = (e: Event) => {
      const d = (e as CustomEvent<{ title: string; sub: string; special?: boolean }>).detail
      toast(d)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener(LOGO_TAP_EVENT, onTap)
    window.addEventListener(SCREEN_GLITCH_EVENT, onGlitch)
    window.addEventListener(TOAST_EVENT, onToast)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(LOGO_TAP_EVENT, onTap)
      window.removeEventListener(SCREEN_GLITCH_EVENT, onGlitch)
      window.removeEventListener(TOAST_EVENT, onToast)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce])

  return (
    <>
      {/* Screen tear: two colour-shifted slices that jitter for half a second */}
      {tearKey > 0 && (
        <div key={tearKey} className="pointer-events-none fixed inset-0 z-[95]" aria-hidden>
          <div className="screen-tear absolute inset-x-0 top-[22%] h-[9%] bg-[#ff3b5c]/25 mix-blend-screen" />
          <div className="screen-tear absolute inset-x-0 top-[58%] h-[6%] bg-[#39e1ff]/25 mix-blend-screen [animation-delay:60ms]" />
          <div className="screen-tear absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_3px,rgba(255,255,255,0.05)_4px)]" />
        </div>
      )}

      {/* Toasts */}
      <div
        className="pointer-events-none fixed left-1/2 top-[max(4.5rem,env(safe-area-inset-top))] z-[96] flex w-[min(92vw,380px)] -translate-x-1/2 flex-col gap-2"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              className={`ops-panel px-4 py-3 font-mono text-[12.5px] ${t.special ? 'border-ops-err/60' : 'border-dark-accent/50'}`}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              <p className={t.special ? 'text-ops-err' : 'text-dark-accent'}>
                ◆ {t.special ? <GlitchText text={t.title} burst /> : t.title}
              </p>
              <p className="mt-0.5 text-ops-dim">{t.sub}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}

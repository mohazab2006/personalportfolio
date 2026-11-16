'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EGGS, EGG_EVENT, findEgg, clearance, type EggId } from '@/lib/eggs'
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
    if (!findEgg('konami')) toast({ title: 'player 2 has entered the game', sub: 'already unlocked: theme magenta' })
  }

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
    const onEgg = (e: Event) => {
      const { id, count } = (e as CustomEvent<{ id: EggId; count: number }>).detail
      const egg = EGGS.find((x) => x.id === id)
      if (!egg) return
      let found: EggId[] = []
      try {
        found = JSON.parse(localStorage.getItem('azab-eggs') ?? '[]')
      } catch {
        /* ignore */
      }
      toast({
        title: `${egg.tier} egg · ${egg.name}`,
        sub: `unlocked ${egg.reward.label} · ${count}/${EGGS.length} · clearance: ${clearance(found).title}`,
        special: egg.tier === 'hard' || count === EGGS.length,
      })
    }
    const onToast = (e: Event) => {
      const d = (e as CustomEvent<{ title: string; sub: string; special?: boolean }>).detail
      toast(d)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener(LOGO_TAP_EVENT, onTap)
    window.addEventListener(SCREEN_GLITCH_EVENT, onGlitch)
    window.addEventListener(EGG_EVENT, onEgg)
    window.addEventListener(TOAST_EVENT, onToast)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(LOGO_TAP_EVENT, onTap)
      window.removeEventListener(SCREEN_GLITCH_EVENT, onGlitch)
      window.removeEventListener(EGG_EVENT, onEgg)
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

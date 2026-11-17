'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EGGS, EGG_EVENT, MAX_XP, clearance, type EggId } from '@/lib/eggs'
import { setTheme, THEME_SWATCH, type ThemeName } from '@/lib/theme'
import { SCREEN_GLITCH_EVENT } from '@/lib/events'
import GlitchText from './GlitchText'

type Egg = (typeof EGGS)[number]
type Unlock = {
  egg: Egg
  xpBefore: number
  xpAfter: number
  rankUp: string | null
  title: string
  lead: string | null
  color: string
}

const XP: Record<Egg['tier'], number> = { easy: 1, medium: 2, hard: 4 }

/** How to actually use the thing you just unlocked. */
function howTo(egg: Egg): string {
  const r = egg.reward
  if (r.kind === 'theme') return 'the whole site just switched to it. change any time in the footer or the nav palette.'
  if (r.kind === 'command') return `open snaggy and type: ${r.value}`
  if (r.kind === 'file') return r.value === '.lore' ? 'open snaggy and type: ls .lore' : `open snaggy and type: cat ${r.value}`
  return 'a new button is waiting in the on-call game.'
}

function readFound(): EggId[] {
  try {
    return JSON.parse(localStorage.getItem('azab-eggs') ?? '[]')
  } catch {
    return []
  }
}

/** Points you at an egg you haven't found yet: easiest tier first, random within it. */
function nextLead(found: EggId[]): string | null {
  for (const tier of ['easy', 'medium', 'hard'] as const) {
    const left = EGGS.filter((e) => e.tier === tier && !found.includes(e.id))
    if (left.length) return left[Math.floor(Math.random() * left.length)].hint
  }
  return null
}

/**
 * Finding an easter egg takes over the screen for a moment: a colour wipe in the reward's colour,
 * the name, the XP and clearance gained, what was unlocked (themes apply immediately), and a lead
 * on the next one. Konami gets an "intrusion" variant. Click / any key / Esc to continue.
 */
export default function EggUnlock() {
  const reduce = useReducedMotion()
  const [u, setU] = useState<Unlock | null>(null)
  const timer = useRef<number | null>(null)

  const close = useCallback(() => {
    setU(null)
    if (timer.current) window.clearTimeout(timer.current)
  }, [])

  useEffect(() => {
    const on = (e: Event) => {
      const { id } = (e as CustomEvent<{ id: EggId }>).detail
      const egg = EGGS.find((x) => x.id === id)
      if (!egg) return
      const found = readFound()
      const before = found.filter((f) => f !== id)
      const cBefore = clearance(before)
      const cAfter = clearance(found)
      const themeReward = egg.reward.kind === 'theme' ? (egg.reward.value as ThemeName) : null
      if (themeReward) setTheme(themeReward)
      if (!reduce) {
        const n = id === 'konami' ? [0, 180, 380, 620, 900, 1200] : [0, 260]
        n.forEach((t) => window.setTimeout(() => window.dispatchEvent(new Event(SCREEN_GLITCH_EVENT)), t))
      }
      setU({
        egg,
        xpBefore: cBefore.xp,
        xpAfter: cAfter.xp,
        rankUp: cAfter.level > cBefore.level ? cAfter.title : null,
        title: cAfter.title,
        lead: nextLead(found),
        color: themeReward ? THEME_SWATCH[themeReward] : 'rgb(var(--accent))',
      })
      if (timer.current) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setU(null), id === 'konami' ? 9000 : 7500)
    }
    window.addEventListener(EGG_EVENT, on)
    return () => window.removeEventListener(EGG_EVENT, on)
  }, [reduce])

  useEffect(() => {
    if (!u) return
    const onKey = () => close()
    // Let the triggering keystroke finish before listening, so it doesn't close itself instantly.
    const id = window.setTimeout(() => window.addEventListener('keydown', onKey), 700)
    return () => {
      window.clearTimeout(id)
      window.removeEventListener('keydown', onKey)
    }
  }, [u, close])

  const intrusion = u?.egg.id === 'konami'
  const delayIn = reduce ? 0 : intrusion ? 1.35 : 0.45

  return (
    <AnimatePresence>
      {u && (
        <motion.div
          key={u.egg.id}
          role="dialog"
          aria-modal="true"
          aria-label={`Easter egg found: ${u.egg.name}`}
          className="fixed inset-0 z-[97] flex items-center justify-center overflow-hidden px-4 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
          onClick={close}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/85" />

          {/* Colour wipe in the reward's colour */}
          {!reduce && (
            <motion.div
              className="absolute inset-0 origin-left"
              style={{ background: u.color }}
              initial={{ scaleX: 0, opacity: 0.9 }}
              animate={{ scaleX: [0, 1, 1], opacity: [0.9, 0.9, 0] }}
              transition={{ duration: intrusion ? 1.3 : 0.75, times: [0, 0.45, 1], ease: [0.7, 0, 0.2, 1] }}
            />
          )}

          {/* Intrusion noise: scrolling fake connection log */}
          {intrusion && !reduce && (
            <motion.div
              className="pointer-events-none absolute inset-0 overflow-hidden p-4 text-[11px] leading-relaxed text-ops-err/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0.15] }}
              transition={{ duration: 1.6, times: [0, 0.1, 0.7, 1] }}
              aria-hidden
            >
              {Array.from({ length: 40 }, (_, i) => (
                <div key={i}>
                  [{(0.042 * i).toFixed(3)}] incoming connection from 127.0.0.{(i * 7) % 255}:{2000 + i} · session p2 · {i % 3 === 0 ? 'auth bypass' : i % 3 === 1 ? 'controller 2 attached' : 'input stream hijacked'}
                </div>
              ))}
            </motion.div>
          )}

          {/* Card */}
          <motion.div
            className="ops-panel ops-ticks relative w-full max-w-lg"
            style={{ borderColor: u.color }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, delay: delayIn, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ops-head" style={{ color: u.color }}>
              <span>◆ easter egg found</span>
              <span className="ml-auto uppercase">
                {u.egg.tier} · +{XP[u.egg.tier]} xp
              </span>
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-[clamp(1.8rem,7vw,3.2rem)] font-extrabold uppercase leading-[0.95] tracking-tight" style={{ color: u.color }}>
                <GlitchText text={intrusion ? 'player 2 has entered the game' : u.egg.name} burst />
              </p>

              <dl className="mt-6 space-y-2.5 text-[13px]">
                <div className="flex gap-3">
                  <dt className="w-20 shrink-0 text-ops-dim">unlocked</dt>
                  <dd className="text-dark-text">
                    {u.egg.reward.label}
                    {u.egg.reward.kind === 'theme' && <span className="text-ops-ok"> · now active</span>}
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-20 shrink-0 text-ops-dim">use it</dt>
                  <dd className="text-dark-text/80">{howTo(u.egg)}</dd>
                </div>
                <div className="flex items-center gap-3">
                  <dt className="w-20 shrink-0 text-ops-dim">clearance</dt>
                  <dd className="flex-1">
                    <div className="flex items-center justify-between text-dark-text">
                      <span>
                        {u.title}
                        {u.rankUp && <span style={{ color: u.color }}> · rank up</span>}
                      </span>
                      <span className="tabular-nums text-ops-dim">
                        {u.xpAfter}/{MAX_XP} xp
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 bg-ops-line">
                      <motion.div
                        className="h-full"
                        style={{ background: u.color }}
                        initial={{ width: `${(u.xpBefore / MAX_XP) * 100}%` }}
                        animate={{ width: `${(u.xpAfter / MAX_XP) * 100}%` }}
                        transition={{ duration: 0.9, delay: delayIn + 0.35, ease: 'easeOut' }}
                      />
                    </div>
                  </dd>
                </div>
              </dl>

              {u.lead ? (
                <p className="mt-6 border-t border-dashed border-ops-line pt-4 text-[12.5px] leading-relaxed text-dark-text/75">
                  <span className="text-ops-dim">next lead › </span>
                  {u.lead}
                </p>
              ) : (
                <p className="mt-6 border-t border-dashed border-ops-line pt-4 text-[12.5px] text-ops-err">
                  every egg found. one door is still closed.
                </p>
              )}

              <button type="button" onClick={close} className="ops-btn mt-6 w-full sm:w-auto">
                continue <span className="text-ops-dim">(any key)</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

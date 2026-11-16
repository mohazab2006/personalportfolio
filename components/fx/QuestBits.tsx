'use client'

import { useState } from 'react'
import { PONEGLYPH_WORDS, readQuests, useQuests, writeQuests } from '@/lib/eggs'

export const TOAST_EVENT = 'azab-toast'
export function toast(title: string, sub: string, special = false) {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { title, sub, special } }))
}

/**
 * Road poneglyph fragment. Four are hidden around the site; each is a small, dim, slightly-off glyph
 * that only reads as "something" if you're looking. Clicking one records it.
 */
export function Poneglyph({ index, className = '' }: { index: 0 | 1 | 2 | 3; className?: string }) {
  const q = useQuests()
  const found = q.poneglyphs.includes(index)
  return (
    <button
      type="button"
      onClick={() => {
        const cur = readQuests().poneglyphs
        if (cur.includes(index)) {
          toast(`road poneglyph ${index + 1}/4`, `"${PONEGLYPH_WORDS[index]}" (already recorded)`)
          return
        }
        const next = [...cur, index]
        writeQuests({ poneglyphs: next })
        toast(
          `road poneglyph ${index + 1}/4 · "${PONEGLYPH_WORDS[index]}"`,
          next.length === 4 ? 'all four. open snaggy and set sail.' : `${next.length}/4 recorded`,
          next.length === 4
        )
      }}
      aria-label="an old engraved stone"
      title={found ? PONEGLYPH_WORDS[index] : undefined}
      className={`inline-flex h-6 w-6 items-center justify-center align-middle text-[13px] leading-none transition-[color,opacity,transform] duration-300 hover:scale-110 ${
        found ? 'text-dark-accent opacity-90' : 'text-[#7d4a3a] opacity-60 hover:opacity-100'
      } ${className}`}
    >
      ⧈
    </button>
  )
}

/** The power switch for the pack-a-punch quest. Dim, small, easy to scroll past. */
export function PowerSwitch({ className = '' }: { className?: string }) {
  const q = useQuests()
  const [flick, setFlick] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        if (readQuests().power) {
          toast('the power is already on', 'the machine is waiting. upgrade your weapon of choice.')
          return
        }
        setFlick(true)
        writeQuests({ power: true })
        toast('power: on', 'something across the site just hummed to life.', true)
      }}
      aria-label={q.power ? 'power switch (on)' : 'power switch (off)'}
      title={q.power ? 'power: on' : undefined}
      className={`inline-flex h-7 w-7 items-center justify-center text-[15px] leading-none transition-[color,transform,text-shadow] duration-300 ${
        q.power ? 'text-ops-ok [text-shadow:0_0_10px_rgba(124,228,149,0.8)]' : 'text-ops-line-strong hover:text-ops-dim'
      } ${flick ? 'rotate-180' : ''} ${className}`}
    >
      ⏻
    </button>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01ABCDEFGHJKLMNPQRSTUVWXYZ'

/**
 * Text that "decrypts" into place the first time it scrolls into view.
 * Screen readers get the real text immediately (aria-label); the scramble is visual only.
 */
export default function DecodeText({ text, className = '', duration = 700 }: { text: string; className?: string; duration?: number }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const [out, setOut] = useState(text)
  const done = useRef(false)

  useEffect(() => {
    if (reduce || done.current) return
    const el = ref.current
    if (!el) return
    // Start scrambled so there is no flash of the final text before the effect.
    setOut(text.replace(/\S/g, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
    let raf = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done.current) return
        done.current = true
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration)
          const settled = Math.floor(p * text.length)
          setOut(
            text
              .split('')
              .map((ch, i) => (i < settled || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
              .join('')
          )
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.6 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [text, reduce, duration])

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{out}</span>
    </span>
  )
}

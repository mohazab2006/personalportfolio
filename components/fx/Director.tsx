'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { NAV_LINKS } from '@/lib/data'
import { scrollToElement } from '@/lib/utils'

const IDS = NAV_LINKS.map((l) => l.toLowerCase())

/**
 * The "camera" layer for the home page:
 *  - a hairline scroll-progress bar under the nav (all screens)
 *  - a chapter rail in the left gutter on wide screens (01–07, current one lit)
 *  - very light film grain on pointer devices (never on reduced motion)
 */
export default function Director() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5] }
    )
    let tries = 0
    const attach = () => {
      let n = 0
      IDS.forEach((id) => {
        const el = document.getElementById(id)
        if (el) {
          io.observe(el)
          n++
        }
      })
      if (n < IDS.length && tries++ < 25) window.setTimeout(attach, 400)
    }
    attach()
    const onTop = () => window.scrollY < 200 && setActive(null)
    window.addEventListener('scroll', onTop, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onTop)
    }
  }, [])

  return (
    <>
      {/* Progress hairline */}
      <motion.div
        className="pointer-events-none fixed inset-x-0 top-0 z-[51] h-[2px] origin-left bg-dark-accent shadow-[0_0_10px_rgb(var(--accent)/0.8)]"
        style={{ scaleX: reduce ? scrollYProgress : progress }}
        aria-hidden
      />

      {/* Chapter rail (wide screens only, so it never crowds content) */}
      <nav
        className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2.5 font-mono text-[10px] xl:flex 2xl:left-8"
        aria-label="Chapters"
      >
        {IDS.map((id, i) => {
          const on = active === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => scrollToElement(id)}
              className={`group flex items-center gap-2 transition-colors ${on ? 'text-dark-accent' : 'text-ops-dim hover:text-dark-text'}`}
              aria-current={on ? 'true' : undefined}
              aria-label={`Chapter ${i + 1}: ${id}`}
            >
              <span className={`h-px transition-all duration-300 ${on ? 'w-6 bg-dark-accent' : 'w-3 bg-ops-line-strong group-hover:w-5'}`} />
              <span className="tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <span className={`transition-opacity duration-200 ${on ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>{id}</span>
            </button>
          )
        })}
      </nav>

      {/* Film grain */}
      {!reduce && <div className="film-grain pointer-events-none fixed inset-0 z-[88]" aria-hidden />}
    </>
  )
}

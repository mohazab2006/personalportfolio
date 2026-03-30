'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { TECH_STACK } from '@/lib/data'

type Category = keyof typeof TECH_STACK

const viewport = { once: true, amount: 0.2, margin: '0px 0px -8% 0px' } as const
const easeSmooth = [0.16, 1, 0.3, 1] as const

const chipClass =
  'rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[13px] font-medium leading-snug text-white/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'

export default function TechStack() {
  const reduceMotion = useReducedMotion()
  const categories = useMemo(() => Object.keys(TECH_STACK) as Category[], [])

  return (
    <section className="relative border-t border-white/[0.06] py-16 sm:py-24" id="stack">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.header
          className="mb-12 text-center sm:mb-14"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.48, ease: easeSmooth }}
          viewport={viewport}
        >
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-emerald-400/80">Stack</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Technologies
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/48">
            Grouped for quick scanning — tools I use regularly in class, client work, and personal projects.
          </p>
        </motion.header>

        <div className="grid gap-10 sm:grid-cols-2 xl:gap-x-12 xl:gap-y-12">
          {categories.map((category, catIndex) => (
            <motion.div
              key={category}
              initial={
                reduceMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 20 }
              }
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.5,
                delay: reduceMotion ? 0 : catIndex * 0.06,
                ease: easeSmooth,
              }}
              viewport={viewport}
            >
              <h3 className="mb-3.5 border-b border-white/[0.06] pb-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">
                {category}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {TECH_STACK[category].map((tech) => (
                  <li key={tech} className={chipClass}>
                    {tech}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

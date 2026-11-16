'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { TECH_STACK } from '@/lib/data'
import Section from '@/components/Section'

type Category = keyof typeof TECH_STACK

const viewport = { once: true, amount: 0.2, margin: '0px 0px -8% 0px' } as const
const easeSmooth = [0.16, 1, 0.3, 1] as const

/** Installed-packages listing: one panel per category, each tool as a package line. */
export default function TechStack() {
  const reduceMotion = useReducedMotion()
  const categories = useMemo(() => Object.keys(TECH_STACK) as Category[], [])
  const total = useMemo(() => categories.reduce((n, c) => n + TECH_STACK[c].length, 0), [categories])

  return (
    <Section
      id="stack"
      index="04"
      command="which --all"
      title="Stack"
      subtitle={`${total} tools installed across ${categories.length} groups — what I reach for in class, client work, and side projects.`}
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category, catIndex) => (
          <motion.div
            key={category}
            className="ops-panel"
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.45,
              delay: reduceMotion ? 0 : catIndex * 0.05,
              ease: easeSmooth,
            }}
            viewport={viewport}
          >
            <div className="ops-head">
              <span className="text-dark-accent">/usr/{category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}</span>
              <span className="ml-auto tabular-nums text-ops-dim">{TECH_STACK[category].length} pkgs</span>
            </div>
            <ul className="flex flex-wrap gap-1.5 p-4">
              {TECH_STACK[category].map((tech) => (
                <li
                  key={tech}
                  className="border border-ops-line bg-dark-bg/40 px-2 py-1 font-mono text-[12.5px] text-dark-text/80 transition-colors hover:border-dark-accent/50 hover:text-dark-accent"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

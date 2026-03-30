'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PERSONAL } from '@/lib/data'
import { scrollToElement } from '@/lib/utils'
import { useSnaggy } from '@/components/SnaggyProvider'

const NAME = 'Mohamed Azab'

/** Must match per-letter motion below: delay + duration of the last character. */
const LETTER_DELAY_START = 0.4
const LETTER_STAGGER = 0.045
const LETTER_DURATION = 0.7
const NAME_ANIM_END_SEC =
  LETTER_DELAY_START + Math.max(0, NAME.length - 1) * LETTER_STAGGER + LETTER_DURATION

export default function Hero() {
  const { open: openSnaggy } = useSnaggy()
  const [showCursor, setShowCursor] = useState(false)

  useEffect(() => {
    const ms = Math.ceil((NAME_ANIM_END_SEC + 0.04) * 1000)
    const id = window.setTimeout(() => setShowCursor(true), ms)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden">
      {/* Subtle radial gradient — barely-there depth */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 20% 50%, rgba(45,212,191,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="mx-auto w-full max-w-7xl px-4 pt-[max(7rem,env(safe-area-inset-top)+4.5rem)] pb-16 sm:px-6 sm:pt-32 sm:pb-24 lg:px-8">
        <div className="space-y-5">
          {/* Intro label */}
          <motion.p
            className="font-mono text-sm tracking-wide text-dark-muted"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            hi, my name is
          </motion.p>

          {/* Name — big, dominant, takes up the hero */}
          <h1 className="flex min-w-0 flex-wrap items-center text-[clamp(2rem,6.5vw+0.75rem,9rem)] font-extrabold uppercase leading-none tracking-tight text-white min-[480px]:flex-nowrap min-[480px]:whitespace-nowrap">
            <motion.span
              className="mr-[0.12em] font-mono text-dark-accent"
              aria-hidden="true"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              &gt;
            </motion.span>
            {NAME.split('').map((char, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.02em] pt-[0.08em]">
                <motion.span
                  className="inline-block cursor-default transition-colors duration-200 hover:text-dark-accent"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: LETTER_DURATION,
                    ease: [0.16, 1, 0.3, 1],
                    delay: LETTER_DELAY_START + i * LETTER_STAGGER,
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              </span>
            ))}
            {showCursor && (
              <motion.span
                className="terminal-cursor text-dark-accent"
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.12 }}
              />
            )}
          </h1>

          {/* Positioning — one strong line */}
          <motion.p
            className="max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 1.4 }}
          >
            Computer Science at{' '}
            <span className="text-dark-accent font-medium">Carleton University</span>{' '}
            — focused on AI, cybersecurity, and infrastructure.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap items-center gap-3 pt-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 1.6 }}
          >
            <button
              onClick={() => scrollToElement('projects')}
              className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-dark-accent px-5 py-2.5 text-sm font-semibold text-dark-bg transition-colors hover:bg-dark-accent-hover active:bg-dark-accent-hover"
            >
              View Projects
            </button>
            <a
              href={PERSONAL.resumePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-white/12 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/25 hover:bg-white/[0.04]"
            >
              Resume
            </a>
            <button
              type="button"
              onClick={openSnaggy}
              className="inline-flex min-h-[44px] items-center justify-center rounded-md px-3 py-2.5 text-sm font-medium text-white/45 transition-colors hover:text-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070708] active:text-white/60"
            >
              Ask Snaggy
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="h-8 w-[1.5px] bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  )
}

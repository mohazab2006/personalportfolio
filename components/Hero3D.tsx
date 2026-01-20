'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/lib/utils'

/**
 * CSS-only “plasma orb” replacement for react-three-fiber.
 * Fixes runtime crashes like `ReactCurrentOwner` by avoiding R3F internals.
 */
export default function Hero3D() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Outer glow */}
        <motion.div
          className="absolute h-[520px] w-[520px] rounded-full bg-dark-accent/20 blur-[140px]"
          animate={prefersReducedMotion ? undefined : { opacity: [0.35, 0.55, 0.35], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Mid glow */}
        <motion.div
          className="absolute h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-[80px]"
          animate={prefersReducedMotion ? undefined : { opacity: [0.25, 0.45, 0.25], scale: [1, 1.08, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Orb body */}
        <motion.div
          className="relative h-[340px] w-[340px] overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-dark-accent/35 via-cyan-400/10 to-white/5 shadow-[0_0_40px_rgba(45,212,191,0.18)]"
          animate={prefersReducedMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {/* Specular highlight */}
          <div className="absolute -left-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

          {/* Inner plasma swirl */}
          <motion.div
            className="absolute inset-0 opacity-60"
            style={{
              background:
                'conic-gradient(from 180deg at 50% 50%, rgba(45,212,191,0.22), rgba(6,182,212,0.10), rgba(255,255,255,0.06), rgba(45,212,191,0.22))',
            }}
            animate={prefersReducedMotion ? undefined : { rotate: -360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          />

          {/* Subtle scan lines */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              background:
                'repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, transparent 2px, transparent 6px)',
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}


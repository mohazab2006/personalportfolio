'use client'

import { motion } from 'framer-motion'
import { PERSONAL } from '@/lib/data'
import { HERO_LAYOUT } from '@/lib/utils'
import dynamic from 'next/dynamic'

// Client-only to avoid runtime crashes
const Hero3D = dynamic(() => import('./Hero3D'), { ssr: false, loading: () => <div className="h-full w-full" /> })

const socialIcons = [
  {
    name: 'GitHub',
    url: PERSONAL.github,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    url: PERSONAL.linkedin,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: 'Email',
    url: `mailto:${PERSONAL.email}`,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
]

export default function Hero() {
  const layout = HERO_LAYOUT || 'split'

  if (layout === 'center') {
    return (
      <section className="relative min-h-screen overflow-hidden bg-transparent">
        {/* Background orb */}
        <div className="absolute inset-0 opacity-30">
          <Hero3D />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center lg:px-8">
          <div className="mb-4">
            <motion.p 
              className="text-lg font-medium text-white/70 md:text-xl mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              hi, my name is
            </motion.p>
            <h1 className="text-4xl md:text-6xl lg:text-[7rem] xl:text-[9rem] flex flex-wrap justify-center leading-[0.9] text-neon" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}>
              {"MOHAMED AZAB".split("").map((char, index) => (
                <span 
                  key={index} 
                  className="inline-block overflow-hidden"
                >
                  <motion.span
                    className="name-letter inline-block text-white cursor-default"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.3 + index * 0.04,
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                </span>
              ))}
            </h1>
          </div>

          <motion.p
            className="mb-2 max-w-2xl text-lg text-white font-medium md:text-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.5 }}
          >
            A <span className="text-dark-accent font-bold">Computer Science</span> student at{' '}
            <span className="text-dark-accent font-bold">Carleton University</span> (AI/ML & Security).
          </motion.p>

          <motion.p
            className="mb-8 max-w-2xl text-base text-white font-medium md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.7 }}
          >
            A passionate learner who enjoys building{' '}
            <span className="text-dark-accent font-bold">secure</span>,{' '}
            <span className="text-dark-accent font-bold">reliable</span> software.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.9 }}
          >
            {socialIcons.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target={social.name !== 'Email' ? '_blank' : undefined}
                rel={social.name !== 'Email' ? 'noopener noreferrer' : undefined}
                className="liquid-glass magnetic-button group flex h-14 w-14 items-center justify-center rounded-2xl text-white transition-all active:scale-95"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 2.1 + index * 0.1 }}
                aria-label={social.name}
              >
                <div className="h-6 w-6">{social.icon}</div>
              </motion.a>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.6 }}
          >
            <motion.div
              className="relative flex items-center justify-center"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Outer ring */}
              <div className="absolute w-10 h-10 rounded-full border-2 border-white/30" />
              {/* Chevron */}
              <svg 
                className="w-5 h-5 text-white/60" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 9l-7 7-7-7" 
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </section>
    )
  }

  // Split Layout (Default) - Now centered without holographic card
  return (
    <section className="relative min-h-screen overflow-hidden bg-transparent">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 lg:px-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <motion.p 
              className="text-lg font-medium text-white/70 md:text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              hi, my name is
            </motion.p>
            <h1 className="text-5xl md:text-7xl lg:text-[8rem] xl:text-[10rem] flex flex-wrap leading-[0.9] text-neon" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}>
              {"MOHAMED AZAB".split("").map((char, index) => (
                <span 
                  key={index} 
                  className="inline-block overflow-hidden"
                >
                  <motion.span
                    className="name-letter inline-block text-white cursor-default"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.3 + index * 0.04,
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                </span>
              ))}
            </h1>
          </div>

          <motion.p
            className="max-w-3xl text-xl text-white font-medium md:text-2xl leading-relaxed mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.5 }}
          >
            A <span className="text-dark-accent font-bold drop-shadow-[0_0_8px_rgba(45,212,191,0.4)]">Computer Science</span> student at{' '}
            <span className="text-dark-accent font-bold drop-shadow-[0_0_8px_rgba(45,212,191,0.4)]">Carleton University</span> (AI/ML & Security).
          </motion.p>

          <motion.p
            className="max-w-3xl text-lg text-white font-medium md:text-xl mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.7 }}
          >
            A passionate learner who enjoys building{' '}
            <span className="text-dark-accent font-bold">secure</span>,{' '}
            <span className="text-dark-accent font-bold">reliable</span> software.
          </motion.p>

          {/* Social Icons Row */}
          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.9 }}
          >
            {socialIcons.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target={social.name !== 'Email' ? '_blank' : undefined}
                rel={social.name !== 'Email' ? 'noopener noreferrer' : undefined}
                className="liquid-glass magnetic-button group flex h-14 w-14 items-center justify-center rounded-2xl text-white transition-all active:scale-95"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 2.1 + index * 0.1 }}
                aria-label={social.name}
              >
                <div className="h-6 w-6">{social.icon}</div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.6 }}
      >
        <motion.div
          className="relative flex items-center justify-center"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Outer ring */}
          <div className="absolute w-10 h-10 rounded-full border-2 border-white/30" />
          {/* Chevron */}
          <svg 
            className="w-5 h-5 text-white/60" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 9l-7 7-7-7" 
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}


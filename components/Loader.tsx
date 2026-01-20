'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@/lib/utils'

const welcomeWords = "WELCOME".split("")

const containerVars = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    }
  },
  exit: { 
    opacity: 0,
    scale: 1.5,
    filter: "blur(20px)",
    transition: { duration: 1.2, ease: "easeInOut" }
  }
}

const letterVars = {
  initial: { y: 100, opacity: 0, rotateX: -90 },
  animate: { 
    y: 0, 
    opacity: 1, 
    rotateX: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100
    }
  }
}

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showPortal, setShowPortal] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const duration = prefersReducedMotion ? 800 : 2500 // Slightly longer
    const interval = 20
    const steps = duration / interval
    const increment = 100 / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= 100) {
        setProgress(100)
        clearInterval(timer)

        setTimeout(() => {
          setShowWelcome(true)
          setTimeout(() => {
            setShowPortal(true)
            setTimeout(() => {
              onComplete()
            }, prefersReducedMotion ? 350 : 1300)
          }, prefersReducedMotion ? 600 : 2600) // Keep WELCOME visible a bit longer
        }, 500)
      } else {
        setProgress(Math.min(current, 100))
      }
    }, interval)

    return () => clearInterval(timer)
  }, [onComplete, prefersReducedMotion])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-transparent"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Semi-transparent backdrop that doesn't block siblings in RootLayout */}
        <div className="absolute inset-0 bg-dark-bg/40 backdrop-blur-[2px] -z-10" />

        {/* Animated Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -left-1/4 -top-1/4 h-[150%] w-[150%] rounded-full bg-cyan-500/5 blur-[120px]"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Shockwave Effect when Portal triggers */}
        {showPortal && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-cyan-500/30"
                initial={{ width: 0, height: 0, opacity: 0.8 }}
                animate={{ width: "300%", height: "300%", opacity: 0 }}
                transition={{ duration: 1.5, delay: i * 0.2, ease: "easeOut" }}
              />
            ))}
          </motion.div>
        )}

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center">
          <AnimatePresence mode="wait">
            {!showWelcome ? (
              <motion.div
                key="loading"
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                {/* Modern circular loader */}
                <div className="relative mb-12 h-32 w-32">
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                    <circle
                      className="text-white/5 stroke-current"
                      strokeWidth="2"
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                    />
                    <motion.circle
                      className="text-cyan-500 stroke-current"
                      strokeWidth="2"
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      initial={{ strokeDasharray: "283", strokeDashoffset: 283 }}
                      animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
                      transition={{ duration: 0.1 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold tracking-tighter text-white">
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>
                
                <motion.div
                  className="flex flex-col items-center gap-2"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-xs uppercase tracking-[0.4em] text-cyan-500/80 font-bold">Initializing</span>
                  <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="welcome"
                variants={containerVars}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col items-center"
              >
                <div className="flex gap-2 md:gap-6 overflow-hidden py-10">
                  {welcomeWords.map((char, i) => (
                    <motion.span
                      key={i}
                      variants={letterVars}
                      className="text-7xl font-black tracking-tighter text-white md:text-[12rem] lg:text-[15rem]"
                      style={{ 
                        fontFamily: 'var(--font-display)',
                        textShadow: '0 0 30px rgba(255,255,255,0.2)'
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="px-6 text-center text-[10px] font-medium uppercase tracking-[0.35em] text-cyan-500/60 md:px-0 md:text-sm md:tracking-[0.8em]"
                >
                  <span className="block md:inline md:whitespace-nowrap">MOHAMED AZAB</span>
                  <span className="hidden md:inline">&nbsp;•&nbsp;</span>
                  <span className="mt-2 block md:mt-0 md:inline md:whitespace-nowrap">PORTFOLIO 2026</span>
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Animated Orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/2 left-1/2 h-px w-px bg-cyan-500 shadow-[0_0_150px_60px_rgba(45,212,191,0.15)]"
            animate={{
              scale: showPortal ? [1, 50, 0] : 1,
              opacity: showPortal ? [0.5, 1, 0] : 0.5,
            }}
            transition={{ duration: 1.2, ease: "easeIn" }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

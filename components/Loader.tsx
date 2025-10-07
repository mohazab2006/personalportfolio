'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@/lib/utils'

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showPortal, setShowPortal] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    // Simulate loading progress
    const duration = prefersReducedMotion ? 800 : 2000
    const interval = 20
    const steps = duration / interval
    const increment = 100 / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= 100) {
        setProgress(100)
        clearInterval(timer)

        // Show welcome message
        setTimeout(() => {
          setShowWelcome(true)

          // Trigger portal reveal
          setTimeout(() => {
            setShowPortal(true)

            // Complete loading
            setTimeout(() => {
              onComplete()
            }, prefersReducedMotion ? 200 : 600)
          }, prefersReducedMotion ? 150 : 400)
        }, prefersReducedMotion ? 100 : 200)
      } else {
        setProgress(Math.min(current, 100))
      }
    }, interval)

    return () => clearInterval(timer)
  }, [onComplete, prefersReducedMotion])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-gradient-to-br from-dark-bg via-purple-950/20 to-dark-bg"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
      >
        {/* Animated Background Orbs */}
        {!showPortal && (
          <>
            <motion.div
              className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1.5,
              }}
            />
          </>
        )}
        {/* Portal/Hyperdrive Effect */}
        {showPortal && (
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0.2 : 0.6,
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
            >
              {/* Radial gradient rings with glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full border-4 border-purple-500/40 shadow-2xl shadow-purple-500/50"
                    initial={{ width: 0, height: 0, opacity: 0 }}
                    animate={{
                      width: `${(i + 1) * 250}%`,
                      height: `${(i + 1) * 250}%`,
                      opacity: [0, 0.8, 0],
                    }}
                    transition={{
                      duration: prefersReducedMotion ? 0.15 : 0.5,
                      delay: i * 0.03,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </div>

              {/* Radial burst effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-radial from-purple-400/40 via-purple-500/20 to-transparent"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 5, opacity: [0, 1, 0] }}
                transition={{ duration: prefersReducedMotion ? 0.2 : 0.6 }}
              />

              {/* Light rays */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`ray-${i}`}
                  className="absolute left-1/2 top-1/2 h-2 w-full origin-left bg-gradient-to-r from-purple-400/50 to-transparent"
                  style={{
                    transform: `rotate(${i * 30}deg)`,
                  }}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 2, opacity: [0, 0.6, 0] }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.02,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Logo in top-left */}
        <motion.div
          className="absolute left-8 top-8 z-20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-2xl font-bold text-white">
            Mohamed Azab
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center gap-8">
          {/* Loading Counter or Welcome */}
          <AnimatePresence mode="wait">
            {!showWelcome ? (
              <motion.div
                key="loading"
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: prefersReducedMotion ? 0.1 : 0.2 }}
              >
                {/* Pill-style loading indicator */}
                <motion.div
                  className="relative mx-auto mb-8 h-16 w-80 rounded-full bg-black/20 backdrop-blur-sm border border-purple-500/30 shadow-2xl shadow-purple-500/20"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex h-full items-center justify-between px-8">
                    <span className="text-lg font-medium text-white">LOADING</span>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-medium text-white">{Math.round(progress)}%</span>
                      <div className="h-2 w-16 rounded-full bg-white/20">
                        <motion.div
                          className="h-full rounded-full bg-white"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.p
                  className="text-xl font-medium tracking-wider text-purple-300"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  PASSIONATE LEARNER • BUILDING THE FUTURE
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                key="welcome"
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
              >
                <motion.h1
                  className="bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-7xl font-bold text-transparent md:text-9xl"
                  animate={{
                    backgroundPosition: ['0%', '100%', '0%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  style={{
                    backgroundSize: '200% 200%',
                  }}
                >
                  WELCOME
                </motion.h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Right Spinner */}
        {!showPortal && (
          <motion.div
            className="absolute bottom-8 right-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative h-12 w-12">
              {/* Outer ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-purple-500/20 border-t-purple-500"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              {/* Inner ring */}
              <motion.div
                className="absolute inset-2 rounded-full border-2 border-purple-400/20 border-b-purple-400"
                animate={{ rotate: -360 }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}


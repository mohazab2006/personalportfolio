'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Ripple {
  id: number
  x: number
  y: number
}

export default function CursorRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newRipple: Ripple = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      }
      
      setRipples(prev => [...prev, newRipple])
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
      }, 600)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-purple-400 shadow-lg shadow-purple-400/50"
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
            initial={{
              scale: 0,
              opacity: 1,
            }}
            animate={{
              scale: [0, 1, 2.5, 4],
              opacity: [1, 0.9, 0.6, 0],
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

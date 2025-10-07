'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useHasHover, useReducedMotion } from '@/lib/utils'

type CursorState = 'default' | 'link' | 'magnetic'

export default function CustomCursor() {
  const [cursorState, setCursorState] = useState<CursorState>('default')
  const [isVisible, setIsVisible] = useState(false)
  const hasHover = useHasHover()
  const prefersReducedMotion = useReducedMotion()

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 300 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    if (!hasHover || prefersReducedMotion) return

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      setIsVisible(true)
    }

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement
      if (!target || typeof target.closest !== 'function') return
      
      const isLinkOrButton = target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a, button')
      if (isLinkOrButton) {
        const isMagnetic = target.classList.contains('magnetic-button') || 
                          (target.closest && target.closest('.magnetic-button'))
        setCursorState(isMagnetic ? 'magnetic' : 'link')
      } else {
        setCursorState('default')
      }
    }

    const handleMouseLeave = () => {
      setCursorState('default')
    }

    window.addEventListener('mousemove', moveCursor)
    document.addEventListener('mouseenter', handleMouseEnter, true)
    document.addEventListener('mouseleave', handleMouseLeave, true)

    // Set cursor state on hover
    const handleGlobalMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target || typeof target.closest !== 'function') return
      
      const isLinkOrButton = target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a, button')
      if (isLinkOrButton) {
        const isMagnetic = target.classList.contains('magnetic-button') || 
                          (target.closest && target.closest('.magnetic-button'))
        setCursorState(isMagnetic ? 'magnetic' : 'link')
      } else {
        setCursorState('default')
      }
    }

    document.addEventListener('mouseover', handleGlobalMouseOver)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      document.removeEventListener('mouseenter', handleMouseEnter, true)
      document.removeEventListener('mouseleave', handleMouseLeave, true)
      document.removeEventListener('mouseover', handleGlobalMouseOver)
    }
  }, [cursorX, cursorY, hasHover, prefersReducedMotion])

  if (!hasHover || prefersReducedMotion || !isVisible) return null

  const cursorSize = cursorState === 'link' || cursorState === 'magnetic' ? 40 : 20

  return (
    <motion.div
      className="custom-cursor pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    >
      <motion.div
        className="relative"
        animate={{
          width: cursorSize,
          height: cursorSize,
          x: -cursorSize / 2,
          y: -cursorSize / 2,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
        }}
      >
        <div className="absolute inset-0 rounded-full bg-white" />
        {(cursorState === 'link' || cursorState === 'magnetic') && (
          <motion.div
            className="absolute inset-0 rounded-full bg-white opacity-30"
            initial={{ scale: 1 }}
            animate={{ scale: 1.5 }}
            transition={{
              duration: 0.3,
            }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}


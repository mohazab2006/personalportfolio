'use client'

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useState, useRef } from 'react'
import { TECH_STACK, getTechCategories } from '@/lib/data'
import { useReducedMotion } from '@/lib/utils'

type Category = keyof typeof TECH_STACK

export default function TechChips() {
  const [activeCategory, setActiveCategory] = useState<Category>('Frontend')
  const categories = getTechCategories() as Category[]
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <motion.button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
              activeCategory === category
                ? 'bg-white text-black shadow-lg shadow-white/10'
                : 'bg-white/5 text-white/80 hover:bg-dark-accent/10 hover:text-dark-accent active:bg-white/10 active:text-white dark:bg-white/5'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </motion.button>
        ))}
      </div>

      {/* Tech Items with Bars */}
      <motion.div
        className="space-y-4"
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {TECH_STACK[activeCategory].map(([tech, proficiency], index) => (
          <TechBar
            key={tech}
            tech={tech}
            proficiency={proficiency}
            index={index}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </motion.div>
    </div>
  )
}

function TechBar({
  tech,
  proficiency,
  index,
  prefersReducedMotion,
}: {
  tech: string
  proficiency: number
  index: number
  prefersReducedMotion: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [5, -5]))
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-5, 5]))

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className="group relative"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        prefersReducedMotion
          ? {}
          : {
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }
      }
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-light-text dark:text-dark-text">{tech}</span>
        <span className="text-sm text-dark-accent/80 group-hover:text-dark-accent">{proficiency}%</span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 overflow-hidden rounded-full bg-light-bg-secondary dark:bg-dark-bg-secondary">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-dark-accent via-cyan-400 to-white shadow-[0_0_15px_rgba(45,212,191,0.6)]"
          initial={{ width: 0 }}
          animate={{ width: `${proficiency}%` }}
          transition={{ duration: 1, delay: index * 0.1 + 0.2, ease: 'easeOut' }}
        />

        {/* Glow effect */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-dark-accent/60 blur-[6px]"
          initial={{ width: 0 }}
          animate={{ width: `${proficiency}%` }}
          transition={{ duration: 1, delay: index * 0.1 + 0.2, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  )
}


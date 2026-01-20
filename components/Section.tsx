'use client'

import { motion } from 'framer-motion'
import { useIntersectionObserver } from '@/lib/utils'
import { useRef } from 'react'

type SectionProps = {
  id: string
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}

export default function Section({ id, title, subtitle, children, className = '' }: SectionProps) {
  const ref = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(ref, { threshold: 0.1, triggerOnce: true })

  return (
    <motion.section
      ref={ref}
      id={id}
      className={`relative py-20 lg:py-32 ${className}`}
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="group mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="section-title mb-4 text-4xl font-bold text-light-text dark:text-dark-text md:text-5xl lg:text-6xl cursor-default text-neon transition-colors duration-300">
            {title}
          </h2>
          {subtitle && (
            <p className="mx-auto max-w-2xl text-lg text-light-text/70 dark:text-dark-text/70">
              {subtitle}
            </p>
          )}

          {/* Subtle divider accent (alive but clean) */}
          <motion.div
            className="mx-auto mt-8 h-[2px] w-28 bg-gradient-to-r from-transparent via-dark-accent to-transparent group-hover:via-dark-accent group-hover:shadow-[0_0_15px_rgba(45,212,191,0.8)] transition-all duration-500"
            initial={{ width: 0, opacity: 0 }}
            animate={isVisible ? { width: '7rem', opacity: 1 } : { width: 0, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
          />
        </motion.div>

        {/* Section Content */}
        {children}
      </div>
    </motion.section>
  )
}


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
      className={`relative py-12 sm:py-16 lg:py-section xl:py-section-lg ${className}`}
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold tracking-tight text-dark-text sm:text-3xl md:text-4xl lg:text-5xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 max-w-2xl text-base text-dark-muted lg:text-lg">
              {subtitle}
            </p>
          )}
          <div className="mt-6 h-px w-16 bg-dark-accent" />
        </motion.div>

        {children}
      </div>
    </motion.section>
  )
}

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import DecodeText from '@/components/fx/DecodeText'
import { useIntersectionObserver } from '@/lib/utils'
import { useRef } from 'react'

type SectionProps = {
  id: string
  title: string
  subtitle?: string
  /** Two-digit index shown in the header rule, e.g. "01". */
  index?: string
  /** Shell command that "produced" this section, e.g. "ls ./projects". */
  command?: string
  children: React.ReactNode
  className?: string
}

/** Header used by every console section: index + command rule, title, comment-style subtitle. */
export function SectionHeader({
  title,
  subtitle,
  index,
  command,
  isVisible = true,
}: Pick<SectionProps, 'title' | 'subtitle' | 'index' | 'command'> & { isVisible?: boolean }) {
  const reduce = useReducedMotion()
  return (
    <motion.header
      className="relative mb-10 lg:mb-14"
      initial={{ opacity: 0, y: 16 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mb-5 flex items-center gap-3 font-mono text-xs text-ops-dim sm:text-[13px]">
        {index && <span className="text-dark-accent phosphor">{index}</span>}
        {command && (
          <span className="shrink-0">
            <span className="text-ops-ok">$</span> <span className="text-dark-text/80">{command}</span>
          </span>
        )}
        {/* the rule draws itself in, like a cursor running across the line */}
        <motion.span
          className="h-px flex-1 origin-left bg-gradient-to-r from-dark-accent/60 via-ops-line-strong to-transparent"
          initial={reduce ? false : { scaleX: 0 }}
          animate={isVisible ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden
        />
      </div>
      <h2 className="phosphor-soft font-display text-3xl font-extrabold tracking-tight text-dark-text sm:text-4xl lg:text-5xl">
        <DecodeText text={title.toLowerCase()} />
      </h2>
      {/* one pass of a scan line over the header as the section arrives */}
      {!reduce && isVisible && (
        <motion.span
          className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-dark-accent/70 to-transparent"
          initial={{ top: '0%', opacity: 0 }}
          animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
          transition={{ duration: 0.9, delay: 0.1, ease: 'easeInOut' }}
          aria-hidden
        />
      )}
      {subtitle && (
        <p className="mt-3 max-w-2xl font-mono text-[13px] leading-relaxed text-dark-muted sm:text-sm">
          <span className="text-ops-dim">{'// '}</span>
          {subtitle}
        </p>
      )}
    </motion.header>
  )
}

export default function Section({
  id,
  title,
  subtitle,
  index,
  command,
  children,
  className = '',
}: SectionProps) {
  const ref = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(ref, { threshold: 0.1, triggerOnce: true })

  return (
    <motion.section
      ref={ref}
      id={id}
      className={`relative py-14 sm:py-20 lg:py-section xl:py-section-lg ${className}`}
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          index={index}
          command={command}
          isVisible={isVisible}
        />
        {children}
      </div>
    </motion.section>
  )
}

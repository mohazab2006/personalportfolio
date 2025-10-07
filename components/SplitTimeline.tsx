'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EDUCATION, LEADERSHIP, EXPERIENCE, ExperienceItem, EducationItem } from '@/lib/data'
import Section from './Section'

export default function SplitTimeline() {
  const [isSingleColumn, setIsSingleColumn] = useState(false)

  return (
    <Section
      id="experience"
      title="Experience"
      subtitle="My professional journey, education, and leadership"
      className="bg-light-bg dark:bg-dark-bg"
    >
      <div className="space-y-8">
        {/* Toggle Button */}
        <div className="flex justify-center">
          <motion.button
            onClick={() => setIsSingleColumn(!isSingleColumn)}
            className="magnetic-button flex items-center gap-2 rounded-full bg-purple-500/10 px-6 py-3 text-sm font-medium text-purple-600 transition-all hover:bg-purple-500/20 dark:text-purple-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
              />
            </svg>
            {isSingleColumn ? 'Switch to Split View' : 'Switch to Single Column'}
          </motion.button>
        </div>

        {/* Timeline */}
        <AnimatePresence mode="wait">
          {isSingleColumn ? (
            <SingleColumnTimeline key="single" />
          ) : (
            <DoubleColumnTimeline key="double" />
          )}
        </AnimatePresence>
      </div>
    </Section>
  )
}

function DoubleColumnTimeline() {
  const leftItems = [
    ...EDUCATION.map((item) => ({ ...item, type: 'education' as const })),
    ...LEADERSHIP.map((item) => ({ ...item, type: 'leadership' as const })),
  ]

  const rightItems = EXPERIENCE.map((item) => ({ ...item, type: 'work' as const }))

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto_1fr]">
        {/* Left Column: Education + Leadership */}
        <div className="space-y-12">
          {leftItems.map((item, index) => (
            <TimelineCard key={index} item={item} index={index} side="left" />
          ))}
        </div>

        {/* Center Line - Hidden on mobile, visible on lg+ */}
        <div className="relative hidden w-1 lg:block">
          <motion.div
            className="h-full w-full bg-gradient-to-b from-purple-500 via-purple-600 to-purple-700"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ transformOrigin: 'top' }}
          />
        </div>

        {/* Right Column: Work Experience */}
        <div className="space-y-12">
          {rightItems.map((item, index) => (
            <TimelineCard key={index} item={item} index={index} side="right" />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function SingleColumnTimeline() {
  const allItems = [
    ...EDUCATION.map((item) => ({ ...item, type: 'education' as const })),
    ...LEADERSHIP.map((item) => ({ ...item, type: 'leadership' as const })),
    ...EXPERIENCE.map((item) => ({ ...item, type: 'work' as const })),
  ]

  return (
    <motion.div
      className="relative mx-auto max-w-3xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Vertical Line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-purple-600 to-purple-700 md:left-8" />

      <div className="space-y-12 pl-8 md:pl-20">
        {allItems.map((item, index) => (
          <TimelineCard key={index} item={item} index={index} side="single" />
        ))}
      </div>
    </motion.div>
  )
}

type TimelineCardProps = {
  item: (ExperienceItem | EducationItem) & { type: 'education' | 'leadership' | 'work' }
  index: number
  side: 'left' | 'right' | 'single'
}

function TimelineCard({ item, index, side }: TimelineCardProps) {
  const isEducation = 'degree' in item
  const title = isEducation ? item.degree : item.role
  const subtitle = isEducation ? item.school : item.org
  const dates = isEducation ? item.years : item.dates

  return (
    <motion.div
      className={`relative ${side === 'left' ? 'text-right' : ''}`}
      initial={{ opacity: 0, x: side === 'left' ? -50 : side === 'right' ? 50 : -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* Connector Dot - Hidden on mobile for split view, visible on lg+ */}
      {side !== 'single' && (
        <motion.div
          className={`absolute top-8 hidden h-3 w-3 rounded-full bg-purple-400 shadow-lg shadow-purple-500/50 lg:block ${
            side === 'left' ? '-right-[1.35rem]' : '-left-[1.35rem]'
          }`}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
        />
      )}

      {side === 'single' && (
        <motion.div
          className="absolute -left-8 top-8 h-3 w-3 rounded-full bg-purple-400 shadow-lg shadow-purple-500/50 md:-left-[4.5rem]"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
        />
      )}

      {/* Card */}
      <motion.div
        className="group rounded-2xl bg-light-bg-secondary p-6 shadow-lg transition-all hover:shadow-xl dark:bg-dark-bg-secondary"
        whileHover={{ y: -5, scale: 1.02 }}
      >
        {/* Type Badge */}
        <div className={`mb-3 flex ${side === 'left' ? 'justify-end' : 'justify-start'}`}>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              item.type === 'education'
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                : item.type === 'leadership'
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                  : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
            }`}
          >
            {item.type === 'education'
              ? '🎓 Education'
              : item.type === 'leadership'
                ? '👥 Leadership'
                : '💼 Work'}
          </span>
        </div>

        {/* Header */}
        <h3 className="mb-2 text-xl font-bold text-light-text dark:text-dark-text">{title}</h3>
        <p className="mb-1 text-purple-500">{subtitle}</p>
        <p className="mb-4 text-sm text-light-text/60 dark:text-dark-text/60">{dates}</p>

        {/* GPA for Education */}
        {isEducation && item.gpa && (
          <p className="mb-3 text-sm font-semibold text-purple-500">{item.gpa}</p>
        )}

        {/* Bullets or Courses */}
        {!isEducation && item.bullets && (
          <ul className={`mb-4 space-y-2 ${side === 'left' ? 'text-right' : 'text-left'}`}>
            {item.bullets.map((bullet, i) => (
              <li
                key={i}
                className="text-sm text-light-text/70 dark:text-dark-text/70"
              >
                {side === 'left' && '• '}
                {bullet}
                {side !== 'left' && ' •'}
              </li>
            ))}
          </ul>
        )}

        {isEducation && item.courses && item.courses.length > 0 && (
          <div className={`mb-4 ${side === 'left' ? 'text-right' : 'text-left'}`}>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-light-text/70 dark:text-dark-text/70">
              Relevant Courses
            </h4>
            <div className={`flex flex-wrap gap-2 ${side === 'left' ? 'justify-end' : 'justify-start'}`}>
              {item.courses.map((course, i) => (
                <span
                  key={i}
                  className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-600 dark:text-blue-400"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {!isEducation && item.tags && item.tags.length > 0 && (
          <div className={`flex flex-wrap gap-2 ${side === 'left' ? 'justify-end' : 'justify-start'}`}>
            {item.tags.map((tag, i) => (
              <span
                key={i}
                className="rounded-full bg-purple-500/10 px-3 py-1 text-xs text-purple-600 dark:text-purple-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Glow effect */}
        <div className="absolute inset-0 -z-10 rounded-2xl bg-purple-500/0 opacity-0 blur-xl transition-all group-hover:bg-purple-500/10 group-hover:opacity-100" />
      </motion.div>
    </motion.div>
  )
}


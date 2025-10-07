'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { INTERESTS, INTEREST_STORIES } from '@/lib/data'
import Section from './Section'

export default function Interests() {
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null)

  return (
    <Section
      id="interests"
      title="Interests"
      subtitle="What I'm passionate about and continuously learning"
      className="bg-light-bg-secondary dark:bg-dark-bg-secondary"
    >
      {/* Instruction text */}
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-lg text-light-text/70 dark:text-dark-text/70">
          Click on each interest to discover my journey and passion behind it ✨
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {INTERESTS.map((interest, index) => (
          <motion.button
            key={interest.title}
            onClick={() => setSelectedInterest(selectedInterest === interest.title ? null : interest.title)}
            className="group relative overflow-hidden rounded-2xl bg-light-bg p-6 text-left transition-all hover:shadow-xl dark:bg-dark-bg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Icon */}
            <div className="mb-4 text-5xl transition-transform group-hover:scale-110">
              {interest.icon}
            </div>

            {/* Content */}
            <h3 className="mb-2 text-xl font-semibold text-light-text dark:text-dark-text">
              {interest.title}
            </h3>
            <p className="text-light-text/70 dark:text-dark-text/70">{interest.text}</p>

            {/* Click indicator */}
            <div className="mt-3 text-xs text-purple-500 opacity-0 transition-opacity group-hover:opacity-100">
              Click to learn more →
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/0 to-purple-600/0 opacity-0 transition-all group-hover:from-purple-500/5 group-hover:to-purple-600/5 group-hover:opacity-100" />
          </motion.button>
        ))}
      </div>

      {/* Detailed Story */}
      <AnimatePresence mode="wait">
        {selectedInterest && (
          <motion.div
            key={selectedInterest}
            className="mt-12 rounded-2xl bg-light-bg p-8 shadow-lg dark:bg-dark-bg"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-light-text dark:text-dark-text">
                {INTEREST_STORIES[selectedInterest as keyof typeof INTEREST_STORIES].title}
              </h3>
              <button
                onClick={() => setSelectedInterest(null)}
                className="text-light-text/50 hover:text-light-text dark:text-dark-text/50 dark:hover:text-dark-text"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="mb-6 text-lg leading-relaxed text-light-text/80 dark:text-dark-text/80">
              {INTEREST_STORIES[selectedInterest as keyof typeof INTEREST_STORIES].story}
            </p>

            <div className="flex flex-wrap gap-2">
              {INTEREST_STORIES[selectedInterest as keyof typeof INTEREST_STORIES].highlights.map((highlight, index) => (
                <span
                  key={index}
                  className="rounded-full bg-purple-500/10 px-3 py-1 text-sm text-purple-600 dark:text-purple-400"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Default narrative when nothing is selected */}
      {!selectedInterest && (
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="mx-auto max-w-2xl text-lg text-light-text/70 dark:text-dark-text/70">
            I'm constantly exploring new technologies and methodologies to expand my skill set. My
            goal is to build impactful solutions that bridge the gap between innovative technology
            and real-world applications.
          </p>
        </motion.div>
      )}
    </Section>
  )
}


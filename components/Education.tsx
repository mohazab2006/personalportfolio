'use client'

import { motion } from 'framer-motion'
import { EDUCATION } from '@/lib/data'
import Section from './Section'

export default function Education() {
  return (
    <Section
      id="education"
      title="Education"
      subtitle="My academic journey and relevant coursework"
      className="bg-light-bg-secondary dark:bg-transparent"
    >
      <div className="mx-auto max-w-4xl space-y-8">
        {EDUCATION.map((edu, index) => (
          <motion.div
            key={index}
            className="group relative overflow-hidden rounded-2xl bg-[#0F0F12]/80 backdrop-blur-xl p-8 border border-white/5 transition-all duration-500 hover:border-dark-accent/40 hover:shadow-[0_0_30px_rgba(45,212,191,0.1)] light-highlight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.01 }}
          >
            {/* Glossy sweep */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.01] to-white/[0.03] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            
            {/* Header */}
            <div className="mb-6 border-b border-white/10 pb-4">
              <h3 className="mb-2 text-2xl font-bold text-light-text dark:text-dark-text">
                {edu.degree}
              </h3>
              <p className="mb-1 text-lg text-dark-accent">{edu.school}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-light-text/60 dark:text-dark-text/60">
                <span>{edu.years}</span>
                {edu.gpa && (
                  <>
                    <span>•</span>
                    <span className="font-semibold text-dark-accent">{edu.gpa}</span>
                  </>
                )}
              </div>
            </div>

            {/* Courses */}
            {edu.courses && edu.courses.length > 0 && (
              <div>
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-light-text/70 dark:text-dark-text/70">
                  Relevant Courses
                </h4>
                <div className="flex flex-wrap gap-2">
                  {edu.courses.map((course, courseIndex) => (
                    <motion.span
                      key={courseIndex}
                      className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-sm text-white/70 hover:bg-dark-accent hover:text-black hover:shadow-[0_0_15px_rgba(45,212,191,0.4)] transition-all"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.1 + courseIndex * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {course}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </Section>
  )
}


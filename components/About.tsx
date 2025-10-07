'use client'

import { motion } from 'framer-motion'
import { ABOUT_TEXT, SERVICES } from '@/lib/data'
import Section from './Section'

export default function About() {
  return (
    <Section
      id="about"
      title="About Me"
      subtitle="Get to know me and what I'm passionate about"
      className="bg-light-bg dark:bg-dark-bg"
    >
      <div className="space-y-16">
        {/* About Text */}
        <motion.div
          className="mx-auto max-w-3xl space-y-4 text-center text-lg leading-relaxed text-light-text/80 dark:text-dark-text/80"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {ABOUT_TEXT.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.title}
              className="group rounded-2xl bg-light-bg-secondary p-8 transition-all hover:scale-105 hover:shadow-xl dark:bg-dark-bg-secondary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="mb-4 text-5xl">{service.icon}</div>
              <h3 className="mb-3 text-xl font-semibold text-light-text dark:text-dark-text">
                {service.title}
              </h3>
              <p className="text-light-text/70 dark:text-dark-text/70">{service.description}</p>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 -z-10 rounded-2xl bg-purple-500/0 opacity-0 blur-xl transition-all group-hover:bg-purple-500/10 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}


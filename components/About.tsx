'use client'

import { motion } from 'framer-motion'
import { SERVICES } from '@/lib/data'
import Section from './Section'

const highlights = [
  { label: 'Focus Areas', value: 'AI/ML & Security' },
  { label: 'University', value: 'Carleton' },
  { label: 'Passion', value: 'Building Things That Matter' },
]

export default function About() {
  return (
    <Section
      id="about"
      title="About Me"
      subtitle="Get to know me and what I'm passionate about"
      className="bg-light-bg dark:bg-dark-bg"
    >
      <div className="space-y-16">
        {/* Hero-style About */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left: Short punchy text */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold text-white md:text-4xl leading-tight">
              Curious by nature,{' '}
              <span className="text-purple-500">driven by code</span>.
            </h3>
            <p className="text-lg text-white/70 leading-relaxed">
              Computer Science student at <span className="text-purple-500 font-semibold">Carleton University</span> specializing 
              in <span className="text-purple-500 font-semibold">AI & Machine Learning</span> with a focus on{' '}
              <span className="text-purple-500 font-semibold">Cybersecurity</span>.
            </p>
            <p className="text-lg text-white/60 leading-relaxed">
              I enjoy tackling complex problems and creating solutions that make a real impact—whether 
              it's web apps, secure infrastructure, or AI experiments.
            </p>
          </motion.div>

          {/* Right: Visual highlights */}
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {highlights.map((item, index) => (
              <motion.div
                key={item.label}
                className="rounded-xl bg-white/5 border border-white/10 p-6 text-center lg:text-left"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02, borderColor: 'rgba(139, 92, 246, 0.3)' }}
              >
                <p className="text-sm text-white/50 uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-xl font-bold text-purple-500">{item.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* What I Do - Services */}
        <div>
          <motion.h3
            className="text-2xl font-bold text-white text-center mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            What I Do
          </motion.h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {SERVICES.map((service, index) => (
              <motion.div
                key={service.title}
                className="group relative rounded-2xl bg-white/5 border border-white/10 p-8 transition-all hover:border-purple-500/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="mb-4 text-4xl">{service.icon}</div>
                <h4 className="mb-3 text-xl font-bold text-white">
                  {service.title}
                </h4>
                <p className="text-base text-white/70 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}


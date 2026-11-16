'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { PERSONAL } from '@/lib/data'
import Section from './Section'

const channels = [
  { name: 'email', value: PERSONAL.email, href: `mailto:${PERSONAL.email}`, action: 'send →', external: false },
  { name: 'github', value: 'mohazab2006', href: PERSONAL.github, action: 'open ↗', external: true },
  { name: 'linkedin', value: 'mohamedazabca', href: PERSONAL.linkedin, action: 'open ↗', external: true },
] as const

export default function Contact() {
  const reduce = useReducedMotion()

  return (
    <Section
      id="contact"
      index="07"
      command={`ping ${PERSONAL.name.split(' ')[0].toLowerCase()}`}
      title="Contact"
      subtitle="open to internships, projects, and good ideas."
    >
      <motion.div
        className="ops-panel ops-ticks mx-auto max-w-4xl font-mono"
        initial={reduce ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <div className="ops-head">
          <span className="flex gap-1.5" aria-hidden>
            <span className="status-dot bg-ops-err/80" />
            <span className="status-dot bg-dark-accent/80" />
            <span className="status-dot bg-ops-ok/80" />
          </span>
          <span>tty1 — contact</span>
        </div>

        <div className="p-5 text-[13px] sm:p-8 sm:text-sm">
          <p className="text-dark-muted">
            PING mohamed (azab.dev): {channels.length} channels open
          </p>

          <ul className="mt-5 border-y border-dashed border-ops-line">
            {channels.map((c, i) => (
              <motion.li
                key={c.name}
                initial={reduce ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.15 + i * 0.12 }}
              >
                <a
                  href={c.href}
                  target={c.external ? '_blank' : undefined}
                  rel={c.external ? 'noopener noreferrer' : undefined}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 py-3.5 transition-colors sm:grid-cols-[6rem_1fr_auto] sm:gap-5"
                >
                  <span className="flex items-center gap-2 text-ops-ok">
                    <span aria-hidden>›</span>
                    {c.name}
                  </span>
                  <span className="truncate text-dark-text/85 transition-colors group-hover:text-dark-accent">
                    {c.value}
                  </span>
                  <span className="text-ops-dim transition-colors group-hover:text-dark-accent">[ {c.action} ]</span>
                </a>
              </motion.li>
            ))}
          </ul>

          <p className="mt-5 text-ops-dim">--- mohamed ping statistics ---</p>
          <p className="mt-1 text-dark-muted">
            {channels.length} channels open, 0% packet loss.
          </p>

          <div className="mt-8 flex flex-col gap-4 border-t border-ops-line pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md font-sans text-[15px] leading-relaxed text-dark-text/75">
              Always happy to talk about new projects, ideas, or a role on your team.
            </p>
            <a href={`mailto:${PERSONAL.email}`} className="ops-btn ops-btn-primary shrink-0">
              mail -s &quot;hello&quot; mohamed
            </a>
          </div>
        </div>
      </motion.div>
    </Section>
  )
}

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { PERSONAL } from '@/lib/data'

export const socialRailBtnClass =
  'magnetic-button flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-white/[0.1] bg-dark-surface text-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-[color,background-color,border-color,transform] duration-200 hover:border-white/[0.16] hover:bg-[#18181b] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg active:scale-[0.97]'

const iconClass = 'h-[1.125rem] w-[1.125rem]'

function IconGithub() {
  return (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"
      />
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2V9zM4 6a2 2 0 100-4 2 2 0 000 4z"
      />
    </svg>
  )
}

function IconMail() {
  return (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  )
}

function IconResume() {
  return (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.25 2.25H6a2.25 2.25 0 00-2.25 2.25v15a2.25 2.25 0 002.25 2.25h12a2.25 2.25 0 002.25-2.25V7.5L14.25 2.25z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 2.25v5.25h5.25M9 12.75h6M9 16.5h6M9 9h2.25" />
    </svg>
  )
}

const ITEMS = [
  { name: 'GitHub', href: PERSONAL.github, external: true, Icon: IconGithub },
  { name: 'LinkedIn', href: PERSONAL.linkedin, external: true, Icon: IconLinkedIn },
  { name: 'Email', href: `mailto:${PERSONAL.email}`, external: false, Icon: IconMail },
  { name: 'Resume', href: PERSONAL.resumePdf, external: true, Icon: IconResume },
] as const

const MOBILE_MENU_SOCIAL = ITEMS.filter((item) => item.name !== 'Resume')

/** GitHub, LinkedIn, and email — sits directly under the mobile Resume control. */
export function MobileMenuSocialRow({ onNavigate }: { onNavigate: () => void }) {
  return (
    <ul className="flex items-center justify-center gap-3" aria-label="Social and contact links">
      {MOBILE_MENU_SOCIAL.map((item) => {
        const Icon = item.Icon
        return (
          <li key={item.name}>
            <a
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              className={socialRailBtnClass}
              aria-label={item.name}
              title={item.name}
              onClick={onNavigate}
            >
              <Icon />
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export default function SocialRail() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.nav
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:flex"
      aria-label="Social and contact links"
      initial={reduceMotion ? false : { opacity: 0, x: 16 }}
      animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <ul className="flex flex-col gap-3">
        {ITEMS.map((item, index) => {
          const Icon = item.Icon
          return (
            <motion.li
              key={item.name}
              initial={reduceMotion ? false : { opacity: 0, x: 12 }}
              animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.45 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <a
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className={socialRailBtnClass}
                aria-label={item.name === 'Resume' ? 'Open resume PDF' : item.name}
                title={item.name}
              >
                <Icon />
              </a>
            </motion.li>
          )
        })}
      </ul>
    </motion.nav>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PERSONAL, NAV_LINKS } from '@/lib/data'
import { scrollToElement } from '@/lib/utils'
import { MobileMenuSocialRow } from '@/components/SocialRail'

/** Track which section is on screen so the matching "window" tab lights up, tmux-style. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5] }
    )

    // Sections are lazy-loaded; retry briefly until they exist.
    let tries = 0
    const attach = () => {
      let found = 0
      ids.forEach((id) => {
        const el = document.getElementById(id)
        if (el) {
          observer.observe(el)
          found++
        }
      })
      if (found < ids.length && tries++ < 20) window.setTimeout(attach, 400)
    }
    attach()

    return () => observer.disconnect()
  }, [ids])

  return active
}

const SECTION_IDS = NAV_LINKS.map((l) => l.toLowerCase())

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const active = useActiveSection(SECTION_IDS)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const handleNavClick = (link: string) => {
    scrollToElement(link.toLowerCase())
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <motion.nav
        className={`fixed left-0 right-0 top-0 z-50 font-mono transition-[background-color,border-color] duration-300 ${
          isScrolled || isMobileMenuOpen
            ? 'border-b border-ops-line bg-dark-bg/95 lg:bg-dark-bg/85 lg:backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
        }`}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Primary"
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
              window.dispatchEvent(new Event('azab-logo-tap')) // 7 quick taps: phone-friendly konami
            }}
            className="group flex items-center gap-2 text-[13px] text-dark-text"
            aria-label="Back to top"
          >
            <span className="bg-dark-accent px-1.5 py-0.5 font-bold text-dark-bg">MA</span>
            <span className="text-ops-ok">azab</span>
            <span className="text-ops-dim">@</span>
            <span className="text-dark-text/80 transition-colors group-hover:text-dark-accent">ottawa</span>
          </button>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link, i) => {
              const id = link.toLowerCase()
              const isActive = active === id
              return (
                <button
                  key={link}
                  type="button"
                  onClick={() => handleNavClick(link)}
                  className={`relative px-3 py-2 text-[13px] lowercase transition-colors ${
                    isActive ? 'text-dark-accent' : 'text-dark-muted hover:text-dark-text'
                  }`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span className={isActive ? 'text-dark-accent' : 'text-ops-dim'}>{i + 1}:</span>
                  {id}
                  {isActive && <span className="text-dark-accent">*</span>}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 -bottom-px h-px bg-dark-accent shadow-[0_0_8px_rgb(var(--accent)/0.8)]"
                    />
                  )}
                </button>
              )
            })}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={PERSONAL.resumePdf}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open résumé in a new tab"
              className="ops-btn ops-btn-primary min-h-[36px] px-3.5 py-1.5 text-[12.5px]"
            >
              resume.pdf ↗
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-11 items-center gap-2 border border-ops-line-strong px-3.5 text-[12px] text-dark-text transition-colors hover:border-dark-accent/60 hover:text-dark-accent lg:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? '[ x ] close' : '[ ≡ ] menu'}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[45] overflow-y-auto overscroll-contain bg-dark-bg font-mono lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex h-full flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[calc(5rem+env(safe-area-inset-top))]">
              <p className="mb-4 text-xs text-ops-dim">
                <span className="text-ops-ok">$</span> ls ./sections
              </p>
              <ul className="flex flex-1 flex-col border-t border-ops-line">
                {NAV_LINKS.map((link, index) => (
                  <motion.li
                    key={link}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                  >
                    <button
                      type="button"
                      onClick={() => handleNavClick(link)}
                      className="flex w-full items-center gap-4 border-b border-ops-line py-4 text-left text-xl lowercase text-dark-text transition-colors hover:text-dark-accent"
                    >
                      <span className="text-sm text-dark-accent">0{index + 1}</span>
                      {link}
                      <span className="ml-auto text-ops-dim">→</span>
                    </button>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col items-center gap-5">
                <a
                  href={PERSONAL.resumePdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open résumé in a new tab"
                  className="ops-btn ops-btn-primary w-full max-w-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  cat resume.pdf
                </a>
                <MobileMenuSocialRow onNavigate={() => setIsMobileMenuOpen(false)} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

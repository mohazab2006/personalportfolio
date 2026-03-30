'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PERSONAL, NAV_LINKS } from '@/lib/data'
import { scrollToElement } from '@/lib/utils'
import { MobileMenuSocialRow } from '@/components/SocialRail'

const navLinkClass =
  'rounded-full px-4 py-2 text-sm font-medium text-white/62 transition-colors duration-200 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070708]'

const resumeDocIconClass = 'h-4 w-4 shrink-0 text-[#050508]/85'

/** Outline document (text lines) — reads as “résumé file,” not download. */
function ResumeDocumentIcon() {
  return (
    <svg
      className={resumeDocIconClass}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 3v6h6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6M9 17h4" />
    </svg>
  )
}

const resumeDesktopClass =
  'group inline-flex min-h-[42px] items-center gap-2 rounded-full bg-dark-accent px-5 py-2 text-sm font-semibold tracking-tight text-[#050508] shadow-[0_1px_0_rgba(255,255,255,0.22)_inset] transition-[background-color,box-shadow,transform] duration-200 hover:bg-dark-accent-hover hover:shadow-[0_1px_0_rgba(255,255,255,0.28)_inset] active:scale-[0.98] [@media(hover:hover)]:hover:shadow-[0_8px_28px_-8px_rgba(45,212,191,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-accent/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070708]'

const resumeMobileClass =
  'group inline-flex min-h-[52px] w-full max-w-sm items-center justify-center gap-2.5 rounded-2xl bg-dark-accent px-6 py-3.5 text-base font-semibold tracking-tight text-[#050508] shadow-[0_1px_0_rgba(255,255,255,0.22)_inset] transition-[background-color,transform] duration-200 hover:bg-dark-accent-hover active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-accent/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const handleNavClick = (link: string) => {
    const id = link.toLowerCase()
    scrollToElement(id)
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <motion.nav
        className={`fixed left-0 right-0 top-0 z-50 transition-[padding,background-color,border-color,box-shadow] duration-300 ${
          isScrolled
            ? 'border-b border-white/[0.06] bg-[#050505]/82 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl backdrop-saturate-150'
            : 'border-b border-transparent bg-transparent py-5 sm:py-6'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="rounded-lg px-3 py-2 text-sm font-bold tracking-[0.12em] text-white transition-colors hover:bg-white/[0.05] hover:text-dark-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070708] sm:-ml-1"
            style={{ fontFamily: 'var(--font-logo)' }}
          >
            {PERSONAL.name.toUpperCase()}
          </button>

          <div className="hidden items-center gap-3 lg:flex">
            <div
              className="flex items-center gap-0.5 rounded-full border border-white/[0.09] bg-white/[0.04] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              role="presentation"
            >
              {NAV_LINKS.map((link) => (
                <button
                  key={link}
                  type="button"
                  onClick={() => handleNavClick(link)}
                  className={navLinkClass}
                >
                  {link}
                </button>
              ))}
            </div>

            <a
              href={PERSONAL.resumePdf}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open résumé in a new tab"
              className={resumeDesktopClass}
            >
              <ResumeDocumentIcon />
              <span>Resume</span>
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors hover:border-white/[0.14] hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070708] lg:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <div className="relative flex h-5 w-5 items-center justify-center">
              <motion.span
                className="absolute h-0.5 w-[1.125rem] rounded-full bg-current"
                animate={isMobileMenuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -5 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.span
                className="absolute h-0.5 w-[1.125rem] rounded-full bg-current"
                animate={isMobileMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.18 }}
              />
              <motion.span
                className="absolute h-0.5 w-[1.125rem] rounded-full bg-current"
                animate={isMobileMenuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 5 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[45] bg-[#050505]/96 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="flex h-full flex-col px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[calc(4.5rem+env(safe-area-inset-top))]">
              <div className="flex flex-1 flex-col items-stretch justify-center gap-2 sm:max-w-sm sm:mx-auto sm:w-full">
                {NAV_LINKS.map((link, index) => (
                  <motion.button
                    key={link}
                    type="button"
                    onClick={() => handleNavClick(link)}
                    className="rounded-2xl border border-white/[0.07] bg-white/[0.03] px-5 py-4 text-left text-lg font-semibold tracking-tight text-white transition-colors hover:border-white/[0.12] hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-accent/40"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.32, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {link}
                  </motion.button>
                ))}
              </div>

              <div className="mt-8 flex flex-col items-center gap-4 sm:mt-10">
                <a
                  href={PERSONAL.resumePdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open résumé in a new tab"
                  className={resumeMobileClass}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ResumeDocumentIcon />
                  <span>Resume</span>
                </a>
                <div className="flex justify-center">
                  <MobileMenuSocialRow onNavigate={() => setIsMobileMenuOpen(false)} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

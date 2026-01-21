'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { PERSONAL, NAV_LINKS } from '@/lib/data'
import { scrollToElement } from '@/lib/utils'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const logoWispVariants: Variants = {
    rest: { opacity: 0, scale: 0.9, y: 6, filter: 'blur(22px)' },
    hover: {
      opacity: 1,
      scale: 1.35,
      y: 0,
      filter: 'blur(30px)',
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    },
  }

  const logoWispDriftVariants: Variants = {
    rest: { opacity: 0, scale: 0.85, rotate: 0, filter: 'blur(26px)' },
    hover: {
      opacity: 1,
      scale: 1.45,
      rotate: [0, 8, -6, 0],
      filter: 'blur(34px)',
      transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
    },
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (link: string) => {
    const id = link.toLowerCase()
    scrollToElement(id)
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <motion.nav
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent py-6'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Light edge highlight */}
        {isScrolled && <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-dark-accent/20 to-transparent" />}
        
        <div className="mx-auto flex max-w-[1700px] items-center justify-between px-4 lg:px-12">
          {/* Left: Logo/Name - Shifted right slightly */}
          <div className="flex items-center lg:pl-16">
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group relative flex items-center"
              initial="rest"
              animate="rest"
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
            >
              {/* Bigger hover wisp (behind the pill) */}
              <motion.div
                variants={logoWispVariants}
                className="pointer-events-none absolute -inset-10 -z-10 rounded-full opacity-0"
                style={{
                  background:
                    'radial-gradient(60% 60% at 30% 40%, rgba(45,212,191,0.45) 0%, rgba(45,212,191,0.0) 65%), radial-gradient(55% 55% at 70% 60%, rgba(6,182,212,0.28) 0%, rgba(6,182,212,0.0) 70%)',
                  mixBlendMode: 'screen',
                }}
              />
              <motion.div
                variants={logoWispDriftVariants}
                className="pointer-events-none absolute -inset-14 -z-10 rounded-full opacity-0"
                style={{
                  background:
                    'radial-gradient(50% 50% at 45% 35%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.0) 62%), radial-gradient(50% 50% at 55% 70%, rgba(45,212,191,0.25) 0%, rgba(45,212,191,0.0) 70%)',
                  mixBlendMode: 'screen',
                }}
              />

              {/* Logo Pill Container - Liquid Glass */}
              <div className="liquid-glass relative overflow-hidden rounded-full px-5 py-1.5 border border-white/10 group-hover:border-dark-accent/40 group-hover:bg-dark-accent/5 group-hover:shadow-[0_0_25px_rgba(45,212,191,0.2)]">
                {/* Subtle light sweep */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-full" />
                
                <span
                  className="relative z-10 whitespace-nowrap text-sm font-black tracking-[0.2em] text-white transition-colors group-hover:text-dark-accent md:text-base"
                  style={{ fontFamily: 'var(--font-logo)' }}
                >
                  {PERSONAL.name.toUpperCase().replace(' ', ' • ')}
                </span>
              </div>
            </motion.button>
          </div>

          {/* Right: Nav Links (no connect/email) */}
          <div className="hidden items-center lg:flex lg:pr-8">
            <div className="liquid-glass flex items-center gap-1 rounded-full border border-white/10 px-1 py-1">
              {NAV_LINKS.map((link) => (
                <motion.button
                  key={link}
                  onClick={() => handleNavClick(link)}
                  className="group relative rounded-full px-3 py-2 text-xs font-bold text-white/70 transition-all duration-300 hover:text-dark-accent xl:px-4 xl:text-sm"
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 tracking-widest">{link.toUpperCase()}</span>

                  {/* Soft hover lens */}
                  <motion.div
                    className="absolute inset-0 -z-10 rounded-full bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    layoutId="nav-hover-bg"
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="magnetic-button relative h-10 w-10 rounded-lg bg-white/5 backdrop-blur-sm transition-colors hover:bg-white/10 lg:hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle mobile menu"
          >
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  className="absolute h-0.5 w-5 bg-current"
                  animate={isMobileMenuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="absolute h-0.5 w-5 bg-current"
                  animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="absolute h-0.5 w-5 bg-current"
                  animate={isMobileMenuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-dark-bg/95 backdrop-blur-lg dark:bg-dark-bg/95 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex h-full flex-col items-center justify-center gap-8 p-8">
              {/* Connect (mobile only) */}
              <a
                href={`mailto:${PERSONAL.email}`}
                className="group flex flex-col items-center gap-2 text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-xs uppercase tracking-wider text-dark-text/50">connect</span>
                <span className="font-mono text-sm text-dark-text group-hover:text-dark-accent group-active:text-white">
                  {PERSONAL.email}
                </span>
              </a>

              {/* Nav Links */}
              <div className="flex flex-col items-center gap-6">
                {NAV_LINKS.map((link, index) => (
                  <motion.button
                    key={link}
                    onClick={() => handleNavClick(link)}
                    className="group relative text-2xl font-bold text-dark-text transition-colors duration-200 hover:text-dark-accent active:text-white"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ x: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">{link.toUpperCase()}</span>
                    {/* Glowing background hint for mobile */}
                    <div className="absolute inset-y-0 -left-4 -right-4 -z-10 rounded-xl bg-dark-accent/0 transition-colors group-hover:bg-dark-accent/5" />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

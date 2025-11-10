'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PERSONAL, NAV_LINKS } from '@/lib/data'
import { scrollToElement } from '@/lib/utils'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
          isScrolled ? 'glass py-4' : 'bg-transparent py-6'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Logo/Name */}
          <motion.div
            className="text-xl font-bold text-dark-text dark:text-dark-text"
            whileHover={{ scale: 1.02 }}
          >
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="transition-colors hover:text-purple-500"
            >
              {PERSONAL.name}
            </button>
          </motion.div>

          {/* Center: Email (Desktop) */}
          <div className="hidden lg:block">
            <motion.a
              href={`mailto:${PERSONAL.email}`}
              className="group flex items-center gap-2 text-sm text-dark-text/70 transition-colors hover:text-purple-500 dark:text-dark-text/70"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-xs uppercase tracking-wider">connect</span>
              <span className="font-mono">{PERSONAL.email}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </motion.a>
          </div>

          {/* Right: Nav Links + Toggles (Desktop) */}
          <div className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((link, index) => (
              <motion.button
                key={link}
                onClick={() => handleNavClick(link)}
                className="text-sm font-medium text-dark-text/70 transition-colors duration-200 hover:text-purple-500 dark:text-dark-text/70"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.95 }}
              >
                {link.toUpperCase()}
              </motion.button>
            ))}

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
              {/* Email */}
              <a
                href={`mailto:${PERSONAL.email}`}
                className="group flex flex-col items-center gap-2 text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-xs uppercase tracking-wider text-dark-text/50">connect</span>
                <span className="font-mono text-sm text-dark-text group-hover:text-purple-500">
                  {PERSONAL.email}
                </span>
              </a>

              {/* Nav Links */}
              <div className="flex flex-col items-center gap-6">
                {NAV_LINKS.map((link, index) => (
                  <motion.button
                    key={link}
                    onClick={() => handleNavClick(link)}
                    className="text-2xl font-medium text-dark-text transition-colors duration-200 hover:text-purple-500"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ 
                      scale: 1.05, 
                      x: 5,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {link.toUpperCase()}
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


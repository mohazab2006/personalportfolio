'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { NAV_LINKS } from '@/lib/data'
import { scrollToElement } from '@/lib/utils'

export default function SectionDots() {
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_LINKS.map((link) => link.toLowerCase())
      const scrollPosition = window.scrollY + window.innerHeight / 3

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i])
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed right-8 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 lg:flex">
      {NAV_LINKS.map((link) => {
        const id = link.toLowerCase()
        const isActive = activeSection === id

        return (
          <motion.button
            key={link}
            onClick={() => scrollToElement(id)}
            className="group relative"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Navigate to ${link}`}
          >
            <motion.div
              className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${
                isActive
                  ? 'bg-dark-accent shadow-[0_0_15px_rgba(45,212,191,0.8)] scale-125'
                  : 'bg-white/20 group-hover:bg-dark-accent/70 dark:bg-white/20'
              }`}
              animate={{
                scale: isActive ? 1.5 : 1,
              }}
              transition={{ duration: 0.2 }}
            />

            {/* Tooltip */}
            <span className="absolute right-full mr-4 whitespace-nowrap rounded-md bg-dark-bg-secondary px-2 py-1 text-xs text-dark-text opacity-0 transition-opacity group-hover:opacity-100 dark:bg-dark-bg-secondary">
              {link}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}


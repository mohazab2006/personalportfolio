'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-lg bg-white/5" />
    )
  }

  const isDark = theme === 'dark'

  return (
    <motion.button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="magnetic-button relative h-9 w-9 rounded-lg bg-white/5 backdrop-blur-sm transition-all hover:bg-dark-accent/10 hover:shadow-[0_0_15px_rgba(45,212,191,0.3)] border border-white/5 hover:border-dark-accent/30"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <div className="relative flex h-full w-full items-center justify-center">
        {/* Sun Icon */}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="absolute h-5 w-5 text-yellow-400"
          initial={false}
          animate={{
            opacity: isDark ? 1 : 0,
            rotate: isDark ? 0 : 180,
            scale: isDark ? 1 : 0.5,
          }}
          transition={{ duration: 0.2 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          />
        </motion.svg>

        {/* Moon Icon */}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="absolute h-5 w-5 text-white/70"
          initial={false}
          animate={{
            opacity: isDark ? 0 : 1,
            rotate: isDark ? -180 : 0,
            scale: isDark ? 0.5 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
          />
        </motion.svg>
      </div>
    </motion.button>
  )
}


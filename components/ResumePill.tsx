'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { getPersonalInfo } from '@/lib/projects'

export default function ResumePill() {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)

  useEffect(() => {
    async function fetchResume() {
      const info = await getPersonalInfo()
      if (info) {
        setResumeUrl(info.resumeUrl)
      }
    }
    fetchResume()
  }, [])

  if (!resumeUrl) return null

  return (
    <motion.a
      href={resumeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="magnetic-button fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-40 flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-medium text-black shadow-lg shadow-white/10 transition-all hover:bg-dark-accent hover:text-black hover:shadow-[0_0_25px_rgba(45,212,191,0.5)] active:bg-white active:text-black sm:px-6"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Download Resume"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
      <span className="hidden sm:inline">Resume</span>
    </motion.a>
  )
}


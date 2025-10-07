'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Loader from '@/components/Loader'
import Navbar from '@/components/Navbar'
import SocialRail from '@/components/SocialRail'
import ResumePill from '@/components/ResumePill'
import SectionDots from '@/components/SectionDots'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Education from '@/components/Education'
import Portfolio from '@/components/Portfolio'
import SplitTimeline from '@/components/SplitTimeline'
import Interests from '@/components/Interests'
import Contact from '@/components/Contact'
import CursorRipple from '@/components/CursorRipple'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Disable scroll during loading
    document.body.style.overflow = 'hidden'
  }, [])

  const handleLoadingComplete = () => {
    setIsLoading(false)
    // Small delay before showing content for smooth transition
    setTimeout(() => {
      setShowContent(true)
      document.body.style.overflow = 'auto'
    }, 100)
  }

  return (
    <>
      {/* Loader - Always plays on refresh */}
      <AnimatePresence mode="wait">
        {isLoading && <Loader key="loader" onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      {/* Main Content */}
      {showContent && (
        <>
          {/* Cursor Ripple Effect */}
          <CursorRipple />
          
          {/* Navigation */}
          <Navbar />
          
          {/* Persistent UI Elements */}
          <SocialRail />
          <ResumePill />
          <SectionDots />

          {/* Page Sections */}
          <main className="relative z-[1]">
            <Hero />
            <About />
            <Education />
            <Portfolio />
            <SplitTimeline />
            <Interests />
            <Contact />
          </main>

          {/* Footer */}
          <footer className="bg-light-bg-secondary py-8 text-center dark:bg-dark-bg-secondary">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <p className="text-sm text-light-text/60 dark:text-dark-text/60">
                © 2025 Mohamed Azab
              </p>
              <p className="mt-2 text-sm text-light-text/60 dark:text-dark-text/60">
                Designed and developed with passion 💜
              </p>
            </div>
          </footer>
        </>
      )}
    </>
  )
}


'use client'

import { useState, useEffect, lazy, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import Loader from '@/components/Loader'
import Navbar from '@/components/Navbar'
import SocialRail from '@/components/SocialRail'
import ResumePill from '@/components/ResumePill'
import ChatButton from '@/components/ChatButton'
import SectionDots from '@/components/SectionDots'
import Hero from '@/components/Hero'
import About from '@/components/About'

// Lazy load components below the fold for better performance
const CursorRipple = lazy(() => import('@/components/CursorRipple'))
const Education = lazy(() => import('@/components/Education'))
const Portfolio = lazy(() => import('@/components/Portfolio'))
const SplitTimeline = lazy(() => import('@/components/SplitTimeline'))
const Interests = lazy(() => import('@/components/Interests'))
const Contact = lazy(() => import('@/components/Contact'))

// Session storage key for loader state
const LOADER_SHOWN_KEY = 'portfolio_loader_shown'

// Loading fallback component
const SectionLoader = () => (
  <div className="flex min-h-[400px] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/40 border-t-white"></div>
  </div>
)

export default function Home() {
  // Check if loader was already shown this session
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem(LOADER_SHOWN_KEY)
    }
    return true
  })
  const [showContent, setShowContent] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!sessionStorage.getItem(LOADER_SHOWN_KEY)
    }
    return false
  })

  useEffect(() => {
    // If loader already shown, enable scroll immediately
    if (!isLoading) {
      document.body.style.overflow = 'auto'
      return
    }
    // Disable scroll during loading
    document.body.style.overflow = 'hidden'
  }, [isLoading])

  const handleLoadingComplete = () => {
    // Mark loader as shown for this session
    sessionStorage.setItem(LOADER_SHOWN_KEY, 'true')
    setIsLoading(false)
    // Small delay before showing content for smooth transition
    setTimeout(() => {
      setShowContent(true)
      document.body.style.overflow = 'auto'
    }, 100)
  }

  return (
    <>
      {/* Loader - Only plays once per session */}
      <AnimatePresence mode="wait">
        {isLoading && <Loader key="loader" onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      {/* Main Content */}
      {showContent && (
        <>
          {/* Cursor Ripple Effect */}
          <Suspense fallback={null}>
            <CursorRipple />
          </Suspense>
          
          {/* Navigation */}
          <Navbar />
          
          {/* Persistent UI Elements */}
          <SocialRail />
          <ResumePill />
          <ChatButton />
          <SectionDots />

          {/* Page Sections */}
          <main className="relative z-[1] overflow-x-hidden">
            <Hero />
            <About />
            <Suspense fallback={<SectionLoader />}>
              <Education />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
              <Portfolio />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
              <SplitTimeline />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
              <Interests />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
              <Contact />
            </Suspense>
          </main>

          {/* Footer */}
          <footer className="relative bg-dark-bg/40 py-12 text-center backdrop-blur-xl border-t border-white/5">
            {/* Top light edge */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dark-accent/30 to-transparent" />
            
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-sm font-medium text-white/40 uppercase tracking-[0.2em]">
                  © 2026 Mohamed Azab
                </p>
                <div className="h-px w-8 bg-white/10" />
                <p className="text-sm text-white/60">
                  Built with <span className="text-dark-accent drop-shadow-[0_0_8px_rgba(45,212,191,0.4)]">Next.js</span> & <span className="text-dark-accent drop-shadow-[0_0_8px_rgba(45,212,191,0.4)]">Framer Motion</span>
                </p>
              </div>
            </div>
          </footer>
        </>
      )}
    </>
  )
}


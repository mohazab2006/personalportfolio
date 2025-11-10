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

// Loading fallback component
const SectionLoader = () => (
  <div className="flex min-h-[400px] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
  </div>
)

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


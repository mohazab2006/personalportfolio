'use client'

import { lazy, Suspense } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import SnaggyFooterHint from '@/components/SnaggyFooterHint'

// Client-only: custom cursor (no SSR)
const Cursor = dynamic(() => import('@/components/Cursor'), { ssr: false })

// Lazy load below-fold sections
const FeaturedWork = lazy(() => import('@/components/FeaturedWork'))
const SplitTimeline = lazy(() => import('@/components/SplitTimeline'))
const Education = lazy(() => import('@/components/Education'))
const TechStack = lazy(() => import('@/components/TechStack'))
const Contact = lazy(() => import('@/components/Contact'))

const SectionLoader = () => (
  <div className="flex min-h-[400px] items-center justify-center">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white/60"></div>
  </div>
)

export default function Home() {
  return (
    <>
      <Cursor />
      <Navbar />

      <main className="relative z-[1]">
        <Hero />
        <Suspense fallback={<SectionLoader />}>
          <FeaturedWork />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <SplitTimeline />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Education />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <TechStack />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Contact />
        </Suspense>
      </main>

      <footer className="border-t border-white/5 pb-[max(3rem,env(safe-area-inset-bottom,0px)+1.25rem)] pt-12 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-sm text-white/40 tracking-wide">
            <p>© 2026 Mohamed Azab</p>
            <p className="mt-1 text-white/35">All rights reserved.</p>
            <SnaggyFooterHint />
          </div>
        </div>
      </footer>
    </>
  )
}

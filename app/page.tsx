'use client'

import { lazy, Suspense } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import SiteFooter from '@/components/SiteFooter'

const Director = dynamic(() => import('@/components/fx/Director'), { ssr: false })

// Lazy load below-fold sections
const FeaturedWork = lazy(() => import('@/components/FeaturedWork'))
const SplitTimeline = lazy(() => import('@/components/SplitTimeline'))
const Education = lazy(() => import('@/components/Education'))
const TechStack = lazy(() => import('@/components/TechStack'))
const Offline = lazy(() => import('@/components/Offline'))
const OnCall = lazy(() => import('@/components/OnCall'))
const Contact = lazy(() => import('@/components/Contact'))

const SectionLoader = () => (
  <div className="flex min-h-[400px] items-center justify-center">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white/60"></div>
  </div>
)

export default function Home() {
  return (
    <>
      <Director />
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
          <Offline />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <OnCall />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Contact />
        </Suspense>
      </main>

      <SiteFooter />
    </>
  )
}

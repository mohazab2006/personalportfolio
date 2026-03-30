'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectStorageImage from '@/components/ProjectStorageImage'
import { imageTryListForSlot } from '@/lib/projects'

const BLUR =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4MCIgaGVpZ2h0PSI3MjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyODAiIGhlaWdodD0iNzIwIiBmaWxsPSIjMTExMTE0Ii8+PC9zdmc+'

type Props = {
  slug: string
  title: string
  shots: string[]
}

export default function ProjectDetailGallery({ slug, title, shots }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => setLightbox(null), [])
  const goNext = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i + 1) % shots.length))
  }, [shots.length])
  const goPrev = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i - 1 + shots.length) % shots.length))
  }, [shots.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox === null) return
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, close, goNext, goPrev])

  useEffect(() => {
    if (lightbox === null) {
      document.body.style.removeProperty('overflow')
      return
    }
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => closeRef.current?.focus(), 50)
    return () => {
      window.clearTimeout(t)
      document.body.style.removeProperty('overflow')
    }
  }, [lightbox])

  if (shots.length === 0) return null

  return (
    <>
      <ul className="space-y-8 sm:space-y-10">
        {shots.map((screenshot, index) => (
          <motion.li
            key={`${slug}-${screenshot}-${index}`}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.2) }}
          >
            <figure className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0c] ring-1 ring-inset ring-white/[0.04]">
              <button
                type="button"
                onClick={() => setLightbox(index)}
                className="group relative block w-full cursor-zoom-in text-left transition-colors duration-200 hover:border-white/[0.12] focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070708]"
                aria-label={`Open fullscreen: ${title}, image ${index + 1} of ${shots.length}`}
              >
                <div className="relative aspect-video w-full bg-[#0a0a0c]">
                  <ProjectStorageImage
                    slug={slug}
                    tryList={imageTryListForSlot(screenshot)}
                    alt={`${title} — screen ${index + 1}`}
                    className="object-cover transition-opacity duration-300 group-hover:opacity-[0.92]"
                    sizes="(max-width: 1280px) 100vw, min(1024px, 90vw)"
                    placeholder="blur"
                    blurDataURL={BLUR}
                  />
                </div>
                <figcaption className="flex flex-col gap-1 border-t border-white/[0.06] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <span className="font-mono text-xs tracking-wide text-dark-muted">
                    {index + 1} / {shots.length}
                  </span>
                  <span className="text-xs text-white/40">Tap to view full size</span>
                </figcaption>
              </button>
            </figure>
          </motion.li>
        ))}
      </ul>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} gallery`}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/88 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-[102] rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-accent/50"
            >
              Close
            </button>

            {shots.length > 1 && (
              <>
                <div className="absolute inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[102] flex justify-center gap-3 md:hidden">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      goPrev()
                    }}
                    className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-accent/50"
                    aria-label="Previous image"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      goNext()
                    }}
                    className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-accent/50"
                    aria-label="Next image"
                  >
                    Next
                  </button>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    goPrev()
                  }}
                  className="absolute left-2 top-1/2 z-[102] hidden -translate-y-1/2 rounded-lg border border-white/15 bg-white/5 p-3 text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-accent/50 sm:left-4 md:block"
                  aria-label="Previous image"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    goNext()
                  }}
                  className="absolute right-2 top-1/2 z-[102] hidden -translate-y-1/2 rounded-lg border border-white/15 bg-white/5 p-3 text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-accent/50 sm:right-4 md:block"
                  aria-label="Next image"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </>
            )}

            <motion.div
              className="relative max-h-[min(85dvh,900px)] w-full max-w-6xl"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0c] shadow-2xl">
                <ProjectStorageImage
                  slug={slug}
                  tryList={imageTryListForSlot(shots[lightbox]!)}
                  alt={`${title} — full view ${lightbox + 1}`}
                  className="object-contain"
                  sizes="100vw"
                  priority
                  placeholder="blur"
                  blurDataURL={BLUR}
                />
              </div>
              <p className="mt-3 text-center font-mono text-xs text-white/50">
                {lightbox + 1} / {shots.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

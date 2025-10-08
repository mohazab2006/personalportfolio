import { type ClassValue, clsx } from 'clsx'
import { useEffect, useState } from 'react'

// Utility for merging class names
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Hero Layout Configuration
export const HERO_LAYOUT: 'split' | 'center' = 'split'

// Check if user prefers reduced motion
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

// Check if device supports hover
export function useHasHover(): boolean {
  const [hasHover, setHasHover] = useState(true)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    setHasHover(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setHasHover(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return hasHover
}

// Intersection Observer Hook with optional triggerOnce
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit & { triggerOnce?: boolean } = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const { triggerOnce, ...observerOptions } = options

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      const isNowIntersecting = entry.isIntersecting
      
      // If triggerOnce is true and we've already triggered, don't update
      if (triggerOnce && isIntersecting) return
      
      setIsIntersecting(isNowIntersecting)
      
      // If triggerOnce is true and we're now intersecting, disconnect
      if (triggerOnce && isNowIntersecting) {
        observer.disconnect()
      }
    }, observerOptions)

    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, observerOptions, triggerOnce, isIntersecting])

  return isIntersecting
}

// Smooth scroll to element
export function scrollToElement(id: string) {
  const element = document.getElementById(id)
  if (element) {
    const offset = 80 // navbar height
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    const offsetPosition = elementPosition - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
  }
}

// Format date
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Check if WebGL is supported
export function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}


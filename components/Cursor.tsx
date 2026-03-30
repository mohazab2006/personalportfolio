'use client'

import { useEffect, useRef, useState } from 'react'

function cursorSupported() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const [enabled] = useState(cursorSupported)
  const [visible, setVisible] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    if (!enabled) return

    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let glowX = -100
    let glowY = -100

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      setVisible(true)

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
      }
    }

    const onDown = () => setClicking(true)
    const onUp = () => setClicking(false)
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    const onOverCapture = (e: Event) => {
      const target = e.target as HTMLElement
      const isHoverable =
        target.closest('a, button, [role="button"], input, textarea, select, label, summary') !== null
      setHovering(isHoverable)
    }

    let raf: number
    const animate = () => {
      const ringEase = hovering ? 0.12 : 0.18
      const glowEase = 0.08
      ringX += (mouseX - ringX) * ringEase
      ringY += (mouseY - ringY) * ringEase
      glowX += (mouseX - glowX) * glowEase
      glowY += (mouseY - glowY) * glowEase

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`
      }

      raf = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mouseover', onOverCapture, true)
    raf = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mouseover', onOverCapture, true)
      cancelAnimationFrame(raf)
    }
  }, [enabled])

  if (!enabled) return null

  const dotSize = clicking ? 5 : hovering ? 7 : 6
  const ringSize = hovering ? 52 : 40
  const ringBorder = hovering ? 'rgba(45, 212, 191, 0.55)' : 'rgba(255, 255, 255, 0.18)'

  return (
    <>
      <style>{`
        @media (hover: hover) and (pointer: fine) {
          html.custom-cursor-active,
          html.custom-cursor-active * {
            cursor: none !important;
          }
        }
      `}</style>

      {/* Enable class on html so cursor:none applies after mount */}
      <HtmlCursorClass />

      {/* Soft trailing bloom — very subtle */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed left-0 top-0 z-[9997]"
        style={{
          opacity: visible ? (hovering ? 0.55 : 0.28) : 0,
          transition: 'opacity 0.25s ease',
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: 72,
            height: 72,
            marginLeft: -36,
            marginTop: -36,
            background: 'radial-gradient(circle, rgba(45,212,191,0.22) 0%, transparent 68%)',
            filter: 'blur(6px)',
          }}
        />
      </div>

      {/* Ring — lagging frame */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998]"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: clicking ? ringSize * 0.85 : ringSize,
            height: clicking ? ringSize * 0.85 : ringSize,
            marginLeft: clicking ? -(ringSize * 0.85) / 2 : -ringSize / 2,
            marginTop: clicking ? -(ringSize * 0.85) / 2 : -ringSize / 2,
            border: `1.5px solid ${ringBorder}`,
            backgroundColor: 'transparent',
            boxShadow: hovering
              ? '0 0 0 1px rgba(45,212,191,0.1)'
              : 'none',
            transition:
              'width 0.22s cubic-bezier(0.16,1,0.3,1), height 0.22s cubic-bezier(0.16,1,0.3,1), margin 0.22s cubic-bezier(0.16,1,0.3,1), border-color 0.2s, box-shadow 0.2s',
          }}
        />
      </div>

      {/* Core dot — crisp focal point */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.15s ease',
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: dotSize,
            height: dotSize,
            marginLeft: -dotSize / 2,
            marginTop: -dotSize / 2,
            background: 'radial-gradient(circle at 35% 30%, #ecfeff 0%, #2dd4bf 45%, #0d9488 100%)',
            boxShadow:
              '0 0 10px 1px rgba(45,212,191,0.45), 0 0 3px rgba(255,255,255,0.9) inset',
            transition:
              'width 0.15s cubic-bezier(0.16,1,0.3,1), height 0.15s cubic-bezier(0.16,1,0.3,1), margin 0.15s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </div>
    </>
  )
}

/** Adds `custom-cursor-active` on html while this component is mounted (client only). */
function HtmlCursorClass() {
  useEffect(() => {
    document.documentElement.classList.add('custom-cursor-active')
    return () => document.documentElement.classList.remove('custom-cursor-active')
  }, [])
  return null
}

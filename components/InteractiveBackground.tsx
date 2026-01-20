'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/lib/utils'

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [isMobileLikeRender, setIsMobileLikeRender] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const isCoarsePointer =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(hover: none) and (pointer: coarse)').matches
    const isSmallScreen = typeof window !== 'undefined' ? window.innerWidth < 768 : false
    const isMobileLike = isCoarsePointer || isSmallScreen

    // Expose mobile detection to render (no window usage during SSR render)
    setIsMobileLikeRender(isMobileLike)

    const particleCount = isMobileLike ? 45 : 100
    const connectionDistance = isMobileLike ? 120 : 150
    const mouseRadius = isMobileLike ? 140 : 200

    // Particle class
    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      brightness: number

      constructor() {
        this.x = Math.random() * canvas!.width
        this.y = Math.random() * canvas!.height
        this.vx = (Math.random() - 0.5) * 1.5
        this.vy = (Math.random() - 0.5) * 1.5
        this.size = Math.random() * 3 + 2
        // Slightly brighter particles for a more "alive" feel
        this.opacity = Math.random() * 0.25 + 0.2
        this.brightness = Math.random() * 20 + 90
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        // Bounce off edges with some randomness
        if (this.x < 0 || this.x > canvas!.width) {
          this.vx *= -0.8
          this.x = Math.max(0, Math.min(canvas!.width, this.x))
        }
        if (this.y < 0 || this.y > canvas!.height) {
          this.vy *= -0.8
          this.y = Math.max(0, Math.min(canvas!.height, this.y))
        }

        // Twinkle effect - smoother and slightly more visible
        this.opacity += (Math.random() - 0.5) * 0.02
        this.opacity = Math.max(0.15, Math.min(0.4, this.opacity))
      }

      draw() {
        if (!ctx) return

        // Outer glow
        ctx.beginPath()
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 4)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity * 0.6})`)
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${this.opacity * 0.25})`)
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`)
        ctx.fillStyle = gradient
        ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2)
        ctx.fill()

        // Core
        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()

        // Bright center
        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.8})`
        ctx.arc(this.x, this.y, this.size * 0.4, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Mouse tracking
    const mouse = { x: canvas.width / 2, y: canvas.height / 2, radius: mouseRadius }
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    canvas.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousemove', handleMouseMove)

    // Create particles
    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle) => {
        // Mouse interaction - repel particles
        const dx = particle.x - mouse.x
        const dy = particle.y - mouse.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < mouse.radius) {
          const angle = Math.atan2(dy, dx)
          const force = (mouse.radius - distance) / mouse.radius
          particle.vx += Math.cos(angle) * force * 1.2
          particle.vy += Math.sin(angle) * force * 1.2
        }

        // Add random drift for organic movement
        particle.vx += (Math.random() - 0.5) * 0.05
        particle.vy += (Math.random() - 0.5) * 0.05

        particle.update()

        // Less damping = more freedom
        particle.vx *= 0.995
        particle.vy *= 0.995

        particle.draw()
      })

      // Draw connections between nearby particles
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            ctx.beginPath()
            const opacity = (1 - distance / connectionDistance) * 0.35
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
            ctx.lineWidth = 1
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        })
      })

      // Draw mouse cursor effect (High-light flashlight feel)
      if (mouse.x !== canvas.width / 2 || mouse.y !== canvas.height / 2) {
        ctx.beginPath()
        const mouseGradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.radius * 1.5)
        mouseGradient.addColorStop(0, 'rgba(45, 212, 191, 0.08)')
        mouseGradient.addColorStop(0.4, 'rgba(45, 212, 191, 0.03)')
        mouseGradient.addColorStop(1, 'rgba(45, 212, 191, 0)')
        ctx.fillStyle = mouseGradient
        ctx.arc(mouse.x, mouse.y, mouse.radius * 1.5, 0, Math.PI * 2)
        ctx.fill()
        
        // Specular flare point
        ctx.beginPath()
        const flareGradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 20)
        flareGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)')
        flareGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = flareGradient
        ctx.arc(mouse.x, mouse.y, 20, 0, Math.PI * 2)
        ctx.fill()
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [prefersReducedMotion])

  if (prefersReducedMotion) {
    return null
  }

  const sparklesCount = isMobileLikeRender ? 10 : 20
  const shootingStarsCount = isMobileLikeRender ? 1 : 3

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10 opacity-80 sm:opacity-100"
        style={{ pointerEvents: 'none' }}
      />

      {/* Additional floating sparkles */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {[...Array(sparklesCount)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/60 shadow-[0_0_10px_rgba(255,255,255,0.4)]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Shooting stars */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {[...Array(shootingStarsCount)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute h-0.5 w-16 bg-gradient-to-r from-transparent via-white/90 to-transparent shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              rotate: '-45deg',
            }}
            animate={{
              x: [0, -200],
              y: [0, 200],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 5 + Math.random() * 5,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>
    </>
  )
}


'use client'

import { useEffect, useRef } from 'react'

type Node = { x: number; y: number; vx: number; vy: number }
type Packet = { a: number; b: number; t: number; speed: number }

const LINK = 170 // px: nodes closer than this are linked
const POINTER_LINK = 210

/** Current phosphor colour as "r g b" (follows theme changes, eggs, incidents). */
function accent(): string {
  return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '255 181 71'
}

/**
 * Background: a slow, faint network of nodes with packets travelling the links, in the current
 * phosphor colour. Nodes near the pointer light up and link to it. Pauses when hidden; static for
 * reduced motion; fewer nodes on small screens.
 */
export default function PacketNet() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0
    let h = 0
    let nodes: Node[] = []
    let packets: Packet[] = []
    let raf = 0
    let rgb = accent()
    const pointer = { x: -9999, y: -9999, active: false }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(42, Math.max(12, (w * h) / 38000)))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
      }))
      packets = []
    }

    const neighbours = (i: number) => {
      const out: number[] = []
      for (let j = 0; j < nodes.length; j++) {
        if (j === i) continue
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        if (dx * dx + dy * dy < LINK * LINK) out.push(j)
      }
      return out
    }

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h)

      // move
      for (const n of nodes) {
        n.x += n.vx * dt
        n.y += n.vy * dt
        if (n.x < -20) n.x = w + 20
        if (n.x > w + 20) n.x = -20
        if (n.y < -20) n.y = h + 20
        if (n.y > h + 20) n.y = -20
      }

      // links
      ctx.lineWidth = 1
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d2 = dx * dx + dy * dy
          if (d2 > LINK * LINK) continue
          const a = (1 - Math.sqrt(d2) / LINK) * 0.16
          ctx.strokeStyle = `rgb(${rgb} / ${a})`
          ctx.beginPath()
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(nodes[j].x, nodes[j].y)
          ctx.stroke()
        }
      }

      // pointer wiring
      if (pointer.active) {
        for (const n of nodes) {
          const dx = n.x - pointer.x
          const dy = n.y - pointer.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d > POINTER_LINK) continue
          ctx.strokeStyle = `rgb(${rgb} / ${(1 - d / POINTER_LINK) * 0.35})`
          ctx.beginPath()
          ctx.moveTo(pointer.x, pointer.y)
          ctx.lineTo(n.x, n.y)
          ctx.stroke()
        }
      }

      // nodes
      for (const n of nodes) {
        const near = pointer.active && Math.hypot(n.x - pointer.x, n.y - pointer.y) < POINTER_LINK
        ctx.fillStyle = `rgb(${rgb} / ${near ? 0.75 : 0.28})`
        ctx.fillRect(n.x - 1.5, n.y - 1.5, 3, 3)
      }

      // packets
      if (!reduce && packets.length < 9 && Math.random() < 0.06) {
        const a = Math.floor(Math.random() * nodes.length)
        const nb = neighbours(a)
        if (nb.length) packets.push({ a, b: nb[Math.floor(Math.random() * nb.length)], t: 0, speed: 0.006 + Math.random() * 0.008 })
      }
      packets = packets.filter((p) => {
        p.t += p.speed * dt
        if (p.t >= 1) return false
        const A = nodes[p.a]
        const B = nodes[p.b]
        const x = A.x + (B.x - A.x) * p.t
        const y = A.y + (B.y - A.y) * p.t
        ctx.fillStyle = `rgb(${rgb} / 0.85)`
        ctx.shadowColor = `rgb(${rgb} / 0.9)`
        ctx.shadowBlur = 8
        ctx.fillRect(x - 1.5, y - 1.5, 3, 3)
        ctx.shadowBlur = 0
        return true
      })
    }

    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(3, (now - last) / 16.7)
      last = now
      draw(dt)
      raf = requestAnimationFrame(loop)
    }

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.active = true
    }
    const onLeave = () => (pointer.active = false)
    const onTheme = () => (rgb = accent())
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf)
      else if (!reduce) {
        last = performance.now()
        raf = requestAnimationFrame(loop)
      }
    }

    resize()
    if (reduce) draw(0)
    else raf = requestAnimationFrame(loop)

    // Theme can change via eggs, the palette, incidents (data-incident) — re-read the colour on any of them.
    const mo = new MutationObserver(onTheme)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-incident'] })
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelAnimationFrame(raf)
      mo.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0" aria-hidden />
}

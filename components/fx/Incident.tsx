'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import GlitchText from './GlitchText'
import { CAUSES, INCIDENT_EVENT, recordRecovery, type IncidentCause, type IncidentStats } from '@/lib/incident'
import { SCREEN_GLITCH_EVENT } from '@/lib/events'
import { PROJECTS } from '@/lib/data'

type Phase = 'idle' | 'degrading' | 'down' | 'defend' | 'reboot' | 'booting' | 'restored'
type Packet = { id: number; angle: number; bad: boolean; label: string; src: string; dur: number }
type BootLine = { text: string; state: 'run' | 'ok' }

const BAD = ['SYN flood', 'UDP amp :53', 'GET /?%00%00', 'POST /wp-login', 'slowloris', 'ICMP storm', 'GET /.env', 'botnet']
const GOOD = ['GET /projects', 'GET /resume.pdf', 'recruiter GET /', 'GET /']
const ip = () => `${1 + Math.floor(Math.random() * 222)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`

const START_LOAD = 92
const SAFE_LOAD = 15
const IDLE_FAILOVER_MS = 25_000
const SPINNER = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

function Spinner() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setI((n) => (n + 1) % SPINNER.length), 70)
    return () => window.clearInterval(id)
  }, [])
  return <span className="inline-block w-[1ch]">{SPINNER[i]}</span>
}

const fmt = (ms: number) => `${(ms / 1000).toFixed(1)}s`

/**
 * The whole incident flow. Opt-in only (a visitor has to break something on purpose), and always
 * escapable: "skip · restore site" is visible in every phase, Esc restores, and leaving it alone
 * triggers an automatic failover.
 */
export default function Incident() {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('idle')
  const [cause, setCause] = useState<IncidentCause>('button')
  const [logShown, setLogShown] = useState(0)
  const [load, setLoad] = useState(START_LOAD)
  const [packets, setPackets] = useState<Packet[]>([])
  const [events, setEvents] = useState<{ id: number; text: string; bad: boolean }[]>([])
  const [dropped, setDropped] = useState(0)
  const [blockedUsers, setBlockedUsers] = useState(0)
  const [boot, setBoot] = useState<BootLine[]>([])
  const [result, setResult] = useState<{ ms: number; stats: IncidentStats; failover: boolean } | null>(null)
  const [elapsed, setElapsed] = useState(0)

  const startRef = useRef(0)
  const lastTouch = useRef(0)
  const timers = useRef<number[]>([])
  const idRef = useRef(1)
  const failoverRef = useRef(false)
  const actionRef = useRef<HTMLButtonElement>(null)
  const packetsRef = useRef<Packet[]>([])
  packetsRef.current = packets

  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms))
  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout)
    timers.current = []
  }

  const setIncidentAttr = (v: string | null) => {
    if (v) document.documentElement.dataset.incident = v
    else delete document.documentElement.dataset.incident
  }

  const note = useCallback((text: string, bad: boolean) => {
    setEvents((e) => [{ id: idRef.current++, text, bad }, ...e].slice(0, 5))
  }, [])

  // ── Restore paths ─────────────────────────────────────────
  const close = useCallback(() => {
    clearTimers()
    setIncidentAttr(null)
    setPhase('idle')
    setPackets([])
  }, [])

  const skip = useCallback(() => close(), [close])

  // ── Trigger ───────────────────────────────────────────────
  useEffect(() => {
    const on = (e: Event) => {
      if (phase !== 'idle') return
      const c = (e as CustomEvent<IncidentCause>).detail ?? 'button'
      clearTimers()
      setCause(c)
      setLoad(START_LOAD)
      setPackets([])
      setEvents([])
      setDropped(0)
      setBlockedUsers(0)
      setBoot([])
      setResult(null)
      setLogShown(0)
      failoverRef.current = false
      startRef.current = performance.now()
      lastTouch.current = performance.now()

      if (reduce) {
        setIncidentAttr('down')
        setPhase('down')
        setLogShown(CAUSES[c].log.length)
        later(1200, () => setPhase('defend'))
        return
      }
      setIncidentAttr('degrading')
      setPhase('degrading')
      ;[0, 450, 950, 1300].forEach((t) => later(t, () => window.dispatchEvent(new Event(SCREEN_GLITCH_EVENT))))
      later(1500, () => {
        setIncidentAttr('down')
        setPhase('down')
        CAUSES[c].log.forEach((_, i) => later(320 * (i + 1), () => setLogShown(i + 1)))
        later(320 * CAUSES[c].log.length + 1100, () => setPhase('defend'))
      })
    }
    window.addEventListener(INCIDENT_EVENT, on)
    return () => window.removeEventListener(INCIDENT_EVENT, on)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, reduce])

  // Esc always restores
  useEffect(() => {
    if (phase === 'idle') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') skip()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, skip])

  // Lock page scroll while the overlay is up
  useEffect(() => {
    if (phase === 'idle' || phase === 'degrading') return
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prev
    }
  }, [phase])

  // Outage clock
  useEffect(() => {
    if (phase === 'idle' || phase === 'restored') return
    const id = window.setInterval(() => setElapsed(performance.now() - startRef.current), 100)
    return () => window.clearInterval(id)
  }, [phase])

  // Move focus to whatever the visitor should do next
  useEffect(() => {
    if (phase === 'reboot' || phase === 'restored') window.setTimeout(() => actionRef.current?.focus(), 60)
  }, [phase])

  // ── Boot sequence (real checks where we can) ──────────────
  const runBoot = useCallback(
    async (failover: boolean) => {
      setPhase('booting')
      setPackets([])
      const add = (text: string) => setBoot((b) => [...b, { text, state: 'run' }])
      const ok = (text?: string) =>
        setBoot((b) => b.map((l, i) => (i === b.length - 1 ? { text: text ?? l.text, state: 'ok' } : l)))
      const wait = (ms: number) => new Promise<void>((r) => later(reduce ? 0 : ms, r))

      const live = PROJECTS.filter((p) => p.demo).length
      const steps: [string, number, (() => Promise<string | undefined>)?][] = [
        ['cpu: bringing cores online', 380],
        ['memory: testing 16384 MB', 520],
        [`firewall: reloading rules`, 420, async () => `firewall: rules reloaded · ${Math.max(dropped, 1)} sources blackholed`],
        [`mount /projects`, 400, async () => `mount /projects · ${PROJECTS.length} services, ${live} live`],
        ['tls: verifying certificate', 380, async () => `tls: certificate valid (${location.protocol === 'https:' ? 'https' : 'local dev'})`],
        [
          'http: GET / health check',
          200,
          async () => {
            const t = performance.now()
            try {
              const res = await fetch('/', { method: 'HEAD', cache: 'no-store' })
              return `http: GET / → ${res.status} in ${Math.round(performance.now() - t)}ms`
            } catch {
              return 'http: GET / → served from cache'
            }
          },
        ],
        ['snaggy.service: starting', 420, async () => 'snaggy.service: active (running)'],
        ['health checks', 360, async () => `health checks: ${PROJECTS.length + 3}/${PROJECTS.length + 3} passing`],
      ]
      for (const [label, ms, done] of steps) {
        add(label)
        await wait(ms)
        ok(done ? await done() : undefined)
      }
      await wait(350)
      const ms = performance.now() - startRef.current
      const stats = recordRecovery(ms)
      setIncidentAttr(null)
      setResult({ ms, stats, failover })
      setPhase('restored')
      later(reduce ? 6000 : 4200, close)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [close, dropped, reduce]
  )

  // ── Defend: packets fly at the core, tap the red ones ─────
  useEffect(() => {
    if (phase !== 'defend') return
    const spawn = window.setInterval(() => {
      const bad = Math.random() < 0.72
      const pool = bad ? BAD : GOOD
      setPackets((p) => [
        ...p.slice(-14),
        {
          id: idRef.current++,
          angle: Math.random() * Math.PI * 2,
          bad,
          label: pool[Math.floor(Math.random() * pool.length)],
          src: bad ? ip() : '',
          dur: 3.2 + Math.random() * 1.6,
        },
      ])
    }, reduce ? 1100 : 650)
    const idle = window.setInterval(() => {
      if (!failoverRef.current && performance.now() - lastTouch.current > IDLE_FAILOVER_MS) {
        failoverRef.current = true
        note('no operator response. auto-failover engaged.', false)
        later(900, () => runBoot(true))
      }
    }, 1000)
    return () => {
      window.clearInterval(spawn)
      window.clearInterval(idle)
    }
  }, [phase, reduce, note, runBoot])

  useEffect(() => {
    if (phase === 'defend' && load <= SAFE_LOAD) {
      note('load nominal. threat contained.', false)
      setPhase('reboot')
      setPackets([])
    }
  }, [load, phase, note])

  const hit = (p: Packet) => {
    if (!packetsRef.current.some((x) => x.id === p.id)) return
    packetsRef.current = packetsRef.current.filter((x) => x.id !== p.id)
    lastTouch.current = performance.now()
    setPackets((list) => list.filter((x) => x.id !== p.id))
    if (p.bad) {
      setDropped((d) => d + 1)
      setLoad((l) => Math.max(0, l - 8))
      note(`dropped ${p.label}${p.src ? ` ${p.src}` : ''}`, false)
    } else {
      setBlockedUsers((b) => b + 1)
      setLoad((l) => Math.min(100, l + 5))
      note(p.label.startsWith('recruiter') ? 'you blocked a recruiter. bold.' : `blocked a real user (${p.label})`, true)
    }
  }

  const reached = (p: Packet) => {
    // Already dropped by the visitor? Then it never arrived.
    if (!packetsRef.current.some((x) => x.id === p.id)) return
    packetsRef.current = packetsRef.current.filter((x) => x.id !== p.id)
    setPackets((list) => list.filter((x) => x.id !== p.id))
    if (p.bad) {
      setLoad((l) => Math.min(100, l + 6))
      note(`${p.label}${p.src ? ` ${p.src}` : ''} hit origin`, true)
    } else {
      setLoad((l) => Math.max(0, l - 1))
    }
  }

  if (phase === 'idle' || phase === 'degrading') return null

  const loadTone = load > 70 ? 'text-ops-err' : load > 35 ? 'text-dark-accent' : 'text-ops-ok'
  const loadBar = load > 70 ? 'bg-ops-err' : load > 35 ? 'bg-dark-accent' : 'bg-ops-ok'
  const restored = phase === 'restored'

  return (
    <motion.div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="incident-title"
      className={`fixed inset-0 z-[94] flex flex-col overflow-y-auto font-mono ${restored ? 'bg-[#060805]' : 'bg-[#0A0605]'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduce ? 0 : 0.25 }}
    >
      {/* Scanlines + red vignette for the outage */}
      {!restored && (
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(255,40,60,0.18)_100%)]"
          aria-hidden
        />
      )}

      {/* Top bar — the way out is always right here */}
      <div className="relative z-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-ops-err/30 px-4 py-3 text-[12px] sm:px-6">
        <span className={`flex items-center gap-2 ${restored ? 'text-ops-ok' : 'text-ops-err'}`}>
          <span className={`status-dot ${restored ? 'bg-ops-ok' : 'animate-status-pulse bg-ops-err'}`} />
          {restored ? 'resolved' : 'SEV-1'}
        </span>
        <span id="incident-title" className="text-dark-text/80">
          {restored ? 'azab.dev is back up' : `azab.dev is down · ${CAUSES[cause].title}`}
        </span>
        <span className="tabular-nums text-ops-dim">outage {fmt(restored && result ? result.ms : elapsed)}</span>
        {!restored && (
          <button
            type="button"
            onClick={skip}
            className="ml-auto min-h-[40px] border border-dark-text/30 px-3 text-dark-text transition-colors hover:border-dark-text hover:bg-white/5"
          >
            skip · restore site <span className="text-ops-dim">(esc)</span>
          </button>
        )}
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-10">
        {/* DOWN: what happened */}
        {(phase === 'down' || phase === 'defend' || phase === 'reboot') && (
          <div className={phase === 'defend' ? 'mb-4 sm:mb-6' : 'mb-6'}>
            <p className={`font-extrabold tracking-tight text-ops-err sm:text-5xl ${phase === 'defend' ? 'text-2xl' : 'text-3xl'}`}>
              <GlitchText text="SYSTEM DOWN" burst={phase === 'down'} />
            </p>
            <ol className="mt-4 space-y-0.5 text-[12.5px] text-ops-dim sm:text-[13px]">
              {CAUSES[cause].log.slice(0, logShown || CAUSES[cause].log.length).map((l, i, arr) => (
                <li
                  key={i}
                  className={`${i === arr.length - 1 ? 'text-ops-err' : ''} ${
                    phase === 'defend' && i < arr.length - 1 ? 'hidden sm:block' : ''
                  }`}
                >
                  <span className="text-ops-err/60">[{(0.137 * (i + 1)).toFixed(3)}]</span> {l}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* DEFEND */}
        {phase === 'defend' && (
          <div className="grid flex-1 gap-5 lg:grid-cols-[1fr_280px]">
            <div>
              <p className="mb-3 text-[13px] text-dark-text sm:text-sm">
                <span className="text-ops-err">fight it.</span> tap the <span className="text-ops-err">red</span> packets before
                they hit the server. leave the <span className="text-ops-ok">green</span> ones, they’re real visitors.
              </p>
              <div className="mb-2 flex items-center gap-3 text-xs">
                <span className="text-ops-dim">load</span>
                <div className="h-2 flex-1 bg-ops-line">
                  <motion.div className={`h-full ${loadBar}`} animate={{ width: `${load}%` }} transition={{ duration: 0.25 }} />
                </div>
                <span className={`w-10 text-right tabular-nums ${loadTone}`}>{Math.round(load)}%</span>
              </div>
              <p className="mb-3 text-[11px] text-ops-dim">get it under {SAFE_LOAD}% to reboot safely</p>

              {/* Arena */}
              <div className="relative mx-auto aspect-square w-full max-w-[460px] select-none overflow-hidden border border-ops-err/25 bg-black/40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,60,80,0.10),transparent_60%)]" aria-hidden />
                {/* Core */}
                <div
                  className={`absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center border text-center sm:h-28 sm:w-28 ${
                    load > 70 ? 'animate-status-pulse border-ops-err bg-ops-err/10' : 'border-dark-accent bg-dark-accent/10'
                  }`}
                >
                  <span className="text-[11px] text-dark-text">azab.dev</span>
                  <span className={`text-lg font-bold tabular-nums ${loadTone}`}>{Math.round(load)}%</span>
                </div>
                {packets.map((p) => {
                  const sx = 50 + 40 * Math.cos(p.angle)
                  const sy = 50 + 44 * Math.sin(p.angle)
                  return (
                    <motion.button
                      key={p.id}
                      type="button"
                      onPointerDown={() => hit(p)}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && hit(p)}
                      aria-label={`${p.bad ? 'malicious' : 'legitimate'} packet: ${p.label}`}
                      className={`absolute z-10 min-h-[34px] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap border px-2 py-1.5 text-[10.5px] leading-none sm:text-[11px] ${
                        p.bad
                          ? 'border-ops-err bg-ops-err/20 text-ops-err shadow-[0_0_14px_-2px_rgba(255,80,90,0.7)]'
                          : 'border-ops-ok/70 bg-ops-ok/10 text-ops-ok'
                      }`}
                      initial={{ left: `${sx}%`, top: `${sy}%`, opacity: 0 }}
                      animate={{ left: '50%', top: '50%', opacity: 1 }}
                      transition={{ duration: p.dur, ease: 'linear', opacity: { duration: 0.2 } }}
                      onAnimationComplete={() => reached(p)}
                    >
                      {p.label}
                      {p.src && <span className="hidden opacity-70 sm:inline"> {p.src}</span>}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Live log */}
            <div className="border border-ops-line bg-black/30">
              <p className="border-b border-dashed border-ops-line px-3 py-2 text-[11px] text-ops-dim">
                <span className="text-ops-ok">$</span> tail -f /var/log/firewall
              </p>
              <ol className="space-y-1 px-3 py-2 text-[11.5px]">
                {events.length === 0 && <li className="text-ops-dim">waiting for operator…</li>}
                {events.map((e) => (
                  <li key={e.id} className={`truncate ${e.bad ? 'text-ops-err' : 'text-ops-ok'}`}>
                    {e.text}
                  </li>
                ))}
              </ol>
              <p className="border-t border-ops-line px-3 py-2 text-[11px] text-ops-dim">
                dropped {dropped} · real users blocked {blockedUsers}
              </p>
            </div>
          </div>
        )}

        {/* REBOOT */}
        {phase === 'reboot' && (
          <div className="flex flex-1 flex-col items-start justify-center gap-4">
            <p className="text-sm text-ops-ok">threat contained. load {Math.round(load)}%.</p>
            <p className="max-w-md font-sans text-[15px] leading-relaxed text-dark-text/80">
              The box is still in a bad state. A clean reboot brings every service back and runs the health checks.
            </p>
            <button ref={actionRef} type="button" onClick={() => runBoot(false)} className="ops-btn ops-btn-primary text-base">
              sudo reboot
            </button>
          </div>
        )}

        {/* BOOTING */}
        {(phase === 'booting' || restored) && (
          <div className="flex-1">
            <p className="mb-4 text-xs text-ops-dim">azab.dev bios v3 · power-on self test</p>
            <ol className="space-y-1.5 text-[13px] sm:text-sm">
              {boot.map((l, i) => (
                <li key={i} className="flex gap-3">
                  <span className={`w-[6ch] shrink-0 whitespace-nowrap ${l.state === 'ok' ? 'text-ops-ok' : 'text-dark-accent'}`}>
                    {l.state === 'ok' ? '[ ok ]' : <Spinner />}
                  </span>
                  <span className={l.state === 'ok' ? 'text-dark-text/85' : 'text-dark-text'}>{l.text}</span>
                </li>
              ))}
            </ol>

            <AnimatePresence>
              {restored && result && (
                <motion.div
                  className="mt-8"
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="phosphor text-3xl font-extrabold tracking-tight text-ops-ok sm:text-5xl">ALL SYSTEMS OPERATIONAL</p>
                  <p className="mt-3 text-sm text-dark-text/80">
                    {result.failover ? 'auto-failover restored service' : 'you brought it back'} in{' '}
                    <span className="text-ops-ok">{fmt(result.ms)}</span>
                    <span className="text-ops-dim">
                      {' '}
                      · incidents survived: {result.stats.survived}
                      {result.stats.fastestMs !== null && ` · fastest ${fmt(result.stats.fastestMs)}`}
                    </span>
                  </p>
                  <button ref={actionRef} type="button" onClick={close} className="ops-btn mt-5">
                    back to the site
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  )
}

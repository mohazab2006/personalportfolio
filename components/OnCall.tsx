'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Section from '@/components/Section'
import { START_ONCALL_EVENT } from '@/lib/events'
import { triggerIncident } from '@/lib/incident'
import { findEgg, readQuests, writeQuests, useEggs, unlocked } from '@/lib/eggs'
import { useSnaggy } from '@/components/SnaggyProvider'

/**
 * ON-CALL — an original mini-game: you hold the pager for a 45s shift.
 * Servers degrade at random; tap a degraded one to restart it before it goes down.
 * Score is real uptime (time-weighted share of the fleet that stayed serving).
 */

/** Normal shift, and Round 115 (unlocked by the five-nines egg): longer, nastier. */
const MODES = {
  normal: { shiftMs: 45_000, fail: [0.04, 0.1] as const, window: [3400, 1600] as const, label: '45s' },
  round115: { shiftMs: 60_000, fail: [0.07, 0.14] as const, window: [2800, 1500] as const, label: '60s · round 115' },
}
type Mode = keyof typeof MODES
const TICK_MS = 100
const BEST_KEY = 'azab-oncall-best'

// Named after things this portfolio actually runs on.
const FLEET = [
  'snaggy',
  'supabase',
  'nginx',
  'docker',
  'tailscale',
  'postgres',
  'redis',
  'ci-cd',
  'dns',
  'vercel',
  'pgvector',
  'cloudflare',
] as const

type NodeState = 'up' | 'degraded' | 'down' | 'restarting'
type FleetNode = {
  name: string
  state: NodeState
  /** degraded: when it goes down; restarting: when it comes back */
  until: number
  /** degraded: how long the window was (for the drain bar) */
  window: number
}
type LogLine = { t: number; text: string; tone: 'ok' | 'warn' | 'err' | 'dim' }
type Phase = 'idle' | 'running' | 'over'

function fmtClock(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

function rank(uptime: number) {
  if (uptime >= 99.9) return { title: 'five nines. are you a bot?', tone: 'ok' as const }
  if (uptime >= 99) return { title: 'SRE material', tone: 'ok' as const }
  if (uptime >= 96) return { title: 'solid on-call', tone: 'ok' as const }
  if (uptime >= 90) return { title: 'pager fatigue setting in', tone: 'warn' as const }
  return { title: 'postmortem required', tone: 'err' as const }
}

const freshFleet = (): FleetNode[] => FLEET.map((name) => ({ name, state: 'up', until: 0, window: 0 }))

/** The other games, so nobody has to know the terminal commands to find them. */
function GameStrip() {
  const { run } = useSnaggy()
  const games = [
    { name: 'on-call', what: 'keep 12 servers alive for 45s', cta: 'below ↓', act: () => sectionTop() },
    { name: 'typing test', what: 'dev words, wpm + accuracy, personal best', cta: 'play →', act: () => run('play typing') },
    { name: 'outage drill', what: 'take the site down, then bring it back', cta: 'start →', act: () => triggerIncident('button') },
    { name: 'easter eggs', what: '12 hidden, each unlocks something', cta: 'hints →', act: () => run('eggs') },
  ]
  return (
    <div className="mb-5 grid grid-cols-2 gap-2 font-mono sm:gap-3 lg:grid-cols-4">
      {games.map((g) => (
        <button
          key={g.name}
          type="button"
          onClick={g.act}
          className="ops-panel group flex min-h-[88px] flex-col justify-between p-3 text-left transition-colors hover:border-dark-accent/50 sm:p-4"
        >
          <span className="text-[13px] font-bold text-dark-text">{g.name}</span>
          <span className="mt-1 text-[11px] leading-snug text-ops-dim">{g.what}</span>
          <span className="mt-2 text-[11px] text-dark-accent opacity-80 transition-opacity group-hover:opacity-100">{g.cta}</span>
        </button>
      ))}
    </div>
  )
}

function sectionTop() {
  document.getElementById('oncall-board')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

export default function OnCall() {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('idle')
  const [nodes, setNodes] = useState<FleetNode[]>(freshFleet)
  const [log, setLog] = useState<LogLine[]>([])
  const [now, setNow] = useState(0)
  const [stats, setStats] = useState({ resolved: 0, outages: 0, uptime: 100, streak: 0, bestStreak: 0 })
  const [best, setBest] = useState<number | null>(null)
  const [isBest, setIsBest] = useState(false)
  const [mode, setMode] = useState<Mode>('normal')
  const [attempt, setAttempt] = useState(0)
  const eggs = useEggs()
  const has115 = unlocked(eggs).modes.includes('round115')
  const cfg = MODES[mode]
  const SHIFT_MS = cfg.shiftMs

  const startRef = useRef(0)
  const servedRef = useRef(0) // integral of serving-fraction over time
  const lastRef = useRef(0)
  const nodesRef = useRef(nodes)
  nodesRef.current = nodes
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const b = localStorage.getItem(BEST_KEY)
      if (b) setBest(parseFloat(b))
    } catch {
      /* ignore */
    }
  }, [])

  const pushLog = useCallback((text: string, tone: LogLine['tone']) => {
    setLog((l) => [{ t: performance.now() - startRef.current, text, tone }, ...l].slice(0, 40))
  }, [])

  const start = useCallback((m: Mode = 'normal') => {
    setMode(m)
    setAttempt(readQuests().oncallLosses + 1)
    const t = performance.now()
    startRef.current = t
    lastRef.current = t
    servedRef.current = 0
    setNodes(freshFleet())
    setLog([{ t: 0, text: 'pager acquired. shift started.', tone: 'dim' }])
    setStats({ resolved: 0, outages: 0, uptime: 100, streak: 0, bestStreak: 0 })
    setIsBest(false)
    setNow(0)
    setPhase('running')
  }, [])

  // Snaggy's `play oncall` (or any other launcher) starts a shift from anywhere.
  useEffect(() => {
    const on = () => {
      sectionRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
      window.setTimeout(() => start('normal'), reduce ? 0 : 600)
    }
    window.addEventListener(START_ONCALL_EVENT, on)
    return () => window.removeEventListener(START_ONCALL_EVENT, on)
  }, [start, reduce])

  // Game loop
  useEffect(() => {
    if (phase !== 'running') return
    const id = window.setInterval(() => {
      const t = performance.now()
      const elapsed = t - startRef.current
      const dt = t - lastRef.current
      lastRef.current = t
      const progress = Math.min(1, elapsed / SHIFT_MS)

      let next = nodesRef.current.map((n) => ({ ...n }))
      const events: [string, LogLine['tone']][] = []

      // Timers: degraded → down, restarting → up
      for (const n of next) {
        if (n.state === 'degraded' && t >= n.until) {
          n.state = 'down'
          events.push([`${n.name} DOWN — missed the window`, 'err'])
          setStats((s) => ({ ...s, outages: s.outages + 1, streak: 0 }))
        } else if (n.state === 'restarting' && t >= n.until) {
          n.state = 'up'
        }
      }

      // Failures: more frequent and with shorter windows as the shift wears on
      // Per 100ms tick: ~0.4 failures/s at the start, ~1.4/s at the end (humanly beatable, still sweaty)
      const failChance = cfg.fail[0] + progress * cfg.fail[1]
      const windowMs = cfg.window[0] - progress * cfg.window[1]
      const healthy = next.filter((n) => n.state === 'up')
      const failures = Math.random() < failChance ? (progress > 0.6 && Math.random() < 0.35 ? 2 : 1) : 0
      for (let k = 0; k < failures && healthy.length; k++) {
        const victim = healthy.splice(Math.floor(Math.random() * healthy.length), 1)[0]
        const target = next.find((n) => n.name === victim.name)!
        target.state = 'degraded'
        target.window = windowMs
        target.until = t + windowMs
        const reasons = ['latency spike', 'memory leak', 'cert expiring', '5xx rate up', 'disk 97%', 'conn pool full']
        events.push([`${target.name} degraded: ${reasons[Math.floor(Math.random() * reasons.length)]}`, 'warn'])
      }

      // Uptime: degraded still serves traffic; down and restarting do not
      const serving = next.filter((n) => n.state === 'up' || n.state === 'degraded').length / next.length
      servedRef.current += serving * dt
      const uptime = elapsed > 0 ? (servedRef.current / elapsed) * 100 : 100

      setNodes(next)
      setNow(elapsed)
      setStats((s) => ({ ...s, uptime }))
      events.forEach(([text, tone]) => pushLog(text, tone))

      if (elapsed >= SHIFT_MS) {
        window.clearInterval(id)
        next = next.map((n) => ({ ...n }))
        setPhase('over')
        const final = Math.round(uptime * 100) / 100
        pushLog(`shift over. uptime ${final.toFixed(2)}%`, 'dim')
        // Eggs: five nines, and the six-tries boss
        if (final >= 99) findEgg('fivenines')
        const q = readQuests()
        if (final < 90) writeQuests({ oncallLosses: q.oncallLosses + 1 })
        else if (final >= 95) {
          if (q.oncallLosses >= 6 && findEgg('radahn')) pushLog(`felled after ${q.oncallLosses} failed shifts.`, 'ok')
          writeQuests({ oncallLosses: 0 })
        }
        if (final < 40) {
          pushLog('cascading failure: the outage is spreading to production…', 'err')
          window.setTimeout(() => triggerIncident('oncall'), 2200)
        }
        setBest((b) => {
          if (b === null || final > b) {
            setIsBest(true)
            try {
              localStorage.setItem(BEST_KEY, String(final))
            } catch {
              /* ignore */
            }
            return final
          }
          return b
        })
      }
    }, TICK_MS)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, pushLog])

  const restart = (name: string) => {
    if (phase !== 'running') return
    const t = performance.now()
    setNodes((list) =>
      list.map((n) => {
        if (n.name !== name) return n
        if (n.state === 'degraded') {
          pushLog(`${n.name} restarted ✓`, 'ok')
          setStats((s) => {
            const streak = s.streak + 1
            return { ...s, resolved: s.resolved + 1, streak, bestStreak: Math.max(s.bestStreak, streak) }
          })
          return { ...n, state: 'restarting', until: t + 350 }
        }
        if (n.state === 'down') {
          pushLog(`${n.name} recovered from outage`, 'ok')
          return { ...n, state: 'restarting', until: t + 1100 }
        }
        return n
      })
    )
  }

  const remaining = SHIFT_MS - now
  const uptimeTone = stats.uptime >= 99 ? 'text-ops-ok' : stats.uptime >= 95 ? 'text-dark-accent' : 'text-ops-err'
  const result = rank(stats.uptime)

  return (
    <Section
      id="play"
      index="06"
      command="./oncall.sh --shift 45s"
      title="Play"
      subtitle="games, hidden in a portfolio. start with on-call: tap the degraded servers before they go down."
    >
      <GameStrip />

      <div ref={sectionRef} id="oncall-board" className="ops-panel ops-ticks select-none font-mono">
        {/* Header / HUD */}
        <div className="ops-head flex-wrap gap-y-1">
          <span className="text-dark-text/80">
            oncall — shift.sh
            {phase !== 'idle' && attempt > 1 && <span className="text-ops-dim"> · attempt {attempt}</span>}
            {mode === 'round115' && <span className="text-ops-err"> · round 115</span>}
          </span>
          <span className="ml-auto flex items-center gap-4">
            <span className="tabular-nums">
              <span className="text-ops-dim">uptime </span>
              <span className={uptimeTone}>{stats.uptime.toFixed(2)}%</span>
            </span>
            <span className="tabular-nums">
              <span className="text-ops-dim">streak </span>
              <motion.span
                key={stats.streak}
                className={`inline-block ${stats.streak >= 10 ? 'phosphor text-dark-accent' : stats.streak >= 5 ? 'text-dark-accent' : 'text-dark-text/80'}`}
                initial={reduce || stats.streak === 0 ? false : { scale: 1.6 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                x{stats.streak}
              </motion.span>
            </span>
            <span className="tabular-nums">
              <span className="text-ops-dim">shift </span>
              <span className="text-dark-text/80">{phase === 'running' ? fmtClock(remaining) : fmtClock(SHIFT_MS)}</span>
            </span>
          </span>
        </div>

        {/* Shift progress */}
        <div className="h-[3px] bg-ops-line" aria-hidden>
          <div
            className="h-full bg-dark-accent shadow-[0_0_10px_rgb(var(--accent)/0.7)]"
            style={{ width: `${phase === 'idle' ? 0 : Math.min(100, (now / SHIFT_MS) * 100)}%` }}
          />
        </div>

        <div className="grid lg:grid-cols-[1fr_300px]">
          {/* Fleet */}
          <div className="relative p-3 sm:p-5">
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="Server fleet">
              {nodes.map((n) => {
                const t = performance.now()
                const drain = n.state === 'degraded' ? Math.max(0, (n.until - t) / n.window) : 0
                return (
                  <li key={n.name}>
                    <button
                      type="button"
                      onClick={() => restart(n.name)}
                      disabled={phase !== 'running'}
                      aria-label={`${n.name}: ${n.state}${n.state === 'degraded' || n.state === 'down' ? ', tap to restart' : ''}`}
                      className={`relative flex min-h-[76px] w-full flex-col justify-between overflow-hidden border p-2.5 text-left transition-[border-color,background-color,transform] duration-150 active:scale-[0.97] sm:min-h-[88px] sm:p-3 ${
                        n.state === 'up'
                          ? 'border-ops-line bg-dark-bg/40'
                          : n.state === 'degraded'
                            ? 'animate-status-pulse border-dark-accent bg-dark-accent/[0.08] shadow-[0_0_20px_-6px_rgb(var(--accent)/0.6)]'
                            : n.state === 'down'
                              ? 'border-ops-err bg-ops-err/[0.12] shadow-[0_0_20px_-6px_rgba(255,107,91,0.6)]'
                              : 'border-ops-line-strong bg-dark-bg/40'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 text-[11px] text-dark-text/85 sm:text-xs">
                        <span
                          className={`status-dot ${
                            n.state === 'up'
                              ? 'bg-ops-ok'
                              : n.state === 'degraded'
                                ? 'bg-dark-accent'
                                : n.state === 'down'
                                  ? 'bg-ops-err'
                                  : 'bg-ops-dim'
                          }`}
                        />
                        <span className="truncate">{n.name}</span>
                      </span>
                      <span
                        className={`text-[10.5px] uppercase tracking-wider sm:text-[11px] ${
                          n.state === 'up'
                            ? 'text-ops-dim'
                            : n.state === 'degraded'
                              ? 'text-dark-accent'
                              : n.state === 'down'
                                ? 'font-bold text-ops-err'
                                : 'text-dark-muted'
                        }`}
                      >
                        {n.state === 'restarting' ? 'restarting…' : n.state}
                      </span>
                      {n.state === 'degraded' && (
                        <span className="absolute inset-x-0 bottom-0 h-[3px] bg-ops-line" aria-hidden>
                          <span className="block h-full bg-dark-accent" style={{ width: `${drain * 100}%` }} />
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>

            {/* Start / results overlay */}
            <AnimatePresence>
              {phase !== 'running' && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-dark-bg/80 p-4 backdrop-blur-[2px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.2 }}
                >
                  {phase === 'idle' ? (
                    <div className="max-w-sm text-center">
                      <p className="text-xs text-ops-dim">
                        <span className="text-ops-ok">$</span> ./oncall.sh
                      </p>
                      <p className="mt-3 text-lg font-bold text-dark-text sm:text-xl">You have the pager.</p>
                      <p className="mt-2 font-sans text-sm leading-relaxed text-dark-text/70">
                        {FLEET.length} services, {MODES.normal.shiftMs / 1000} seconds. Restart anything that turns{' '}
                        <span className="text-dark-accent">amber</span> before it goes{' '}
                        <span className="text-ops-err">red</span>. It gets worse.
                      </p>
                      <div className="mt-5 flex flex-wrap justify-center gap-2">
                        <button type="button" onClick={() => start('normal')} className="ops-btn ops-btn-primary">
                          start shift
                        </button>
                        {has115 && (
                          <button type="button" onClick={() => start('round115')} className="ops-btn border-ops-err/60 text-ops-err">
                            round 115
                          </button>
                        )}
                      </div>
                      {best !== null && (
                        <p className="mt-3 text-[11px] text-ops-dim">
                          your best: <span className="text-ops-ok">{best.toFixed(2)}%</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="max-w-sm text-center">
                      <p className="text-xs text-ops-dim">--- shift report ---</p>
                      <p className={`phosphor mt-3 text-4xl font-extrabold tabular-nums sm:text-5xl ${uptimeTone}`}>
                        {stats.uptime.toFixed(2)}%
                      </p>
                      <p
                        className={`mt-2 text-sm ${
                          result.tone === 'ok' ? 'text-ops-ok' : result.tone === 'warn' ? 'text-dark-accent' : 'text-ops-err'
                        }`}
                      >
                        {result.title}
                      </p>
                      <p className="mt-3 text-xs text-dark-muted">
                        {stats.resolved} caught · {stats.outages} outages · best streak x{stats.bestStreak}
                        {isBest && <span className="text-ops-ok"> · new personal best</span>}
                      </p>
                      <div className="mt-5 flex flex-wrap justify-center gap-2">
                        <button type="button" onClick={() => start(mode)} className="ops-btn ops-btn-primary">
                          run it back
                        </button>
                        {has115 && mode !== 'round115' && (
                          <button type="button" onClick={() => start('round115')} className="ops-btn border-ops-err/60 text-ops-err">
                            round 115
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Incident log */}
          <div className="border-t border-ops-line bg-dark-bg/50 lg:border-l lg:border-t-0">
            <p className="border-b border-dashed border-ops-line px-4 py-2 text-[11px] text-ops-dim">
              <span className="text-ops-ok">$</span> tail -f /var/log/incidents
            </p>
            <ol className="h-[132px] overflow-hidden px-4 py-2 text-[11.5px] leading-relaxed lg:h-[300px]" aria-live="off">
              {log.length === 0 && <li className="text-ops-dim">waiting for a shift to start…</li>}
              {log.map((l, i) => (
                <li
                  key={`${l.t}-${i}`}
                  className={`truncate ${
                    l.tone === 'ok'
                      ? 'text-ops-ok'
                      : l.tone === 'warn'
                        ? 'text-dark-accent'
                        : l.tone === 'err'
                          ? 'text-ops-err'
                          : 'text-ops-dim'
                  } ${i > 0 ? 'opacity-80' : ''}`}
                >
                  <span className="text-ops-dim">[{fmtClock(l.t)}]</span> {l.text}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </Section>
  )
}

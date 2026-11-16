'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { PERSONAL, PROJECTS } from '@/lib/data'
import { scrollToElement } from '@/lib/utils'
import { useSnaggy } from '@/components/SnaggyProvider'
import { triggerIncident, useIncidentStats } from '@/lib/incident'

const NAME_LINES = ['MOHAMED', 'AZAB'] as const

/** Each service "comes up" in turn; ms is how long it spins before reporting ok. */
const BOOT = [
  { msg: 'init azab.dev', ms: 340 },
  { msg: 'mounting /projects', ms: 580 },
  { msg: 'loading experience.log', ms: 460 },
  { msg: 'starting snaggy.service', ms: 760 },
] as const

const BOOT_DELAY = 280 // pause before the first line, like a cursor waking up
const LINE_GAP = 110 // between one ok and the next line starting
const READY_PAUSE = 180 // after the last ok, before "ready"
const PROMPT_PAUSE = 420 // after "ready", before typing starts
const CMD = 'whoami'
const KEY_MS = 85 // per keystroke
const ENTER_PAUSE = 300 // after typing, before the output (your name) appears
const SESSION_KEY = 'azab-boot-played'

// Kernel-log style timestamps derived from the real schedule, so they match what you watch.
const STARTS: number[] = []
BOOT.reduce((t, l) => {
  STARTS.push(t)
  return t + l.ms + LINE_GAP
}, BOOT_DELAY)
const READY_AT = STARTS[STARTS.length - 1] + BOOT[BOOT.length - 1].ms + READY_PAUSE
const stamp = (ms: number) => (ms / 1000).toFixed(3).padStart(7, ' ')

const LETTER_STAGGER = 0.035
const LETTER_DURATION = 0.6
const NAME_CHARS = NAME_LINES.join('').length
const NAME_END = NAME_CHARS * LETTER_STAGGER + LETTER_DURATION // relative to reveal
const AFTER_NAME = NAME_END - 0.25

const liveCount = PROJECTS.filter((p) => p.demo).length
const SPINNER = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

type BootState = {
  /** Index of the line currently running (-1 = nothing started). */
  line: number
  /** How many lines have reported ok. */
  done: number
  ready: boolean
  typed: number
  revealed: boolean
  /** True when we jumped to the end (skip / repeat visit): no fill transitions. */
  instant: boolean
}

const START: BootState = { line: -1, done: 0, ready: false, typed: 0, revealed: false, instant: false }
const END: BootState = {
  line: BOOT.length - 1,
  done: BOOT.length,
  ready: true,
  typed: CMD.length,
  revealed: true,
  instant: true,
}

function Spinner() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setI((n) => (n + 1) % SPINNER.length), 70)
    return () => window.clearInterval(id)
  }, [])
  return <span className="text-dark-accent">{SPINNER[i]}</span>
}

/** Runs the boot timeline once per session; any key or click fast-forwards it. */
function useBootSequence(reduce: boolean | null) {
  const [state, setState] = useState<BootState>(START)
  const timers = useRef<number[]>([])

  const finish = useCallback(() => {
    timers.current.forEach(window.clearTimeout)
    timers.current = []
    setState((s) => (s.revealed ? s : END))
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      /* storage blocked: fine, it just plays again next time */
    }
  }, [])

  useEffect(() => {
    let played = false
    try {
      played = sessionStorage.getItem(SESSION_KEY) === '1'
    } catch {
      /* ignore */
    }
    if (reduce || played) {
      setState(END)
      return
    }

    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms))

    BOOT.forEach((l, i) => {
      at(STARTS[i], () => setState((s) => ({ ...s, line: i })))
      at(STARTS[i] + l.ms, () => setState((s) => ({ ...s, done: i + 1 })))
    })
    at(READY_AT, () => setState((s) => ({ ...s, ready: true })))

    // Type the command with slightly uneven keystrokes, like a person.
    let t = READY_AT + PROMPT_PAUSE
    for (let c = 1; c <= CMD.length; c++) {
      t += KEY_MS + Math.round((Math.random() - 0.5) * 40)
      at(t, () => setState((s) => ({ ...s, typed: c })))
    }
    at(t + ENTER_PAUSE, finishNatural)

    function finishNatural() {
      setState((s) => ({ ...s, revealed: true }))
      try {
        sessionStorage.setItem(SESSION_KEY, '1')
      } catch {
        /* ignore */
      }
    }

    const skip = (e: Event) => {
      if (e instanceof KeyboardEvent && (e.metaKey || e.ctrlKey || e.altKey || e.key === 'Tab')) return
      finish()
    }
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)

    return () => {
      timers.current.forEach(window.clearTimeout)
      timers.current = []
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [reduce, finish])

  return state
}

/** Local Ottawa time, ticking. Rendered only after mount to avoid hydration mismatch. */
function useOttawaClock() {
  const [time, setTime] = useState<string | null>(null)
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-CA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'America/Toronto',
      timeZoneName: 'short',
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])
  return time
}

function StatusRow({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] gap-3 border-b border-dashed border-ops-line px-4 py-2.5 last:border-b-0 sm:grid-cols-[7.5rem_1fr]">
      <dt className="text-ops-dim">{k}</dt>
      <dd className="min-w-0 text-dark-text/90">{children}</dd>
    </div>
  )
}

function StatusPanel({ show, delay, onAsk }: { show: boolean; delay: number; onAsk: () => void }) {
  const time = useOttawaClock()
  const incidents = useIncidentStats()

  return (
    <motion.aside
      className={`ops-panel ops-ticks w-full font-mono text-[12.5px] sm:text-[13px] ${show ? '' : 'pointer-events-none'}`}
      initial={{ opacity: 0, y: 14 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ duration: 0.55, delay: show ? delay : 0, ease: [0.16, 1, 0.3, 1] }}
      aria-label="System status"
    >
      <div className="ops-head">
        <span className="flex gap-1.5" aria-hidden>
          <span className="status-dot bg-ops-err/80" />
          <span className="status-dot bg-dark-accent/80" />
          <span className="status-dot bg-ops-ok/80" />
        </span>
        <span>sys/status</span>
        <span className="ml-auto flex items-center gap-2 text-ops-ok">
          <span className="status-dot animate-status-pulse bg-ops-ok shadow-[0_0_8px_rgba(124,228,149,0.8)]" />
          online
        </span>
      </div>
      <dl>
        <StatusRow k="host">azab.dev</StatusRow>
        <StatusRow k="location">ottawa, on</StatusRow>
        <StatusRow k="local time">
          <span className="tabular-nums">{time ?? '--:--:--'}</span>
        </StatusRow>
        <StatusRow k="education">cs @ {PERSONAL.university.toLowerCase()}</StatusRow>
        <StatusRow k="focus">ai · security · infra</StatusRow>
        <StatusRow k="services">
          <span className="text-dark-accent">{PROJECTS.length}</span> shipped
          <span className="text-ops-dim"> · </span>
          <span className="text-ops-ok">{liveCount}</span> live
        </StatusRow>
        <StatusRow k="on-call">
          <button
            type="button"
            onClick={onAsk}
            className="group inline-flex items-center gap-2 text-dark-text/90 transition-colors hover:text-dark-accent"
          >
            <span className="status-dot bg-ops-ok" aria-hidden />
            snaggy
            <span className="text-ops-dim transition-colors group-hover:text-dark-accent">[ ask → ]</span>
          </button>
        </StatusRow>
        <StatusRow k="incidents">
          {incidents.survived ? (
            <span>
              <span className="text-ops-ok">{incidents.survived}</span> survived
              {incidents.fastestMs !== null && (
                <span className="text-ops-dim"> · best {(incidents.fastestMs / 1000).toFixed(1)}s</span>
              )}
            </span>
          ) : (
            <span className="text-ops-dim">0 · all quiet</span>
          )}
        </StatusRow>
      </dl>
      {/* Opt-in chaos. Nobody who doesn't press it ever sees an outage. */}
      <div className="flex items-center justify-between gap-3 border-t border-ops-line px-4 py-3">
        <span className="text-[11px] text-ops-dim">{'// authorised personnel only'}</span>
        <button
          type="button"
          onClick={() => triggerIncident('button')}
          className="min-h-[40px] border border-ops-err/60 px-3 text-[12px] text-ops-err transition-[background-color,box-shadow] hover:bg-ops-err/10 hover:shadow-[0_0_18px_-4px_rgba(255,107,91,0.7)] active:bg-ops-err/20"
        >
          [ do not press ]
        </button>
      </div>
    </motion.aside>
  )
}

function BootLine({ index, boot }: { index: number; boot: BootState }) {
  const line = BOOT[index]
  const visible = index <= boot.line
  const done = index < boot.done
  const running = visible && !done

  return (
    <li
      className={`flex gap-3 transition-opacity duration-150 ${visible ? 'opacity-100' : 'opacity-0'}`}
      aria-hidden={!visible}
    >
      <span className="shrink-0 whitespace-pre tabular-nums">[{stamp(STARTS[index])}]</span>
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <span className={`truncate transition-colors duration-300 ${running ? 'text-dark-text/85' : ''}`}>
          {line.msg}
        </span>
        {/* Leader dots fill left→right while the service comes up */}
        <span className="relative hidden h-[1.2em] flex-1 overflow-hidden sm:block" aria-hidden>
          <span
            className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-ops-line-strong ease-linear"
            style={{
              width: visible ? '100%' : '0%',
              transitionProperty: 'width',
              transitionDuration: boot.instant ? '0ms' : `${line.ms}ms`,
            }}
          >
            {'.'.repeat(120)}
          </span>
        </span>
        <span className="ml-auto w-[2ch] shrink-0 text-right sm:ml-0">
          {done ? (
            <motion.span
              className="inline-block text-ops-ok"
              initial={boot.instant ? false : { opacity: 0, scale: 1.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.18 }}
            >
              ok
            </motion.span>
          ) : running ? (
            <Spinner />
          ) : null}
        </span>
      </span>
    </li>
  )
}

/** Cinema bars, portalled to <body> so they sit above the nav (main is its own stacking context). */
function Letterbox({ open }: { open: boolean }) {
  const reduce = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted || reduce) return null
  const bar = (pos: 'top-0' | 'bottom-0') => (
    <motion.div
      className={`pointer-events-none fixed inset-x-0 ${pos} z-[60] flex items-center justify-center overflow-hidden bg-black`}
      initial={{ height: '9vh' }}
      animate={{ height: open ? 0 : '9vh' }}
      transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1], delay: open ? 0.05 : 0 }}
      aria-hidden
    >
      {pos === 'bottom-0' && !open && (
        // subtitle position, like a film
        <span className="animate-status-pulse font-mono text-[11px] tracking-wide text-dark-text/50">
          <span className="[@media(hover:none)]:hidden">press any key to skip</span>
          <span className="hidden [@media(hover:none)]:inline">tap to skip</span>
        </span>
      )}
    </motion.div>
  )
  return createPortal(
    <>
      {bar('top-0')}
      {bar('bottom-0')}
    </>,
    document.body
  )
}

export default function Hero() {
  const { open: openSnaggy } = useSnaggy()
  const reduce = useReducedMotion()
  const boot = useBootSequence(reduce)
  const [showCursor, setShowCursor] = useState(false)

  useEffect(() => {
    if (!boot.revealed) return
    if (reduce) {
      setShowCursor(true)
      return
    }
    const id = window.setTimeout(() => setShowCursor(true), Math.ceil(NAME_END * 1000))
    return () => window.clearTimeout(id)
  }, [boot.revealed, reduce])

  const d = (s: number) => (reduce ? 0 : s)
  const shown = boot.revealed
  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 8 },
    animate: shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 },
    transition: { duration: 0.45, delay: shown ? d(delay) : 0 },
  })
  let charIndex = 0

  return (
    <section
      id="home"
      className="min-h-screen-dvh relative flex items-center overflow-hidden"
      aria-labelledby="hero-name"
    >
      {/* Letterbox: frames the boot like an opening shot, pulls away on the reveal */}
      <Letterbox open={shown} />
      <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-[max(6.5rem,env(safe-area-inset-top)+4.5rem)] sm:px-6 sm:pt-32 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
          <div className="min-w-0">
            {/* Boot log: every row is always in the DOM (invisible until reached) so nothing jumps */}
            <ol className="mb-7 space-y-1 font-mono text-[11.5px] leading-relaxed text-ops-dim sm:text-xs" aria-hidden>
              {BOOT.map((_, i) => (
                <BootLine key={i} index={i} boot={boot} />
              ))}
              <li
                className={`flex gap-3 transition-opacity duration-300 ${boot.ready ? 'opacity-100' : 'opacity-0'}`}
              >
                <span className="shrink-0 whitespace-pre tabular-nums">[{stamp(READY_AT)}]</span>
                <span className="text-ops-ok">
                  ready <span className="text-ops-dim">·</span> {BOOT.length}/{BOOT.length} services up
                </span>
              </li>
            </ol>

            {/* Prompt: types the command, then waits for "enter" */}
            <p
              className={`mb-3 font-mono text-sm text-dark-muted transition-opacity duration-200 sm:text-[15px] ${
                boot.ready ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span className="text-ops-ok">azab@ottawa</span>
              <span className="text-ops-dim">:</span>
              <span className="text-dark-accent">~</span>
              <span className="text-ops-dim">$ </span>
              <span className="text-dark-text">{CMD.slice(0, boot.typed)}</span>
              {boot.ready && !boot.revealed && (
                <span className="terminal-cursor translate-y-[0.1em] text-dark-accent" aria-hidden />
              )}
            </p>

            <h1
              id="hero-name"
              aria-label={PERSONAL.name}
              className="font-display text-[clamp(3rem,min(11vw,17svh),7.25rem)] font-extrabold leading-[0.92] tracking-[-0.04em] text-dark-text"
            >
              {NAME_LINES.map((line, lineIdx) => (
                <span key={line} className="flex items-end" aria-hidden>
                  <motion.span
                    className={`mr-[0.25em] font-bold ${lineIdx === 0 ? 'text-dark-accent phosphor' : 'invisible'}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: shown ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    &gt;
                  </motion.span>
                  {line.split('').map((char) => {
                    const i = charIndex++
                    return (
                      <span key={`${line}-${i}`} className="inline-block overflow-hidden pb-[0.04em] pt-[0.06em]">
                        <motion.span
                          className="phosphor-soft inline-block transition-colors duration-150 hover:text-dark-accent"
                          initial={{ y: '105%' }}
                          animate={{ y: shown ? 0 : '105%' }}
                          transition={{
                            duration: reduce ? 0 : LETTER_DURATION,
                            ease: [0.16, 1, 0.3, 1],
                            delay: shown ? d(i * LETTER_STAGGER) : 0,
                          }}
                        >
                          {char}
                        </motion.span>
                      </span>
                    )
                  })}
                  {lineIdx === NAME_LINES.length - 1 && showCursor && (
                    <span className="terminal-cursor mb-[0.12em] text-dark-accent phosphor" />
                  )}
                </span>
              ))}
            </h1>

            <motion.p className="mt-7 max-w-xl text-lg leading-relaxed text-dark-text/80 sm:text-xl" {...reveal(AFTER_NAME)}>
              Computer Science at{' '}
              <span className="font-medium text-dark-accent">{PERSONAL.university}</span>. I build and
              run systems across <span className="text-dark-text">AI</span>,{' '}
              <span className="text-dark-text">cybersecurity</span>, and{' '}
              <span className="text-dark-text">infrastructure</span>.
            </motion.p>

            <motion.div
              className={`mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3 ${shown ? '' : 'pointer-events-none'}`}
              {...reveal(AFTER_NAME + 0.15)}
            >
              <button type="button" onClick={() => scrollToElement('projects')} className="ops-btn ops-btn-primary">
                ./projects
              </button>
              <a href={PERSONAL.resumePdf} target="_blank" rel="noopener noreferrer" className="ops-btn">
                cat resume.pdf
              </a>
              <button type="button" onClick={openSnaggy} className="ops-btn">
                <span className="status-dot bg-ops-ok" aria-hidden />
                ask snaggy
              </button>
            </motion.div>
          </div>

          <StatusPanel show={shown} delay={d(AFTER_NAME + 0.3)} onAsk={openSnaggy} />
        </div>
      </div>

      {/* Bottom hint: "skip" while booting, then the scroll cue */}
      <div
        className={`whitespace-nowrap font-mono text-[11px] text-ops-dim ${
          shown
            ? 'absolute bottom-6 left-1/2 -translate-x-1/2'
            : // While booting, pin to the screen: on short phones the hero is taller than the viewport
              'fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-4 z-[61] sm:left-1/2 sm:-translate-x-1/2'
        }`}
      >
        {!shown ? (
          reduce ? (
            <span>
              <span className="[@media(hover:none)]:hidden">press any key to skip</span>
              <span className="hidden [@media(hover:none)]:inline">tap to skip</span>
            </span>
          ) : null
        ) : (
          <motion.button
            type="button"
            onClick={() => scrollToElement('projects')}
            className="hidden items-center gap-2 transition-colors hover:text-dark-accent sm:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: d(AFTER_NAME + 0.6), duration: 0.5 }}
            aria-label="Scroll to projects"
          >
            <motion.span
              animate={reduce ? undefined : { y: [0, 3, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              ↓
            </motion.span>
            tail -f ./portfolio
          </motion.button>
        )}
      </div>
    </section>
  )
}

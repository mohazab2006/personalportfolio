'use client'

import { useState, useRef, useEffect, useCallback, Fragment } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import GlitchText from '@/components/fx/GlitchText'
import { runCommand, complete, keywords, type Line, type Tone, type Effects } from '@/lib/shell'
import { EGGS, findEgg, useEggs, unlocked, useQuests, clearance } from '@/lib/eggs'
import { setTheme, useTheme, useAvailableThemes } from '@/lib/theme'
import { tryOpenRoot, hasRoot } from '@/lib/rootEgg'
import { START_ONCALL_EVENT, SCREEN_GLITCH_EVENT } from '@/lib/events'
import { triggerIncident } from '@/lib/incident'
import { useUsername, writeUsername } from '@/lib/username'

// ── Types ────────────────────────────────────────────────────────────────────

type Entry =
  | { id: number; kind: 'cmd'; prompt: string; text: string }
  | { id: number; kind: 'out'; lines: Line[]; shown: number }
  | { id: number; kind: 'tool'; label: string; result?: string; failed?: boolean }
  | { id: number; kind: 'ai'; text: string; error?: boolean }

type Typing = { target: string; typed: string; start: number | null }

const SUGGESTIONS = ['whoami', 'ls projects', 'neofetch', 'play typing', 'eggs', 'What is Air Property?']

const TYPE_WORDS =
  'deploy docker latency kernel router commit branch merge socket cache token vector tensor async await lambda cluster proxy schema query index buffer thread mutex packet tunnel cipher hash patch build release rollback uptime server client request payload webhook pipeline monitor'.split(
    ' '
  )
const TYPE_BEST_KEY = 'azab-type-best'

const SPINNER = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

const TONE: Record<Tone, string> = {
  default: 'text-dark-text/90',
  dim: 'text-ops-dim',
  ok: 'text-ops-ok',
  warn: 'text-dark-accent',
  err: 'text-ops-err',
  accent: 'text-dark-accent',
}

// ── Small pieces ─────────────────────────────────────────────────────────────

function Spinner() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setI((n) => (n + 1) % SPINNER.length), 80)
    return () => window.clearInterval(id)
  }, [])
  return <span className="inline-block w-[1ch] text-dark-accent">{SPINNER[i]}</span>
}

/** Reveals text a few characters at a time, like output streaming into a terminal. */
function TypeOut({ text, instant, onTick, onDone }: { text: string; instant: boolean; onTick: () => void; onDone?: () => void }) {
  const [n, setN] = useState(instant ? text.length : 0)
  useEffect(() => {
    if (instant) {
      setN(text.length)
      return
    }
    const step = Math.max(2, Math.ceil(text.length / 160))
    const id = window.setInterval(() => {
      setN((prev) => {
        const next = Math.min(text.length, prev + step)
        if (next >= text.length) window.clearInterval(id)
        return next
      })
    }, 14)
    return () => window.clearInterval(id)
  }, [text, instant])
  const done = n >= text.length
  useEffect(() => {
    onTick()
  }, [n, onTick])
  useEffect(() => {
    if (done && !instant) onDone?.()
  }, [done, instant, onDone])
  return (
    <>
      {text.slice(0, n)}
      {!done && <span className="ml-0.5 inline-block h-[1.05em] w-[0.55em] translate-y-[0.15em] bg-dark-accent" aria-hidden />}
    </>
  )
}

function TrafficDot({ color, label, glyph, onClick }: { color: string; label: string; glyph: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`group/dot flex h-3 w-3 items-center justify-center rounded-full ${color} text-[8px] font-bold leading-none text-black/70 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-accent/60`}
    >
      <span className="opacity-0 transition-opacity group-hover/dot:opacity-100 group-focus-visible/dot:opacity-100">{glyph}</span>
    </button>
  )
}

/** Box-drawing / block glyphs aren't in the web font's latin subset, so mixing them with it misaligns
 *  ASCII art. Lines that contain them render wholly in the system monospace: one font, one width. */
const ART = /[─-▟]/

function OutLine({ line }: { line: Line }) {
  const art = line.art || ART.test(line.text) ? '[font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace] leading-[1.25]' : ''
  const cls = `${TONE[line.tone ?? 'default']} ${art} ${line.big ? 'my-1 text-2xl font-extrabold tracking-tight sm:text-3xl' : ''}`
  if (!line.text) return <div className="h-[1.4em]" />
  return (
    <div className={`whitespace-pre-wrap break-words ${cls}`}>
      {line.glitch ? <GlitchText text={line.text} burst={line.big} /> : line.text}
    </div>
  )
}

/** Phone-width screens get a full-screen sheet instead of a floating window. */
function useIsPhone() {
  const [phone, setPhone] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const update = () => setPhone(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return phone
}

/** The area visible above the on-screen keyboard (iOS doesn't shrink fixed layouts for it). */
function useVisualViewport(active: boolean) {
  const [vv, setVv] = useState<{ height: number; top: number } | null>(null)
  useEffect(() => {
    const v = typeof window !== 'undefined' ? window.visualViewport : null
    if (!active || !v) {
      setVv(null)
      return
    }
    const update = () => setVv({ height: Math.round(v.height), top: Math.round(v.offsetTop) })
    update()
    v.addEventListener('resize', update)
    v.addEventListener('scroll', update)
    return () => {
      v.removeEventListener('resize', update)
      v.removeEventListener('scroll', update)
    }
  }, [active])
  return vv
}

function pickWords(n: number) {
  const out: string[] = []
  for (let i = 0; i < n; i++) out.push(TYPE_WORDS[Math.floor(Math.random() * TYPE_WORDS.length)])
  return out.join(' ')
}

// ── Terminal ─────────────────────────────────────────────────────────────────

export default function ChatBot({
  isOpen,
  onClose,
  queued = null,
  onQueuedRun,
}: {
  isOpen: boolean
  onClose: () => void
  /** A command another part of the site asked us to run on open (e.g. "eggs"). */
  queued?: string | null
  onQueuedRun?: () => void
}) {
  const reduceMotion = useReducedMotion()
  const theme = useTheme()
  const eggs = useEggs()
  const quests = useQuests()
  const themes = useAvailableThemes()
  const username = useUsername()
  const isPhone = useIsPhone()
  const vv = useVisualViewport(isOpen && isPhone)

  const [isFullScreen, setIsFullScreen] = useState(false)
  const [entries, setEntries] = useState<Entry[]>([])
  const [showWelcome, setShowWelcome] = useState(true)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [cwd, setCwd] = useState('~')
  const [root, setRoot] = useState(false)
  const [crt, setCrt] = useState(false)
  const [vim, setVim] = useState(false)
  const [vimTries, setVimTries] = useState(0)
  const [typing, setTyping] = useState<Typing | null>(null)
  const [typingAiId, setTypingAiId] = useState<number | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [historyPos, setHistoryPos] = useState<number | null>(null)

  const idRef = useRef(1)
  const timers = useRef<number[]>([])
  const bootedAt = useRef(0)
  const chatLog = useRef<{ role: 'user' | 'assistant'; content: string }[]>([])
  /** Epoch ms until which the AI is rate-limited (free tier); 0 when available. */
  const aiCooldownUntil = useRef(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const nextId = () => idRef.current++
  const prompt = `${root ? 'root' : username ?? 'visitor'}@azab:${cwd}${root ? '#' : '$'}`

  useEffect(() => {
    bootedAt.current = performance.now()
    setRoot(hasRoot())
    setCrt(document.documentElement.dataset.crt === '1')
    const t = timers.current
    return () => t.forEach(window.clearTimeout)
  }, [])

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [entries, busy, typing, vv?.height, scrollToBottom])

  useEffect(() => {
    if (!isOpen) setIsFullScreen(false)
  }, [isOpen])

  // Phones: lock the page behind the sheet so swipes scroll the terminal, not the site.
  useEffect(() => {
    if (!isOpen || !isPhone) return
    const html = document.documentElement
    const body = document.body
    const prev = [html.style.overflow, body.style.overflow]
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prev[0]
      body.style.overflow = prev[1]
    }
  }, [isOpen, isPhone])

  // Only auto-focus with a real keyboard; on touch it would throw the keyboard over everything.
  useEffect(() => {
    if (!isOpen) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    window.setTimeout(() => inputRef.current?.focus(), 50)
  }, [isOpen])

  /** Adds output; lines with `delay` appear one after another. */
  const pushLines = useCallback(
    (lines: Line[]) => {
      if (!lines.length) return
      const id = idRef.current++
      const instant = !!reduceMotion
      const firstHidden = instant ? lines.length : lines.findIndex((l, i) => i > 0 && (l.delay ?? 0) > 0)
      const shown = firstHidden === -1 ? lines.length : Math.max(1, firstHidden)
      setEntries((e) => [...e, { id, kind: 'out', lines, shown }])
      let t = 0
      for (let i = shown; i < lines.length; i++) {
        t += lines[i].delay ?? 60
        const n = i + 1
        timers.current.push(
          window.setTimeout(() => setEntries((e) => e.map((x) => (x.id === id && x.kind === 'out' ? { ...x, shown: n } : x))), t)
        )
      }
    },
    [reduceMotion]
  )

  const applyEffects = useCallback(
    (fx: Effects | undefined) => {
      if (!fx) return
      if (fx.egg) findEgg(fx.egg)
      if (fx.glitch && !reduceMotion) window.dispatchEvent(new Event(SCREEN_GLITCH_EVENT))
      if (fx.cwd) setCwd(fx.cwd)
      if (fx.theme) setTheme(fx.theme)
      if (fx.mode === 'vim') setVim(true)
      if (fx.username !== undefined) writeUsername(fx.username)
      if (fx.crt !== undefined) {
        setCrt(fx.crt)
        if (fx.crt) document.documentElement.dataset.crt = '1'
        else delete document.documentElement.dataset.crt
        try {
          localStorage.setItem('azab-crt', fx.crt ? '1' : '0')
        } catch {
          /* ignore */
        }
      }
      if (fx.clear) {
        setEntries([])
        setShowWelcome(false)
      }
      if (fx.open) {
        const url = fx.open
        timers.current.push(
          window.setTimeout(() => {
            if (url.startsWith('/')) window.location.assign(url)
            else window.open(url, '_blank', 'noopener,noreferrer')
          }, 350)
        )
      }
      if (fx.play === 'typing') setTyping({ target: pickWords(14), typed: '', start: null })
      if (fx.play === 'oncall') {
        timers.current.push(window.setTimeout(() => window.dispatchEvent(new Event(START_ONCALL_EVENT)), 450))
      }
      if (fx.incident) {
        const c = fx.incident
        timers.current.push(window.setTimeout(() => triggerIncident(c), 1300))
        timers.current.push(window.setTimeout(onClose, 1100))
      } else if (fx.close) timers.current.push(window.setTimeout(onClose, 420))
    },
    [onClose, reduceMotion]
  )

  const finishTyping = useCallback(
    (t: Typing) => {
      const ms = t.start ? performance.now() - t.start : 0
      let correct = 0
      for (let i = 0; i < t.typed.length; i++) if (t.typed[i] === t.target[i]) correct++
      const wpm = ms > 0 ? Math.round(correct / 5 / (ms / 60000)) : 0
      const acc = t.typed.length ? Math.round((correct / t.typed.length) * 100) : 0
      let best = 0
      try {
        best = parseInt(localStorage.getItem(TYPE_BEST_KEY) ?? '0', 10) || 0
        if (acc >= 85 && wpm > best) localStorage.setItem(TYPE_BEST_KEY, String(wpm))
      } catch {
        /* ignore */
      }
      const isBest = acc >= 85 && wpm > best
      if (wpm >= 80 && acc >= 95) findEgg('typist')
      setTyping(null)
      pushLines([
        { text: `${wpm} wpm`, tone: 'accent', big: true },
        {
          text: `accuracy ${acc}% · ${(ms / 1000).toFixed(1)}s${isBest ? ' · new personal best' : best ? ` · best ${best} wpm` : ''}`,
          tone: isBest ? 'ok' : 'dim',
        },
        {
          text:
            wpm >= 90 ? 'are you a compiler?' : wpm >= 65 ? 'senior engineer fingers.' : wpm >= 40 ? 'solid. ship it.' : 'warming up. play typing to retry.',
          tone: 'dim',
        },
      ])
    },
    [pushLines]
  )

  /** Shown when the free AI quota is used up. Calm, specific, and points at what still works. */
  const atCapacity = (toolId: number, seconds: number) => {
    const wait = seconds >= 90 ? `${Math.ceil(seconds / 60)} min` : `${seconds}s`
    setEntries((e) => [
      ...e.map((x) => (x.id === toolId && x.kind === 'tool' ? { ...x, result: 'at capacity' } : x)),
      {
        id: nextId(),
        kind: 'ai',
        text: `the ai side of snaggy is at capacity right now (it runs on a free tier shared by everyone on the site). try again in about ${wait}.\n\neverything else still works: help · ls projects · cat about.md · play oncall`,
      },
    ])
  }

  const askAi = async (q: string) => {
    const toolId = nextId()
    setEntries((e) => [...e, { id: toolId, kind: 'tool', label: `search portfolio "${keywords(q)}"` }])

    // Still cooling down from a rate limit: answer instantly instead of spending another request.
    const waitMs = aiCooldownUntil.current - Date.now()
    if (waitMs > 0) {
      atCapacity(toolId, Math.ceil(waitMs / 1000))
      return
    }

    chatLog.current.push({ role: 'user', content: q })
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatLog.current.slice(-12) }),
      })
      if (res.status === 429) {
        chatLog.current.pop()
        const body = await res.json().catch(() => ({}))
        const seconds = Math.max(5, Math.min(3600, Number(body.retryAfter) || 30))
        aiCooldownUntil.current = Date.now() + seconds * 1000
        atCapacity(toolId, seconds)
        return
      }
      if (!res.ok) throw new Error('bad status')
      const data = await res.json()
      chatLog.current.push({ role: 'assistant', content: data.message })
      const aiId = nextId()
      setEntries((e) => [
        ...e.map((x) => (x.id === toolId && x.kind === 'tool' ? { ...x, result: 'context loaded' } : x)),
        { id: aiId, kind: 'ai', text: data.message },
      ])
      setTypingAiId(aiId)
    } catch {
      chatLog.current.pop()
      setEntries((e) => [
        ...e.map((x) => (x.id === toolId && x.kind === 'tool' ? { ...x, result: 'connection dropped', failed: true } : x)),
        { id: nextId(), kind: 'ai', text: 'error: connection dropped. try again in a moment.', error: true },
      ])
    }
  }

  const revealRoot = (payload: { sealedAt: string; lines: string[] }) => {
    setRoot(true)
    pushLines([
      { text: 'verifying passphrase…', tone: 'dim' },
      { text: '[!] privilege escalation detected', tone: 'err', glitch: true, delay: 700 },
      { text: 'ACCESS GRANTED', tone: 'err', glitch: true, big: true, delay: 900 },
      { text: 'uid=0(root) gid=0(root) groups=0(root)', tone: 'dim', delay: 500 },
      { text: '', delay: 200 },
      ...payload.lines.map((l) => ({ text: l, tone: 'default' as Tone, delay: 650 })),
      { text: '', delay: 200 },
      { text: `sealed ${payload.sealedAt} · opened ${new Date().toISOString().slice(0, 10)}`, tone: 'dim', delay: 400 },
      { text: '' },
      { text: 'a new directory has appeared: /vault', tone: 'err', glitch: true, delay: 900 },
      { text: '→ cd /vault', tone: 'dim', delay: 300 },
    ])
    applyEffects({ theme: 'root', glitch: true })
  }

  const submit = async (raw: string) => {
    const text = raw.trim()
    setInput('')
    setHistoryPos(null)

    // Typing test: enter ends it early
    if (typing) {
      finishTyping(typing)
      return
    }
    if (!text || busy) return

    setEntries((e) => [...e, { id: nextId(), kind: 'cmd', prompt, text }])
    setHistory((h) => [...h, text])

    if (vim) {
      if (/^:(q|q!|wq|x|wq!)$/.test(text)) {
        setVim(false)
        setVimTries(0)
        pushLines([{ text: 'you escaped vim. that already puts you ahead of most developers.', tone: 'ok' }])
      } else {
        const tries = vimTries + 1
        setVimTries(tries)
        pushLines([
          { text: `E492: Not an editor command: ${text}`, tone: 'err' },
          ...(tries >= 2 ? [{ text: 'psst: type :q and press enter', tone: 'dim' as Tone }] : []),
        ])
      }
      return
    }

    const u = unlocked(eggs)
    const result = runCommand(text, {
      cwd,
      history: [...history, text],
      theme,
      themes,
      eggs,
      root,
      bootedAt: bootedAt.current,
      commands: u.commands,
      files: u.files,
      quests,
      crt,
      username,
    })
    if (result) {
      pushLines(result.lines)
      applyEffects(result.effects)
      return
    }

    // Not a command. First, silently see if it's the sealed phrase — before anything leaves the browser.
    setBusy(true)
    try {
      const payload = await tryOpenRoot(text)
      if (payload) {
        revealRoot(payload)
        return
      }
      await askAi(text)
    } finally {
      setBusy(false)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && !typing) {
      e.preventDefault()
      setInput((v) => complete(v, { cwd, files: unlocked(eggs).files }))
      return
    }
    if (typing || !history.length) return
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const pos = historyPos === null ? history.length - 1 : Math.max(0, historyPos - 1)
      setHistoryPos(pos)
      setInput(history[pos])
    } else if (e.key === 'ArrowDown' && historyPos !== null) {
      e.preventDefault()
      const pos = historyPos + 1
      if (pos >= history.length) {
        setHistoryPos(null)
        setInput('')
      } else {
        setHistoryPos(pos)
        setInput(history[pos])
      }
    }
  }

  const onChange = (v: string) => {
    if (typing) {
      const next = { ...typing, typed: v, start: typing.start ?? performance.now() }
      if (v.length >= typing.target.length) {
        setInput('')
        finishTyping(next)
      } else {
        setTyping(next)
        setInput(v)
      }
      return
    }
    setInput(v)
    setHistoryPos(null)
  }

  // Commands queued from elsewhere on the site (hint buttons, game cards, locked swatches)
  const submitRef = useRef<(raw: string) => void>(() => {})
  submitRef.current = submit
  useEffect(() => {
    if (!isOpen || !queued) return
    const id = window.setTimeout(() => {
      submitRef.current(queued)
      onQueuedRun?.()
    }, 250)
    return () => window.clearTimeout(id)
  }, [isOpen, queued, onQueuedRun])

  // Esc: leave a mode first, then full screen, then close.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (typing) {
        setTyping(null)
        setInput('')
        pushLines([{ text: 'typing test cancelled.', tone: 'dim' }])
      } else if (vim) {
        pushLines([{ text: 'esc does nothing in vim either. try :q', tone: 'dim' }])
      } else if (isFullScreen) setIsFullScreen(false)
      else onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, isFullScreen, onClose, typing, vim, pushLines])

  const width = isFullScreen ? 'max-w-3xl' : ''
  const placeholder = typing ? 'type the words above…' : vim ? ':q to quit' : busy ? 'thinking…' : 'ask me anything, or type help'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            className={`fixed inset-0 z-[48] cursor-default ${isFullScreen ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/30'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            aria-label="Close terminal"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="snaggy-dialog-title"
            className={`fixed z-[50] flex flex-col bg-[#0B0D09] font-mono ${
              isPhone
                ? 'inset-x-0 border-0'
                : `ops-panel ops-ticks shadow-[0_32px_80px_-12px_rgba(0,0,0,0.85),0_0_0_1px_rgba(0,0,0,0.6),0_0_60px_-20px_rgb(var(--accent)/0.3)] ${
                    isFullScreen ? 'inset-3 sm:inset-6 lg:inset-10' : 'h-[min(680px,calc(100dvh-2rem))] w-[min(calc(100vw-1.5rem),620px)]'
                  }`
            }`}
            style={
              isPhone
                ? { top: vv?.top ?? 0, height: vv ? vv.height : '100dvh' }
                : isFullScreen
                  ? undefined
                  : { bottom: 'max(1rem, env(safe-area-inset-bottom))', right: 'max(0.75rem, env(safe-area-inset-right))' }
            }
            initial={reduceMotion ? { opacity: 1 } : isPhone ? { opacity: 0, y: 28 } : { opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : isPhone ? { opacity: 0, y: 28 } : { opacity: 0, y: 14, scale: 0.97 }}
            transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title bar */}
            <header className="ops-head shrink-0 py-3" style={isPhone ? { paddingTop: 'max(0.75rem, env(safe-area-inset-top))' } : undefined}>
              <span className="hidden items-center gap-2 sm:flex">
                <TrafficDot color="bg-ops-err" label="Close" glyph="×" onClick={onClose} />
                <TrafficDot color="bg-dark-accent" label="Minimise" glyph="−" onClick={onClose} />
                <TrafficDot
                  color="bg-ops-ok"
                  label={isFullScreen ? 'Exit full screen' : 'Full screen'}
                  glyph={isFullScreen ? '↙' : '↗'}
                  onClick={() => setIsFullScreen((v) => !v)}
                />
              </span>
              <h2 id="snaggy-dialog-title" className="truncate text-dark-text/80 sm:ml-2">
                snaggy <span className="text-ops-dim">— {cwd}</span>
              </h2>
              <span className="ml-auto flex items-center gap-1.5" aria-live="polite">
                {busy ? (
                  <span className="flex items-center gap-1.5 text-dark-accent">
                    <Spinner /> working
                  </span>
                ) : root ? (
                  <span className="flex items-center gap-1.5 text-ops-err">
                    <span className="status-dot animate-status-pulse bg-ops-err" /> root
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-ops-ok">
                    <span className="status-dot animate-status-pulse bg-ops-ok shadow-[0_0_8px_rgba(124,228,149,0.8)]" />
                    online
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="-my-2 -mr-2 flex min-h-[44px] items-center px-2.5 text-dark-text/80 active:text-dark-accent sm:hidden"
                aria-label="Close Snaggy"
              >
                [ close ]
              </button>
            </header>

            {/* Scrollback — clicking it focuses the prompt, like a real terminal */}
            <div
              ref={scrollRef}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 text-[13px] leading-relaxed sm:px-5"
              onClick={() => {
                if (window.getSelection()?.toString()) return
                if (window.matchMedia('(hover: hover)').matches) inputRef.current?.focus()
              }}
            >
              <div className={`mx-auto ${width}`}>
                {showWelcome && (
                  <div className="mb-4 rounded-md border border-dark-accent/40 px-4 py-3">
                    <p>
                      <span className="text-dark-accent">◆</span> <span className="font-bold text-dark-text">snaggy v3{eggs.includes('packapunch') ? ' · pack-a-punched' : ''}</span>
                      <span className="text-ops-dim"> · ai assistant + shell</span>
                    </p>
                    <p className="mt-1 text-dark-text/70">
                      i&apos;m an <span className="text-dark-accent">ai</span> that knows mohamed&apos;s work. ask me anything in plain english, or
                      type <span className="text-dark-accent">help</span> for commands and games.
                    </p>
                    <p className="mt-2 text-[11.5px] text-ops-dim">
                      {username ? `${username} · ` : 'login <name> to pick a username · '}eggs {eggs.length}/{EGGS.length} · {clearance(eggs).title} ({clearance(eggs).xp} xp)
                    </p>
                  </div>
                )}

                {showWelcome && entries.length === 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => submit(s)}
                        className="min-h-[36px] border border-ops-line-strong px-2.5 py-1.5 text-left text-xs text-dark-text/75 transition-colors hover:border-dark-accent/60 hover:text-dark-accent active:border-dark-accent/60"
                      >
                        <span className="text-ops-dim">› </span>
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  {entries.map((en) => (
                    <Fragment key={en.id}>
                      {en.kind === 'cmd' && (
                        <div className="break-words">
                          <span className={en.prompt.startsWith('root') ? 'text-ops-err' : 'text-ops-ok'}>{en.prompt}</span>{' '}
                          <span className="text-dark-text">{en.text}</span>
                        </div>
                      )}
                      {en.kind === 'out' && (
                        <div>
                          {en.lines.slice(0, en.shown).map((l, i) => (
                            <OutLine key={i} line={l} />
                          ))}
                        </div>
                      )}
                      {en.kind === 'tool' && (
                        <div className="text-ops-dim">
                          <div>
                            <span className="text-dark-accent">●</span> {en.label}
                          </div>
                          <div className="pl-3">
                            ⎿{' '}
                            {en.result ? (
                              <span className={en.failed ? 'text-ops-err' : ''}>{en.result}</span>
                            ) : (
                              <>
                                <Spinner /> reading…
                              </>
                            )}
                          </div>
                        </div>
                      )}
                      {en.kind === 'ai' && (
                        <div className="flex gap-2">
                          <span className={en.error ? 'text-ops-err' : 'text-dark-accent'}>{eggs.includes('packapunch') ? '◈' : '◆'}</span>
                          <p
                            className={`min-w-0 whitespace-pre-wrap font-sans text-[14px] leading-relaxed ${en.error ? 'text-ops-err' : 'text-dark-text/90'}`}
                          >
                            <TypeOut
                              text={en.text}
                              instant={!!reduceMotion || en.id !== typingAiId}
                              onTick={scrollToBottom}
                              onDone={() => setTypingAiId(null)}
                            />
                          </p>
                        </div>
                      )}
                    </Fragment>
                  ))}

                  {/* Live typing test */}
                  {typing && (
                    <div className="rounded-md border border-ops-line-strong p-3 text-[15px] leading-loose">
                      {typing.target.split('').map((ch, i) => {
                        const t = typing.typed[i]
                        const cls =
                          t === undefined
                            ? i === typing.typed.length
                              ? 'text-dark-text underline decoration-dark-accent decoration-2 underline-offset-4'
                              : 'text-ops-dim'
                            : t === ch
                              ? 'text-dark-accent'
                              : 'bg-ops-err/25 text-ops-err'
                        return (
                          <span key={i} className={cls}>
                            {ch}
                          </span>
                        )
                      })}
                      <p className="mt-2 text-[11px] text-ops-dim">
                        {typing.typed.length}/{typing.target.length} · enter to finish early · esc to cancel
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Prompt */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                submit(input)
              }}
              className="shrink-0 border-t border-ops-line bg-[#090A07] px-3 pb-2.5 pt-3 sm:px-4"
              style={isPhone ? { paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' } : undefined}
            >
              <label
                className={`mx-auto flex items-center gap-2 rounded-md border border-ops-line-strong px-3 py-1 transition-colors focus-within:border-dark-accent/60 ${width}`}
              >
                <span className={`shrink-0 ${root ? 'text-ops-err' : 'text-dark-accent'}`}>{vim ? ':' : typing ? '⌨' : '›'}</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => onChange(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={placeholder}
                  className="min-h-[40px] min-w-0 flex-1 bg-transparent text-[16px] text-dark-text caret-dark-accent outline-none placeholder:text-ops-dim focus-visible:outline-none sm:text-[13.5px]"
                  disabled={busy}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  enterKeyHint="send"
                  aria-label="Terminal input"
                />
                <button
                  type="submit"
                  disabled={busy || (!input.trim() && !typing)}
                  className="flex min-h-[40px] min-w-[40px] shrink-0 items-center justify-center text-sm text-dark-muted transition-colors hover:text-dark-accent disabled:opacity-30"
                  aria-label="Run"
                >
                  ↵
                </button>
              </label>
              <p className={`mx-auto mt-2 flex flex-wrap gap-x-3 text-[10.5px] text-ops-dim ${width}`}>
                <span className="[@media(hover:none)]:hidden">tab complete</span>
                <span className="[@media(hover:none)]:hidden">↑ history</span>
                <span>help</span>
                <span className="[@media(hover:none)]:hidden">esc close</span>
                <span className="ml-auto">
                  eggs {eggs.length}/{EGGS.length}
                </span>
              </p>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

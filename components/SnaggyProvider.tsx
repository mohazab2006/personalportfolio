'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import ChatBot from './ChatBot'
import GlobalFx from './fx/GlobalFx'
import Incident from './fx/Incident'
import EggUnlock from './fx/EggUnlock'
import dynamic from 'next/dynamic'

// Site-wide custom cursor (client-only: it reads pointer media queries on mount)
const Cursor = dynamic(() => import('./Cursor'), { ssr: false })
// Background network (canvas, client-only)
const PacketNet = dynamic(() => import('./fx/PacketNet'), { ssr: false })

type SnaggyContextValue = {
  open: () => void
  close: () => void
  isOpen: boolean
  /** Open Snaggy and run a command in it (e.g. 'eggs', 'play typing'). */
  run: (command: string) => void
}

const SnaggyContext = createContext<SnaggyContextValue | null>(null)

export function useSnaggy(): SnaggyContextValue {
  const ctx = useContext(SnaggyContext)
  if (!ctx) {
    throw new Error('useSnaggy must be used within SnaggyProvider')
  }
  return ctx
}

function SnaggyLauncher() {
  const reduceMotion = useReducedMotion()
  const ctx = useContext(SnaggyContext)!
  const { open, isOpen } = ctx

  if (isOpen) return null

  return (
    <motion.button
      type="button"
      onClick={open}
      className="group fixed z-[44] flex items-center gap-3 border border-ops-line-strong min-h-[44px] bg-[#0D0F0B] py-2.5 pl-3 pr-2.5 font-mono text-[13px] shadow-[0_12px_36px_-8px_rgba(0,0,0,0.7)] transition-[border-color,box-shadow] duration-200 hover:border-dark-accent/60 hover:shadow-[0_12px_36px_-8px_rgba(0,0,0,0.7),0_0_28px_-6px_rgb(var(--accent)/0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg"
      style={{
        bottom: 'max(1.1rem, env(safe-area-inset-bottom))',
        right: 'max(0.85rem, env(safe-area-inset-right))',
      }}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: reduceMotion ? 0 : 0.75, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Open Snaggy, the AI assistant about Mohamed's work (shortcut: /)"
      title="Ask Snaggy  ( / or Ctrl+K )"
    >
      <span className="status-dot animate-status-pulse bg-ops-ok shadow-[0_0_8px_rgba(124,228,149,0.8)]" aria-hidden />
      <span className="flex items-center text-dark-text">
        <span className="mr-1.5 text-dark-accent">›</span>
        snaggy
        <span className="ml-1.5 border border-ops-line-strong px-1 text-[9.5px] leading-[1.4] text-ops-dim">ai</span>
        <span
          className="terminal-cursor ml-1 text-dark-accent opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden
        />
      </span>
      <kbd className="hidden border border-ops-line-strong px-1.5 py-0.5 text-[11px] text-ops-dim transition-colors group-hover:border-dark-accent/50 group-hover:text-dark-accent sm:inline-block">
        /
      </kbd>
    </motion.button>
  )
}

/** "/" or Ctrl/Cmd+K opens Snaggy from anywhere, unless the visitor is typing in a field. */
function useSnaggyShortcut(open: () => void, isOpen: boolean) {
  useEffect(() => {
    if (isOpen) return
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      const typing = !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))
      const isSlash = e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'
      if ((isSlash && !typing) || isCmdK) {
        e.preventDefault()
        open()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, isOpen])
}

export function SnaggyProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [queued, setQueued] = useState<string | null>(null)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const run = useCallback((command: string) => {
    setQueued(command)
    setIsOpen(true)
  }, [])
  const consumed = useCallback(() => setQueued(null), [])
  useSnaggyShortcut(open, isOpen)

  return (
    <SnaggyContext.Provider value={{ open, close, isOpen, run }}>
      <PacketNet />
      {children}
      <SnaggyLauncher />
      <ChatBot isOpen={isOpen} onClose={close} queued={queued} onQueuedRun={consumed} />
      <Cursor />
      <GlobalFx />
      <Incident />
      <EggUnlock />
    </SnaggyContext.Provider>
  )
}

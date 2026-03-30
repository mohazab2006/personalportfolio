'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import ChatBot from './ChatBot'
import SnaggyMark from './SnaggyMark'

type SnaggyContextValue = {
  open: () => void
  close: () => void
  isOpen: boolean
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
      className="group fixed z-[44] flex items-center gap-2 rounded-xl border border-white/[0.12] bg-[#0a0b0c]/92 py-2 pl-2 pr-2.5 shadow-[0_8px_28px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-xl transition-[border-color,box-shadow,background-color] duration-200 hover:border-emerald-400/22 hover:shadow-[0_12px_36px_rgba(0,0,0,0.5),0_0_0_1px_rgba(45,212,191,0.07),inset_0_1px_0_rgba(255,255,255,0.09)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070708] sm:gap-2.5 sm:pl-2.5 sm:pr-3.5 sm:py-2.5"
      style={{
        bottom: 'max(1.1rem, env(safe-area-inset-bottom))',
        right: 'max(0.85rem, env(safe-area-inset-right))',
      }}
      initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.38, delay: reduceMotion ? 0 : 0.75, ease: [0.16, 1, 0.3, 1] }}
      whileHover={reduceMotion ? undefined : { scale: 1.015 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      aria-label="Open Snaggy — AI assistant about Mohamed’s work"
      title="Snaggy · Ask about my background"
    >
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.1] bg-gradient-to-b from-white/[0.07] to-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] sm:h-10 sm:w-10 sm:rounded-xl">
        <SnaggyMark className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" />
      </div>
      <span className="flex flex-col items-start pr-0.5">
        <span
          className="text-sm font-semibold leading-tight tracking-tight text-white sm:text-[15px]"
          style={{ fontFamily: 'var(--font-logo)' }}
        >
          Snaggy
        </span>
        <span className="hidden text-[10px] font-medium tracking-wide text-white/45 sm:block">
          AI assistant
        </span>
      </span>
    </motion.button>
  )
}

export function SnaggyProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <SnaggyContext.Provider value={{ open, close, isOpen }}>
      {children}
      <SnaggyLauncher />
      <ChatBot isOpen={isOpen} onClose={close} />
    </SnaggyContext.Provider>
  )
}

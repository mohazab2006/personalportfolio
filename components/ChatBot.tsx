'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import SnaggyMark from './SnaggyMark'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatBot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const reduceMotion = useReducedMotion()
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "I'm Snaggy — Mohamed's site assistant. Ask about projects, experience, or stack; I'll keep answers grounded in what's on this portfolio.",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!isOpen) {
      setIsFullScreen(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (isFullScreen) {
        setIsFullScreen(false)
      } else {
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, isFullScreen, onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Something went wrong. Try again in a moment.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && panelRef.current) {
      const focusable = panelRef.current.querySelector<HTMLElement>('input, button')
      focusable?.focus()
    }
  }, [isOpen])

  const bubbleMax = isFullScreen ? 'sm:max-w-[72%] max-w-[88%]' : 'max-w-[88%] sm:max-w-[85%]'
  const bodyText = isFullScreen ? 'text-sm' : 'text-[13px]'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            className={`fixed inset-0 z-[48] backdrop-blur-[2px] transition-colors ${
              isFullScreen ? 'bg-black/35' : 'bg-black/20 lg:bg-black/25'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            aria-label="Close chat overlay"
            onClick={onClose}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="snaggy-dialog-title"
            className={`fixed z-[50] flex flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0a0a0c]/95 shadow-[0_24px_64px_rgba(0,0,0,0.55)] backdrop-blur-xl ${
              isFullScreen
                ? 'inset-3 w-auto sm:inset-4 lg:inset-8'
                : 'max-h-[min(720px,90dvh)] w-[min(100vw-1rem,540px)]'
            }`}
            style={
              isFullScreen
                ? undefined
                : {
                    bottom: 'max(1rem, env(safe-area-inset-bottom))',
                    right: 'max(0.75rem, env(safe-area-inset-right))',
                  }
            }
            initial={
              reduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 16, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex shrink-0 items-center justify-between gap-2 border-b border-white/[0.06] px-4 py-3 sm:gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.1] bg-gradient-to-b from-white/[0.08] to-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                  <SnaggyMark className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <div className="min-w-0">
                  <h2
                    id="snaggy-dialog-title"
                    className="truncate text-sm font-semibold tracking-tight text-white sm:text-base"
                    style={{ fontFamily: 'var(--font-logo)' }}
                  >
                    Snaggy
                  </h2>
                  <p className="truncate text-[11px] text-white/45">AI assistant · portfolio context only</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => setIsFullScreen((v) => !v)}
                  className="rounded-lg p-2 text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-accent/40"
                  aria-label={isFullScreen ? 'Exit full screen' : 'Full screen'}
                >
                  {isFullScreen ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
                      />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                      />
                    </svg>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-2 text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-accent/40"
                  aria-label="Close"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-4">
              <ul className={`mx-auto flex max-w-3xl flex-col gap-3 ${isFullScreen ? 'lg:max-w-4xl' : ''}`}>
                {messages.map((message, index) => (
                  <li
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`${bubbleMax} rounded-2xl px-3.5 py-2.5 ${
                        message.role === 'user'
                          ? 'bg-emerald-500/[0.14] text-white ring-1 ring-emerald-400/20'
                          : 'bg-white/[0.04] text-white/88 ring-1 ring-white/[0.06]'
                      }`}
                    >
                      <p className={`${bodyText} leading-relaxed whitespace-pre-wrap`}>{message.content}</p>
                    </div>
                  </li>
                ))}
                {isLoading && (
                  <li className="flex justify-start">
                    <div
                      className="rounded-2xl bg-white/[0.04] px-3.5 py-3 ring-1 ring-white/[0.06]"
                      aria-live="polite"
                      aria-busy
                    >
                      {reduceMotion ? (
                        <span className="text-xs text-white/45">Thinking…</span>
                      ) : (
                        <span className="flex gap-1.5">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/50 [animation-duration:1s]" />
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/50 [animation-delay:0.2s] [animation-duration:1s]" />
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/50 [animation-delay:0.4s] [animation-duration:1s]" />
                        </span>
                      )}
                    </div>
                  </li>
                )}
              </ul>
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className={`shrink-0 border-t border-white/[0.06] p-3 sm:p-4 ${isFullScreen ? 'sm:px-6' : ''}`}
            >
              <div className={`mx-auto flex gap-2 ${isFullScreen ? 'max-w-3xl lg:max-w-4xl' : ''}`}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about projects, experience…"
                  className="min-w-0 flex-1 rounded-xl border border-white/[0.1] bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-emerald-400/30 focus:ring-1 focus:ring-emerald-400/25 sm:py-3"
                  disabled={isLoading}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center self-end rounded-xl border border-white/[0.1] bg-white/[0.06] text-white transition-colors hover:border-emerald-400/25 hover:bg-emerald-500/10 disabled:pointer-events-none disabled:opacity-40 sm:h-12 sm:w-12"
                  aria-label="Send"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-white/30">
                {isFullScreen ? 'Esc exits full screen · then Esc closes · AI can misstate details' : 'Esc to close · AI can misstate details'}
              </p>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

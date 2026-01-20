'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatBot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hey there! I'm Snaggy, Mohamed's AI assistant. I can tell you all about Mohamed's experience, projects, and skills. What would you like to know?"
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: userMessage }] }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
    } catch {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again!' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed ${isFullScreen ? 'inset-4 sm:inset-8' : 'bottom-4 right-4 sm:bottom-24 sm:right-4'} z-50 flex flex-col overflow-hidden rounded-2xl bg-dark-bg/95 shadow-2xl backdrop-blur-lg border border-white/10 ${isFullScreen ? 'h-auto' : 'h-[500px] w-[350px] sm:w-[400px]'}`}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-white/10">
                  S
                </div>
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-dark-bg animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-bold text-white">Snaggy</h3>
                <p className="text-xs text-white/60">Mohamed's AI Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="rounded-lg p-2 transition-colors hover:bg-dark-accent/10 active:bg-white/10"
                aria-label={isFullScreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {isFullScreen ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                )}
              </button>
              <button
                onClick={onClose}
                className="rounded-lg p-2 transition-colors hover:bg-dark-accent/10 active:bg-white/10"
                aria-label="Close chat"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                      : 'bg-white/5 text-white border border-white/10'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl bg-white/5 border border-white/10 px-4 py-2">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-white" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-white" style={{ animationDelay: '150ms' }}></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-white" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-white/10 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about Mohamed..."
                className="flex-1 rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:ring-2 focus:ring-white/60 focus:border-white/25"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-lg bg-white/10 border border-white/15 px-4 py-2 text-white transition-all hover:bg-dark-accent hover:text-black hover:border-dark-accent/40 active:bg-white active:text-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


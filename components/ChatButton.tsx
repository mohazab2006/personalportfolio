'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ChatBot from './ChatBot'

export default function ChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <>
      <motion.button
        onClick={() => setIsChatOpen(true)}
        className="liquid-glass magnetic-button fixed bottom-[68px] right-4 sm:bottom-[84px] sm:right-8 z-40 group rounded-full border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.4)]"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          opacity: { duration: 0.5, delay: 1.2 },
          scale: { duration: 0.5, delay: 1.2, ease: "easeOut" },
          y: { duration: 0.5, delay: 1.2 }
        }}
        whileHover={{ 
          scale: 1.1, 
          y: -4,
          boxShadow: "0 0 40px rgba(45, 212, 191, 0.45)"
        }}
        whileTap={{ scale: 0.95 }}
        aria-label="Chat with Snaggy"
      >
        {/* Main button container */}
        <div className="relative flex items-center gap-2 rounded-full px-3 py-2.5 sm:px-5">
          {/* Snaggy Logo - Animated S */}
          <motion.div
            className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="text-xl font-black text-white drop-shadow-lg">S</span>
            
            {/* Sparkle effect */}
            <motion.div
              className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5"
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg viewBox="0 0 24 24" fill="white" className="drop-shadow-lg">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Text */}
          <div className="flex flex-col items-start">
            <span className="text-xs font-bold text-white drop-shadow-md">Chat with</span>
            <span className="text-base font-black text-white drop-shadow-md leading-none">Snaggy</span>
          </div>

          {/* Status indicator */}
          <div className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-dark-accent border-2 border-white shadow-lg z-10" />
        </div>
      </motion.button>

      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  )
}


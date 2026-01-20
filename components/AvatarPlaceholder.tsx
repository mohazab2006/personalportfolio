'use client'

import { motion } from 'framer-motion'

export default function AvatarPlaceholder() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-dark-accent/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Avatar SVG */}
      <motion.svg
        width="400"
        height="400"
        viewBox="0 0 200 200"
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Head */}
        <ellipse cx="100" cy="90" rx="45" ry="50" fill="#D4A574" />

        {/* Curly Hair */}
        <g>
          {/* Main hair shape */}
          <path
            d="M 55 70 Q 50 50, 60 40 Q 70 30, 85 35 Q 95 25, 105 25 Q 115 25, 125 35 Q 140 30, 150 40 Q 160 50, 145 70 Z"
            fill="#2D1B1B"
          />
          {/* Curls */}
          {[...Array(12)].map((_, i) => (
            <motion.circle
              key={i}
              cx={60 + i * 7}
              cy={40 + Math.sin(i) * 10}
              r="4"
              fill="#2D1B1B"
              animate={{
                y: [0, -2, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: 'easeInOut',
              }}
            />
          ))}
          {/* Hair split */}
          <path
            d="M 100 35 Q 102 60, 104 70"
            stroke="#1A0F0F"
            strokeWidth="2"
            fill="none"
          />
        </g>

        {/* Glasses */}
        <g stroke="#333" strokeWidth="3" fill="none">
          {/* Left lens */}
          <rect x="70" y="85" width="20" height="15" rx="3" />
          {/* Right lens */}
          <rect x="110" y="85" width="20" height="15" rx="3" />
          {/* Bridge */}
          <line x1="90" y1="92" x2="110" y2="92" />
          {/* Left temple */}
          <line x1="70" y1="92" x2="60" y2="92" />
          {/* Right temple */}
          <line x1="130" y1="92" x2="140" y2="92" />
          {/* Lens glare */}
          <circle cx="78" cy="89" r="2" fill="white" opacity="0.6" />
          <circle cx="118" cy="89" r="2" fill="white" opacity="0.6" />
        </g>

        {/* Eyes behind glasses */}
        <g>
          <circle cx="80" cy="92" r="3" fill="#2D1B1B" />
          <circle cx="120" cy="92" r="3" fill="#2D1B1B" />
        </g>

        {/* Nose */}
        <path
          d="M 100 100 Q 102 105, 100 108"
          stroke="#B8946E"
          strokeWidth="2"
          fill="none"
        />

        {/* Smile */}
        <motion.path
          d="M 85 115 Q 100 122, 115 115"
          stroke="#8B6F4E"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          animate={{
            d: [
              'M 85 115 Q 100 122, 115 115',
              'M 85 115 Q 100 125, 115 115',
              'M 85 115 Q 100 122, 115 115',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Neck */}
        <rect x="88" y="130" width="24" height="20" fill="#D4A574" />

        {/* Shoulders/Shirt */}
        <path
          d="M 70 145 Q 100 155, 130 145 L 130 200 L 70 200 Z"
          fill="#2DD4BF"
        />
      </motion.svg>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-dark-accent/20"
          style={{
            left: `${20 + i * 10}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}


'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'

export default function HolographicCard() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), {
    stiffness: 300,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), {
    stiffness: 300,
    damping: 30,
  })

  const glowX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%'])
  const glowY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseXPos = e.clientX - rect.left
    const mouseYPos = e.clientY - rect.top

    const xPct = mouseXPos / width - 0.5
    const yPct = mouseYPos / height - 0.5

    mouseX.set(xPct)
    mouseY.set(yPct)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  return (
    <div className="relative flex items-center justify-center p-8">
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-blue-500/30 blur-3xl"
        animate={{
          scale: isHovered ? [1, 1.2, 1] : 1,
          opacity: isHovered ? [0.3, 0.6, 0.3] : 0.3,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        ref={cardRef}
        className="relative h-[400px] w-[320px] cursor-pointer lg:h-[500px] lg:w-[400px]"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        {/* Card Container */}
        <motion.div
          className="relative h-full w-full overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-dark-bg via-purple-950/50 to-dark-bg shadow-2xl"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Holographic shimmer overlay */}
          <motion.div
            className="absolute inset-0 opacity-40"
            style={{
              background: `
                radial-gradient(
                  circle at ${glowX.get()} ${glowY.get()},
                  rgba(139, 92, 246, 0.4) 0%,
                  rgba(236, 72, 153, 0.3) 25%,
                  rgba(59, 130, 246, 0.3) 50%,
                  rgba(16, 185, 129, 0.2) 75%,
                  transparent 100%
                )
              `,
            }}
            animate={{
              opacity: isHovered ? [0.4, 0.7, 0.4] : 0.4,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />

          {/* Rainbow gradient overlay */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: `
                linear-gradient(
                  135deg,
                  rgba(139, 92, 246, 0.3),
                  rgba(236, 72, 153, 0.3),
                  rgba(59, 130, 246, 0.3),
                  rgba(16, 185, 129, 0.3)
                )
              `,
            }}
            animate={{
              rotate: isHovered ? 360 : 0,
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Scan line effect */}
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              background: `
                repeating-linear-gradient(
                  0deg,
                  rgba(139, 92, 246, 0.1) 0px,
                  transparent 2px,
                  transparent 4px
                )
              `,
            }}
            animate={{
              y: [0, 20, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Profile silhouette/image */}
          <motion.div
            className="relative z-10 flex h-full w-full flex-col items-center justify-center p-8"
            style={{
              transform: 'translateZ(50px)',
            }}
          >
            {/* Your Photo */}
            <div className="relative mb-8 h-48 w-48 lg:h-64 lg:w-64">
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600"
                animate={{
                  boxShadow: isHovered
                    ? [
                        '0 0 20px rgba(139, 92, 246, 0.5)',
                        '0 0 40px rgba(139, 92, 246, 0.8)',
                        '0 0 20px rgba(139, 92, 246, 0.5)',
                      ]
                    : '0 0 20px rgba(139, 92, 246, 0.3)',
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              
              {/* Inner circle with your photo */}
              <div className="absolute inset-2 overflow-hidden rounded-full bg-dark-bg/80 backdrop-blur-sm">
                <motion.div
                  className="relative h-full w-full"
                  animate={{
                    scale: isHovered ? [1, 1.05, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <Image
                    src="/profile.jpg"
                    alt="Mohamed Azab"
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Holographic overlay on photo */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20"
                    animate={{
                      opacity: isHovered ? [0.2, 0.4, 0.2] : 0.2,
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                </motion.div>
              </div>

              {/* Rotating ring */}
              <motion.div
                className="absolute -inset-4 rounded-full border-2 border-purple-400/30"
                animate={{
                  rotate: 360,
                  scale: isHovered ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 2, repeat: Infinity },
                }}
              />
            </div>

            {/* Name/Title */}
            <motion.div
              className="text-center"
              style={{
                transform: 'translateZ(75px)',
              }}
            >
              <motion.h3
                className="mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl"
                animate={{
                  backgroundPosition: isHovered ? ['0%', '100%', '0%'] : '0%',
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                style={{
                  backgroundSize: '200% 200%',
                }}
              >
                Mohamed Azab
              </motion.h3>
              <motion.p
                className="text-sm text-purple-300 lg:text-base"
                animate={{
                  opacity: isHovered ? [0.7, 1, 0.7] : 0.7,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                Computer Science • AI & ML
              </motion.p>
            </motion.div>

            {/* Decorative corners */}
            <div className="absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-purple-400/50" />
            <div className="absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2 border-purple-400/50" />
            <div className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-purple-400/50" />
            <div className="absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-purple-400/50" />
          </motion.div>

          {/* Glowing edge */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            style={{
              boxShadow: isHovered
                ? '0 0 40px rgba(139, 92, 246, 0.6), inset 0 0 40px rgba(139, 92, 246, 0.2)'
                : '0 0 20px rgba(139, 92, 246, 0.3)',
            }}
            animate={{
              boxShadow: isHovered
                ? [
                    '0 0 40px rgba(139, 92, 246, 0.6), inset 0 0 40px rgba(139, 92, 246, 0.2)',
                    '0 0 60px rgba(139, 92, 246, 0.8), inset 0 0 60px rgba(139, 92, 246, 0.3)',
                    '0 0 40px rgba(139, 92, 246, 0.6), inset 0 0 40px rgba(139, 92, 246, 0.2)',
                  ]
                : '0 0 20px rgba(139, 92, 246, 0.3)',
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </motion.div>

        {/* Floating particles around card */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-purple-400/60"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>

      {/* Interaction hint */}
      <motion.p
        className="absolute -bottom-8 text-center text-xs text-purple-400/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity }}
      >
        Hover to interact ✨
      </motion.p>
    </div>
  )
}


'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'
import { getPersonalInfo } from '@/lib/projects'

export default function HolographicCard() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    async function fetchProfile() {
      const info = await getPersonalInfo()
      if (info) {
        setProfileImage(info.profileImageUrl)
      }
    }
    fetchProfile()
  }, [])

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
        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-dark-accent/20 via-cyan-500/10 to-blue-500/20 blur-3xl"
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
          className="relative h-full w-full overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-br from-dark-bg via-dark-accent/5 to-dark-bg shadow-2xl sweep-hover light-highlight"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Top highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          {/* Holographic shimmer overlay */}
          <motion.div
            className="absolute inset-0 opacity-40"
            style={{
              background: `
                radial-gradient(
                  circle at ${glowX.get()} ${glowY.get()},
                  rgba(45, 212, 191, 0.22) 0%,
                  rgba(45, 212, 191, 0.12) 35%,
                  rgba(6, 182, 212, 0.10) 55%,
                  rgba(45, 212, 191, 0.06) 75%,
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
                  rgba(45, 212, 191, 0.10),
                  rgba(45, 212, 191, 0.06),
                  rgba(6, 182, 212, 0.08),
                  rgba(45, 212, 191, 0.08)
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
                  rgba(45, 212, 191, 0.06) 0px,
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
                className="absolute inset-0 rounded-full bg-gradient-to-br from-dark-accent via-cyan-500 to-cyan-600"
                animate={{
                  boxShadow: isHovered
                    ? [
                        '0 0 18px rgba(45, 212, 191, 0.25)',
                        '0 0 36px rgba(45, 212, 191, 0.45)',
                        '0 0 18px rgba(45, 212, 191, 0.25)',
                      ]
                    : '0 0 18px rgba(45, 212, 191, 0.15)',
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
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="Mohamed Azab"
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 192px, 256px"
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iIzI5MjUzYSIvPjwvc3ZnPg=="
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-white/5">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-dark-accent/40 border-t-dark-accent"></div>
                    </div>
                  )}
                  {/* Holographic overlay on photo */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-dark-accent/10 via-transparent to-blue-500/10"
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
                className="absolute -inset-4 rounded-full border-2 border-white/15 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
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
                className="mb-2 bg-gradient-to-r from-white via-dark-accent to-white bg-clip-text text-3xl font-bold text-transparent lg:text-4xl"
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
                className="text-sm text-dark-accent/80 lg:text-base"
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
            <div className="absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-dark-accent/30" />
            <div className="absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2 border-dark-accent/30" />
            <div className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-dark-accent/30" />
            <div className="absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-dark-accent/30" />
          </motion.div>

          {/* Glowing edge */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            style={{
              boxShadow: isHovered
                ? '0 0 40px rgba(45, 212, 191, 0.22), inset 0 0 40px rgba(45, 212, 191, 0.08)'
                : '0 0 20px rgba(45, 212, 191, 0.12)',
            }}
            animate={{
              boxShadow: isHovered
                ? [
                    '0 0 40px rgba(45, 212, 191, 0.22), inset 0 0 40px rgba(45, 212, 191, 0.08)',
                    '0 0 60px rgba(45, 212, 191, 0.32), inset 0 0 60px rgba(45, 212, 191, 0.12)',
                    '0 0 40px rgba(45, 212, 191, 0.22), inset 0 0 40px rgba(45, 212, 191, 0.08)',
                  ]
                : '0 0 20px rgba(45, 212, 191, 0.12)',
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
            className="absolute h-2 w-2 rounded-full bg-dark-accent/40"
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
        className="absolute -bottom-8 text-center text-xs text-dark-accent/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity }}
      >
        Hover to interact ✨
      </motion.p>
    </div>
  )
}


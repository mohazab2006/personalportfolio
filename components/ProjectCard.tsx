'use client'

import { motion } from 'framer-motion'
import { Project } from '@/lib/data'
import { getProjectImageUrl } from '@/lib/projects'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

type ProjectCardProps = {
  project: Project
  index: number
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [imageError, setImageError] = useState(false)
  const firstScreenshot = project.screenshots[0]
  const imagePath = getProjectImageUrl(project.slug, firstScreenshot)

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl bg-[#0F0F12]/80 backdrop-blur-xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(45,212,191,0.15)] dark:bg-dark-bg-secondary/80 dark:backdrop-blur-lg border border-white/5 hover:border-dark-accent/40 sweep-hover light-highlight"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.01 }}
    >
      {/* Glossy Reflection Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.05] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-[#0F0F12]" />
        {!imageError ? (
          <Image
            src={imagePath}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iIzI5MjUzYSIvPjwvc3ZnPg=="
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/5">
            <div className="text-center">
              <div className="mb-2 text-4xl">🖼️</div>
              <p className="text-sm text-light-text/50 dark:text-dark-text/50">
                Image coming soon
              </p>
            </div>
          </div>
        )}

        {/* Top edge highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-20 p-6">
        <h3 className="mb-2 text-xl font-bold text-white group-hover:text-dark-accent transition-colors duration-300">
          {project.title}
        </h3>

        <p className="mb-4 line-clamp-2 text-sm text-white/60 leading-relaxed group-hover:text-white/80 transition-colors">
          {project.description.split('.')[0]}.
        </p>

        {/* Tech Stack */}
        <div className="mb-4 flex flex-wrap gap-2">
          {project.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-medium text-white/70 backdrop-blur-sm group-hover:border-dark-accent/20 group-hover:bg-dark-accent/5 transition-all"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="magnetic-button flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10 hover:border-white/30 active:scale-95"
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Code
            </a>
          )}

          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="magnetic-button flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-all hover:bg-dark-accent hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] active:scale-95"
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
              Live
            </a>
          )}

          <Link
            href={`/projects/${project.slug}`}
            className="magnetic-button ml-auto flex items-center gap-2 text-sm font-medium text-white/60 transition-all hover:text-dark-accent active:text-white"
          >
            Details
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Dynamic Glow background */}
      <div className="absolute inset-0 -z-10 rounded-2xl bg-dark-accent/0 opacity-0 blur-2xl transition-all duration-500 group-hover:bg-dark-accent/5 group-hover:opacity-100" />
    </motion.div>
  )
}


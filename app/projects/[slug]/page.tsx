'use client'

import { notFound } from 'next/navigation'
import { getProjectBySlug, getProjectImageUrl } from '@/lib/projects'
import { Project } from '@/lib/data'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, use } from 'react'
import { motion } from 'framer-motion'

type Props = {
  params: Promise<{ slug: string }>
}

export default function ProjectPage({ params }: Props) {
  const { slug } = use(params)
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({})
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  const handleImageError = (index: string) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }))
  }

  useEffect(() => {
    async function fetchProject() {
      try {
        const data = await getProjectBySlug(slug)
        setProject(data)
      } catch (err) {
        console.error('Error fetching project:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent text-dark-text flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-dark-accent/40 border-t-dark-accent"></div>
      </div>
    )
  }

  if (!project) {
    notFound()
  }

  return (
    <div className="relative min-h-screen text-dark-text">
      {/* Animated Background Orbs - matching main page */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -left-1/4 top-0 h-96 w-96 animate-float rounded-full bg-dark-accent/10 blur-3xl" />
        <div className="absolute -right-1/4 bottom-0 h-96 w-96 animate-float rounded-full bg-cyan-500/5 blur-3xl" style={{ animationDelay: '2s' }} />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow rounded-full bg-dark-accent/5 blur-3xl" />
      </div>

      {/* Hero Section */}
      <motion.section
        className="relative overflow-hidden bg-gradient-to-b from-dark-bg-secondary/80 to-transparent backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-7xl px-6 py-32 lg:px-8">
          {/* Back Button */}
          <Link
            href="/#portfolio"
            className="group mb-8 inline-flex items-center gap-2 text-dark-accent transition-all hover:gap-3 hover:text-dark-accent active:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Portfolio
          </Link>

          {/* Title */}
          <motion.h1
            className="mb-4 text-4xl font-bold text-dark-text md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {project.title}
          </motion.h1>

          {/* Tech Stack */}
          <div className="mb-8 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm font-medium text-white/80 hover:bg-dark-accent/10 hover:text-dark-accent"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="magnetic-button flex items-center gap-2 rounded-lg bg-white/5 border border-white/15 px-6 py-3 font-medium text-white transition-all hover:bg-dark-accent/10 hover:border-dark-accent/40 active:bg-white/10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View Code
              </a>
            )}

            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="magnetic-button flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-medium text-black transition-all hover:bg-dark-accent hover:text-black active:bg-white active:text-black"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
                Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.section>

      {/* Content Section */}
      <motion.section 
        className="relative py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="mx-auto max-w-5xl px-6 lg:px-8 relative z-10">
          {/* Overview */}
          <div className="mb-16 rounded-2xl bg-dark-bg-secondary/60 backdrop-blur-lg p-8 border border-white/5">
            <h2 className="mb-6 text-3xl font-bold text-dark-text">Overview</h2>
            <p className="text-lg leading-relaxed text-dark-text/80">{project.description}</p>
          </div>

          {/* Tech Stack Details */}
          <div className="mb-16 rounded-2xl bg-dark-bg-secondary/60 backdrop-blur-lg p-8 border border-white/5">
            <h2 className="mb-6 text-3xl font-bold text-dark-text">Tech Stack</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {project.stack.map((tech) => (
                <motion.div
                  key={tech}
                  className="rounded-xl bg-white/5 border border-white/10 p-4 text-center backdrop-blur-sm"
                  whileHover={{ scale: 1.05, y: -2, borderColor: 'rgba(45, 212, 191, 0.3)' }}
                >
                  <p className="font-medium text-dark-text">{tech}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Screenshots Gallery */}
          <div className="rounded-2xl bg-dark-bg-secondary/60 backdrop-blur-lg p-8 border border-white/5">
            <h2 className="mb-6 text-3xl font-bold text-dark-text">Screenshots</h2>
            <div className="space-y-8">
              {project.screenshots.map((screenshot, index) => {
                const imageKey = `${project.slug}-${index}`
                return (
                  <motion.div
                    key={index}
                    className="overflow-hidden rounded-2xl bg-dark-bg-secondary/80 shadow-lg border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="relative aspect-video w-full">
                      {!imageErrors[imageKey] ? (
                        <Image
                          src={getProjectImageUrl(project.slug, screenshot)}
                          alt={`${project.title} screenshot ${index + 1}`}
                          fill
                          className="object-cover"
                          onError={() => handleImageError(imageKey)}
                          loading="lazy"
                          sizes="(max-width: 1280px) 100vw, 1280px"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4MCIgaGVpZ2h0PSI3MjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyODAiIGhlaWdodD0iNzIwIiBmaWxsPSIjMjkyNTNhIi8+PC9zdmc+"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/6 to-white/2">
                          <div className="text-center">
                            <div className="mb-4 text-6xl">🖼️</div>
                            <p className="text-dark-text/50">Screenshot placeholder</p>
                            <p className="mt-2 text-sm text-dark-text/30">
                              Image not available
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}


import Link from 'next/link'
import type { Project } from '@/lib/data'

type Variant = 'hero' | 'grid'

const linkBase =
  'inline-flex items-center gap-1.5 border font-mono transition-[color,border-color,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-accent/40'

/** Project actions written as commands: open the live URL, browse source, read the case study. */
export default function ProjectLinks({
  project,
  variant = 'grid',
}: {
  project: Project
  variant?: Variant
}) {
  // 44px tall on touch screens (Apple/Google minimum), compact on desktop
  const size =
    variant === 'hero'
      ? 'min-h-[44px] px-3.5 py-2 text-[13px] sm:min-h-[40px]'
      : 'min-h-[44px] px-3 py-2 text-[13px] sm:min-h-[34px] sm:px-2.5 sm:py-1.5 sm:text-xs'
  const ghost =
    'border-ops-line-strong text-dark-text/80 hover:border-dark-accent/60 hover:bg-dark-accent/[0.06] hover:text-dark-accent'
  const primary =
    'border-dark-accent bg-dark-accent text-dark-bg hover:border-dark-accent-hover hover:bg-dark-accent-hover'

  return (
    <div className="flex flex-wrap items-center gap-2">
      {project.demo && (
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          className={`${linkBase} ${size} ${variant === 'hero' ? primary : ghost}`}
        >
          open live ↗
        </a>
      )}
      {project.github && (
        <a href={project.github} target="_blank" rel="noopener noreferrer" className={`${linkBase} ${size} ${ghost}`}>
          src ↗
        </a>
      )}
      <Link
        href={`/projects/${project.slug}`}
        className={`${linkBase} ${size} border-transparent text-dark-muted hover:text-dark-accent`}
      >
        details →
      </Link>
    </div>
  )
}

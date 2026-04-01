'use client'

import Link from 'next/link'
import { PERSONAL } from '@/lib/data'

export default function ProjectPageHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-[42] border-b border-white/[0.06] bg-[#070708]/88 py-3 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-[#070708]/76">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 rounded-md px-2 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/78 transition-colors hover:text-dark-accent sm:text-xs"
          style={{ fontFamily: 'var(--font-logo)' }}
        >
          {PERSONAL.name}
        </Link>
        <span className="shrink-0 text-white/20" aria-hidden>
          /
        </span>
        <Link
          href="/projects"
          className="shrink-0 text-sm text-dark-accent transition-colors hover:text-white"
        >
          Projects
        </Link>
        <span className="min-w-0 flex-1 truncate text-right text-sm font-medium text-white/50" title={title}>
          {title}
        </span>
      </div>
    </header>
  )
}

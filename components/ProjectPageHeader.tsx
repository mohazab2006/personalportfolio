'use client'

import Link from 'next/link'

/** Breadcrumb bar for /projects pages, written as a shell path: azab@ottawa:~/projects/<slug> */
export default function ProjectPageHeader({ title, slug }: { title?: string; slug?: string }) {
  return (
    <header className="sticky top-0 z-[42] border-b border-ops-line bg-dark-bg/95 font-mono lg:bg-dark-bg/85 lg:backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href={slug ? '/projects' : '/#projects'}
          className="flex min-h-[44px] shrink-0 items-center border border-ops-line-strong px-3 text-[12.5px] text-dark-text/80 transition-colors hover:border-dark-accent/60 hover:text-dark-accent"
          aria-label={slug ? 'Back to all projects' : 'Back to home'}
        >
          cd ..
        </Link>
        <p className="min-w-0 truncate text-[13px]" title={title}>
          <Link href="/" className="text-ops-ok hover:underline">
            azab@ottawa
          </Link>
          <span className="text-ops-dim">:</span>
          <Link href="/projects" className="text-dark-accent hover:underline">
            ~/projects
          </Link>
          {slug && <span className="text-dark-text/80">/{slug}</span>}
        </p>
      </div>
    </header>
  )
}

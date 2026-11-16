import Link from 'next/link'
import { Poneglyph } from '@/components/fx/QuestBits'

/** 404 — "where lost travellers end up". Carries the fifth key and a poneglyph. */
export default function NotFound() {
  return (
    <main className="relative z-[1] flex min-h-screen items-center px-4 font-mono sm:px-6">
      <div className="mx-auto w-full max-w-2xl">
        <p className="text-xs text-ops-dim sm:text-[13px]">
          <span className="text-ops-ok">visitor@azab</span>
          <span className="text-ops-dim">:</span>
          <span className="text-dark-accent">~</span>
          <span className="text-ops-dim">$ </span>
          <span className="text-dark-text">cd ./this-page</span>
        </p>
        <h1 className="phosphor mt-6 text-7xl font-extrabold tracking-tight text-dark-accent sm:text-8xl">404</h1>
        <p className="mt-3 text-sm text-dark-text/80 sm:text-base">cd: no such file or directory</p>
        <p className="mt-2 max-w-md font-sans text-[15px] leading-relaxed text-dark-text/60">
          Whatever was here has moved, or never existed. The rest of the site is right where you left it.
        </p>

        <div className="mt-8 flex flex-wrap gap-2.5">
          <Link href="/" className="ops-btn ops-btn-primary">
            cd ~
          </Link>
          <Link href="/projects" className="ops-btn">
            ls ./projects
          </Link>
        </div>

        {/* v — the transmission lost travellers pick up */}
        <div className="mt-14 border-t border-dashed border-ops-line pt-5 text-[11.5px] text-ops-dim">
          <p className="flex items-center gap-2">
            <span className="status-dot animate-status-pulse bg-ops-err/80" aria-hidden />
            weak signal on this frequency
          </p>
          <p className="mt-2 tracking-[0.2em] text-dark-text/50">v :: .--. .-. .. -- .. ...</p>
          <p className="mt-6 flex items-center gap-2">
            <Poneglyph index={3} />
            <span className="opacity-0">.</span>
          </p>
        </div>
      </div>
    </main>
  )
}

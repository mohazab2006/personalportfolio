'use client'

import ThemePalette from '@/components/ThemePalette'
import { EGGS, useEggs, clearance } from '@/lib/eggs'
import { useSnaggy } from '@/components/SnaggyProvider'
import { Poneglyph } from '@/components/fx/QuestBits'

/** Footer: system line, phosphor switcher, and an honest nudge toward the easter eggs. */
export default function SiteFooter() {
  const eggs = useEggs()
  const { run } = useSnaggy()

  return (
    <footer className="relative z-[1] border-t border-ops-line pb-[max(2.5rem,env(safe-area-inset-bottom,0px)+1.25rem)] pt-10 font-mono">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 text-xs text-ops-dim sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>
          <span className="text-ops-ok">●</span> all systems operational
          <span className="mx-2 text-ops-line-strong">│</span>© {new Date().getFullYear()} mohamed azab
          <Poneglyph index={0} className="ml-1" />
        </p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <div className="flex items-center gap-3">
            <span>phosphor</span>
            <ThemePalette showProgress={false} size="sm" />
          </div>

          <button
            type="button"
            onClick={() => run('eggs')}
            className="min-h-[36px] text-left transition-colors hover:text-dark-accent"
          >
            {EGGS.length} easter eggs hidden here
            <span className="text-dark-text/70">
              {' '}
              ({eggs.length} found · {clearance(eggs).title} · {clearance(eggs).xp} xp)
            </span>{' '}
            · <span className="text-dark-accent">see hints →</span>
          </button>
        </div>
      </div>
    </footer>
  )
}

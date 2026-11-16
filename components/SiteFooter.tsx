'use client'

import { THEMES, THEME_SWATCH, setTheme, useTheme, useAvailableThemes } from '@/lib/theme'
import { EGGS, useEggs, clearance } from '@/lib/eggs'
import { useSnaggy } from '@/components/SnaggyProvider'
import { Poneglyph } from '@/components/fx/QuestBits'

/** Footer: system line, phosphor switcher, and an honest nudge toward the easter eggs. */
export default function SiteFooter() {
  const theme = useTheme()
  const eggs = useEggs()
  const available = useAvailableThemes()
  const { open } = useSnaggy()

  return (
    <footer className="relative z-[1] border-t border-ops-line pb-[max(2.5rem,env(safe-area-inset-bottom,0px)+1.25rem)] pt-10 font-mono">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 text-xs text-ops-dim sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>
          <span className="text-ops-ok">●</span> all systems operational
          <span className="mx-2 text-ops-line-strong">│</span>© {new Date().getFullYear()} mohamed azab
          <Poneglyph index={0} className="ml-1" />
        </p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <div className="flex items-center gap-2" role="group" aria-label="Colour theme">
            <span>phosphor</span>
            {[...THEMES, ...(available.includes('root') ? (['root'] as const) : [])].map((t) => {
              const open = available.includes(t)
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => open && setTheme(t)}
                  disabled={!open}
                  aria-label={open ? `${t} theme` : 'locked theme (earned by an easter egg)'}
                  aria-pressed={open ? theme === t : undefined}
                  title={open ? t : 'locked · earned by an easter egg'}
                  className={`flex h-9 w-9 items-center justify-center border transition-colors sm:h-7 sm:w-7 ${
                    theme === t ? 'border-dark-text/70' : open ? 'border-ops-line-strong hover:border-dark-text/40' : 'cursor-not-allowed border-dashed border-ops-line'
                  }`}
                >
                  {open ? (
                    <span className="h-3 w-3" style={{ background: THEME_SWATCH[t], boxShadow: `0 0 8px ${THEME_SWATCH[t]}` }} />
                  ) : (
                    <span className="text-[9px] text-ops-line-strong" aria-hidden>
                      ?
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={open}
            className="min-h-[36px] text-left transition-colors hover:text-dark-accent"
          >
            {EGGS.length} easter eggs hidden here
            <span className="text-dark-text/70">
              {' '}
              ({eggs.length} found · {clearance(eggs).title})
            </span>{' '}
            · open snaggy, type <span className="text-dark-accent">eggs</span>
          </button>
        </div>
      </div>
    </footer>
  )
}

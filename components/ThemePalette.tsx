'use client'

import { THEMES, THEME_SWATCH, setTheme, useAvailableThemes, useTheme, type ThemeName } from '@/lib/theme'
import { EGGS, MAX_XP, clearance, useEggs } from '@/lib/eggs'
import { useSnaggy } from '@/components/SnaggyProvider'

/**
 * The phosphor picker. Earned colours are clickable; locked ones show their real colour, greyed out
 * behind a lock, and open the egg hints when clicked. Optionally shows clearance + XP underneath.
 */
export default function ThemePalette({ showProgress = true, size = 'md' }: { showProgress?: boolean; size?: 'sm' | 'md' }) {
  const theme = useTheme()
  const available = useAvailableThemes()
  const eggs = useEggs()
  const { run } = useSnaggy()
  const cl = clearance(eggs)
  const list: ThemeName[] = [...THEMES, ...(available.includes('root') ? (['root'] as ThemeName[]) : [])]
  const box = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10 sm:h-9 sm:w-9'

  return (
    <div className="font-mono">
      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Colour theme">
        {list.map((t) => {
          const open = available.includes(t)
          const active = theme === t
          return (
            <button
              key={t}
              type="button"
              onClick={() => (open ? setTheme(t) : run('eggs'))}
              aria-label={open ? `${t} theme${active ? ' (active)' : ''}` : `${t} theme, locked. see easter egg hints`}
              aria-pressed={open ? active : undefined}
              title={open ? t : `${t} · locked: earned by an easter egg`}
              className={`relative flex ${box} items-center justify-center border transition-[border-color,transform] active:scale-95 ${
                active ? 'border-dark-text' : open ? 'border-ops-line-strong hover:border-dark-text/50' : 'border-dashed border-ops-line hover:border-ops-line-strong'
              }`}
            >
              <span
                className="h-3.5 w-3.5"
                style={{
                  background: THEME_SWATCH[t],
                  boxShadow: open ? `0 0 10px ${THEME_SWATCH[t]}` : 'none',
                  opacity: open ? 1 : 0.22,
                  filter: open ? 'none' : 'grayscale(0.6)',
                }}
              />
              {!open && (
                <svg className="absolute -bottom-1 -right-1 h-3 w-3 bg-dark-bg p-[1px] text-ops-dim" viewBox="0 0 12 12" aria-hidden>
                  <rect x="2.5" y="5.5" width="7" height="5" fill="currentColor" />
                  <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              )}
            </button>
          )
        })}
      </div>
      {showProgress && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-ops-dim">
              clearance <span className="text-dark-text">{cl.title}</span>
            </span>
            <span className="tabular-nums text-ops-dim">
              {cl.xp}/{MAX_XP} xp · {eggs.length}/{EGGS.length} eggs
            </span>
          </div>
          <div className="mt-1.5 h-1 bg-ops-line">
            <div className="h-full bg-dark-accent transition-[width] duration-500" style={{ width: `${(cl.xp / MAX_XP) * 100}%` }} />
          </div>
          <button type="button" onClick={() => run('eggs')} className="mt-2 text-[11px] text-ops-dim underline-offset-2 hover:text-dark-accent hover:underline">
            locked colours are easter egg rewards → hints
          </button>
        </div>
      )}
    </div>
  )
}

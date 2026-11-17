'use client'

import { useState } from 'react'
import { THEMES, THEME_SWATCH, setTheme, useAvailableThemes, useTheme, type ThemeName } from '@/lib/theme'
import { EGGS, MAX_XP, clearance, useEggs } from '@/lib/eggs'
import { useSnaggy } from '@/components/SnaggyProvider'

/** The egg that unlocks each earnable colour. */
const EGG_FOR_THEME = Object.fromEntries(
  EGGS.filter((e) => e.reward.kind === 'theme').map((e) => [e.reward.value, e]),
) as Partial<Record<ThemeName, (typeof EGGS)[number]>>

/**
 * The phosphor picker. Earned colours are clickable; locked ones are plain grey boxes. Hovering,
 * focusing or tapping a locked one shows the hint for the egg that earns it (a second tap opens the
 * full hint list). Optionally shows clearance + XP underneath.
 */
export default function ThemePalette({ showProgress = true, size = 'md' }: { showProgress?: boolean; size?: 'sm' | 'md' }) {
  const theme = useTheme()
  const available = useAvailableThemes()
  const eggs = useEggs()
  const { run } = useSnaggy()
  const cl = clearance(eggs)
  const list: ThemeName[] = [...THEMES, ...(available.includes('root') ? (['root'] as ThemeName[]) : [])]
  const [peek, setPeek] = useState<ThemeName | null>(null)
  const peekEgg = peek ? EGG_FOR_THEME[peek] : undefined
  const box = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10 sm:h-9 sm:w-9'

  return (
    <div className="font-mono">
      <div className="relative">
      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Colour theme" onPointerLeave={(e) => e.pointerType === 'mouse' && setPeek(null)}>
        {list.map((t) => {
          const open = available.includes(t)
          const active = theme === t
          return (
            <button
              key={t}
              type="button"
              onClick={() => {
                if (open) return setTheme(t)
                // first tap (touch) reveals the hint; a second tap on the same one opens the full list
                if (peek === t) run('eggs')
                else setPeek(t)
              }}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setPeek(open ? null : t)}
              onFocus={(e) => e.currentTarget.matches(':focus-visible') && setPeek(open ? null : t)}
              onBlur={() => setPeek(null)}
              aria-label={
                open
                  ? `${t} theme${active ? ' (active)' : ''}`
                  : `${t} theme, locked. hint: ${EGG_FOR_THEME[t]?.hint ?? 'earned by an easter egg'}`
              }
              aria-pressed={open ? active : undefined}
              title={open ? t : undefined}
              className={`relative flex ${box} items-center justify-center border transition-[border-color,transform] active:scale-95 ${
                active
                  ? 'border-dark-text'
                  : open
                    ? 'border-ops-line-strong hover:border-dark-text/50'
                    : `border-dashed ${peek === t ? 'border-dark-text/60' : 'border-ops-line'} bg-ops-line/40`
              }`}
            >
              <span
                className="h-3.5 w-3.5"
                style={
                  open
                    ? { background: THEME_SWATCH[t], boxShadow: `0 0 10px ${THEME_SWATCH[t]}` }
                    : { background: '#3a3b36' }
                }
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
      {peek && (
        <p
          role="tooltip"
          className="absolute left-0 top-full z-20 mt-2 w-full min-w-[16rem] max-w-[calc(100vw-2rem)] border border-ops-line-strong bg-dark-bg px-3 py-2 text-[11px] leading-snug text-ops-dim shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
        >
          <span className="text-dark-text">{peek}</span> · locked
          {peekEgg && (
            <>
              {' '}· {peekEgg.tier} egg: <span className="text-dark-text/85">{peekEgg.hint}</span>
            </>
          )}
          <span className="mt-1 block text-ops-dim/80">click it for the full hint list</span>
        </p>
      )}
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

'use client'

import { useEffect, useState } from 'react'
import { FREE_THEMES, HIDDEN_THEMES, THEMES, THEME_EVENT, THEME_STORAGE_KEY, type ThemeName } from './themeConfig'
import { unlocked, EGG_EVENT } from './eggs'

export { THEMES, FREE_THEMES, EARNED_THEMES, HIDDEN_THEMES, THEME_SWATCH, type ThemeName } from './themeConfig'

export function isTheme(v: string): v is ThemeName {
  return ([...THEMES, ...HIDDEN_THEMES] as readonly string[]).includes(v)
}

export function getTheme(): ThemeName {
  if (typeof document === 'undefined') return 'amber'
  const t = document.documentElement.dataset.theme
  return t && isTheme(t) ? t : 'amber'
}

export function setTheme(theme: ThemeName) {
  const root = document.documentElement
  if (theme === 'amber') delete root.dataset.theme
  else root.dataset.theme = theme
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    /* private mode: theme still applies for this page view */
  }
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: theme }))
}

/** Current theme, kept in sync across every component that shows it. */
export function useTheme(): ThemeName {
  const [theme, setState] = useState<ThemeName>('amber')
  useEffect(() => {
    setState(getTheme())
    const on = (e: Event) => setState((e as CustomEvent<ThemeName>).detail)
    window.addEventListener(THEME_EVENT, on)
    return () => window.removeEventListener(THEME_EVENT, on)
  }, [])
  return theme
}

/** Free themes + any earned by eggs (+ root once the vault is open). */
export function availableThemes(): ThemeName[] {
  let root = false
  try {
    root = localStorage.getItem('azab-root') === '1'
  } catch {
    /* ignore */
  }
  // Opening the vault unlocks every colour.
  if (root) return [...THEMES, 'root']
  const earned = unlocked().themes as ThemeName[]
  return [...FREE_THEMES, ...THEMES.filter((t) => earned.includes(t) && !(FREE_THEMES as readonly string[]).includes(t)), ...(root ? (['root'] as ThemeName[]) : [])]
}

export function useAvailableThemes(): ThemeName[] {
  const [list, setList] = useState<ThemeName[]>([...FREE_THEMES])
  useEffect(() => {
    const on = () => setList(availableThemes())
    on()
    window.addEventListener(EGG_EVENT, on)
    window.addEventListener(THEME_EVENT, on)
    return () => {
      window.removeEventListener(EGG_EVENT, on)
      window.removeEventListener(THEME_EVENT, on)
    }
  }, [])
  return list
}

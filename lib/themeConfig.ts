/** Always available. */
export const FREE_THEMES = ['amber', 'green'] as const
/** Earned by finding easter eggs (see lib/eggs.ts rewards). */
export const EARNED_THEMES = ['cyan', 'magenta', 'ice', 'aether', 'grandline', 'erdtree'] as const
/** Only the sealed root egg grants this one. */
export const HIDDEN_THEMES = ['root'] as const

export const THEMES = [...FREE_THEMES, ...EARNED_THEMES] as const
export type ThemeName = (typeof THEMES)[number] | (typeof HIDDEN_THEMES)[number]

export const THEME_STORAGE_KEY = 'azab-theme'
export const THEME_EVENT = 'azab-theme-change'

/** Swatch colours for UI chips (kept in sync with styles/globals.css). */
export const THEME_SWATCH: Record<ThemeName, string> = {
  amber: 'rgb(255 181 71)',
  green: 'rgb(124 228 149)',
  cyan: 'rgb(103 222 240)',
  magenta: 'rgb(255 120 200)',
  ice: 'rgb(190 225 255)',
  aether: 'rgb(176 130 255)',
  grandline: 'rgb(70 160 255)',
  erdtree: 'rgb(240 200 90)',
  root: 'rgb(255 72 88)',
}

/**
 * Inline script for <head>: applies the saved theme before first paint so there is no colour flash.
 * Plain module (no React) so the server layout can import it.
 */
export const THEME_BOOT_SCRIPT = `try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='root'&&localStorage.getItem('azab-root')!=='1')t=null;if(t&&t!=='amber'&&${JSON.stringify([
  ...THEMES,
  ...HIDDEN_THEMES,
])}.indexOf(t)>-1)document.documentElement.dataset.theme=t;if(localStorage.getItem('azab-crt')==='1')document.documentElement.dataset.crt='1'}catch(e){}`

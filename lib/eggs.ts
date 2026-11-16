'use client'

import { useEffect, useState } from 'react'

/**
 * Findable easter eggs, in three tiers. Every one grants something real: a theme, a command,
 * hidden files, or a game mode. `eggs` in Snaggy prints a hint for each one you haven't found.
 * (One door is not on this list, and never will be.)
 */
export type Tier = 'easy' | 'medium' | 'hard'
export type Reward =
  | { kind: 'theme'; value: string; label: string }
  | { kind: 'command'; value: string; label: string }
  | { kind: 'file'; value: string; label: string }
  | { kind: 'mode'; value: string; label: string }

export const EGGS = [
  // ── easy: hinted plainly ───────────────────────────────────────────────
  { id: 'sudo', tier: 'easy', name: 'access denied', hint: 'in snaggy, ask for superuser powers', reward: { kind: 'theme', value: 'cyan', label: 'theme: cyan' } },
  { id: 'coffee', tier: 'easy', name: 'error 418', hint: 'in snaggy, ask for what developers run on', reward: { kind: 'command', value: 'fortune', label: 'command: fortune' } },
  { id: 'vim', tier: 'easy', name: 'trapped', hint: 'in snaggy, open the editor nobody can exit', reward: { kind: 'file', value: '.lore', label: 'files: ~/.lore/' } },
  { id: 'hidden', tier: 'easy', name: 'dotfiles', hint: 'in snaggy, list every file, even the hidden ones', reward: { kind: 'file', value: '.player-profile', label: 'file: ~/.player-profile' } },
  // ── medium: you have to think a little ─────────────────────────────────
  { id: 'konami', tier: 'medium', name: 'player 2', hint: 'an old cheat code works on the page itself (phones: the logo, seven times, fast)', reward: { kind: 'theme', value: 'magenta', label: 'theme: magenta' } },
  { id: 'hack', tier: 'medium', name: 'not a heist', hint: 'do what movie hackers do', reward: { kind: 'command', value: 'crt', label: 'command: crt (tube mode)' } },
  { id: 'rmrf', tier: 'medium', name: 'chaos engineer', hint: 'delete everything. from the root.', reward: { kind: 'command', value: 'chaos', label: 'command: chaos' } },
  { id: 'fivenines', tier: 'medium', name: 'five nines', hint: 'finish an on-call shift above 99% uptime', reward: { kind: 'mode', value: 'round115', label: 'on-call: round 115 mode' } },
  { id: 'typist', tier: 'medium', name: 'fast hands', hint: '80+ wpm at 95%+ accuracy in the typing test', reward: { kind: 'theme', value: 'ice', label: 'theme: ice' } },
  // ── hard: quests ───────────────────────────────────────────────────────
  { id: 'packapunch', tier: 'hard', name: 'pack-a-punch', hint: 'the power is off somewhere on this site. turn it on, then upgrade your weapon of choice.', reward: { kind: 'theme', value: 'aether', label: 'theme: aether + upgraded snaggy' } },
  { id: 'onepiece', tier: 'hard', name: 'the one piece is real', hint: 'four road poneglyphs are hidden across the site. collect them all, then set sail.', reward: { kind: 'theme', value: 'grandline', label: 'theme: grand line + command: bounty' } },
  { id: 'radahn', tier: 'hard', name: 'consort slayer', hint: 'mohamed felled the consort in six tries. lose six on-call shifts, then win one (95%+).', reward: { kind: 'theme', value: 'erdtree', label: 'theme: erdtree' } },
] as const satisfies readonly { id: string; tier: Tier; name: string; hint: string; reward: Reward }[]

export type EggId = (typeof EGGS)[number]['id']

const XP: Record<Tier, number> = { easy: 1, medium: 2, hard: 4 }
export const MAX_XP = EGGS.reduce((n, e) => n + XP[e.tier], 0)

/** Clearance climbs as you find eggs. The last rank needs every single one. */
export function clearance(found: readonly EggId[]): { level: number; title: string; xp: number } {
  const xp = EGGS.filter((e) => found.includes(e.id)).reduce((n, e) => n + XP[e.tier], 0)
  const ranks = [
    [0, 'visitor'],
    [3, 'operator'],
    [8, 'sysadmin'],
    [16, 'yonko'],
    [MAX_XP, 'pirate king'],
  ] as const
  let level = 0
  ranks.forEach(([min], i) => {
    if (xp >= min) level = i
  })
  return { level, title: ranks[level][1], xp }
}

const KEY = 'azab-eggs'
const EVENT = 'azab-egg-found'

function readFound(): EggId[] {
  try {
    const raw = localStorage.getItem(KEY)
    const ids = raw ? (JSON.parse(raw) as string[]) : []
    return EGGS.map((e) => e.id).filter((id) => ids.includes(id))
  } catch {
    return []
  }
}

export function hasEgg(id: EggId): boolean {
  return readFound().includes(id)
}

/** Every reward currently unlocked, by kind. */
export function unlocked(found: readonly EggId[] = readFound()) {
  const r = EGGS.filter((e) => found.includes(e.id)).map((e) => e.reward)
  return {
    themes: r.filter((x) => x.kind === 'theme').map((x) => x.value) as string[],
    commands: r.filter((x) => x.kind === 'command').map((x) => x.value) as string[],
    files: r.filter((x) => x.kind === 'file').map((x) => x.value) as string[],
    modes: r.filter((x) => x.kind === 'mode').map((x) => x.value) as string[],
  }
}

/** Records an egg. Returns true the first time it is found (so callers can celebrate). */
export function findEgg(id: EggId): boolean {
  const found = readFound()
  if (found.includes(id)) return false
  const next = [...found, id]
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* ignore: still celebrate this page view */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { id, count: next.length } }))
  return true
}

export function useEggs(): EggId[] {
  const [found, setFound] = useState<EggId[]>([])
  useEffect(() => {
    setFound(readFound())
    const on = () => setFound(readFound())
    window.addEventListener(EVENT, on)
    return () => window.removeEventListener(EVENT, on)
  }, [])
  return found
}

export const EGG_EVENT = EVENT

// ── Quest progress (multi-step hard eggs) ────────────────────────────────────

const QUEST_KEY = 'azab-quests'
export const QUEST_EVENT = 'azab-quest'
type Quests = { power: boolean; poneglyphs: number[]; oncallLosses: number }

export function readQuests(): Quests {
  try {
    const raw = localStorage.getItem(QUEST_KEY)
    return { power: false, poneglyphs: [], oncallLosses: 0, ...(raw ? JSON.parse(raw) : {}) }
  } catch {
    return { power: false, poneglyphs: [], oncallLosses: 0 }
  }
}

export function writeQuests(patch: Partial<Quests>) {
  const next = { ...readQuests(), ...patch }
  try {
    localStorage.setItem(QUEST_KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(QUEST_EVENT))
  return next
}

export function useQuests(): Quests {
  const [q, setQ] = useState<Quests>({ power: false, poneglyphs: [], oncallLosses: 0 })
  useEffect(() => {
    setQ(readQuests())
    const on = () => setQ(readQuests())
    window.addEventListener(QUEST_EVENT, on)
    return () => window.removeEventListener(QUEST_EVENT, on)
  }, [])
  return q
}

/** Words revealed by each road poneglyph (in order). Together they name the destination. */
export const PONEGLYPH_WORDS = ['joy', 'boy', 'laugh', 'tale'] as const

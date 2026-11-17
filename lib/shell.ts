/**
 * Snaggy's shell: a tiny virtual filesystem built from the real portfolio data, plus commands.
 * Pure functions — the terminal component renders the Lines and applies the Effects.
 */
import {
  ABOUT_TEXT,
  EDUCATION,
  EXPERIENCE,
  INTEREST_STORIES,
  INTERESTS,
  LEADERSHIP,
  PERSONAL,
  PROJECTS,
  TECH_STACK,
} from './data'
import { projectHook, projectOverviewText } from './projects'
import { EGGS, MAX_XP, PONEGLYPH_WORDS, clearance, type EggId } from './eggs'
import { isTheme, type ThemeName } from './theme'
import type { IncidentCause } from './incident'

export type Tone = 'default' | 'dim' | 'ok' | 'warn' | 'err' | 'accent'
export type Line = {
  text: string
  tone?: Tone
  /** RGB-split glitch on this line */
  glitch?: boolean
  /** ms to wait before this line appears (for dramatic output) */
  delay?: number
  /** Display-size line (reveals) */
  big?: boolean
  /** Part of an ASCII-art block: render in one uniform monospace */
  art?: boolean
}
export type Effects = {
  clear?: boolean
  close?: boolean
  open?: string
  cwd?: string
  theme?: ThemeName
  play?: 'oncall' | 'typing'
  mode?: 'vim'
  egg?: EggId
  glitch?: boolean
  /** Break the site on purpose (the visitor asked for it) */
  incident?: IncidentCause
  crt?: boolean
  /** Snaggy has been pack-a-punched */
  pap?: boolean
  /** Set (string) or clear (null) the visitor's username */
  username?: string | null
}
export type Result = { lines: Line[]; effects?: Effects }
export type Ctx = {
  cwd: string
  history: string[]
  theme: ThemeName
  themes: ThemeName[]
  eggs: EggId[]
  root: boolean
  bootedAt: number
  commands: string[]
  files: string[]
  quests: { power: boolean; poneglyphs: number[] }
  crt: boolean
  username: string | null
}

// ── helpers ─────────────────────────────────────────────────────────────────

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const clip = (s: string, n: number) => {
  const t = s.replace(/\s+/g, ' ').trim()
  return t.length > n ? `${t.slice(0, n - 1).trim()}…` : t
}

/** Wraps prose to the terminal width so long paragraphs read like real file output. */
const wrap = (text: string, width = 64): string[] => {
  const out: string[] = []
  for (const para of text.split(/\n+/)) {
    let line = ''
    for (const word of para.split(/\s+/).filter(Boolean)) {
      if ((line + ' ' + word).trim().length > width) {
        out.push(line)
        line = word
      } else line = (line + ' ' + word).trim()
    }
    if (line) out.push(line)
    out.push('')
  }
  while (out.length && out[out.length - 1] === '') out.pop()
  return out
}

const plain = (lines: string[], tone?: Tone): Line[] => lines.map((text) => ({ text, tone }))

// ── Lore (unlocked by eggs) ─────────────────────────────────────────────────

const LORE: Record<string, string[]> = {
  'zombies.md': [
    '# treyarch zombies',
    'favourite storyline in games, start to finish: element 115, the aether,',
    'the original crew, the timeline that collapses, the dark aether reboot.',
    '',
    'every main-quest easter egg in black ops 1, 2, 3, 6 and 7: done.',
    'the main-quest easter eggs are the reason this site has easter eggs.',
    'a good one is hinted everywhere and obvious to nobody.',
  ],
  'gta.md': [
    '# grand theft auto',
    'played and finished every gta.',
    'gta v: 1,500+ hours. knows los santos better than some real cities.',
  ],
  'fnaf.md': [
    "# five nights at freddy's",
    'fnaf 1 through 5, every night survived to 6 am.',
    'it is a game about watching the logs and not panicking. so, on-call.',
  ],
  'one-piece.md': [
    '# one piece',
    'the best long game in fiction: setups that pay off a thousand chapters later.',
    'four road poneglyphs are hidden on this site. that is not a metaphor.',
  ],
  'elden-ring.md': [
    '# elden ring',
    'multiple full runs. consort radahn: felled in six tries.',
    'the first five were research.',
  ],
  'siege.md': [
    '# rainbow six siege',
    'rank: emerald iii.',
    'a game about information: drones, sound, angles, timing.',
    'same reason security is interesting.',
  ],
  'mastery.md': [
    '# how he plays',
    "he doesn't play a game, he studies it: mechanics, routes, frame data, the meta.",
    'then he plays. the same loop he uses for a new stack:',
    'read everything, build something small, iterate until it is second nature.',
    '',
    'also known to watch eight-hour lore videos in one sitting.',
  ],
}

const FORTUNES = [
  'emerald iii in rainbow six siege. ask him which operators are meta this season.',
  'consort radahn fell in six tries. the first five were research.',
  'has watched eight-hour lore videos in a single sitting. on purpose.',
  "doesn't play games casually: mechanics, routes, frame data, then the meta.",
  'favourite storyline in gaming: treyarch zombies, nacht to the dark aether.',
  'treats a new game like a new codebase: read the docs (the wiki), then ship (win).',
  'beat elden ring more than once. ng+ is just a second draft.',
  'believes the one piece is real. so does this site.',
  'the on-call game was balanced against a bot. the bot scored 92%.',
  'has finished every main-quest zombies easter egg in bo1, bo2, bo3, bo6 and bo7.',
  '1,500+ hours in gta v, and every other gta finished.',
  'survived every night of fnaf 1 through 5. on-call shifts are easier.',
  'every easter egg here is a nod to the zombies main quests he grew up chasing.',
]

const PLAYER_PROFILE: Line[] = [
  { text: '┌─ player profile ─────────────────────────────┐', tone: 'accent' },
  { text: '  handle      azab' },
  { text: '  class       full-stack · security · infra' },
  { text: '  playstyle   completionist. learns the meta first.' },
  { text: '' },
  { text: '  r6 siege    emerald iii' },
  { text: '  elden ring  multiple runs · radahn in 6 tries' },
  { text: '  zombies     every main quest · bo1 bo2 bo3 bo6 bo7' },
  { text: '  gta         every game finished · 1,500+ hrs in v' },
  { text: '  fnaf        1-5, every night to 6 am' },
  { text: '  one piece   currently sailing' },
  { text: '' },
  { text: '  side effect this site has 12 easter eggs', tone: 'dim' },
  { text: '└──────────────────────────────────────────────┘', tone: 'accent' },
]

/** Entry point of the root ARG. Reachable only via `ls -a` → `cat .secrets`. */
const SECRETS: Line[] = [
  { text: 'nothing to see here.', tone: 'dim' },
  { text: '' },
  { text: 'one door is not on the eggs list.', tone: 'err', glitch: true },
  { text: 'it opens with five words, spoken to snaggy, in order.', tone: 'default' },
  { text: '' },
  { text: 'browsers keep secrets in five places:', tone: 'dim' },
  { text: '  i    what the page says before it renders', tone: 'dim' },
  { text: '  ii   what it mutters to whoever opens the console', tone: 'dim' },
  { text: '  iii  what rides along with every response', tone: 'dim' },
  { text: '  iv   what it tells the machines that crawl it', tone: 'dim' },
  { text: '  v    where lost travellers end up', tone: 'dim' },
  { text: '' },
  { text: 'none of them are written plainly.', tone: 'dim' },
]

const BOUNTY: Line[] = [
  { text: '╔══════════════════════════════╗', tone: 'accent' },
  { text: '║            WANTED            ║', tone: 'accent' },
  { text: '║        dead or deployed      ║', tone: 'dim' },
  { text: '║                              ║' },
  { text: '║        MOHAMED  AZAB         ║' },
  { text: '║   "the full-stack engineer"  ║', tone: 'dim' },
  { text: '║                              ║' },
  { text: '║   3,000,000,115 berries      ║', tone: 'accent' },
  { text: '║                              ║' },
  { text: '║  crimes: shipping on fridays ║', tone: 'dim' },
  { text: '╚══════════════════════════════╝', tone: 'accent' },
]

// ── Virtual filesystem ──────────────────────────────────────────────────────

type FileNode = { kind: 'file'; read: () => Line[]; open?: string }
type DirNode = { kind: 'dir'; children: Record<string, Node> }
type Node = FileNode | DirNode

const file = (read: () => Line[], open?: string): FileNode => ({ kind: 'file', read, open })

function projectFile(p: (typeof PROJECTS)[number]): FileNode {
  return file(() => {
    const hook = projectHook(p)
    const status = p.demo ? `● live  ${p.demo}` : p.github ? `● source  ${p.github.replace('https://', '')}` : '● private'
    return [
      { text: `# ${p.title}`, tone: 'accent' },
      { text: status, tone: p.demo ? 'ok' : 'warn' },
      { text: `stack: ${p.stack.join(', ')}`, tone: 'dim' },
      { text: '' },
      ...plain(wrap(hook ?? clip(p.description, 200))),
      { text: '' },
      ...plain(wrap(clip(projectOverviewText(p), 520)), 'dim'),
      { text: '' },
      { text: `→ open ${p.slug}    (or read the full case study at /projects/${p.slug})`, tone: 'dim' },
    ]
  }, p.demo || p.github || `/projects/${p.slug}`)
}

function expFile(e: (typeof EXPERIENCE)[number]): FileNode {
  return file(() => [
    { text: `[${e.dates}]`, tone: 'accent' },
    { text: `${e.role} @ ${e.org}` },
    ...e.bullets.map((b) => ({ text: `  › ${b}`, tone: 'dim' as Tone })),
  ])
}

function buildFs(ctx: Pick<Ctx, 'files'>): DirNode {
  const projects: Record<string, Node> = {}
  for (const p of PROJECTS) projects[`${p.slug}.md`] = projectFile(p)

  const experience: Record<string, Node> = {}
  for (const e of [...EXPERIENCE, ...LEADERSHIP]) experience[`${slugify(e.org)}.log`] = expFile(e)

  const interests: Record<string, Node> = {}
  for (const i of INTERESTS) {
    const story = (INTEREST_STORIES as Record<string, { title: string; story: string; highlights: string[] }>)[i.title]
    interests[`${slugify(i.title)}.md`] = file(() => [
      { text: `# ${i.title}`, tone: 'accent' },
      ...(story
        ? [
            { text: story.title, tone: 'dim' as Tone },
            { text: '' },
            ...plain(wrap(story.story)),
            { text: '' },
            ...story.highlights.map((h) => ({ text: `  › ${h}`, tone: 'ok' as Tone })),
          ]
        : [{ text: i.text }]),
    ])
  }

  const root: DirNode = {
    kind: 'dir',
    children: {
      'about.md': file(() => [{ text: '# about', tone: 'accent' }, ...plain(wrap(ABOUT_TEXT))]),
      'contact.txt': file(() => [
        { text: `email     ${PERSONAL.email}` },
        { text: `github    ${PERSONAL.github.replace('https://', '')}` },
        { text: `linkedin  ${PERSONAL.linkedin.replace('https://www.', '')}` },
        { text: '' },
        { text: '→ open email | open github | open linkedin', tone: 'dim' },
      ]),
      'education.md': file(() =>
        EDUCATION.flatMap((e) => [
          { text: `# ${e.school}`, tone: 'accent' as Tone },
          { text: e.degree },
          { text: `${e.years}${e.gpa ? ` · ${e.gpa}` : ''}`, tone: 'dim' as Tone },
          ...(e.courses?.length ? [{ text: `courses: ${e.courses.join(', ')}`, tone: 'dim' as Tone }] : []),
        ])
      ),
      'stack.txt': file(() => Object.entries(TECH_STACK).map(([k, v]) => ({ text: `${k.toLowerCase().padEnd(14)} ${v.join(', ')}` }))),
      'resume.pdf': file(() => [{ text: 'binary file. opening in a new tab…', tone: 'dim' }], PERSONAL.resumePdf),
      projects: { kind: 'dir', children: projects },
      experience: { kind: 'dir', children: experience },
      interests: { kind: 'dir', children: interests },
      '.bash_history': file(() =>
        plain(
          [
            'git commit -m "final fix"',
            'git commit -m "final fix (actually)"',
            'docker compose up -d && docker compose down && docker compose up -d',
            'npm run dev   # 2am',
            'curl wttr.in/ottawa   # -24°C. stayed inside. shipped a feature.',
            'yt-dlp "the complete zombies storyline (8h)"',
          ],
          'dim'
        )
      ),
      '.secrets': file(() => SECRETS),
    },
  }
  if (ctx.files.includes('.player-profile')) root.children['.player-profile'] = file(() => PLAYER_PROFILE)
  if (ctx.files.includes('.lore')) {
    const lore: Record<string, Node> = {}
    for (const [name, lines] of Object.entries(LORE)) lore[name] = file(() => lines.map((t, i) => ({ text: t, tone: i === 0 ? 'accent' : 'default' })))
    root.children['.lore'] = { kind: 'dir', children: lore }
  }
  return root
}

/** "~", "~/projects", "projects/x.md", "..", "/" → normalised path segments under ~ */
function resolve(cwd: string, arg = ''): string[] {
  const base = arg.startsWith('~') || arg.startsWith('/') ? [] : cwd.replace(/^~\/?/, '').split('/').filter(Boolean)
  const parts = arg.replace(/^~\/?|^\//, '').split('/').filter(Boolean)
  for (const p of parts) {
    if (p === '.') continue
    if (p === '..') base.pop()
    else base.push(p)
  }
  return base
}

function lookup(fs: DirNode, segments: string[]): Node | null {
  let node: Node = fs
  for (const seg of segments) {
    if (node.kind !== 'dir') return null
    const exact: Node | undefined = node.children[seg]
    const loose: string | undefined = exact
      ? undefined
      : Object.keys(node.children).find((k) => k.replace(/\.(md|log|txt|pdf)$/, '') === seg)
    const next: Node | undefined = exact ?? (loose ? node.children[loose] : undefined)
    if (!next) return null
    node = next
  }
  return node
}

const toPath = (segs: string[]) => (segs.length ? `~/${segs.join('/')}` : '~')

// ── Commands ───────────────────────────────────────────────────────────────

const BASE_COMMANDS: [string, string][] = [
  ['help', 'this list'],
  ['ls [-a] [dir]', 'list files'],
  ['cd <dir>', 'change directory'],
  ['cat <file>', 'print a file (try: cat about.md)'],
  ['open <name>', 'open a project, resume, github, linkedin, email'],
  ['whoami', 'who you are, and whose box this is'],
  ['login <name>', 'pick a username (shows in your prompt)'],
  ['neofetch', 'system info'],
  ['theme [name]', 'switch colour'],
  ['play <game>', 'oncall | typing'],
  ['eggs', 'easter eggs, rewards, clearance'],
  ['ddos · shutdown', 'break the site. you will have to fix it.'],
]
const EARNED_COMMANDS: Record<string, string> = {
  fortune: 'a random fact about mohamed',
  crt: 'tube mode on/off',
  chaos: 'start a random incident',
  bounty: 'print the poster',
}

const COMMAND_NAMES = [
  'help', 'ls', 'cd', 'cat', 'open', 'whoami', 'neofetch', 'theme', 'play', 'eggs', 'history', 'clear', 'date', 'echo', 'pwd', 'exit', 'uptime',
  'fortune', 'crt', 'chaos', 'bounty', 'pack-a-punch', 'set', 'login', 'logout'
]

function fmtUptime(ms: number) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  return m ? `${m}m ${s % 60}s` : `${s}s`
}

const locked = (cmd: string): Result => ({
  lines: [{ text: `${cmd}: permission denied. this command is an easter egg reward (type eggs).`, tone: 'err' }],
})

/** Runs a command. Returns null when the input isn't a command (it goes to the AI instead). */
export function runCommand(raw: string, ctx: Ctx): Result | null {
  const input = raw.trim().replace(/^\//, '') // "/help" works too
  const [cmd, ...args] = input.split(/\s+/)
  const arg = args.join(' ')
  const lc = input.toLowerCase()
  const fs = buildFs(ctx)
  const has = (c: string) => ctx.commands.includes(c)

  // ── vault (root only) ──────────────────────────────────
  if (/^(cd|open|ls)\s+\/?vault\/?$/.test(lc)) {
    if (!ctx.root) return { lines: [{ text: `${cmd}: /vault: permission denied`, tone: 'err', glitch: true }] }
    return { lines: [{ text: 'mounting /vault…', tone: 'err' }], effects: { open: '/vault' } }
  }

  // ── things that take the whole site down (visitor's choice) ──
  const incident: IncidentCause | null =
    lc.replace(/\s/g, '') === ':(){:|:&};:' || lc === 'forkbomb' || lc === 'fork bomb'
      ? 'forkbomb'
      : lc === 'ddos' || lc.startsWith('ddos ') || lc === 'stress' || lc.startsWith('stress ') || lc === 'flood'
        ? 'ddos'
        : /^(sudo\s+)?(shutdown|poweroff|halt)\b/.test(lc) || lc === 'kill -9 1' || lc === 'sudo kill -9 1'
          ? 'shutdown'
          : null
  if (incident) {
    return {
      lines: [
        { text: incident === 'ddos' ? 'sending 48,000 req/s at azab.dev…' : incident === 'forkbomb' ? 'forking…' : 'going down now…', tone: 'warn' },
        { text: 'connection lost.', tone: 'err', glitch: true, delay: 600 },
      ],
      effects: { incident, close: true },
    }
  }

  // ── hard quests ─────────────────────────────────────────
  if (/^(pack-?a-?punch|pap)\b/.test(lc)) {
    if (ctx.eggs.includes('packapunch')) return { lines: [{ text: 'already pack-a-punched. it does not stack.', tone: 'dim' }] }
    if (!ctx.quests.power) return { lines: [{ text: 'the machine is dark. turn the power on first.', tone: 'err' }] }
    return {
      lines: [
        { text: 'feeding snaggy into the machine…', tone: 'dim' },
        { text: '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓', tone: 'accent', delay: 900 },
        { text: 'SNAGGY · PACK-A-PUNCHED', tone: 'accent', glitch: true, big: true, delay: 800 },
        { text: 'aether theme unlocked. answers now come with a little extra.', tone: 'dim', delay: 500 },
      ],
      effects: { egg: 'packapunch', theme: 'aether', pap: true, glitch: true },
    }
  }
  if (lc === 'set sail' || lc.startsWith('set sail ')) {
    const n = ctx.quests.poneglyphs.length
    if (ctx.eggs.includes('onepiece')) return { lines: BOUNTY }
    if (n < 4) {
      return {
        lines: [
          { text: 'the log pose is spinning.', tone: 'dim' },
          { text: `road poneglyphs found: ${n}/4`, tone: 'warn' },
        ],
      }
    }
    const dest = PONEGLYPH_WORDS.join(' ')
    return {
      lines: [
        { text: `road poneglyphs: ${dest}`, tone: 'dim' },
        { text: 'charting a course for the last island…', tone: 'dim', delay: 700 },
        { text: 'THE ONE PIECE IS REAL', tone: 'accent', glitch: true, big: true, delay: 1000 },
        ...BOUNTY.map((l, i) => ({ ...l, delay: i === 0 ? 600 : 60 })),
        { text: 'grand line theme + bounty command unlocked.', tone: 'dim', delay: 400 },
      ],
      effects: { egg: 'onepiece', theme: 'grandline', glitch: true },
    }
  }

  // ── easy / medium eggs ──────────────────────────────────
  if (lc === 'sudo' || lc.startsWith('sudo ')) {
    return {
      lines: [
        { text: '[sudo] password for visitor: ********', tone: 'dim' },
        { text: 'visitor is not in the sudoers file.', tone: 'err', glitch: true, delay: 900 },
        { text: 'this incident will be reported.', tone: 'err', delay: 500 },
      ],
      effects: { egg: 'sudo' },
    }
  }
  if (/^rm\s+-(rf|fr)\s+(\/|~|\*|\.)/.test(lc)) {
    const doomed = ['/projects', '/experience', '/snaggy', '/resume.pdf', '/home/mohamed', '/boot']
    return {
      lines: [
        ...doomed.map((d, i) => ({ text: `removing ${d} …`, tone: 'warn' as Tone, delay: i ? 260 : 0 })),
        { text: 'kernel panic - not syncing: attempted to kill portfolio', tone: 'err', glitch: true, delay: 500 },
        { text: '…restored from git. everything lives in git.', tone: 'ok', delay: 1100 },
      ],
      effects: { egg: 'rmrf', glitch: true },
    }
  }
  if (lc === 'coffee' || lc === 'make coffee' || lc === 'brew coffee' || lc === 'brew') {
    return {
      lines: [
        { text: '      ( (', tone: 'dim' },
        { text: '       ) )', tone: 'dim' },
        { text: '    ........', tone: 'accent' },
        { text: '    |      |]', tone: 'accent' },
        { text: '    \\      /', tone: 'accent' },
        { text: "     `----'", tone: 'accent' },
        { text: 'error 418: i’m a teapot. brewing anyway.', tone: 'warn', delay: 400 },
      ],
      effects: { egg: 'coffee' },
    }
  }
  if (cmd === 'vim' || cmd === 'vi' || cmd === 'nvim') {
    return {
      lines: [
        { text: '~', tone: 'dim' },
        { text: '~              VIM - Vi IMproved', tone: 'dim' },
        { text: '~      you are inside vim now. there is no way out.', tone: 'dim' },
        { text: '~      (type :q and press enter. allegedly.)', tone: 'dim' },
        { text: '~', tone: 'dim' },
      ],
      effects: { egg: 'vim', mode: 'vim' },
    }
  }
  if (cmd === 'hack' || lc === 'hack the planet' || lc === 'hack the mainframe') {
    const bars = [12, 37, 64, 88, 99]
    return {
      lines: [
        { text: 'initiating breach on azab.dev…', tone: 'dim' },
        ...bars.map((p, i) => ({
          text: `[${'#'.repeat(Math.round(p / 10)).padEnd(10, '.')}] ${String(p).padStart(2)}%  ${
            ['spoofing mac', 'tunnelling through dns', 'cracking hash', 'pivoting', 'almost…'][i]
          }`,
          tone: 'warn' as Tone,
          delay: 380,
        })),
        { text: 'ACCESS DENIED', tone: 'err', glitch: true, delay: 700 },
        { text: 'this is a portfolio, not a heist. for real security work: cat projects/sentinelstack-ai.md', tone: 'dim', delay: 700 },
      ],
      effects: { egg: 'hack', glitch: true },
    }
  }

  switch (cmd.toLowerCase()) {
    case 'help':
    case '?': {
      const earned = Object.entries(EARNED_COMMANDS).filter(([c]) => has(c))
      return {
        lines: [
          { text: 'commands', tone: 'accent' },
          ...BASE_COMMANDS.map(([c, d]) => ({ text: `  ${c.padEnd(16)} ${d}`, tone: 'default' as Tone })),
          ...(earned.length
            ? [{ text: '' }, { text: 'earned', tone: 'ok' as Tone }, ...earned.map(([c, d]) => ({ text: `  ${c.padEnd(16)} ${d}`, tone: 'ok' as Tone }))]
            : []),
          { text: '' },
          { text: 'also: history · clear · date · echo · pwd · uptime · exit', tone: 'dim' },
          { text: 'anything else is a question for snaggy (ai). tab completes. ↑ recalls.', tone: 'dim' },
        ],
      }
    }

    case 'ls': {
      const showAll = args.some((a) => /^-\w*a/.test(a))
      const target = args.filter((a) => !a.startsWith('-'))[0] ?? ''
      const segs = resolve(ctx.cwd, target)
      const node = lookup(fs, segs)
      if (!node) return { lines: [{ text: `ls: cannot access '${target}': no such file or directory`, tone: 'err' }] }
      if (node.kind === 'file') return { lines: [{ text: target }] }
      const names = Object.keys(node.children).filter((n) => showAll || !n.startsWith('.'))
      const lines: Line[] = names.map((n) => {
        const child = node.children[n]
        const isDir = child.kind === 'dir'
        const p = n.endsWith('.md') && segs[0] === 'projects' ? PROJECTS.find((x) => `${x.slug}.md` === n) : null
        const badge = p ? (p.demo ? '  ● live' : '  ○ source') : ''
        return {
          text: `${isDir ? `${n}/` : n}${badge}`,
          tone: n.startsWith('.') ? ('err' as Tone) : isDir ? ('accent' as Tone) : ('default' as Tone),
        }
      })
      return { lines: showAll ? [{ text: './  ../', tone: 'dim' }, ...lines] : lines, effects: showAll ? { egg: 'hidden' } : undefined }
    }

    case 'cd': {
      const segs = resolve(ctx.cwd, arg || '~')
      const node = lookup(fs, segs)
      if (!node) return { lines: [{ text: `cd: no such directory: ${arg}`, tone: 'err' }] }
      if (node.kind !== 'dir') return { lines: [{ text: `cd: not a directory: ${arg}`, tone: 'err' }] }
      return { lines: [], effects: { cwd: toPath(segs) } }
    }

    case 'pwd':
      return { lines: [{ text: ctx.cwd.replace('~', '/home/mohamed') }] }

    case 'cat':
    case 'less':
    case 'more': {
      if (!arg) return { lines: [{ text: 'cat: which file? try: ls', tone: 'err' }] }
      const node = lookup(fs, resolve(ctx.cwd, arg))
      if (!node) return { lines: [{ text: `cat: ${arg}: no such file`, tone: 'err' }] }
      if (node.kind === 'dir') return { lines: [{ text: `cat: ${arg}: is a directory (try: ls ${arg})`, tone: 'err' }] }
      return { lines: node.read(), effects: arg.includes('resume') ? { open: node.open } : undefined }
    }

    case 'open': {
      const a = arg.toLowerCase()
      if (!a) return { lines: [{ text: 'open: what? (resume, github, linkedin, email, or a project name)', tone: 'err' }] }
      if (a.includes('resume')) return { lines: [{ text: 'opening resume…', tone: 'dim' }], effects: { open: PERSONAL.resumePdf } }
      if (a === 'github') return { lines: [{ text: 'opening github…', tone: 'dim' }], effects: { open: PERSONAL.github } }
      if (a === 'linkedin') return { lines: [{ text: 'opening linkedin…', tone: 'dim' }], effects: { open: PERSONAL.linkedin } }
      if (a === 'email' || a === 'mail') return { lines: [{ text: 'opening mail…', tone: 'dim' }], effects: { open: `mailto:${PERSONAL.email}` } }
      const p = PROJECTS.find((x) => x.slug === a || x.slug === a.replace(/\.md$/, '') || x.title.toLowerCase() === a)
      if (p) return { lines: [{ text: `opening ${p.title}…`, tone: 'dim' }], effects: { open: p.demo || `/projects/${p.slug}` } }
      return { lines: [{ text: `open: nothing called "${arg}" (try: ls projects)`, tone: 'err' }] }
    }

    case 'login':
    case 'name':
    case 'username': {
      const name = arg.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 16)
      if (!arg) return { lines: [{ text: 'usage: login <name>   (letters, numbers, - and _, up to 16)', tone: 'dim' }] }
      if (!name) return { lines: [{ text: 'login: that name has no usable characters. try letters or numbers.', tone: 'err' }] }
      if (name === 'root') return { lines: [{ text: 'login: nice try. root is earned, not typed.', tone: 'err', glitch: true }] }
      return {
        lines: [
          { text: `welcome, ${name}.`, tone: 'ok' },
          { text: 'your prompt has been updated. it stays on this device.', tone: 'dim' },
        ],
        effects: { username: name },
      }
    }

    case 'whoami':
      return {
        lines: [
          { text: `you: ${ctx.username ?? 'visitor'}${ctx.username ? '' : '   (pick a name: login <name>)'}`, tone: 'dim' },
          { text: '' },
          { text: `this box belongs to ${PERSONAL.name.toLowerCase()}`, tone: 'accent' },
          ...plain(
            wrap(
              `computer science at ${PERSONAL.university.toLowerCase()} (ai/ml + cybersecurity, business minor). builds and runs systems across ai, security and infrastructure. based in ottawa. learns things the way he learns games: all the way down.`
            )
          ),
          { text: '' },
          { text: '→ cat about.md · ls projects · cat contact.txt', tone: 'dim' },
        ],
      }

    case 'neofetch':
    case 'fastfetch': {
      const live = PROJECTS.filter((p) => p.demo).length
      const cl = clearance(ctx.eggs)
      const art = [
        '███╗   ███╗ █████╗ ',
        '████╗ ████║██╔══██╗',
        '██╔████╔██║███████║',
        '██║╚██╔╝██║██╔══██║',
        '██║ ╚═╝ ██║██║  ██║',
        '╚═╝     ╚═╝╚═╝  ╚═╝',
      ]
      const info = [
        'mohamed@azab.dev',
        '────────────────',
        `os        cs @ carleton (ai/ml + sec)`,
        `host      ottawa, on`,
        `uptime    ${fmtUptime(performance.now() - ctx.bootedAt)} (this tab)`,
        `shell     snaggy v3${ctx.eggs.includes('packapunch') ? ' (pack-a-punched)' : ''}`,
        `infra     ${PROJECTS.length} projects · ${live} live`,
        `rank      emerald iii (r6 siege)`,
        `boss      consort radahn · 6 tries`,
        `lore      treyarch zombies, one piece`,
        `theme     ${ctx.theme}`,
        `clearance ${cl.title}${ctx.root ? ' · root' : ''}`,
      ]
      const rows = Math.max(art.length, info.length)
      return {
        lines: Array.from({ length: rows }, (_, i) => ({
          text: `${(art[i] ?? '').padEnd(19)}   ${info[i] ?? ''}`,
          tone: i < art.length ? ('accent' as Tone) : ('default' as Tone),
          art: true,
        })),
      }
    }

    case 'theme': {
      const t = arg.toLowerCase()
      if (!t) return { lines: [{ text: `current: ${ctx.theme}. yours: ${ctx.themes.join(', ')}`, tone: 'dim' }] }
      if (!isTheme(t)) return { lines: [{ text: `theme: unknown "${t}". yours: ${ctx.themes.join(', ')}`, tone: 'err' }] }
      if (!ctx.themes.includes(t)) {
        return { lines: [{ text: `theme: ${t} is locked. some easter egg unlocks it (type eggs).`, tone: 'err' }] }
      }
      return { lines: [{ text: `phosphor → ${t}`, tone: 'ok' }], effects: { theme: t } }
    }

    case 'play': {
      const g = arg.toLowerCase()
      if (g === 'oncall' || g === 'on-call') return { lines: [{ text: 'paging you in.', tone: 'warn' }], effects: { play: 'oncall', close: true } }
      if (g === 'typing' || g === 'type') return { lines: [{ text: 'typing test: type the line below. the timer starts on your first key.', tone: 'dim' }], effects: { play: 'typing' } }
      return { lines: [{ text: 'games: play oncall · play typing', tone: 'dim' }] }
    }

    case 'eggs': {
      const cl = clearance(ctx.eggs)
      const lines: Line[] = [
        { text: `clearance: ${cl.title}  ·  ${ctx.eggs.length}/${EGGS.length} found  ·  ${cl.xp}/${MAX_XP} xp`, tone: 'accent' },
      ]
      for (const tier of ['easy', 'medium', 'hard'] as const) {
        lines.push({ text: '' }, { text: `${tier}  (${tier === 'easy' ? 1 : tier === 'medium' ? 2 : 4} xp)`, tone: 'dim' })
        for (const e of EGGS.filter((x) => x.tier === tier)) {
          const got = ctx.eggs.includes(e.id)
          lines.push(
            got
              ? { text: `  ✓ ${e.name.padEnd(22)} → ${e.reward.label}`, tone: 'ok' }
              : { text: `  · ${e.hint}`, tone: 'default' }
          )
        }
      }
      if (ctx.quests.poneglyphs.length && !ctx.eggs.includes('onepiece')) {
        lines.push({ text: '' }, { text: `road poneglyphs: ${ctx.quests.poneglyphs.length}/4`, tone: 'dim' })
      }
      if (ctx.eggs.length === EGGS.length) {
        lines.push({ text: '' }, { text: 'every egg. one door is still closed.', tone: 'err', glitch: true })
      }
      return { lines }
    }

    case 'fortune':
      if (!has('fortune')) return locked('fortune')
      return { lines: [{ text: FORTUNES[Math.floor(Math.random() * FORTUNES.length)] }] }

    case 'crt': {
      if (!has('crt')) return locked('crt')
      const on = arg ? arg === 'on' : !ctx.crt
      return { lines: [{ text: `tube mode ${on ? 'on' : 'off'}.`, tone: 'ok' }], effects: { crt: on } }
    }

    case 'chaos': {
      if (!has('chaos')) return locked('chaos')
      const causes: IncidentCause[] = ['ddos', 'forkbomb', 'shutdown', 'button']
      return {
        lines: [{ text: 'rolling the dice…', tone: 'warn' }],
        effects: { incident: causes[Math.floor(Math.random() * causes.length)], close: true },
      }
    }

    case 'bounty':
      if (!ctx.eggs.includes('onepiece')) return locked('bounty')
      return { lines: BOUNTY }

    case 'history':
      return { lines: ctx.history.map((h, i) => ({ text: `${String(i + 1).padStart(4)}  ${h}`, tone: 'dim' as Tone })) }

    case 'clear':
    case 'cls':
      return { lines: [], effects: { clear: true } }

    case 'date':
      return { lines: [{ text: new Date().toString() }] }

    case 'uptime':
      return { lines: [{ text: `up ${fmtUptime(performance.now() - ctx.bootedAt)}, 1 user` }] }

    case 'echo':
      return { lines: [{ text: arg }] }

    case 'logout':
      return { lines: [{ text: 'logged out. you are a visitor again.', tone: 'dim' }], effects: { username: null } }

    case 'exit':
    case 'quit':
      return { lines: [], effects: { close: true } }
  }

  // Greetings get an instant, friendly answer (and make it obvious there's an AI here).
  if (/^(hi+|hey+|hello+|yo+|sup|hiya|howdy|salam|salaam|good (morning|afternoon|evening)|thanks?|thank you|ty)[!.? ]*$/i.test(input)) {
    const thanks = /^(thanks?|thank you|ty)/i.test(input)
    return {
      lines: [
        {
          text: thanks
            ? 'anytime. ask me anything else about mohamed, or type help to look around.'
            : `hey${ctx.username ? ` ${ctx.username}` : ''}. i'm snaggy, an ai assistant that knows mohamed's work.`,
          tone: 'default',
        },
        ...(thanks
          ? []
          : [
              { text: 'ask me anything in plain english, like "what did he build at cira?" or "what is air property?"', tone: 'dim' as Tone },
              { text: 'or poke around: help · ls projects · play typing · eggs', tone: 'dim' as Tone },
            ]),
      ],
    }
  }

  // Only things that really look like shell commands get "command not found"; everything else is a question for the ai.
  const UNIX = /^(mkdir|touch|rmdir|mv|cp|chmod|chown|ssh|scp|git|npm|npx|yarn|pnpm|pip|python|node|apt|apt-get|brew|curl|wget|ping|top|htop|kill|ps|man|grep|find|tail|head|nano|emacs|cd\.\.|ifconfig|ipconfig|whois|sl)$/i
  if (!/\s/.test(input) && UNIX.test(cmd)) {
    return {
      lines: [
        { text: `snaggy: ${cmd}: not installed on this box.`, tone: 'err' },
        { text: "type help for what works here, or just ask me in plain english, i'm an ai.", tone: 'dim' },
      ],
    }
  }
  return null
}

/** Tab completion for commands and paths. */
export function complete(input: string, ctx: Pick<Ctx, 'cwd' | 'files'>): string {
  const parts = input.split(/\s+/)
  if (parts.length <= 1) {
    const hit = COMMAND_NAMES.filter((c) => c.startsWith(parts[0] ?? ''))
    return hit.length === 1 ? `${hit[0]} ` : input
  }
  const last = parts[parts.length - 1]
  const dirPart = last.includes('/') ? last.slice(0, last.lastIndexOf('/') + 1) : ''
  const stem = last.slice(dirPart.length)
  const node = lookup(buildFs(ctx), resolve(ctx.cwd, dirPart))
  if (!node || node.kind !== 'dir') return input
  const hits = Object.keys(node.children).filter((n) => n.startsWith(stem) && (stem.startsWith('.') || !n.startsWith('.')))
  if (hits.length !== 1) return input
  const done = node.children[hits[0]].kind === 'dir' ? `${hits[0]}/` : hits[0]
  return [...parts.slice(0, -1), dirPart + done].join(' ')
}

/** Short words pulled from a question, used to render the "searching" step before an AI answer. */
export function keywords(q: string): string {
  const stop = new Set(['what', 'whats', 'which', 'does', 'did', 'have', 'about', 'with', 'that', 'this', 'from', 'your', 'mohamed', 'mohameds', 'tell', 'show', 'there', 'the', 'and', 'for', 'how', 'his', 'him', 'are', 'was', 'project', 'projects'])
  const words = q
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stop.has(w))
  return words.slice(0, 3).join(' ') || 'portfolio'
}

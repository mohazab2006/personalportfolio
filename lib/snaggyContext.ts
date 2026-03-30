import {
  EDUCATION,
  EXPERIENCE,
  FEATURED_SLUGS_ORDERED,
  LEADERSHIP,
  PERSONAL,
  PROJECTS,
  TECH_STACK,
} from '@/lib/data'

const PHONE = '(613) 619-5360'

function clip(s: string, max: number): string {
  const t = s.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1).trim()}…`
}

function formatProjectLine(p: (typeof PROJECTS)[number]): string {
  const demo = p.demo ? ` Live/demo: ${p.demo}.` : ''
  const gh = p.github ? ` Repo: ${p.github.replace('https://github.com/', 'github.com/')}.` : ''
  return `${p.title} — ${clip(p.description, 260)} Stack includes: ${p.stack.slice(0, 10).join(', ')}.${demo}${gh}`
}

function featuredProjectSlugs(): Set<string> {
  return new Set(FEATURED_SLUGS_ORDERED.map((s) => s.toLowerCase()))
}

function buildProjectsBlock(): string {
  const featured = FEATURED_SLUGS_ORDERED.map((slug) => PROJECTS.find((p) => p.slug.toLowerCase() === slug.toLowerCase())).filter(
    Boolean
  ) as typeof PROJECTS

  const featLines = featured.map((p, i) => `${i + 1}. ${formatProjectLine(p)}`)

  const featSet = featuredProjectSlugs()
  const rest = PROJECTS.filter((p) => !featSet.has(p.slug.toLowerCase()))
  const restLines = rest.length ? ['OTHER PROJECTS ON THIS SITE:', ...rest.map((p) => `- ${formatProjectLine(p)}`)] : []

  return [`FEATURED ORDER (matches portfolio hero/grid):`, ...featLines, ...restLines].join('\n')
}

function buildWorkBlock(): string {
  return EXPERIENCE.map((e) => {
    const bits = e.bullets.slice(0, 3).join(' ')
    return `- ${e.role}, ${e.org} — ${e.dates}. ${bits}${e.upcoming ? ' (upcoming).' : ''}`
  }).join('\n')
}

function buildLeadershipBlock(): string {
  return LEADERSHIP.map((e) => {
    const bits = e.bullets.slice(0, 2).join(' ')
    return `- ${e.role}, ${e.org} — ${e.dates}. ${bits}`
  }).join('\n')
}

function buildEducationBlock(): string {
  return EDUCATION.map((ed) => {
    const g = ed.gpa ? ` ${ed.gpa}.` : ''
    return `- ${ed.degree} — ${ed.school}, ${ed.years}.${g}`
  }).join('\n')
}

function buildTechBlock(): string {
  return Object.entries(TECH_STACK)
    .map(([cat, items]) => `${cat}: ${items.join(', ')}.`)
    .join('\n')
}

/** System prompt built from live `lib/data.ts` so Snaggy stays aligned with the site. */
export function buildSnaggySystemPrompt(): string {
  return `You are Snaggy, Mohamed Azab's professional AI assistant on his portfolio site. Answer only from the facts below. If something isn't listed, say you're not sure and suggest emailing him.

PERSONALITY: Friendly, concise, credible. About 2–4 sentences unless asked for a list. Redirect off-topic chats politely.

ABOUT (from site data):
- Name: ${PERSONAL.name}
- Email: ${PERSONAL.email}
- GitHub: ${PERSONAL.github}
- LinkedIn: ${PERSONAL.linkedin}
- University: ${PERSONAL.university}
- Phone: ${PHONE}
- Background to mention if relevant: born in Cairo, Egypt; moved to Canada around age 10; coding sparked by games/scripting; basketball player and coach. Languages: English & Arabic fluent, French working proficiency.
- Tagline (tone only, not a bio to quote verbatim): ${clip(PERSONAL.tagline, 220)}

EDUCATION:
${buildEducationBlock()}

WORK:
${buildWorkBlock()}

LEADERSHIP & EXTRACURRICULAR:
${buildLeadershipBlock()}

PROJECTS:
${buildProjectsBlock()}

TECH STACK (grouped — never assign percentages or expert/intermediate tiers):
${buildTechBlock()}

THIS WEBSITE: Recruiter-focused Next.js portfolio — terminal-style hero, featured projects, experience (work & leadership), education section with coursework, tech stack, contact. You are Snaggy, a supporting assistant; answers use a Groq-hosted LLM plus this context and may be wrong — verify important facts on the site or resume.

RULES:
- Never invent employers, dates, or projects not shown above.
- For “what’s on the resume but not the site”: say he may have more on his full resume and to email.
- Encourage email for hiring and collaboration.
- Keep answers grounded; no skill % or invented metrics.`
}

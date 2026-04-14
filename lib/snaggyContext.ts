import {
  EDUCATION,
  EXPERIENCE,
  FEATURED_SLUGS_ORDERED,
  LEADERSHIP,
  PERSONAL,
  PROJECTS,
  TECH_STACK,
} from '@/lib/data'
import { projectHook, projectOverviewText } from '@/lib/projects'

const PHONE = '(613) 619-5360'

function clip(s: string, max: number): string {
  const t = s.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1).trim()}…`
}

function formatProjectLine(p: (typeof PROJECTS)[number]): string {
  const demo = p.demo ? ` Live/demo: ${p.demo}.` : ''
  const gh = p.github ? ` Repo: ${p.github.replace('https://github.com/', 'github.com/')}.` : ''
  const hook = projectHook(p)
  const body = projectOverviewText(p)
  const headline = hook ? `${clip(hook, 180)} Overview: ${clip(body, 280)}` : clip(p.description, 280)
  return `${p.title} — ${headline} Stack includes: ${p.stack.slice(0, 10).join(', ')}.${demo}${gh}`
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

/** Explicit founder/startup anchor so questions like "your startup" or "Air Property" map cleanly (details still in PROJECTS). */
function buildStartupBlock(): string | null {
  const ap = PROJECTS.find((p) => p.slug === 'air-property')
  if (!ap) return null
  const url = ap.demo?.trim()
  const hook = projectHook(ap)
  const elevator = hook ? clip(hook, 260) : clip(projectOverviewText(ap), 260)
  return [
    `- Founder: Mohamed — ${ap.title}${url ? ` · ${url}` : ''}.`,
    `- Elevator: ${elevator}`,
    `- Deeper detail, stack, and links: first entry under PROJECTS (FEATURED ORDER). Not the same as freelance/client work (see WORK: AmanahTech) unless the visitor asks how everything fits together.`,
  ].join('\n')
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
  return `You are Snaggy, Mohamed Azab's AI sidekick on his portfolio site. Answer only from the facts below. If something isn't listed, say you're not sure and suggest emailing him.

PERSONALITY: Friendly, credible, and lightly funny. Humor should be subtle and occasional, not constant. Prefer dry wit over punchlines. Never force a joke, never be corny, never be mean/snarky at the visitor, and avoid edgy humor. If no natural joke fits, skip humor entirely and be straight.

HOW TO EXPLAIN PROJECTS (do this unless the user only wants one angle):
- Start with **plain English**: what the thing does, who it's for, why it matters—like you're explaining to a smart friend who doesn't code. Use analogies sparingly and only when they genuinely clarify.
- Then add **the technical side**: name concrete pieces from the PROJECTS entry (languages, frameworks, databases, APIs, Docker, etc.) and what each layer does in practice—tie jargon to outcomes (e.g. "Supabase for auth and data" not buzzword soup).
- You may rephrase long descriptions into simpler words; do **not** invent features, clients, employers, or numbers that aren't supported by the context.

LENGTH: Default 2–4 sentences, concise and direct. Expand only when the user explicitly asks for detail/deep dive/full breakdown/step-by-step. For project explainers, keep it brief first and offer to go deeper. Use lists only when asked for comparisons or "all projects."

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

WORK NAME NOTE (if someone asks what “AmanahTech” / “Amanah” means or how it translates):
- It reflects Arabic أمانة (romanized “amanah”): trust, honesty, or integrity—not a random brand syllables.

LEADERSHIP & EXTRACURRICULAR:
${buildLeadershipBlock()}

STARTUP (use for founding, "your startup", Air Property, property-owner/manager marketplace — full stack/copy also in PROJECTS):
${buildStartupBlock() ?? '- (No startup row in site data.)'}

PROJECTS:
${buildProjectsBlock()}

TECH STACK (grouped — never assign percentages or expert/intermediate tiers):
${buildTechBlock()}

THIS WEBSITE: Recruiter-focused Next.js portfolio — terminal-style hero, featured projects, experience (work & leadership), education section with coursework, tech stack, contact. You are Snaggy, a supporting assistant; answers use a Groq-hosted LLM plus this context and may be wrong — verify important facts on the site or resume.

RULES:
- Never invent employers, dates, or projects not shown above.
- Questions about Air Property, founding, or "your startup": answer from STARTUP + the Air Property line in PROJECTS; do not invent traction, revenue, or launch dates not stated above.
- For “what’s on the resume but not the site”: say he may have more on his full resume and to email.
- Encourage email for hiring and collaboration.
- Keep answers grounded; no skill % or invented metrics.
- Funny is optional, not required. Do not add a joke to every response.
- Match the user's tone: if they are direct/serious, keep it direct/serious.
- If the user asks for "more detail" or similar, then provide a longer, more complete response.
- Funny is fine; lying for a joke is not—every factual claim must trace to the context above.`
}

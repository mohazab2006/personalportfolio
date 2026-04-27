<div align="center">

# Mohamed Azab — Portfolio

[**mohamedazab.dev**](https://mohamedazab.dev)

*An interactive portfolio meant to feel like a product—not a PDF on the web.*

</div>

---

## What it does

This site is my **public home on the internet**: visitors can browse **projects**, **experience**, and **education**, get a sense of **how I work**, and reach out—all in one flow. Instead of static blocks of text, the UI is built to **reward exploration**: motion, depth, and a conversational layer so people can ask questions in natural language instead of hunting through every section.

**Snaggy**, the embedded assistant, answers questions about my background, projects, and stack using **streaming replies**—so chatting feels immediate, not like filling out a form. Project content can be backed by **Supabase** when configured, so the showcase can stay fresh without redeploying for every tweak.

---

## Why I built it this way

- **Experience first** — Recruiters and collaborators often skim on phones or inside in-app browsers. The layout, scroll behavior, and animations are tuned so the site stays readable and stable where those environments are picky (touch, observers, embedded WebViews).

- **Conversation as an interface** — A portfolio should answer “who is this person?” quickly. Snaggy adds a second path: ask in your own words instead of parsing every section.

- **Craft without clutter** — 3D orbs, particles, and magnetic cursor details are there to signal care and technical range—not to distract. Heavy pieces load **lazily** so the first paint stays fast.

- **One codebase, real patterns** — Next.js App Router, typed content in `lib/data.ts`, API routes for the assistant, and optional Supabase for project data—the same kinds of choices I’d make on a client-facing product.

---

## What you’ll find on the site

| Area | Purpose |
|------|---------|
| **Hero & story** | Who I am and what I focus on |
| **Projects** | Selected work with stack and links |
| **Experience & education** | Timeline-style history |
| **Snaggy** | Ask about my path, projects, or tools |
| **Contact** | Ways to reach me |

Featured builds (among others): client and nonprofit sites, ML/security-oriented work, and infra I run myself—details live on the live site.

---

## Run it locally *(short)*

**Requirements:** Node **≥ 18.17**

```bash
npm install
npm run dev
```

Open **http://localhost:3000**.

**Environment:** Create `.env.local` with:

- `GROQ_API_KEY` — powers Snaggy (Groq API)
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY` — optional; project listing from Supabase when set

Without Supabase keys, the app can still run using bundled/local project data depending on your setup; without `GROQ_API_KEY`, the chat route won’t work until you add a key.

```bash
npm run build   # production build
npm run start   # serve production build
```

---

## Contact

**Mohamed Azab** — [mohamedazab.dev](https://mohamedazab.dev) · mohazab2006@gmail.com · [LinkedIn](https://www.linkedin.com/in/mohamedazabca/) · [GitHub](https://github.com/mohazab2006)

---

Built with Next.js, TypeScript, Tailwind, Framer Motion, R3F/Three.js, Lenis, Groq, and Supabase.

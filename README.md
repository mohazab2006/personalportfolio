<div align="center">

# Mohamed Azab — Portfolio

[**mohamedazab.dev**](https://mohamedazab.dev)

*A portfolio that runs like a server you're logged into.*

</div>

---

## What it is

My public home on the internet, built as an **ops console**: an amber-phosphor terminal that boots up, reports its own status, and hosts my work as if it were a fleet of running services.

If you're here to see what I've built, it gets out of your way: projects, experience, education, stack, and contact are all one scroll, readable on a phone, and nothing interactive ever blocks you.

If you're here to explore, it goes a lot deeper than that.

---

## What you'll find

| Area | What it does |
|------|--------------|
| **Boot sequence** | Services come up one by one, then `whoami`. Skippable, and it plays once per visit. |
| **Projects** | Each project is a "service": live ones show a real response time, pinged from your browser. |
| **Experience & education** | Read like logs, because that's what they are. |
| **Offline** | The person behind the work: how I play games (seriously), and what I nerd out on. |
| **Play** | **On-Call**: you hold the pager for a 45-second shift. Keep the fleet up. |
| **Snaggy** | Press `/` anywhere. A real shell over the portfolio (`ls`, `cd`, `cat`, `neofetch`) with an AI behind it for plain-English questions. |
| **Incidents** | You can take the whole site down. You'll then have to bring it back. |

---

## Things worth finding

There are **twelve easter eggs** on this site, in three tiers.

- **Easy** ones are hinted plainly. Open Snaggy and type `eggs`.
- **Medium** ones need a little lateral thinking.
- **Hard** ones are quests: a switch that's been left off, four stones that don't belong, a fight you're supposed to lose first.

Every one of them unlocks something real: a colour, a command, a file, a harder game mode. Find enough and your clearance goes up.

And then there's the thirteenth, which isn't on the list. It isn't hinted at in `eggs`, and the answer is not in this repository. If you go looking, start where a shell keeps the files it doesn't want you to see, and read everything. Browsers keep more secrets than people think.

*If you solve it, email me and tell me how you found the first key.*

---

## How it's built

- **Next.js (App Router) + TypeScript + Tailwind**, typed content in `lib/data.ts`, optional **Supabase** for project data.
- **Snaggy**: a small virtual filesystem and command set in `lib/shell.ts`; anything that isn't a command goes to `/api/chat` (Groq).
- **Theming**: one CSS variable (`--accent`) drives the whole palette, so themes are a single attribute swap with no flash on load.
- **Motion with restraint**: Framer Motion for choreography, everything honours `prefers-reduced-motion`, and heavy effects are skipped on touch devices.
- **Mobile first-class**: 16px inputs (no iOS zoom), a keyboard-aware chat sheet, 44px tap targets, and no horizontal overflow from 320px up.
- **The sealed egg** is AES-GCM with a PBKDF2-derived key. The site stores no passphrase and no hash, only ciphertext.

---

## Run it locally

**Requirements:** Node **22.x**

```bash
npm install
npm run dev
```

Open **http://localhost:3000**.

**Environment:** create `.env.local` with:

- `GROQ_API_KEY`: powers Snaggy's AI answers (Groq)
- `GROQ_MODEL` *(optional)*: Groq model for Snaggy; defaults to `openai/gpt-oss-120b`. Set this if Groq retires the default.
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY` *(optional)*: project listing from Supabase when set

Without Supabase keys the site uses the bundled project data. Without `GROQ_API_KEY` the shell still works; only the AI answers won't.

```bash
npm run build   # production build
npm run start   # serve production build
```

---

## Contact

**Mohamed Azab** · [mohamedazab.dev](https://mohamedazab.dev) · mohazab2006@gmail.com · [LinkedIn](https://www.linkedin.com/in/mohamedazabca/) · [GitHub](https://github.com/mohazab2006)

---

Built with Next.js, TypeScript, Tailwind CSS, Framer Motion, Groq, and Supabase.

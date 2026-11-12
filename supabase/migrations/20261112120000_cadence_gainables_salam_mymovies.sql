-- Rename StudynFlow -> Cadence (slug kept so storage images and URLs still resolve),
-- add the public Gainables repo and correct its route, and append Salam Society + myMovies.
-- Storage: upload previews to bucket `project-images` at
--   `salam-society/hero.png` and `mymovies/hero.png`

-- 1) Cadence (formerly StudynFlow)
UPDATE projects
SET
  title = 'Cadence',
  github = 'https://github.com/mohazab2006/Cadence-Desktop',
  summary = $s$Cross-platform AI desktop planner for students: weighted grade tracking, syllabus extraction, and focus suggestions driven by your actual performance—not just deadlines.$s$,
  description = $d$Cadence (formerly StudynFlow) is a local-first Tauri 2 + Rust desktop app with a React, TypeScript, and Tailwind frontend. All data lives on device in SQLite via the Tauri SQL plugin—no accounts or cloud sync.

Academic planning covers weighted grades with drop-lowest rules and final-grade planning that calculates the scores needed on remaining assessments. AI features include syllabus extraction (Tesseract.js OCR on PDFs or images pulls out assignments, dates, and weights), smart suggestions that flag at-risk courses from grade trends, natural-language task creation, and voice input. Separate School and Life workspaces, recurring tasks, a home dashboard with weather and a mini calendar, and a Ctrl+K command center round it out.$d$,
  stack = ARRAY['Tauri 2', 'Rust', 'React', 'TypeScript', 'Tailwind', 'Vite', 'SQLite', 'TanStack Query', 'Zod', 'Tesseract.js', 'OpenAI API']::TEXT[],
  updated_at = NOW()
WHERE slug = 'StudynFlow';

-- 2) Gainables: public repo + Montréal → Ottawa route
UPDATE projects
SET
  github = 'https://github.com/mohazab2006/gainables',
  summary = REPLACE(summary, 'Ottawa → Montreal', 'Montréal → Ottawa'),
  updated_at = NOW()
WHERE slug = 'gainables';

-- 3) Salam Society + myMovies: append to the grid
DO $$
DECLARE
  mx integer;
BEGIN
  SELECT COALESCE(MAX(order_index), -1) INTO mx FROM projects
  WHERE slug NOT IN ('salam-society', 'mymovies');

  INSERT INTO projects (slug, title, github, demo, summary, description, stack, screenshots, order_index)
  VALUES (
    'salam-society',
    'Salam Society Platform',
    'https://github.com/mohazab2006/salam-society',
    'https://salam-society.vercel.app',
    $s$Custom bilingual (EN/FR) web platform and admin CMS for Salam Society, an Ottawa Muslim community organization—built to replace a traditional CMS.$s$,
    $d$Public site covers events (upcoming and past), programs and initiatives, a community gallery, partners, and a contact form with real email delivery via Nodemailer. A private admin dashboard lets non-technical organizers create, edit, publish, and delete content and upload media, with server actions and cache revalidation so changes appear instantly.

Built on the Next.js App Router with server components, Supabase Postgres and Storage, and row-level security policies for safe public vs. admin access. Tested with Vitest and Testing Library; deployed on Vercel.$d$,
    ARRAY['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Row-Level Security', 'Tailwind CSS', 'Framer Motion', 'Nodemailer', 'Vitest', 'i18n (EN/FR)', 'Vercel']::TEXT[],
    ARRAY['hero.png']::TEXT[],
    mx + 1
  ),
  (
    'mymovies',
    'myMovies',
    'https://github.com/mohazab2006/myMovies',
    NULL,
    $s$AI movie discovery: describe what you are in the mood for in plain English and get ranked picks, each with a short explanation of why it fits.$s$,
    $d$A Next.js + TypeScript app that turns a natural-language request into structured preferences with OpenAI (gpt-4o-mini), queries TMDB using genre, rating, runtime, and release-year filters, then has the model rank candidates and explain each match. When a query is too narrow, an AI-driven broadening step suggests alternative genres and keywords instead of falling back to plain text search.

Also includes movie search, trending titles, seasonal picks (Halloween in October, holiday films in December), detail pages, and a browser-stored watchlist. API clients for OpenAI and TMDB are covered by a Jest test suite.$d$,
    ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'OpenAI API', 'TMDB API', 'Jest', 'Prompt engineering']::TEXT[],
    ARRAY['hero.png']::TEXT[],
    mx + 2
  )
  ON CONFLICT (slug)
  DO UPDATE SET
    title = EXCLUDED.title,
    github = EXCLUDED.github,
    demo = EXCLUDED.demo,
    summary = EXCLUDED.summary,
    description = EXCLUDED.description,
    stack = EXCLUDED.stack,
    screenshots = EXCLUDED.screenshots,
    order_index = EXCLUDED.order_index,
    updated_at = NOW();
END $$;

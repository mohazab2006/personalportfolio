-- Rename StudynFlow -> Cadence (slug kept so storage images and URLs still resolve),
-- and add the public Gainables repo and correct its route.

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

-- Add short hook column; keep long copy in `description`.
-- After this runs: fill `summary` in the Table Editor (cards + TL;DR), put the full story in `description` (detail Overview).
-- Empty `summary` is allowed: the app falls back to the old `---` split inside `description`, or the first sentence.

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS summary TEXT NOT NULL DEFAULT '';

COMMENT ON COLUMN projects.summary IS 'Short hook for project cards and TL;DR on the detail page.';
COMMENT ON COLUMN projects.description IS 'Full project overview on the detail page (what it is, how it works).';

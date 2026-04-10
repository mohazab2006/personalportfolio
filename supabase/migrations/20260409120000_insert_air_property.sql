-- Air Property — upsert into `projects` (matches `supabase/schema.sql` + summary column).
-- Storage: upload preview to bucket `project-images` at path `air-property/hero.jpg` (see `getProjectImageUrl` in lib/projects.ts).
--
-- If you want this row to sort first everywhere `order_index` is used, set `order_index = 0`
-- and bump other rows, e.g. before insert:
--   UPDATE projects SET order_index = order_index + 1 WHERE order_index >= 0;

INSERT INTO projects (
  slug,
  title,
  github,
  demo,
  summary,
  description,
  stack,
  screenshots,
  order_index
)
VALUES (
  'air-property',
  'Air Property',
  '',
  'https://www.airproperty.ca/',
  'Stop guessing. Start verifying — AirProperty is my startup building a verify-first marketplace that connects Canadian property owners with certified property managers.',
  'Managers complete training, assessment, and background checks before they can appear in search; owners browse verified profiles, send requests, and keep conversations in-app instead of scattered across texts. The product direction includes shared dashboards, structured tasks and messaging, and reputation tied to real engagements — launching in Canada with city-limited early access and a waitlist for owners and managers.',
  ARRAY[
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
    'SEO',
    'Startup',
    'Product',
    'Canada'
  ]::TEXT[],
  ARRAY['hero.jpg']::TEXT[],
  0
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

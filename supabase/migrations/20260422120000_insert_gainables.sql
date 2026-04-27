-- Gainables — Ride for Mental Health (campaign / live tracker site).
-- Grid order: immediately after `empower-orphans-website-v2` (matches `lib/data.ts`).
-- Storage: upload preview to bucket `project-images` at path `gainables/hero.png`
--
-- Inserts or updates the row, shifts `order_index` so nothing collides, then pins Gainables
-- right after Empower Orphans. Requires `empower-orphans-website-v2` to exist first.

DO $$
DECLARE
  ei integer;
BEGIN
  SELECT order_index INTO ei FROM projects WHERE slug = 'empower-orphans-website-v2';
  IF ei IS NULL THEN
    RAISE EXCEPTION 'missing projects row slug=empower-orphans-website-v2 (seed projects first)';
  END IF;

  UPDATE projects SET order_index = order_index + 1
  WHERE order_index > ei AND slug <> 'gainables';

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
    'gainables',
    'Gainables — Ride for Mental Health',
    '',
    NULL,
    $s$Campaign site for Gainables' Ottawa → Montreal Ride for Mental Health: live GPS on a Mapbox tracker, a GSAP-driven biker timeline, donation totals, sponsors, and Supabase-backed content with an email-allowlisted admin.$s$,
    $d$Built with Next.js and Tailwind v4. Real-time rider positions flow from the Overland mobile app into a Supabase Edge Function (ingest-position), then Mapbox GL JS renders the route, checkpoints, and animated rider marker; the landing page centers a bold hero and scroll-driven timeline, donation strip with live goal progress, mission and sponsor strips, email signup (optional Resend), and FAQ. Admin covers ride content, media links, sponsors, subscribers, donations configuration, and exports — all grounded in Supabase Auth/Postgres with cache-friendly server rendering.$d$,
    ARRAY[
      'Mapbox live map',
      'GPS + Overland ingest',
      'Supabase Edge Functions',
      'Realtime positions',
      'GSAP biker timeline',
      'Live donation strip',
      'Allowlisted admin',
      'Next.js 16'
    ]::TEXT[],
    ARRAY['hero.png']::TEXT[],
    ei + 1
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

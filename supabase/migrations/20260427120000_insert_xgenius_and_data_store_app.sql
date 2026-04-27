-- XGenius (featured right after Air Property) + Data Store App (grid with other projects).
-- Storage: `project-images` bucket — `xgenius/hero.jpg`, `data-store-app/hero.jpg`

-- 1) XGenius: pin directly after `air-property` (shift later rows).
DO $$
DECLARE
  ap integer;
BEGIN
  SELECT order_index INTO ap FROM projects WHERE slug = 'air-property';
  IF ap IS NULL THEN
    RAISE EXCEPTION 'missing projects row slug=air-property (seed projects first)';
  END IF;

  UPDATE projects SET order_index = order_index + 1
  WHERE order_index > ap AND slug <> 'xgenius';

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
    'xgenius',
    'XGenius',
    'https://github.com/mohazab2006/XGenius',
    NULL,
    $s$AI-powered football analytics: World Cup match predictions, xG modeling, and Monte Carlo tournament simulation with an explainable insights layer.$s$,
    $d$XGenius combines expected-goals thinking, ML classifiers (e.g. win/draw/loss), statistical goal models, and large-scale probabilistic simulation so you can explore match probabilities and full-tournament outcomes—not just a single scoreline guess.

Monorepo-style stack: FastAPI serves prediction and simulation APIs (PostgreSQL for data); Python ML layer uses Pandas/NumPy, scikit-learn, and XGBoost; Next.js + Tailwind frontend for dashboards, head-to-head and tournament views; Docker for repeatable runs. Example API ideas: single-match prediction, tournament simulation with many runs, and team advancement odds—grounded in the same engine the UI consumes.$d$,
    ARRAY[
      'Python',
      'FastAPI',
      'Next.js',
      'Tailwind CSS',
      'PostgreSQL',
      'scikit-learn',
      'XGBoost',
      'Pandas',
      'NumPy',
      'Docker',
      'Monte Carlo',
      'Sports analytics'
    ]::TEXT[],
    ARRAY['hero.jpg']::TEXT[],
    ap + 1
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

-- 2) Data Store App: append after current max order (typical “normal” grid placement).
DO $$
DECLARE
  mx integer;
BEGIN
  SELECT COALESCE(MAX(order_index), -1) INTO mx FROM projects;

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
    'data-store-app',
    'Data Store App',
    'https://github.com/mohazab2006/data-store-app',
    NULL,
    $s$Full-stack CRUD lab: Spring Boot + JDBC + MySQL API with a Vite React TypeScript UI—built to master low-level SQL before comparing ORM approaches.$s$,
    $d$Monorepo with a Spring Boot backend and a Vite + React + TypeScript frontend. The REST API exposes user resources with proper HTTP status handling; the backend uses JDBC with prepared statements for create/read/update/delete against MySQL, plus validation and CORS for local dev. Axios drives the UI; Tailwind styles the forms and lists.

Deliberately JDBC-first to understand how requests map to SQL and connections; README outlines a future Hibernate pass for contrast. Good for demonstrating solid Java/SQL fundamentals, API design, and a clean split between client and server.$d$,
    ARRAY[
      'Spring Boot',
      'Java',
      'JDBC',
      'MySQL',
      'React',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'Axios',
      'REST API'
    ]::TEXT[],
    ARRAY['hero.jpg']::TEXT[],
    mx + 1
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

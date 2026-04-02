-- SentinelStack AI project entry (upsert-safe)
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
  'sentinelstack-ai',
  'SentinelStack AI',
  'https://github.com/mohazab2006/SentinelStack',
  NULL,
  'Your own mini cybersecurity command center. It watches activity, detects weird behavior, and tells you what''s going on and what to do about it.',
  'AI-powered cybersecurity platform designed to simulate SOC workflows end-to-end: traffic ingestion, deterministic detections, anomaly analysis, severity fusion, and automated response. Built as a Dockerized multi-service stack with a Next.js SOC dashboard, FastAPI detection services, PostgreSQL persistence, and NGINX routing. The platform combines rule-based threat detection with ML-based behavioral anomaly scoring, then enriches alerts with OpenAI-assisted triage summaries and action recommendations. This project strengthened my applied security engineering skills across detection pipelines, explainable risk scoring, response automation, and production-style service orchestration.',
  ARRAY[
    'Next.js',
    'TypeScript',
    'Python',
    'FastAPI',
    'scikit-learn',
    'PostgreSQL',
    'Docker',
    'NGINX',
    'OpenAI API',
    'Cybersecurity'
  ]::TEXT[],
  ARRAY['hero.jpg', 'screen-1.jpg', 'screen-2.jpg', 'screen-3.jpg', 'screen-4.jpg', 'screen-5.jpg']::TEXT[],
  3
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

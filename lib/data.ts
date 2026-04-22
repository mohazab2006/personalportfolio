// Type Definitions
export type Project = {
  slug: string
  title: string
  github: string // required if repo exists, else ""
  demo?: string
  /** Short hook when using Supabase columns; optional for local-only rows. */
  summary?: string
  description: string
  stack: string[]
  screenshots: string[] // at least ["hero.jpg"]
}

export type ExperienceItem = {
  role: string
  org: string
  dates: string
  bullets: string[]
  tags?: string[]
  logo?: string // optional logo path (e.g., '/logos/cira.svg')
  upcoming?: boolean // for future positions
}

export type EducationItem = {
  degree: string
  school: string
  years: string
  gpa?: string
  courses?: string[]
  logo?: string // optional logo path (e.g., '/logos/carleton.png')
  tags?: string[] // optional pills (e.g. AI/ML, Cybersecurity)
}

export type InterestItem = {
  icon: string
  title: string
  text: string
}

export type ServiceItem = {
  icon: string
  title: string
  description: string
}

/** Public resume URL: env override, else local domain route. */
export const RESUME_PDF_URL =
  process.env.NEXT_PUBLIC_RESUME_PDF_URL ??
  '/resume.pdf'

// Personal Information
export const PERSONAL = {
  name: 'Mohamed Azab',
  email: 'mohazab2006@gmail.com',
  github: 'https://github.com/mohazab2006',
  linkedin: 'https://www.linkedin.com/in/mohamedazabca/',
  university: 'Carleton University',
  tagline:
    "Hello, my name is Mohamed Azab — I'm a Computer Science student at Carleton University (AI & ML). A passionate learner who enjoys building reliable, well-designed software.",
  resumePdf: RESUME_PDF_URL,
  heroFallback: '/hero-fallback.png',
}

// Navigation Links (matches docs/information-architecture.md)
export const NAV_LINKS = ['Projects', 'Experience', 'Education', 'Stack', 'Contact']

// About Section
export const ABOUT_TEXT = `I'm Mohamed Azab, a Computer Science student at Carleton University specializing in AI & Machine Learning with a focus on Cybersecurity. I'm passionate about building modern, performant web applications and exploring the intersection of software engineering, artificial intelligence, and security.

With a strong foundation in full-stack development and a growing expertise in machine learning, I enjoy tackling complex problems and creating solutions that make a real impact. Whether it's developing interactive web experiences, implementing secure infrastructure, or experimenting with AI models, I'm always eager to learn and push the boundaries of what's possible.`

export const SERVICES: ServiceItem[] = [
  {
    icon: '🌐',
    title: 'Web Development',
    description:
      'Full-stack apps with Next.js, React, and Tailwind. I\'ve built client sites, nonprofit platforms, and personal projects—handling frontend, backend, databases, and deployment.',
  },
  {
    icon: '🤖',
    title: 'AI & Machine Learning',
    description:
      'AI is the future—I\'m learning how it transforms cybersecurity, automation, and everything in between. Love experimenting with models (like Snaggy on this site) and building tools that actually think.',
  },
  {
    icon: '🔒',
    title: 'Security & Infrastructure',
    description:
      'I approach systems with a security-first mindset, focusing on threat models, attack surfaces, safe defaults, and proven security methodologies. Security is built into every project from day one, not an afterthought.',
  },
]

// Education
export const EDUCATION: EducationItem[] = [
  {
    degree: 'B.Comp (Honours), AI & Machine Learning + Cybersecurity, Minor in Business',
    school: 'Carleton University — Ottawa, ON',
    years: '2024 – 2028 (Expected)',
    gpa: 'GPA: 10.80 / 12.00',
    courses: [
      'Data Structures',
      'Systems Programming (C)',
      'Software Engineering (C++)',
      'Imperative Programming (Python)',
      'OOP (Java)',
      'Linear Algebra',
      'Discrete Structures',
      'Calculus',
      'Probability Models',
      'Algorithms',
    ],
    logo: '/logos/carleton.png',
    tags: ['AI & Machine Learning', 'Cybersecurity', 'Business Minor', 'Honours', 'Ottawa'],
  },
]

// Projects
export const PROJECTS: Project[] = [
  {
    slug: 'air-property',
    title: 'Air Property',
    github: '',
    demo: 'https://www.airproperty.ca/',
    description:
      'Stop guessing. Start verifying — AirProperty is my startup building a verify-first marketplace that connects Canadian property owners with certified property managers.\n\n---\n\nManagers complete training, assessment, and background checks before they can appear in search; owners browse verified profiles, send requests, and keep conversations in-app instead of scattered across texts. The product direction includes shared dashboards, structured tasks and messaging, and reputation tied to real engagements — launching in Canada with city-limited early access and a waitlist for owners and managers.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'SEO', 'Startup', 'Product', 'Canada'],
    screenshots: ['hero.jpg'],
  },
  {
    slug: 'knowledge-mesh',
    title: 'KnowledgeMesh',
    github: 'https://github.com/mohazab2006/KnowledgeMesh',
    demo: '',
    description:
      'Workspace-scoped knowledge product: upload documents, index in the background, then ask in natural language and get answers backed by real passages with citations. Multi-service RAG stack with a gateway for auth, ingestion, retrieval, and LLM calls; PostgreSQL with pgvector for embeddings; Redis-backed ingestion queue; worker pipeline for extract, chunk, and embed; Next.js frontend with semantic search, citation-backed answers, optional MMR reranking, and SSE streaming.',
    stack: ['RAG', 'Ollama', 'Next.js', 'Redis', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'pgvector', 'Docker', 'NGINX', 'OpenAI API'],
    screenshots: ['hero.jpg', 'screen-1.jpg', 'screen-2.jpg', 'screen-3.jpg'],
  },
  {
    slug: 'path-to-offer-ai',
    title: 'PathToOffer AI',
    github: 'https://github.com/mohazab2006/PathToOfferAI',
    demo: '',
    description:
      'AI job-application assistant that parses job descriptions, scores your resume, generates optimized versions and tailored cover letters, and exports polished PDFs for real applications.',
    stack: ['Next.js', 'Tailwind', 'FastAPI', 'Python', 'OpenAI GPT-4o', 'SQLite', 'ReportLab'],
    screenshots: ['hero.jpg', 'screen-1.jpg', 'screen-2.jpg', 'screen-3.jpg', 'screen-4.jpg', 'screen-5.jpg'],
  },
  {
    slug: 'StudynFlow',
    title: 'StudynFlow',
    github: 'https://github.com/mohazab2006/StudynFlow',
    demo: '',
    description:
      'Local-first desktop productivity app for students, combining School/Life workspaces, recurring templates, weather + calendar dashboard, AI-powered syllabus parsing, and flexible grade tracking with RapidTables-like calculations.',
    stack: ['Tauri', 'Rust', 'React', 'OpenAi', 'TypeScript', 'Tailwind', 'SQLite', 'TanStack Query', 'React Router', 'Zod'],
    screenshots: ['hero.jpg', 'screen-1.jpg', 'screen-2.jpg'],
  },
  {
    slug: 'ht-clean-website-v1',
    title: 'HT Clean Website V1',
    github: 'https://github.com/mohazab2006/HT-Clean-V1',
    demo: 'https://htclean.ca/',
    description:
      'A comprehensive service-booking platform for HT Clean, a premium cleaning company specializing in car detailing and property maintenance. The website features real-time scheduling capabilities, instant quote generation, and seamless lead capture functionality. Built with a mobile-first approach and optimized for SEO, the platform streamlines customer bookings and business operations. The site showcases professional cleaning services including car detailing, window cleaning, and power washing services, with integrated contact forms and social media integration. The modern, responsive design ensures excellent user experience across all devices while maintaining fast loading times and secure data handling.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Supabase', 'Docker', 'REST API', 'SEO', 'Booking'],
    screenshots: ['hero.jpg', 'screen-1.jpg', 'screen-2.jpg', 'screen-3.jpg', 'screen-4.jpg', 'screen-5.jpg'],
  },
  {
    slug: 'empower-orphans-website-v2',
    title: 'Empower Orphans Website V2',
    github: 'https://github.com/mohazab2006/Empower-Orphans-Website',
    demo: 'https://empowerorphans.com/',
    description:
      'A comprehensive nonprofit platform for Empower Orphans, a student-led organization mobilizing campus chapters to support orphaned children. The website features donation tracking with real-time progress bars, chapter management system for multiple universities (Carleton University, University of Ottawa), event coordination, and volunteer application forms. Built with role-based access control (RBAC) for chapter leaders and administrators, the platform enables transparent fundraising with clear goal setting and impact reporting. The site includes interactive donation forms, chapter-specific social media integration, contact management, and a responsive design optimized for student engagement and donor transparency.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Supabase', 'Docker', 'RBAC', 'Donations', 'Chapters'],
    screenshots: ['hero.jpg', 'screen-1.jpg', 'screen-2.jpg'],
  },
  {
    slug: 'sentinelstack-ai',
    title: 'SentinelStack AI',
    github: 'https://github.com/mohazab2006/SentinelStack',
    demo: '',
    description:
      'AI-powered cybersecurity platform designed to simulate SOC workflows end-to-end: traffic ingestion, deterministic detections, anomaly analysis, severity fusion, and automated response. Built as a Dockerized multi-service stack with a Next.js SOC dashboard, FastAPI detection services, PostgreSQL persistence, and NGINX routing. The platform combines rule-based threat detection with ML-based behavioral anomaly scoring, then enriches alerts with OpenAI-assisted triage summaries and action recommendations. This project strengthened my applied security engineering skills across detection pipelines, explainable risk scoring, response automation, and production-style service orchestration.',
    stack: ['Next.js', 'TypeScript', 'Python', 'FastAPI', 'scikit-learn', 'PostgreSQL', 'Docker', 'NGINX', 'OpenAI API', 'Cybersecurity'],
    screenshots: ['hero.jpg', 'screen-1.jpg', 'screen-2.jpg'],
  },
  {
    slug: 'personal-portfolio',
    title: 'Personal Portfolio',
    github: 'https://github.com/mohazab2006/personalportfolio',
    demo: '',
    description:
      'An interactive portfolio experience built to push the boundaries of modern web development, featuring Snaggy - a custom AI chatbot assistant powered by Groq\'s LLaMA 3.3 70B model. Snaggy acts as my personal AI representative, trained on my complete background, projects, skills, and experience, capable of answering questions about my journey from Egypt to Canada, coding origins through video games, basketball coaching experience, and technical expertise. The portfolio showcases cutting-edge web technologies including a custom cursor system with magnetic effects, 3D animated orbs using React Three Fiber, smooth page transitions with Framer Motion, real-time AI chat interface with fullscreen mode, sophisticated loader with progress animation, split timeline for experience/education, holographic cards, interactive particle background, and smooth scrolling with Lenis. The project demonstrates advanced full-stack development combining frontend animations, backend API integration, AI model implementation, and modern UX design patterns. Built as a passion project to explore the intersection of web development and artificial intelligence, showcasing both technical skills and creative problem-solving.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Framer Motion', 'Three.js', 'Groq AI', 'LLaMA', 'Lenis', 'AI Chat'],
    screenshots: ['hero.jpg'],
  },
  {
    slug: 'personal-home-server',
    title: 'Personal Home Server',
    github: '',
    demo: '',
    description:
      "A comprehensive self-hosted infrastructure project that became a deep learning journey in system administration, security, and DevOps. Built from scratch on Ubuntu, this server taught me Linux fundamentals, shell scripting with Bash, and Python automation. I learned Docker containerization to run multiple services, Nginx reverse proxy configuration for load balancing, and Let's Encrypt SSL certificate management for secure connections. The project expanded into cybersecurity with VPN setup for secure remote access, SSH key management, firewall configuration, and basic intrusion detection. I implemented automated backup systems, monitoring solutions, and learned about network security, port forwarding, and service hardening. This hands-on experience with real infrastructure taught me the importance of security-first thinking, system reliability, and the power of owning your own infrastructure rather than relying on third-party services.",
    stack: ['Ubuntu', 'Docker', 'Nginx', "Let's Encrypt", 'VPN', 'SSH', 'Bash', 'Python', 'DevOps', 'Self-Hosted'],
    screenshots: ['hero.jpg'],
  },
  {
    slug: 'ramibarbershop',
    title: 'Rami The Barber',
    github: 'https://github.com/mohazab2006/ramibarbershop',
    demo: 'https://ramithebarber.com',
    description:
      'Website for Rami The Barber, a barber shop in Ottawa (Barrhaven). Features a hero section, about Rami with photo and bio, services (Haircut & Beard, Haircut), before/after transformations, gallery, Game Tape videos, reviews, location and contact, and footer with booking CTA. The Book page offers full Square booking integration. Media (hero, gallery, transformations, videos, about photo, OG image) is served from Supabase Storage.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Supabase', 'Square', 'Booking', 'Storage', 'Barber'],
    screenshots: ['hero.jpg'],
  },
]

// Work Experience
export const EXPERIENCE: ExperienceItem[] = [
  {
    role: 'Junior DevOps Specialist — Co-op',
    org: 'CIRA (Canadian Internet Registration Authority)',
    dates: 'May 2026 – August 2026',
    bullets: [
      'Upcoming co-op position focusing on DevOps practices and infrastructure automation.',
      'Will contribute to CI/CD pipelines, cloud infrastructure, and deployment workflows.',
      'Joining the team managing Canada\'s .CA domain registry infrastructure.',
    ],
    tags: ['DevOps', 'CI/CD', 'Cloud', 'Infrastructure', 'Automation', '.CA Registry', 'Upcoming'],
    logo: '/logos/cira.png',
    upcoming: true,
  },
  {
    role: 'Co-Founder & Developer',
    org: 'KOVA',
    dates: 'October 2023 – Present',
    logo: '/logos/kova.jpg',
    bullets: [
      'Production web apps for clients—scalable architecture, auth, RBAC dashboards, and API integrations.',
      'AI-driven features: chatbots, automation, and data pipelines.',
      'Cloud & ops: Docker, NGINX, SSL/TLS, domains, firewalls, backups; CI/CD with GitHub Actions.',
    ],
    tags: ['Ottawa, ON', 'Next.js', 'TypeScript', 'Docker', 'NGINX', 'GitHub Actions', 'AI', 'RBAC', 'Full-Stack'],
  },
]

// Leadership / Extracurricular
export const LEADERSHIP: ExperienceItem[] = [
  {
    role: 'Co-President',
    org: 'Empower Orphans Foundation (Carleton)',
    dates: 'Sept 2024 – Present',
    bullets: [
      'Co-founded and lead a non-profit; coordinate events and partnerships.',
      'Built & maintain the organization website; improved donor engagement.',
      'Lead 30+ members & executives; expand community reach.',
    ],
    tags: ['Leadership', 'Nonprofit', 'Co-Founder', 'Web Dev', 'Fundraising', '30+ Members'],
    logo: '/logos/empower-orphans.png',
  },
  {
    role: 'Youth Program Director',
    org: 'Salam Society',
    dates: 'Sept 2025 – Present',
    bullets: [
      'Lead youth programs and initiatives focused on community and children.',
      'Coordinate programming and engagement for Salam Society.',
    ],
    tags: ['Leadership', 'Youth Programs', 'Children', 'Community', 'Salam Society'],
    logo: '/logos/salam-society.png',
  },
  {
    role: 'Executive Director',
    org: 'RISE Community',
    dates: 'Oct 2025 – Present',
    bullets: [
      'Lead overall direction for RISE: programs, partnerships, and volunteer teams.',
      'Own strategic planning and community outreach for Ottawa-area initiatives.',
    ],
    tags: ['Leadership', 'Executive Director', 'Community', 'RISE', 'Outreach'],
    logo: '/logos/rise-community.png',
  },
]

// Interests
export const INTERESTS: InterestItem[] = [
  {
    icon: '🖥️',
    title: 'Web Development',
    text: 'Modern, fast full-stack apps.',
  },
  {
    icon: '🤖',
    title: 'AI & ML',
    text: 'The future is here—I\'m obsessed with it.',
  },
  {
    icon: '🔒',
    title: 'Cybersecurity',
    text: 'Secure apps and infrastructure.',
  },
  {
    icon: '⚙️',
    title: 'DevOps & Infrastructure',
    text: 'CI/CD, Docker, infrastructure automation.',
  },
  {
    icon: '🛜',
    title: 'Networking',
    text: 'VPNs and reliable connections.',
  },
  {
    icon: '📊',
    title: 'Data Science',
    text: 'Analytics and visualization.',
  },
]

// Detailed stories for each interest
export const INTEREST_STORIES = {
  'Web Development': {
    title: 'From HTML to Self-Hosting: My Learning Journey',
    story: "My web development journey started with simple HTML and CSS, then I discovered JavaScript and everything changed. I began exploring libraries and frameworks, which led me to understand the importance of hosting and infrastructure. Frustrated with third-party hosting limitations and wanting complete control, I built my own personal home server. This hands-on approach taught me Linux administration, Docker orchestration, and the true power of owning your infrastructure. I'm constantly learning new frameworks and techniques, always pushing myself to build faster, more secure, and more scalable applications.",
    highlights: ['Started with HTML/CSS/JS', 'Explored libraries & frameworks', 'Built personal home server', 'Continuous framework learning', 'Infrastructure ownership']
  },
  'AI & ML': {
    title: 'The Future Is Already Here',
    story: "AI isn't just a trend—it's reshaping everything. I'm genuinely obsessed with understanding how it works and where it's going. I built Snaggy, the AI chatbot on this site, to prove to myself I could create something that actually thinks and responds intelligently. But that's just the start. I'm deep into learning how AI transforms cybersecurity—detecting threats, analyzing patterns, staying ahead of attackers. Every new model, every breakthrough, I'm there experimenting. This isn't just a career path for me; it's what I think about constantly.",
    highlights: ['Built Snaggy (this site\'s AI)', 'AI in cybersecurity', 'Experimenting with new models', 'Genuinely obsessed', 'Always learning']
  },
  'Cybersecurity': {
    title: 'Protecting Digital Assets',
    story: "Security isn't just about preventing attacks - it's about building trust and protecting valuable assets. Every website I develop has security as a core consideration from day one. I'm actively learning about business-related security practices, understanding how to protect sensitive data and maintain compliance. I'm also exploring AI-related security applications, learning how machine learning can enhance threat detection and response. From implementing proper authentication to securing APIs and databases, I believe that good security practices should be the foundation, not an afterthought.",
    highlights: ['Security-first development', 'Business security practices', 'AI-enhanced security', 'SSL & encryption expertise', 'Compliance & data protection']
  },
  'DevOps & Infrastructure': {
    title: 'Automation & Reliability',
    story: "I discovered DevOps and infrastructure management through necessity - managing multiple websites and services manually became overwhelming. Learning Docker, CI/CD pipelines, infrastructure automation, and monitoring tools transformed how I approach development. I'm actively learning about container orchestration, infrastructure as code, server provisioning, and advanced deployment strategies. The ability to build, scale, and maintain systems reliably is what makes modern web development truly powerful, and I'm constantly exploring new tools and methodologies to improve my workflow.",
    highlights: ['Docker containerization', 'CI/CD pipeline expertise', 'Infrastructure as code', 'Server automation', 'Continuous learning']
  },
  'Networking': {
    title: 'Connecting the Dots',
    story: "Understanding networking became crucial when I set up my home server. From configuring VPNs for secure remote access to optimizing network performance, I learned that good networking is the backbone of any reliable system. I'm actively learning about advanced networking concepts, security protocols, and how to design scalable network architectures. Whether it's ensuring fast load times for my websites or setting up secure connections for remote work, networking knowledge has been essential to my development journey.",
    highlights: ['VPN configuration', 'Network optimization', 'Security protocols', 'Remote access setup', 'Advanced networking concepts']
  },
  'Data Science': {
    title: 'Finding Insights in Data',
    story: "Data tells stories that numbers alone can't. Through my coursework and projects, I've learned to extract meaningful insights from complex datasets. I'm actively learning about advanced statistical methods, machine learning algorithms, and data visualization techniques. Whether it's analyzing user behavior on my websites or processing information for AI applications, data science helps me make informed decisions and build better user experiences. The combination of statistical analysis and programming opens up endless possibilities.",
    highlights: ['Statistical analysis', 'Machine learning algorithms', 'Data visualization', 'User behavior insights', 'Advanced analytics']
  }
}

// Tech Stack — grouped by category only (per docs/content-strategy.md: no ratings / percentages)
export const TECH_STACK: Record<string, string[]> = {
  Languages: ['TypeScript', 'JavaScript', 'Python', 'Rust', 'Java', 'C', 'C++', 'SQL', 'Bash', 'HTML/CSS'],
  Frameworks: [
    'Next.js',
    'React',
    'Vite',
    'Tauri',
    'Tailwind CSS',
    'Framer Motion',
    'FastAPI',
    'Node.js',
  ],
  'Infra / DevOps': ['Docker', 'Nginx', 'Linux', 'CI/CD', 'GitHub Actions', 'SSL/TLS', "Let's Encrypt", 'VPN'],
  Security: ['Kali Linux', 'Tailscale', 'UFW', 'RBAC', 'JWT', 'Proxmox', 'Cloudflare'],
  'AI / ML & data': [
    'OpenAI API',
    'Groq',
    'scikit-learn',
    'PostgreSQL',
    'MongoDB',
    'SQLite',
    'pgvector',
    'Redis',
    'Supabase',
  ],
  Tools: ['Git', 'VS Code', 'Vercel', 'Postman', 'VirtualBox', 'OpenStack'],
}

// Get all unique tech from projects
export const getAllTech = (): string[] => {
  const techSet = new Set<string>()
  PROJECTS.forEach((project) => {
    project.stack.forEach((tech) => techSet.add(tech))
  })
  return Array.from(techSet).sort()
}

// Get tech categories
export const getTechCategories = (): string[] => {
  return Object.keys(TECH_STACK)
}

/**
 * Projects UI: first slug gets the wide horizontal card; all others use the same image grid card.
 * (Remaining entries kept for ordering reference / chat context; layout uses only `[0]`.)
 */
export const FEATURED_SLUGS_ORDERED = [
  'air-property',
  'knowledge-mesh',
  'sentinelstack-ai',
  'path-to-offer-ai',
  'StudynFlow',
] as const

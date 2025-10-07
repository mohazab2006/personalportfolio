// Type Definitions
export type Project = {
  slug: string
  title: string
  github: string // required if repo exists, else ""
  demo?: string
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
}

export type EducationItem = {
  degree: string
  school: string
  years: string
  gpa?: string
  courses?: string[]
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

// Personal Information
export const PERSONAL = {
  name: 'Mohamed Azab',
  email: 'mohazab2006@gmail.com',
  github: 'https://github.com/mohazab2006',
  linkedin: 'https://www.linkedin.com/in/mohamedazabca/',
  university: 'Carleton University',
  tagline:
    "Hello, my name is Mohamed Azab — I'm a Computer Science student at Carleton University (AI & ML). A passionate learner who enjoys building reliable, well-designed software.",
  resumePdf: '/resume.pdf',
  heroFallback: '/hero-fallback.png',
}

// Navigation Links
export const NAV_LINKS = ['About', 'Education', 'Portfolio', 'Experience', 'Interests', 'Contact']

// About Section
export const ABOUT_TEXT = `I'm Mohamed Azab, a Computer Science student at Carleton University specializing in AI & Machine Learning with a focus on Cybersecurity. I'm passionate about building modern, performant web applications and exploring the intersection of software engineering, artificial intelligence, and security.

With a strong foundation in full-stack development and a growing expertise in machine learning, I enjoy tackling complex problems and creating solutions that make a real impact. Whether it's developing interactive web experiences, implementing secure infrastructure, or experimenting with AI models, I'm always eager to learn and push the boundaries of what's possible.`

export const SERVICES: ServiceItem[] = [
  {
    icon: '🌐',
    title: 'Web Development',
    description:
      'Learned modern full-stack development with Next.js, TypeScript, and Tailwind CSS. Currently learning advanced performance optimization, microservices architecture, SEO optimization, and enterprise-level scalability patterns.',
  },
  {
    icon: '🤖',
    title: 'AI & Machine Learning',
    description:
      'Chose AI & ML as my university stream because I\'m fascinated by its potential. Eagerly exploring AI applications in cybersecurity and commerce, learning machine learning frameworks and building intelligent solutions.',
  },
  {
    icon: '🔒',
    title: 'Security & Infrastructure',
    description:
      'Passionate about learning business security practices and AI-enhanced security, while building secure applications using Docker, DevOps methods, and infrastructure automation.',
  },
]

// Education
export const EDUCATION: EducationItem[] = [
  {
    degree: 'B.Comp (Honours), AI & Machine Learning + Cybersecurity',
    school: 'Carleton University — Ottawa, ON',
    years: '2024 – 2028 (Expected)',
    gpa: 'GPA: 3.90 / 4.00',
    courses: [
      'Data Structures',
      'Systems Programming (C)',
      'Imperative Programming (Python)',
      'OOP (Java)',
      'Linear Algebra',
      'Discrete Structures',
      'Calculus',
      'Probability Models',
    ],
  },
]

// Projects
export const PROJECTS: Project[] = [
  {
    slug: 'ht-clean-website-v1',
    title: 'HT Clean Website V1',
    github: 'https://github.com/mohazab2006/HT-Clean-V1',
    demo: 'https://htclean.ca/',
    description:
      'A comprehensive service-booking platform for HT Clean, a premium cleaning company specializing in car detailing and property maintenance. The website features real-time scheduling capabilities, instant quote generation, and seamless lead capture functionality. Built with a mobile-first approach and optimized for SEO, the platform streamlines customer bookings and business operations. The site showcases professional cleaning services including car detailing, window cleaning, and power washing services, with integrated contact forms and social media integration. The modern, responsive design ensures excellent user experience across all devices while maintaining fast loading times and secure data handling.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'HTML', 'Supabase', 'Docker'],
    screenshots: ['hero.jpg', 'screen-1.jpg', 'screen-2.jpg'],
  },
  {
    slug: 'empower-orphans-website-v2',
    title: 'Empower Orphans Website V2',
    github: 'https://github.com/mohazab2006/Empower-Orphans-Website',
    demo: 'https://empowerorphans.com/',
    description:
      'A comprehensive nonprofit platform for Empower Orphans, a student-led organization mobilizing campus chapters to support orphaned children. The website features donation tracking with real-time progress bars, chapter management system for multiple universities (Carleton University, University of Ottawa), event coordination, and volunteer application forms. Built with role-based access control (RBAC) for chapter leaders and administrators, the platform enables transparent fundraising with clear goal setting and impact reporting. The site includes interactive donation forms, chapter-specific social media integration, contact management, and a responsive design optimized for student engagement and donor transparency.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'HTML', 'Supabase', 'Docker'],
    screenshots: ['hero.jpg', 'screen-1.jpg', 'screen-2.jpg'],
  },
  {
    slug: 'empower-orphans-website-v1',
    title: 'Empower Orphans Website V1',
    github: 'https://github.com/mohazab2006/Empower-Orphans-V1',
    demo: 'https://www.empowerorphans.ca/',
    description:
      'Initial MVP for Empower Orphans, a nonprofit organization focused on providing hope and opportunity to orphaned children. The website features donation tracking, event management for fundraising activities like bake sales, charity partnerships with Children\'s Aid Society of Ottawa (CASOTT), and community engagement tools. Built as a foundation to prove out core features and workflows, this version established the organization\'s online presence with donation forms, contact management, and event coordination. The site emphasizes transparency in fundraising with clear mission statements and impact tracking, serving as the foundation that led to the enhanced V2 with expanded capabilities.',
    stack: ['HTML', 'CSS', 'JavaScript', 'EmailJS API'],
    screenshots: ['hero.jpg', 'screen-1.jpg', 'screen-2.jpg'],
  },
  {
    slug: 'personal-portfolio',
    title: 'Personal Portfolio',
    github: 'https://github.com/mohazab2006/personalportfolio',
    demo: '',
    description:
      'A passion project built for fun and learning, showcasing my journey as a developer through an interactive portfolio experience. This was created purely out of curiosity to explore cutting-edge web technologies and push the boundaries of what\'s possible with modern web development. Features include a custom cursor system with magnetic effects, 3D animated orbs using React Three Fiber and Drei, smooth page transitions with Framer Motion, a sophisticated loader with progress animation, split timeline for experience/education, holographic cards, interactive background effects, and smooth scrolling with Lenis. The project demonstrates my love for creating engaging user experiences and experimenting with new technologies, built entirely for the joy of coding and continuous learning.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Framer Motion', '@react-three/fiber', '@react-three/drei', 'Three.js', 'next-themes', 'Lenis'],
    screenshots: ['hero.jpg'],
  },
  {
    slug: 'personal-home-server',
    title: 'Personal Home Server',
    github: '',
    demo: '',
    description:
      "A comprehensive self-hosted infrastructure project that became a deep learning journey in system administration, security, and DevOps. Built from scratch on Ubuntu, this server taught me Linux fundamentals, shell scripting with Bash, and Python automation. I learned Docker containerization to run multiple services, Nginx reverse proxy configuration for load balancing, and Let's Encrypt SSL certificate management for secure connections. The project expanded into cybersecurity with VPN setup for secure remote access, SSH key management, firewall configuration, and basic intrusion detection. I implemented automated backup systems, monitoring solutions, and learned about network security, port forwarding, and service hardening. This hands-on experience with real infrastructure taught me the importance of security-first thinking, system reliability, and the power of owning your own infrastructure rather than relying on third-party services.",
    stack: ['Ubuntu', 'Docker', 'Nginx', "Let's Encrypt", 'VPN', 'SSH', 'Bash', 'Python'],
    screenshots: ['hero.jpg'],
  },
  {
    slug: 'school-library-management-system',
    title: 'School Library Management System',
    github: '',
    demo: '',
    description:
      'Full-stack library system with searchable inventory, QR/OCR tools, and RBAC for librarians, students, and admins. Streamlined library operations with modern technology and role-based access control.',
    stack: ['Python (Django)', 'Supabase (Postgres)', 'REST API', 'JS/HTML/CSS'],
    screenshots: ['hero.jpg'],
  },
]

// Work Experience
export const EXPERIENCE: ExperienceItem[] = [
  {
    role: 'Freelance Web Developer',
    org: 'Ottawa, Ontario',
    dates: 'Oct 2023 – Present',
    bullets: [
      'Built and deployed full-stack sites (MILK Inc., Empower Orphans, HT Clean) with Next.js + Supabase + Docker.',
      'Managed self-hosted infra via Nginx + Let\'s Encrypt, improving reliability and security.',
      'Integrated booking/donations/events APIs and admin dashboards to streamline operations.',
    ],
    tags: ['Next.js', 'Supabase', 'Docker', 'Nginx', 'SSL'],
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
    tags: ['Leadership', 'Nonprofit', 'Community'],
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
    text: 'Applied ML and small RAG systems.',
  },
  {
    icon: '🔒',
    title: 'Cybersecurity',
    text: 'Secure apps and infrastructure.',
  },
  {
    icon: '⚙️',
    title: 'DevOps',
    text: 'CI/CD, Docker, observability.',
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
    title: 'Exploring AI Across Industries',
    story: "My fascination with AI began during my studies at Carleton University, and I'm actively exploring its applications across different domains. I'm particularly interested in AI's role in cybersecurity - how machine learning can detect threats and protect systems. I'm also learning about AI in commerce, understanding how it can optimize business processes and customer experiences. The intersection of AI and web development is where I see the future, and I'm constantly learning new techniques through online courses, research papers, and hands-on projects to build smarter applications.",
    highlights: ['AI in cybersecurity', 'AI in commerce', 'Machine learning applications', 'Continuous learning', 'Research & experimentation']
  },
  'Cybersecurity': {
    title: 'Protecting Digital Assets',
    story: "Security isn't just about preventing attacks - it's about building trust and protecting valuable assets. Every website I develop has security as a core consideration from day one. I'm actively learning about business-related security practices, understanding how to protect sensitive data and maintain compliance. I'm also exploring AI-related security applications, learning how machine learning can enhance threat detection and response. From implementing proper authentication to securing APIs and databases, I believe that good security practices should be the foundation, not an afterthought.",
    highlights: ['Security-first development', 'Business security practices', 'AI-enhanced security', 'SSL & encryption expertise', 'Compliance & data protection']
  },
  'DevOps': {
    title: 'Automation & Reliability',
    story: "I discovered DevOps through necessity - managing multiple websites and services manually became overwhelming. Learning Docker, CI/CD pipelines, and monitoring tools transformed how I approach development. I'm actively learning about container orchestration, infrastructure as code, and advanced deployment strategies. The ability to scale and maintain systems reliably is what makes modern web development truly powerful, and I'm constantly exploring new tools and methodologies to improve my workflow.",
    highlights: ['Docker containerization', 'CI/CD pipeline expertise', 'Infrastructure as code', 'Automated deployments', 'Continuous learning']
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

// Tech Stack (for interactive display)
export const TECH_STACK = {
  Frontend: [
    ['TypeScript', 90],
    ['Next.js', 85],
    ['React', 85],
    ['Tailwind', 80],
  ] as [string, number][],
  Backend: [
    ['Supabase/Postgres', 75],
    ['Node.js', 80],
    ['Django', 70],
  ] as [string, number][],
  Infra: [
    ['Docker', 75],
    ['Nginx', 70],
    ['VPS/SSL', 75],
  ] as [string, number][],
  Languages: [
    ['Python', 80],
    ['Java', 75],
    ['C', 70],
    ['Bash', 70],
  ] as [string, number][],
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


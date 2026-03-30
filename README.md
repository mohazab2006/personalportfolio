<div align="center">

# 🚀 Mohamed Azab — Personal Portfolio

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-mohamedazab.dev-8B5CF6?style=for-the-badge&labelColor=2D1B69)](https://mohamedazab.dev)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![AI Powered](https://img.shields.io/badge/AI-Groq_LLaMA_3.3-blueviolet?style=for-the-badge&logo=robot)](https://groq.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

**An interactive portfolio built to be an experience — featuring a real-time AI assistant, 3D WebGL visuals, and a cross-browser optimized UI built for performance on every device.**

[View Live](https://mohamedazab.dev) · [Report Bug](https://github.com/mohazab2006/personalportfolio/issues) · [Request Feature](https://github.com/mohazab2006/personalportfolio/issues)

</div>

---

## ✨ Features

### 🤖 **Snaggy — Personal AI Assistant**
- Real-time AI chatbot powered by **Groq (LLaMA 3.3 70B)** for sub-100ms inference
- Context-aware responses built on a structured system prompt covering projects, skills, background, and experience
- **Streaming chat interface** — responses appear word-by-word for a natural feel
- Fullscreen chat mode with a smooth overlay experience
- Handles conversational queries about my journey, tech stack, and work — no scripted answers

---

### 🎨 **Advanced UI/UX Engineering**
- Custom **magnetic cursor system** with ripple click effects
- **3D animated orbs** rendered via React Three Fiber + Three.js (WebGL)
- **Interactive particle background** with mouse-reactive physics using Canvas 2D
- **Holographic project cards** with glossy reflection overlays and sweep animations
- **Split timeline** for experience and education — responsive column reorder on mobile
- Smooth page scrolling powered by **Lenis**
- Entrance animations via **Framer Motion** with scroll-triggered reveals
- Dark/light mode support

---

### ⚡ **Performance & Architecture**
- **Next.js App Router** with server-side rendering
- Lazy loading and code splitting via `React.lazy` + `Suspense`
- `next/dynamic` with `ssr: false` for heavy 3D/animation components
- Image optimization with `next/image` (blur placeholders, responsive `sizes`)
- In-memory project cache (1hr TTL) backed by **Supabase PostgreSQL**
- **90+ Lighthouse score** across all metrics

---

### 📱 **Cross-Browser & Mobile Reliability**
- IntersectionObserver fallbacks for **LinkedIn in-app browser** (silent callback swallowing)
- `getBoundingClientRect` sync check for **Safari** (doesn't fire observer for already-in-viewport elements)
- 1.5s timer safety net in case all observer callbacks fail
- `whileHover` disabled on touch devices — no tap-triggered animation jumps on iOS
- Tested and stable on Safari, Chrome, Firefox, and LinkedIn/social in-app browsers

---

## 🗂️ Projects

| Project | Stack | Live |
|---|---|---|
| **SentinelStack AI** | Next.js, FastAPI, scikit-learn, OpenAI API, Docker, PostgreSQL | — |
| **HT Clean Website** | Next.js, TypeScript, Tailwind, Supabase, Docker | [htclean.ca](https://htclean.ca/) |
| **Empower Orphans V2** | Next.js, TypeScript, Supabase, RBAC, Docker | [empowerorphans.com](https://empowerorphans.com/) |
| **Rami The Barber** | Next.js, TypeScript, Tailwind, Supabase, Square | [ramithebarber.com](https://ramithebarber.com) |
| **School Library System** | Python, Django, Supabase, QR/OCR, RBAC | — |
| **Personal Home Server** | Ubuntu, Docker, Nginx, VPN, Bash, Python | — |

---

## 🛠️ Tech Stack

### **Frontend**
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- React Three Fiber / Three.js
- Lenis (smooth scroll)

### **Backend**
- Next.js API Routes
- Groq API (LLaMA 3.3 70B — LLM inference)
- Python / FastAPI (SentinelStack AI)

### **Database & Storage**
- Supabase (PostgreSQL + object storage)

### **DevOps & Infrastructure**
- Docker & NGINX
- Vercel (portfolio deployment)
- Self-hosted home server (Ubuntu, Let's Encrypt SSL)

---

## 🎯 System Design

**AI Chat Flow:**
```
User Input → Chat UI → Next.js API Route → Groq API → Streaming Response → UI Render
```

**Project Data Flow:**
```
Page Load → In-Memory Cache Check → Supabase Query (on miss) → Transform → Render
```

**Key Concepts:**
- Prompt engineering with full biographical context
- Streaming UI updates for perceived performance
- Serverless backend with edge-friendly API routes
- Observer-pattern scroll animations with multi-browser fallbacks

---

## 🧑‍💻 About Me

CS student at **Carleton University** specializing in **AI & Machine Learning** with a focus on **Cybersecurity**. Upcoming **Junior DevOps Specialist co-op at CIRA** (Canadian Internet Registration Authority — Canada's .CA domain registry).

Co-President of **Empower Orphans Foundation** (Carleton chapter) and Youth Program Director at **Salam Society**.

---

## 📬 Contact

**Mohamed Azab**

- Portfolio: https://mohamedazab.dev
- Email: mohazab2006@gmail.com
- LinkedIn: https://www.linkedin.com/in/mohamedazabca/
- GitHub: https://github.com/mohazab2006

---

## 🙏 Acknowledgments

- Next.js · Vercel · Groq · Supabase · Framer Motion · React Three Fiber · Lenis · Tailwind CSS

---

<div align="center">

⭐ If you found this interesting, consider giving it a star!

</div>

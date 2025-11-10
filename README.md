<div align="center">

# 🚀 Mohamed Azab - Personal Portfolio

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-mohamedazab.dev-8B5CF6?style=for-the-badge&labelColor=2D1B69)](https://mohamedazab.dev)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![AI Powered](https://img.shields.io/badge/AI-Groq_LLaMA_3.3-blueviolet?style=for-the-badge&logo=robot)](https://groq.com/)

**An interactive portfolio showcasing modern web development and AI integration**

[View Demo](https://mohamedazab.dev) · [Report Bug](https://github.com/mohazab2006/personalportfolio/issues) · [Request Feature](https://github.com/mohazab2006/personalportfolio/issues)

</div>

---

## ✨ Features

### 🤖 **Snaggy - AI Chatbot Assistant**
- **Custom AI chatbot** powered by Groq's LLaMA 3.3 70B model
- Acts as my personal AI representative, trained on my complete background
- Answers questions about my journey from Egypt to Canada, projects, skills, and experience
- Real-time chat interface with fullscreen mode
- Professional and friendly personality

### 🎨 **Modern UI/UX**
- **Custom cursor system** with magnetic effects on interactive elements
- **3D animated orbs** using React Three Fiber and Drei
- **Smooth page transitions** with Framer Motion
- **Interactive particle background** with mouse tracking
- **Holographic project cards** with hover effects
- **Dark mode** with smooth theme transitions
- **Smooth scrolling** powered by Lenis

### 📱 **Responsive Design**
- Fully responsive across all devices
- Mobile-first approach
- Optimized touch interactions
- Progressive Web App (PWA) ready

### ⚡ **Performance Optimized**
- Server-side rendering (SSR) with Next.js 14
- Image optimization with Next.js Image component
- Lazy loading for below-the-fold content
- Code splitting and bundle optimization
- Lighthouse score: 90+ across all metrics

---

## 🛠️ Tech Stack

### **Frontend**
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)** - 3D graphics
- **[Three.js](https://threejs.org/)** - 3D library
- **[Lenis](https://lenis.studiofreight.com/)** - Smooth scrolling

### **Backend & Database**
- **[Supabase](https://supabase.com/)** - PostgreSQL database and storage
- **[Groq AI](https://groq.com/)** - LLaMA 3.3 70B model for chatbot
- **Next.js API Routes** - Serverless functions

### **Deployment & Tools**
- **[Vercel](https://vercel.com/)** - Hosting and deployment
- **[Git](https://git-scm.com/)** - Version control
- **ESLint & Prettier** - Code quality

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account (free tier)
- Groq API key (free tier)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mohazab2006/personalportfolio.git
cd personalportfolio
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

**Get your keys:**
- **Supabase:** [Dashboard](https://supabase.com/dashboard) → Settings → API
- **Groq:** [Console](https://console.groq.com/keys) → Create API Key

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📦 Project Structure

```
personalportfolio/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── chat/         # Snaggy chatbot endpoint
│   ├── projects/         # Dynamic project pages
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ChatBot.tsx       # AI chatbot interface
│   ├── ChatButton.tsx    # Floating chat button
│   ├── Hero.tsx          # Hero section
│   ├── Navbar.tsx        # Navigation
│   └── ...               # Other components
├── lib/                   # Utility functions
│   ├── data.ts           # Site data and content
│   ├── projects.ts       # Supabase integration
│   ├── seo.ts            # SEO metadata
│   └── utils.ts          # Helper functions
├── public/                # Static assets
├── styles/                # Global styles
└── supabase/             # Database schema
```

---

## 🔧 Configuration

### Database Setup (Supabase)

1. Create tables using the schema in `/supabase/schema.sql`
2. Upload project images to Supabase Storage
3. Create a public bucket named `projects`
4. Update project data in the `projects` table

### Customization

**Update personal information:**
Edit `/lib/data.ts`:
```typescript
export const PERSONAL = {
  name: 'Your Name',
  email: 'your@email.com',
  github: 'https://github.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
  // ... more fields
}
```

**Update Snaggy's knowledge:**
Edit `/app/api/chat/route.ts` - Update the `SYSTEM_PROMPT` with your information.

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variables
   - Deploy!

3. **Add Environment Variables in Vercel**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GROQ_API_KEY`

**Full deployment guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🎯 Key Features Explained

### Snaggy AI Chatbot
Snaggy is a custom-built AI assistant that:
- Uses Groq's LLaMA 3.3 70B model for fast, intelligent responses
- Is trained on my complete professional background, projects, and skills
- Provides a conversational way for visitors to learn about me
- Demonstrates full-stack AI integration capabilities

**Technical Implementation:**
- Next.js API route handles chat requests
- Groq API integration for AI responses
- Real-time streaming chat interface
- Context-aware conversations with system prompts

### 3D Animations
- React Three Fiber for WebGL rendering
- Animated floating orbs in the background
- Interactive particle system
- Optimized for performance with lazy loading

### Custom Cursor
- Magnetic effect that follows interactive elements
- Smooth animations with Framer Motion
- Disabled on mobile for better UX

---

## 📊 Performance

- **Lighthouse Score:** 90+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Bundle Size:** Optimized with code splitting
- **Image Optimization:** Next.js Image with WebP

---

## 🤝 Contributing

While this is a personal portfolio, I welcome suggestions and bug reports!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

**Note:** While the code is open source, please don't use my personal content, images, or branding. Feel free to use the code structure and features as a template for your own portfolio!

---

## 📬 Contact

**Mohamed Azab**

- Portfolio: [mohamedazab.dev](https://mohamedazab.dev)
- Email: [mohazab2006@gmail.com](mailto:mohazab2006@gmail.com)
- LinkedIn: [linkedin.com/in/mohamedazabca](https://www.linkedin.com/in/mohamedazabca/)
- GitHub: [@mohazab2006](https://github.com/mohazab2006)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel](https://vercel.com/) - Deployment platform
- [Groq](https://groq.com/) - AI inference engine
- [Supabase](https://supabase.com/) - Backend as a Service
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) - 3D graphics

---

<div align="center">

**⭐ If you found this project interesting, please consider giving it a star!**

Made with 💜 by Mohamed Azab

</div>

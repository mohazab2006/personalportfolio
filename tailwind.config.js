/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#050505',
          'bg-secondary': '#0A0A0C',
          surface: '#111114',
          text: '#F0F0F3',
          muted: '#8B8B9A',
          accent: '#2DD4BF',
          'accent-hover': '#14B8A6',
          'accent-light': '#99F6E4',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        // Legacy tokens — kept until components are rebuilt in later milestones
        light: {
          bg: '#FFFFFF',
          'bg-secondary': '#F7F8FA',
          text: '#0B0B0F',
          accent: '#2DD4BF',
          'accent-hover': '#14B8A6',
          'accent-light': '#99F6E4',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      spacing: {
        section: '6rem',
        'section-lg': '8rem',
      },
    },
  },
  plugins: [],
}

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
          bg: '#0B0B0F',
          'bg-secondary': '#16161D',
          text: '#F5F7FB',
          accent: '#8B5CF6',
          'accent-hover': '#6D28D9',
          'accent-light': '#C4B5FD',
        },
        light: {
          bg: '#FFFFFF',
          'bg-secondary': '#F7F8FA',
          text: '#0B0B0F',
          accent: '#6D28D9',
          'accent-hover': '#5B21B6',
          'accent-light': '#A78BFA',
        },
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


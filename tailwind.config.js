/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  // Only apply hover: styles on devices that can actually hover, so taps on phones don't leave elements stuck lit.
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        // "Ops console" palette: warm phosphor black, amber glow, status lights.
        dark: {
          bg: '#0A0B08',
          'bg-secondary': '#0E100C',
          surface: '#121410',
          text: '#ECE8DA',
          muted: '#8E9182',
          // Themeable phosphor colour: switch via <html data-theme> (see styles/globals.css)
          accent: 'rgb(var(--accent) / <alpha-value>)',
          'accent-hover': 'rgb(var(--accent-hover) / <alpha-value>)',
          'accent-light': 'rgb(var(--accent-light) / <alpha-value>)',
          border: 'rgba(236, 232, 218, 0.1)',
        },
        ops: {
          line: '#2A2E24',
          'line-strong': '#3A3F32',
          panel: '#11130F',
          'panel-head': '#171A14',
          ok: '#7CE495',
          warn: 'rgb(var(--accent) / <alpha-value>)',
          err: '#FF6B5B',
          dim: '#6B6F60',
        },
        // Legacy tokens — kept for components not yet rebuilt
        light: {
          bg: '#FFFFFF',
          'bg-secondary': '#F7F8FA',
          text: '#0B0B0F',
          // Themeable phosphor colour: switch via <html data-theme> (see styles/globals.css)
          accent: 'rgb(var(--accent) / <alpha-value>)',
          'accent-hover': 'rgb(var(--accent-hover) / <alpha-value>)',
          'accent-light': 'rgb(var(--accent-light) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['var(--font-plex)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
        display: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      spacing: {
        section: '6rem',
        'section-lg': '8rem',
      },
      keyframes: {
        'status-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
      },
      animation: {
        'status-pulse': 'status-pulse 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

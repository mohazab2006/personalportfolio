import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google'
import {
  generateMetadata as generateSEOMetadata,
  generatePersonSchema,
  SITE_ICON_PATH,
} from '@/lib/seo'
import Providers from '@/components/Providers'
import SocialRail from '@/components/SocialRail'
import { THEME_BOOT_SCRIPT } from '@/lib/themeConfig'
import '@/styles/globals.css'

export const metadata: Metadata = generateSEOMetadata()

/** Dark browser chrome (Safari toolbar, Android status bar) that matches the page. Zoom stays enabled for accessibility. */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0B08',
  colorScheme: 'dark',
}

// Display + UI: a monospace with real weight at hero sizes.
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-jetbrains',
  display: 'swap',
})

// Reading text: an industrial sans that pairs with the mono.
const plex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${jetbrains.variable} ${plex.variable}`} suppressHydrationWarning>
      <head>
        {/* Apply the saved phosphor theme before paint (no colour flash) */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
        <link rel="icon" href={SITE_ICON_PATH} type="image/svg+xml" sizes="any" />
        <link rel="shortcut icon" href={SITE_ICON_PATH} />
        <link rel="apple-touch-icon" href={SITE_ICON_PATH} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generatePersonSchema()) }}
        />
        <link rel="dns-prefetch" href="https://supabase.co" />
        <link rel="preconnect" href="https://supabase.co" />
      </head>
      <body className="font-sans min-h-screen bg-dark-bg text-dark-text">
        {/* Backdrop: engineering grid + a low amber bloom, like a monitor warming up */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
          <div className="ops-grid absolute inset-0" />
          <div className="absolute inset-x-0 top-0 h-[min(70vh,620px)] bg-[radial-gradient(ellipse_70%_55%_at_30%_0%,rgb(var(--accent)/0.09),transparent_65%)]" />
          <div className="absolute -right-[10%] top-[25%] h-[min(80vw,720px)] w-[min(80vw,720px)] bg-[radial-gradient(circle,rgba(124,228,149,0.045),transparent_65%)]" />
        </div>
        {/* i — only visible in the page source */}
        <div hidden aria-hidden dangerouslySetInnerHTML={{ __html: '<!-- i :: a3Jvbm9yaXVt -->' }} />
        {/* CRT scanlines + vignette sit above everything but never catch clicks */}
        <div className="crt-overlay pointer-events-none fixed inset-0 z-[90] opacity-60" aria-hidden />
        <div className="crt-vignette pointer-events-none fixed inset-0 z-[89]" aria-hidden />
        <Providers>
          {children}
          <SocialRail />
        </Providers>
      </body>
    </html>
  )
}

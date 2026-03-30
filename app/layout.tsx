import type { Metadata } from 'next'
import { Inter, Unbounded } from 'next/font/google'
import {
  generateMetadata as generateSEOMetadata,
  generatePersonSchema,
  SITE_ICON_PATH,
} from '@/lib/seo'
import Providers from '@/components/Providers'
import SocialRail from '@/components/SocialRail'
import '@/styles/globals.css'

export const metadata: Metadata = generateSEOMetadata()

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const logoFont = Unbounded({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-logo',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${logoFont.variable}`}>
      <head>
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
      <body className="font-sans min-h-screen bg-[#070708] text-dark-text">
        <div
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
          aria-hidden
        >
          {/* Soft top “sky” — pulls the page out of flat black */}
          <div className="absolute inset-x-0 top-0 h-[min(72vh,640px)] bg-[radial-gradient(ellipse_75%_55%_at_50%_0%,rgba(45,212,191,0.11),transparent_62%)]" />
          {/* Center wash — readable mid-tone */}
          <div className="absolute left-1/2 top-[38%] h-[min(90vh,820px)] w-[min(110vw,1200px)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.045),transparent_68%)]" />
          {/* Left accent pool */}
          <div className="absolute -left-[22%] -top-[12%] h-[min(58vw,560px)] w-[min(58vw,560px)] rounded-full bg-dark-accent/[0.12] blur-[130px]" />
          {/* Right cool counter-balance */}
          <div className="absolute -right-[16%] top-[18%] h-[min(48vw,460px)] w-[min(48vw,460px)] rounded-full bg-cyan-300/[0.075] blur-[115px]" />
          {/* Lower lift */}
          <div className="absolute bottom-[-12%] left-1/2 h-[min(48vw,420px)] w-[min(78vw,680px)] -translate-x-1/2 rounded-full bg-white/[0.055] blur-[105px]" />
          <div className="absolute bottom-[-8%] right-[-5%] h-[min(38vw,360px)] w-[min(38vw,360px)] rounded-full bg-teal-200/[0.04] blur-[90px]" />
          {/* Light edge framing — keeps focus mid-page without killing the glows */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_90%_at_50%_42%,transparent_32%,rgba(5,5,5,0.28)_100%)]" />
        </div>
        <Providers>
          {children}
          <SocialRail />
        </Providers>
      </body>
    </html>
  )
}

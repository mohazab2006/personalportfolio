import type { Metadata } from 'next'
import { Unbounded } from 'next/font/google'
import { generateMetadata as generateSEOMetadata, generatePersonSchema } from '@/lib/seo'
import Providers from '@/components/Providers'
import ClientLayout from '@/components/ClientLayout'
import '@/styles/globals.css'

export const metadata: Metadata = generateSEOMetadata()

const logoFont = Unbounded({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-logo',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${logoFont.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generatePersonSchema()) }}
        />
        {/* DNS prefetch for Supabase */}
        <link rel="dns-prefetch" href="https://supabase.co" />
        <link rel="preconnect" href="https://supabase.co" />
      </head>
      <body className="bg-dark-bg text-dark-text">
        <Providers>
          {/* Client-side only components (cursor + background) */}
          <ClientLayout />
          
          {/* Smooth Animated Background Orbs */}
          <div className="fixed inset-0 -z-20 overflow-hidden" aria-hidden="true">
            <div className="absolute -left-1/4 top-0 h-96 w-96 animate-float rounded-full bg-dark-accent/10 blur-3xl" />
            <div className="absolute -right-1/4 bottom-0 h-96 w-96 animate-float rounded-full bg-cyan-500/5 blur-3xl" style={{ animationDelay: '2s' }} />
            <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow rounded-full bg-dark-accent/5 blur-3xl" />
          </div>

          {/* Ambient motion layer (kept subtle) */}
          <div className="fixed inset-0 -z-[15] pointer-events-none ambient-gradient" aria-hidden="true" />
          
          {children}
        </Providers>
      </body>
    </html>
  )
}


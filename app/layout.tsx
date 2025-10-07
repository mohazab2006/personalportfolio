import type { Metadata } from 'next'
import { generateMetadata as generateSEOMetadata, generatePersonSchema } from '@/lib/seo'
import Providers from '@/components/Providers'
import CustomCursor from '@/components/CustomCursor'
import InteractiveBackground from '@/components/InteractiveBackground'
import '@/styles/globals.css'

export const metadata: Metadata = generateSEOMetadata()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generatePersonSchema()) }}
        />
      </head>
      <body className="bg-dark-bg text-dark-text">
        <Providers>
          <CustomCursor />
          
          {/* Interactive Particle Background */}
          <InteractiveBackground />
          
          {/* Smooth Animated Background Orbs */}
          <div className="fixed inset-0 -z-20 overflow-hidden" aria-hidden="true">
            <div className="absolute -left-1/4 top-0 h-96 w-96 animate-float rounded-full bg-purple-500/10 blur-3xl" />
            <div className="absolute -right-1/4 bottom-0 h-96 w-96 animate-float rounded-full bg-purple-600/10 blur-3xl" style={{ animationDelay: '2s' }} />
            <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow rounded-full bg-purple-400/5 blur-3xl" />
          </div>
          
          {children}
        </Providers>
      </body>
    </html>
  )
}


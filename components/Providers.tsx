'use client'

import { SnaggyProvider } from '@/components/SnaggyProvider'

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SnaggyProvider>{children}</SnaggyProvider>
}


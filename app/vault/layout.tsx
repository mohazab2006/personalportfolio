import type { Metadata } from 'next'

// The vault is a reward, not a landing page: keep it out of search results.
export const metadata: Metadata = {
  title: 'Mohamed Azab',
  robots: { index: false, follow: false },
}

export default function VaultLayout({ children }: { children: React.ReactNode }) {
  return children
}

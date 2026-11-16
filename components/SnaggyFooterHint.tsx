'use client'

import { useSnaggy } from '@/components/SnaggyProvider'

export default function SnaggyFooterHint() {
  const { open } = useSnaggy()

  return (
    <p className="text-xs leading-relaxed text-ops-dim">
      <button
        type="button"
        onClick={open}
        className="text-dark-text/70 underline decoration-ops-line-strong underline-offset-2 transition-colors hover:text-dark-accent hover:decoration-dark-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-accent/35"
      >
        snaggy --help
      </button>
      <span> — ask anything about this portfolio.</span>
    </p>
  )
}

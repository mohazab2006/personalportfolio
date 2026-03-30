'use client'

import { useSnaggy } from '@/components/SnaggyProvider'

export default function SnaggyFooterHint() {
  const { open } = useSnaggy()

  return (
    <p className="mx-auto mt-5 max-w-md text-xs leading-relaxed text-white/35">
      <button
        type="button"
        onClick={open}
        className="font-medium text-white/50 underline decoration-white/15 underline-offset-2 transition-colors hover:text-white/70 hover:decoration-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070708]"
      >
        Ask Snaggy
      </button>
      <span className="text-white/30"> — short answers about this portfolio.</span>
    </p>
  )
}

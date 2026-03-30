'use client'

import { useId } from 'react'

/** Site-aligned prompt chevron (gradient) — used on launcher and in the chat header. */
export default function SnaggyMark({ className }: { className?: string }) {
  const raw = useId()
  const gradId = `snaggy-grad-${raw.replace(/:/g, '')}`

  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="6" y1="4" x2="26" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5eead4" />
          <stop offset="1" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
      <path
        d="M11.5 9.5 19.2 16l-7.7 6.5"
        stroke={`url(#${gradId})`}
        strokeWidth="2.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

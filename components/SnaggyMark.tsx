/** Site-aligned prompt chevron (amber phosphor) — used on launcher and in the chat header. */
export default function SnaggyMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M11.5 9.5 19.2 16l-7.7 6.5"
        stroke="#FFB547"
        strokeWidth="2.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

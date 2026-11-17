'use client'

/**
 * One wording for every collapsed list on the site: "[ show all (n) ]" / "[ show less ]".
 * Only rendered below the lg breakpoint — desktop always shows everything.
 */
export default function ShowMore({
  expanded,
  hidden,
  onToggle,
  className = '',
}: {
  expanded: boolean
  /** how many items are currently hidden */
  hidden: number
  onToggle: () => void
  className?: string
}) {
  if (hidden <= 0 && !expanded) return null
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      className={`flex min-h-[44px] w-full items-center justify-center border border-dashed border-ops-line-strong font-mono text-[12.5px] text-dark-text/75 transition-colors hover:border-dark-accent/60 hover:text-dark-accent active:text-dark-accent lg:hidden ${className}`}
    >
      {expanded ? '[ show less ]' : `[ show all (${hidden} more) ]`}
    </button>
  )
}

/** Class for an item that hides on small screens unless the list is expanded. */
export const collapsible = (index: number, limit: number, expanded: boolean) =>
  !expanded && index >= limit ? 'hidden lg:block' : ''

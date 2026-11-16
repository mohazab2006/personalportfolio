/** RGB-split glitch text. `burst` tears hard once (for reveals); otherwise it twitches every few seconds. */
export default function GlitchText({
  text,
  burst = false,
  className = '',
}: {
  text: string
  burst?: boolean
  className?: string
}) {
  return (
    <span className={`glitch ${burst ? 'glitch-burst' : ''} ${className}`} data-text={text}>
      {text}
    </span>
  )
}

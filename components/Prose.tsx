type ProseProps = {
  children: React.ReactNode
  className?: string
}

export default function Prose({ children, className = '' }: ProseProps) {
  return <div className={`prose prose-lg max-w-none ${className}`}>{children}</div>
}


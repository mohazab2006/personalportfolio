'use client'

import Image from 'next/image'
import { useState } from 'react'
import { getProjectImageUrl } from '@/lib/projects'

type Props = {
  slug: string
  /** Try in order until one loads (e.g. hero.jpg then hero.png). */
  tryList: string[]
  alt: string
  className?: string
  sizes: string
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

export default function ProjectStorageImage({
  slug,
  tryList,
  alt,
  className,
  sizes,
  priority,
  placeholder = 'empty',
  blurDataURL,
}: Props) {
  const [idx, setIdx] = useState(0)
  const [failed, setFailed] = useState(false)

  const list = tryList.length > 0 ? tryList : ['hero.jpg']
  const safeIdx = Math.min(idx, list.length - 1)
  const fileName = list[safeIdx]
  const src = getProjectImageUrl(slug, fileName)

  if (failed) {
    return (
      <div className={`absolute inset-0 flex items-center justify-center bg-dark-surface ${className ?? ''}`}>
        <span className="text-sm text-dark-muted">Preview coming soon</span>
      </div>
    )
  }

  return (
    <Image
      key={`${slug}-${fileName}-${safeIdx}`}
      src={src}
      alt={alt}
      fill
      unoptimized
      className={className}
      sizes={sizes}
      priority={!!priority}
      loading={priority ? 'eager' : 'lazy'}
      {...(placeholder === 'blur' && blurDataURL
        ? { placeholder: 'blur' as const, blurDataURL }
        : {})}
      onError={() => {
        if (idx + 1 < list.length) setIdx((i) => i + 1)
        else setFailed(true)
      }}
    />
  )
}

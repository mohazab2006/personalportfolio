'use client'

import dynamic from 'next/dynamic'

// Lazy load heavy visual components for better performance
const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false })
const InteractiveBackground = dynamic(() => import('@/components/InteractiveBackground'), { ssr: false })

export default function ClientLayout() {
  return (
    <>
      <CustomCursor />
      <InteractiveBackground />
    </>
  )
}


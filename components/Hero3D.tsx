'use client'

import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sphere, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { useReducedMotion, isWebGLSupported } from '@/lib/utils'

function AnimatedOrb() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const prefersReducedMotion = useReducedMotion()

  useFrame((state) => {
    if (prefersReducedMotion) return

    const time = state.clock.getElapsedTime()

    // Slow rotation
    meshRef.current.rotation.x = time * 0.1
    meshRef.current.rotation.y = time * 0.15

    // Subtle floating
    meshRef.current.position.y = Math.sin(time * 0.5) * 0.1
  })

  return (
    <Sphere ref={meshRef} args={[1, 100, 100]} scale={2.2}>
      <MeshDistortMaterial
        color="#8B5CF6"
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  )
}

export default function Hero3D() {
  const prefersReducedMotion = useReducedMotion()
  const webGLSupported = typeof window !== 'undefined' ? isWebGLSupported() : true

  if (!webGLSupported || prefersReducedMotion) {
    // Fallback: CSS gradient blob
    return (
      <div className="relative h-full w-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-64 w-64 md:h-96 md:w-96">
            <div className="absolute inset-0 animate-pulse-glow rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 opacity-60 blur-3xl" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 opacity-80 blur-2xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={0.5} />
          <pointLight position={[0, 0, 5]} intensity={1} color="#8B5CF6" />

          {/* Animated Orb */}
          <AnimatedOrb />

          {/* Environment for reflections */}
          <Environment preset="city" />
        </Suspense>
      </Canvas>

      {/* Background gradient glow */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
      </div>
    </div>
  )
}


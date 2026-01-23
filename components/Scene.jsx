'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { OrbitControls } from '@react-three/drei'
import Model from "./Model"

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      <Suspense fallback={null}>
        <Model />
      </Suspense>

      {/* Optional, bisa dihapus kalau tidak ingin kontrol manual */}
      <OrbitControls enableZoom={false} />
    </Canvas>
  )
}

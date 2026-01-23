'use client'

import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'

export default function Model() {
  const modelRef = useRef()
  const { scene } = useGLTF('/my_computer.glb')

  const [scrollY, setScrollY] = useState(0)

  // Ambil nilai scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Update rotasi setiap frame
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y = scrollY * 0.005
    //   modelRef.current.rotation.x = scrollY * 0.002
    }
  })

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={1.5}
      position={[0, -1, 0]}
    />
  )
}

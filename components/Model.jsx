'use client'

import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { MathUtils } from 'three'

export default function Model() {
  const modelRef = useRef(null)
  const scrollY = useRef(0)
  const footerTop = useRef(null)
  const baseScale = 1.5
  const hoverScale = 1.7
  const activeScale = 1.85
  const targetScale = useRef(baseScale)

  const { scene } = useGLTF('/my_computer.glb')

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const footer = document.querySelector('footer')
    if (footer) {
      footerTop.current = footer.offsetTop
    }
  }, [])

  useFrame((_, delta) => {
    if (!modelRef.current || footerTop.current === null) return

    // Smoothly ease toward the target scale for hover/press interactions
    const nextScale = MathUtils.damp(
      modelRef.current.scale.x,
      targetScale.current,
      6,
      delta
    )
    modelRef.current.scale.setScalar(nextScale)

    const start = 0
    const end = footerTop.current - window.innerHeight
    const current = scrollY.current

    if (current <= start || current >= end) {
      modelRef.current.rotation.y = 0
      return
    }

    const progress = (current - start) / (end - start)

    const rotationY = progress * Math.PI * 2

    modelRef.current.rotation.y = rotationY
  })

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={baseScale}
      position={[0, -1, 0]}
      onPointerOver={() => (targetScale.current = hoverScale)}
      onPointerOut={() => (targetScale.current = baseScale)}
      onPointerDown={() => (targetScale.current = activeScale)}
      onPointerUp={() => (targetScale.current = hoverScale)}
      onPointerCancel={() => (targetScale.current = baseScale)}
    />
  )
}

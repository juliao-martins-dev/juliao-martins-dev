'use client'

import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'

export default function Model() {
  const modelRef = useRef(null)
  const scrollY = useRef(0)
  const footerTop = useRef(null)

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

  useFrame(() => {
    if (!modelRef.current || footerTop.current === null) return

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
      scale={1.5}
      position={[0, -1, 0]}
    />
  )
}

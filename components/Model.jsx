'use client'

import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'

export default function Model() {
  const modelRef = useRef()
  const { scene } = useGLTF('/my_computer.glb')

  const [scrollY, setScrollY] = useState<number>(0)
  const [footerTop, setFooterTop] = useState<number | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const footer = document.querySelector('.footer')
    if (footer) {
      setFooterTop(footer.offsetTop)
    }
  }, [])

  useFrame(() => {
    if (!modelRef.current || footerTop === null) return

    const footerStart = footerTop - window.innerHeight

    if (scrollY <= 0) {
      modelRef.current.rotation.y = 0
      return
    }

    if (scrollY >= footerStart) {
      modelRef.current.rotation.y = 0
      return
    }

    modelRef.current.rotation.y = scrollY * 0.005
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

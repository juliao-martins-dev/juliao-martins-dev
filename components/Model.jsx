'use client'

import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'

export default function Model() {
  const modelRef = useRef()
  const { scene } = useGLTF('/my_computer.glb')

  const [scrollY, setScrollY] = useState(0)
  const [footerTop, setFooterTop] = useState(null)

  // Ambil scrollY
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Ambil posisi footer (sekali saja)
  useEffect(() => {
    const footer = document.querySelector('.footer')
    if (footer) {
      setFooterTop(footer.offsetTop)
    }
  }, [])

  // Update rotasi per frame
  useFrame(() => {
    if (!modelRef.current || footerTop === null) return

    const footerStart = footerTop - window.innerHeight

    // ATAS (scrollY = 0)
    if (scrollY <= 0) {
      modelRef.current.rotation.y = 0
      return
    }

    // BAWAH (sudah sampai footer)
    if (scrollY >= footerStart) {
      modelRef.current.rotation.y = 0
      return
    }

    // ZONA AKTIF (scroll di tengah)
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

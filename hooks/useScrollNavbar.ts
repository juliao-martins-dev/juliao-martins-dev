import { useEffect, useRef, useState } from "react"

const SCROLL_THRESHOLD = 20

export function useScrollNavbar() {
  const [scrolled, setScrolled] = useState(false)
  // Mirrors the state so the scroll handler can early-return without touching
  // React at all. Previously every single scroll event called setState, which
  // meant React work on every frame of every scroll.
  const scrolledRef = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > SCROLL_THRESHOLD
      if (next === scrolledRef.current) return
      scrolledRef.current = next
      setScrolled(next)
    }

    onScroll()
    // Passive: this handler never calls preventDefault, and saying so lets the
    // browser keep scrolling on the compositor instead of waiting on JS.
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return scrolled
}

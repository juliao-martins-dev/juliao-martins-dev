"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronUp } from "lucide-react"

export default function ScrollToTop() {
  const [visible, setVisible] = useState<boolean>(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300)
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      variant="default"
      aria-label="Scroll to top"
      className={`
        fixed bottom-14 right-7 z-50 rounded-full shadow-lg
        transition-all duration-300
        ${visible
          ? "opacity-100 scale-100"
          : "opacity-0 scale-90 pointer-events-none"}
      `}
    >
      <ChevronUp className="h-5 w-5" />
    </Button>
  )
}

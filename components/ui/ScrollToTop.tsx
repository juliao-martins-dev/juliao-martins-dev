"use client"

import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronUp } from "lucide-react"

export default function ScrollToTop() {
  const t = useTranslations()
  const [visible, setVisible] = useState<boolean>(false)
  // Mirror of `visible`, so the handler can bail before touching React.
  const visibleRef = useRef(false)

  useEffect(() => {
    const toggleVisibility = () => {
      const next = window.scrollY > 300
      if (next === visibleRef.current) return
      visibleRef.current = next
      setVisible(next)
    }

    toggleVisibility()
    // Passive: never calls preventDefault, so scrolling stays off the main thread.
    window.addEventListener("scroll", toggleVisibility, { passive: true })
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
      aria-label={t("a11y.backToTop")}
      className={`
        fixed bottom-14 right-7 z-50 size-11 rounded-full shadow-lg
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

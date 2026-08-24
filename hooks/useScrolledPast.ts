"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll position relative to a threshold.
 *
 * Returns `past` (currently beyond it) and `everPast` (has been at least once).
 * `everPast` exists so a consumer can mount something expensive on first
 * crossing and then keep it mounted, rather than tearing it down on scroll-up.
 *
 * The ref mirrors the state so the listener can early-return without touching
 * React on the vast majority of scroll frames — only the two crossings of the
 * threshold cause a render. The listener is passive, so scrolling stays on the
 * compositor.
 */
export function useScrolledPast(threshold: number) {
  const [state, setState] = useState({ past: false, everPast: false });
  const pastRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > threshold;
      if (next === pastRef.current) return;
      pastRef.current = next;
      // Latching here rather than in a downstream effect keeps every setState
      // inside an event handler, which is where React wants them.
      setState((prev) => ({ past: next, everPast: prev.everPast || next }));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return state;
}

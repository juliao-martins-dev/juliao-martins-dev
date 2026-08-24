"use client";

import { useMediaQuery } from "./useMediaQuery";

/** Reads `prefers-reduced-motion` as reactive state. */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

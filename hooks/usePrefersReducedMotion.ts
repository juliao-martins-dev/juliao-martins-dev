"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const getSnapshot = () => window.matchMedia(QUERY).matches;

// The server cannot know the preference, so it renders the motion-allowed
// branch and the value corrects itself on hydration. Anything that must be
// right before first paint uses the `data-motion` attribute the head probe
// stamps in layout.tsx instead.
const getServerSnapshot = () => false;

/**
 * Reads `prefers-reduced-motion` as reactive state.
 *
 * `useSyncExternalStore` rather than `useState` + `useEffect`: subscribing to
 * a browser API is exactly what it exists for, and it avoids the
 * set-state-in-effect pattern (which this repo's lint config rejects).
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

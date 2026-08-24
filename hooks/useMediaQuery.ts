"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query as reactive state.
 *
 * `useSyncExternalStore` rather than `useState` + `useEffect`: subscribing to a
 * browser API is precisely what it exists for, and it avoids the
 * set-state-in-effect pattern this repo's lint config rejects.
 *
 * The server cannot evaluate a media query, so `getServerSnapshot` returns
 * false and the value corrects itself on hydration. Anything that must be
 * right before first paint reads the `data-motion` attribute that the inline
 * probe in layout.tsx stamps on <html> instead.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query]
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query]
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

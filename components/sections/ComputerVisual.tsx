"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * The three.js scene is the heaviest thing on the site by a wide margin
 * (~358KB gz of three + @react-three, and the dominant share of main-thread
 * script evaluation). It is purely decorative, so it now loads under three
 * conditions instead of eagerly on every request:
 *
 *   1. never server-rendered            -> ssr: false
 *   2. never on touch or small screens  -> pointer: fine and >= md
 *   3. never before the page has loaded -> waits for the `load` event
 *
 * (3) is the important one: loading it eagerly put it directly in front of the
 * LCP image. Waiting for `load` guarantees it cannot compete with first paint.
 *
 * This also replaces the previous `<main>` wrapper, which was nested inside the
 * page's own `<main>` — invalid HTML and a duplicate landmark.
 */
const Scene = dynamic(() => import("../Scene"), {
  ssr: false,
  loading: () => null,
});

const DESKTOP_POINTER = "(min-width: 768px) and (pointer: fine)";

export default function ComputerVisual() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!window.matchMedia(DESKTOP_POINTER).matches) return;

    const arm = () => setShow(true);

    if (document.readyState === "complete") {
      arm();
      return;
    }

    window.addEventListener("load", arm, { once: true });
    return () => window.removeEventListener("load", arm);
  }, []);

  if (!show) return null;

  return (
    <div
      aria-hidden
      className="fixed bottom-20 left-1/2 z-20 -translate-x-1/2"
    >
      <div className="h-25">
        <Scene />
      </div>
    </div>
  );
}

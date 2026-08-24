"use client";

import dynamic from "next/dynamic";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useScrolledPast } from "@/hooks/useScrolledPast";
import { computer } from "@/motion/tokens";

/**
 * The three.js scene is the heaviest thing on the site by a wide margin
 * (~244KB gz of three + @react-three, plus a continuous `useFrame` loop). It is
 * purely decorative, so it loads under three conditions rather than eagerly:
 *
 *   1. never server-rendered            -> ssr: false
 *   2. never on touch or small screens  -> pointer: fine and >= md
 *   3. never while the hero is on screen -> only past `computer.revealAt`
 *
 * (3) replaced an earlier `load`-event gate. Waiting for scroll rather than
 * load means the bundle and the render loop stay out of the picture entirely
 * while the visitor is looking at the hero — which is also the LCP window.
 *
 * This also replaced a `<main>` wrapper that was nested inside the page's own
 * `<main>`: invalid HTML and a duplicate landmark.
 */
const Scene = dynamic(() => import("../Scene"), {
  ssr: false,
  loading: () => null,
});

const DESKTOP_POINTER = "(min-width: 768px) and (pointer: fine)";

export default function ComputerVisual() {
  const allowed = useMediaQuery(DESKTOP_POINTER);
  const { past, everPast } = useScrolledPast(computer.revealAt);

  /*
   * Mount on the first crossing, then stay mounted and let opacity follow
   * `past`. Unmounting on scroll-up would tear down the WebGL context and
   * re-fetch my_computer.glb every time — far more expensive than keeping one
   * idle canvas alive.
   */
  if (!allowed || !everPast) return null;

  return (
    <div
      aria-hidden
      className="reveal-fade fixed bottom-20 left-1/2 z-20 -translate-x-1/2"
      style={{
        opacity: past ? 1 : 0,
        pointerEvents: past ? "auto" : "none",
      }}
    >
      <div className="h-25">
        <Scene />
      </div>
    </div>
  );
}

"use client";

import { useGSAP } from "@gsap/react";
import { RefObject } from "react";

import { gsap, ScrollTrigger } from "@/motion/registry";
import { ease } from "@/motion/tokens";

interface Props {
  containerRef: RefObject<HTMLDivElement | null>;
  trackRef: RefObject<HTMLDivElement | null>;
}

/**
 * Pinned horizontal scroll for the gallery.
 *
 * Pinning hijacks the scroll direction, which is a classic vestibular trigger,
 * so the whole effect is gated behind `prefers-reduced-motion: no-preference`.
 * The reduced-motion path is not "the animation turned off" — it is a designed
 * alternative: CSS in globals.css turns the same track into a natively
 * scrollable, snap-aligned strip, so every image stays reachable.
 */
export function useHorizontalScroll({ containerRef, trackRef }: Props) {
  useGSAP(
    () => {
      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          full: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const conditions = context.conditions as
            | { full: boolean; reduced: boolean }
            | undefined;

          if (!conditions?.full) return;

          const getScrollAmount = () => track.scrollWidth - window.innerWidth;

          const tween = gsap.to(track, {
            x: () => -getScrollAmount(),
            ease: ease.none,
            scrollTrigger: {
              trigger: container,
              start: "top top",
              end: () => `+=${track.scrollWidth}`,
              scrub: 1,
              pin: true,
              invalidateOnRefresh: true,
            },
          });

          return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
          };
        }
      );

      // The track holds lazily-loaded images; until they have laid out, the
      // pin distance is computed from a stale scrollWidth and the section ends
      // early. Refresh once everything has settled.
      const refresh = () => ScrollTrigger.refresh();
      if (document.readyState === "complete") {
        refresh();
      } else {
        window.addEventListener("load", refresh, { once: true });
      }
      const fonts = document.fonts;
      if (fonts) fonts.ready.then(refresh).catch(() => {});

      return () => {
        window.removeEventListener("load", refresh);
        mm.revert();
      };
    },
    { scope: containerRef }
  );
}

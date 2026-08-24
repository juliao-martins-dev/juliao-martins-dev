"use client";

import { useGSAP } from "@gsap/react";
import { RefObject } from "react";

import { gsap, ScrollTrigger } from "@/motion/registry";
import { ease, gallery } from "@/motion/tokens";

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

          /*
           * Per-slide focus, driven off the horizontal tween itself.
           *
           * `containerAnimation` is ScrollTrigger's mechanism for triggering on
           * elements that move horizontally inside a scrubbed tween: start/end
           * are read against the slide's position within that tween rather than
           * against page scroll. Doing the maths by hand would drift out of
           * sync with the pin the moment anything re-flows.
           */
          const slides = gsap.utils.toArray<HTMLElement>(
            track.querySelectorAll("[data-gallery-item]")
          );

          const extras = slides.flatMap((slide) => {
            const built: gsap.core.Tween[] = [];

            // Slides arrive slightly small and dim, and settle at full size as
            // they reach the middle of the viewport.
            built.push(
              gsap.fromTo(
                slide,
                { scale: gallery.scaleFrom, autoAlpha: gallery.alphaFrom },
                {
                  scale: gallery.scaleTo,
                  autoAlpha: 1,
                  ease: ease.none,
                  scrollTrigger: {
                    trigger: slide,
                    containerAnimation: tween,
                    start: "left right",
                    end: "center center",
                    scrub: true,
                  },
                }
              )
            );

            // The media drifts against the track, which reads as depth rather
            // than a flat conveyor belt.
            const media = slide.querySelector<HTMLElement>("[data-gallery-media]");
            if (media) {
              built.push(
                gsap.fromTo(
                  media,
                  { xPercent: gallery.parallax },
                  {
                    xPercent: -gallery.parallax,
                    ease: ease.none,
                    scrollTrigger: {
                      trigger: slide,
                      containerAnimation: tween,
                      start: "left right",
                      end: "right left",
                      scrub: true,
                    },
                  }
                )
              );
            }

            return built;
          });

          return () => {
            extras.forEach((t) => {
              t.scrollTrigger?.kill();
              t.kill();
            });
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

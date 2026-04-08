import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Animate the About-section timeline on scroll-in.
 *
 * Targets are queried by class so the same call works for both the
 * mobile vertical layout and the desktop perspective-road layout.
 *
 * Created triggers are scoped (returned for cleanup) and not killed
 * globally — see hooks/useHorizontalScroll.ts for the previous bug.
 */
export function animateTimeline(root: HTMLElement) {
  const ctx = gsap.context(() => {
    const cards = root.querySelectorAll<HTMLElement>(".timeline-card");
    const lines = root.querySelectorAll<HTMLElement>(".timeline-line");
    const bases = root.querySelectorAll<HTMLElement>(".timeline-base");

    if (cards.length === 0) return;

    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
        // Don't pre-apply FROM state on mount. Otherwise React Strict Mode's
        // double-mount + ScrollTrigger `once: true` can leave cards stuck at
        // opacity:0 / y:50 if the trigger has already passed by the second
        // mount.
        immediateRender: false,
      },
      scrollTrigger: {
        trigger: root,
        start: "top 85%",
        once: true,
      },
    });

    tl.from(cards, {
      opacity: 0,
      y: 50,
      duration: 0.7,
      stagger: 0.15,
      // Clear inline styles so nothing GSAP wrote can linger as a stuck state.
      clearProps: "opacity,transform",
    });

    if (lines.length) {
      tl.from(
        lines,
        {
          scaleY: 0,
          transformOrigin: "top center",
          duration: 0.55,
          stagger: 0.15,
          clearProps: "transform",
        },
        "-=0.55"
      );
    }

    if (bases.length) {
      tl.from(
        bases,
        {
          opacity: 0,
          scale: 0.4,
          duration: 0.4,
          stagger: 0.15,
          ease: "back.out(1.8)",
          clearProps: "opacity,transform",
        },
        "-=0.35"
      );
    }
  }, root);

  return () => ctx.revert();
}

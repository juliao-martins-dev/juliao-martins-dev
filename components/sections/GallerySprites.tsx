"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import {
  SiCss3,
  SiGreensock,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiReact,
  SiTypescript,
} from "react-icons/si";

import { gsap } from "@/motion/registry";
import { duration, ease, sprites } from "@/motion/tokens";

/**
 * Official brand marks, via react-icons' Simple Icons set — already a
 * dependency, and accurate. Hand-authoring seven brand paths is how logos end
 * up subtly wrong.
 *
 * Next.js's mark is pure black, which disappears on the dark theme, so it
 * inherits the foreground token instead of a fixed hex.
 */
const LOGOS = [
  { Icon: SiHtml5, color: "#E34F26", label: "HTML5" },
  { Icon: SiCss3, color: "#1572B6", label: "CSS3" },
  { Icon: SiJavascript, color: "#F7DF1E", label: "JavaScript" },
  { Icon: SiTypescript, color: "#3178C6", label: "TypeScript" },
  { Icon: SiReact, color: "#61DAFB", label: "React" },
  { Icon: SiNextdotjs, color: "var(--color-foreground)", label: "Next.js" },
  { Icon: SiGreensock, color: "#88CE02", label: "GSAP" },
] as const;

/**
 * Sprinkles the stack's logos out of a gallery slide — once on first hover,
 * and again on every click.
 *
 * Not SplitText: that splits *text* into characters, and these slides are
 * images and videos with no text to split. This is a pooled sprite emitter,
 * which is the technique the effect actually needs.
 *
 * Entirely decorative, so it is `aria-hidden`, pointer-only, and adds no tab
 * stops — a keyboard or screen-reader user loses nothing, because nothing here
 * carries information. Under reduced motion it does not run at all.
 */
export default function GallerySprites() {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const templatesRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const overlay = overlayRef.current;
      const templates = templatesRef.current;
      if (!overlay || !templates) return;

      /*
       * Derived from this component's own node rather than passed-in refs.
       *
       * React attaches host refs bottom-up, so an ancestor's ref is still null
       * while a descendant's layout effect runs — passing the <section> ref in
       * meant `section` was always null here and the emitter silently never
       * armed. Only this component's own refs are guaranteed attached.
       */
      const section = overlay.closest<HTMLElement>("[data-gallery-viewport]");
      const track = section?.querySelector<HTMLElement>("[data-gallery-track]");
      if (!section || !track) return;

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

          // Reduced motion: a burst of flying particles is pure motion carrying
          // no information, so the designed state is simply no burst at all.
          if (!conditions?.full) return;

          const stamps = Array.from(
            templates.querySelectorAll<HTMLElement>("[data-sprite-template]")
          );
          if (stamps.length === 0) return;

          /*
           * A real pool, one bank per logo.
           *
           * The first version cloned a node per sprite and removed it on
           * complete. Measured at 4x CPU throttle while scrolling that was
           * 27fps and 33 long tasks: the cost is DOM churn plus a compositor
           * layer per node from an explicit will-change. Nodes are now created
           * once, capped, and reused — banks are per logo because a recycled
           * node still carries its own SVG.
           */
          const perLogo = Math.max(1, Math.floor(sprites.max / stamps.length));

          type Bank = {
            stamp: HTMLElement;
            free: HTMLElement[];
            busy: { node: HTMLElement; tl: gsap.core.Timeline }[];
            made: number;
          };

          const banks: Bank[] = stamps.map((stamp) => ({
            stamp,
            free: [],
            busy: [],
            made: 0,
          }));

          const acquire = (bank: Bank): HTMLElement => {
            const spare = bank.free.pop();
            if (spare) return spare;

            if (bank.made < perLogo) {
              const node = bank.stamp.cloneNode(true) as HTMLElement;
              node.removeAttribute("data-sprite-template");
              node.style.position = "absolute";
              node.style.left = "0";
              node.style.top = "0";
              // No will-change: GSAP promotes transformed elements itself, and
              // a standing layer per sprite is what made this expensive.
              overlay.appendChild(node);
              bank.made += 1;
              return node;
            }

            // At cap: steal the oldest in-flight sprite of this logo.
            const oldest = bank.busy.shift();
            if (oldest) {
              oldest.tl.kill();
              return oldest.node;
            }
            return bank.stamp;
          };

          const release = (bank: Bank, node: HTMLElement) => {
            const i = bank.busy.findIndex((e) => e.node === node);
            if (i !== -1) bank.busy.splice(i, 1);
            gsap.set(node, { autoAlpha: 0 });
            bank.free.push(node);
          };

          const burstFrom = (slide: Element) => {
            const slideBox = slide.getBoundingClientRect();
            const sectionBox = section.getBoundingClientRect();
            const originX = slideBox.left - sectionBox.left + slideBox.width / 2;
            const originY = slideBox.top - sectionBox.top + slideBox.height / 2;

            banks.forEach((bank, i) => {
              // Evenly fan the seven logos, jittered so repeat clicks on the
              // same slide do not stack identical bursts.
              const angle =
                (i / banks.length) * Math.PI * 2 + Math.random() * 0.6;
              const distance =
                sprites.travel + Math.random() * sprites.travelJitter;

              const node = acquire(bank);
              const tl = gsap.timeline({
                onComplete: () => release(bank, node),
              });
              bank.busy.push({ node, tl });

              tl.fromTo(
                node,
                { x: originX, y: originY, scale: 0, autoAlpha: 0, rotation: 0 },
                {
                  scale: 1,
                  autoAlpha: 1,
                  duration: sprites.popIn,
                  ease: ease.out,
                }
              )
                .to(
                  node,
                  {
                    x: originX + Math.cos(angle) * distance,
                    y: originY + Math.sin(angle) * distance,
                    rotation: gsap.utils.random(-sprites.spin, sprites.spin),
                    duration: sprites.drift,
                    ease: ease.out,
                  },
                  0
                )
                .to(
                  node,
                  {
                    autoAlpha: 0,
                    scale: 0.6,
                    duration: sprites.fade,
                    ease: ease.in,
                  },
                  `>-${duration.sm}`
                );
            });
          };

          /*
           * Delegated from the track rather than 20 React handlers on the
           * slides. `pointerenter` does not bubble, so this listens for
           * `pointerover` and remembers which slides have already greeted the
           * visitor — first hover fires once, clicks fire every time.
           */
          const greeted = new WeakSet<Element>();

          const onPointerOver = (event: PointerEvent) => {
            const slide = (event.target as Element | null)?.closest(
              "[data-gallery-item]"
            );
            if (!slide || greeted.has(slide)) return;
            greeted.add(slide);
            burstFrom(slide);
          };

          const onClick = (event: MouseEvent) => {
            const slide = (event.target as Element | null)?.closest(
              "[data-gallery-item]"
            );
            if (!slide) return;
            burstFrom(slide);
          };

          track.addEventListener("pointerover", onPointerOver);
          track.addEventListener("click", onClick);

          return () => {
            track.removeEventListener("pointerover", onPointerOver);
            track.removeEventListener("click", onClick);
            banks.forEach((bank) => {
              bank.busy.forEach((e) => e.tl.kill());
              bank.busy = [];
              bank.free = [];
            });
            overlay.replaceChildren();
          };
        }
      );

      return () => mm.revert();
    },
    { scope: overlayRef }
  );

  return (
    <>
      {/*
        Rendered once, never shown. Bursts clone these nodes rather than
        mounting React components per particle.
      */}
      <div ref={templatesRef} hidden aria-hidden>
        {LOGOS.map(({ Icon, color, label }) => (
          <span
            key={label}
            data-sprite-template=""
            style={{ color, display: "inline-flex" }}
          >
            <Icon size={sprites.size} />
          </span>
        ))}
      </div>

      <div
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
      />
    </>
  );
}

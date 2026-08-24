"use client";

import { useGSAP } from "@gsap/react";
import { useLocale } from "next-intl";
import { useRef } from "react";

import { formatStack, heroCopy, isHeroLocale } from "@/content/hero";
import { gsap, SplitText } from "@/motion/registry";
import { ease, hero, staggerAmount } from "@/motion/tokens";

/**
 * The role/stack morph — the hero's signature interaction.
 *
 * Both states are real text in the server-rendered HTML. The layout mode is
 * chosen in CSS from the `data-motion` attribute that an inline probe stamps
 * on <html> before first paint, so this component never decides *whether*
 * content is visible — only how it moves. With JS disabled, or with reduced
 * motion, the CSS static state stands on its own and nothing here runs.
 */
export default function HeroRoleMorph() {
  const locale = useLocale();
  const copy = heroCopy[isHeroLocale(locale) ? locale : "en"];

  const scope = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      // If the head probe never ran, CSS is showing the static state. Animating
      // on top of that would mask state A away while state B sits in normal
      // flow below it, so stand down.
      if (document.documentElement.dataset.motion !== "full") return;

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

          // Reduced-motion branch. The designed static state is delivered
          // entirely by CSS — both roles, both stacks and the connector in
          // normal flow. There is nothing to animate and nothing to undo, so
          // we deliberately build no timeline rather than "disabling" one.
          if (!conditions?.full) return;

          const pick = <T extends HTMLElement>(selector: string): T | null =>
            root.querySelector<T>(selector);

          const connector = pick("[data-hero-connector]");
          const stateA = pick('[data-hero-state="a"]');
          const stateB = pick('[data-hero-state="b"]');
          const roleAEl = pick('[data-hero-state="a"] [data-hero-role]');
          const stackAEl = pick('[data-hero-state="a"] [data-hero-stack]');
          const roleBEl = pick('[data-hero-state="b"] [data-hero-role]');
          const stackBEl = pick('[data-hero-state="b"] [data-hero-stack]');

          if (
            !connector || !stateA || !stateB ||
            !roleAEl || !stackAEl || !roleBEl || !stackBEl
          ) {
            return;
          }

          let roleA: SplitText | null = null;
          let stackA: SplitText | null = null;
          let roleB: SplitText | null = null;
          let stackB: SplitText | null = null;

          let timeline: gsap.core.Timeline | null = null;
          let frame = 0;

          const build = () => {
            if (!roleA?.chars || !stackA?.lines || !roleB?.chars || !stackB?.lines) {
              return;
            }

            // Absolute offsets, all derived from tokens. Resolving them here
            // rather than with relative position strings keeps the documented
            // budget in motion/tokens.ts literally true:
            //   1.60 connector  ->  1.66 A out  ->  1.90 B in  ->  2.48 rest
            const atConnector = hero.holdA;
            const atOut = atConnector + hero.connectorIn + hero.outOverlap;
            const atIn =
              atOut + hero.stateOut + staggerAmount.tight + hero.inOverlap;

            // Carry the playhead across a re-split (a font swap or a resize)
            // so the hold restarts from where it was rather than from zero.
            const elapsed = timeline ? timeline.totalTime() : 0;
            timeline?.kill();

            const tl = gsap.timeline({
              // Requested: the headline cycles A <-> B indefinitely. Measured
              // at roughly 7 Lighthouse points and +600ms scripting versus
              // play-once. Only ever built inside the no-preference branch.
              repeat: -1,
              yoyo: true,
              repeatDelay: hero.holdB,
            });

            tl.fromTo(
              connector,
              { autoAlpha: 0, yPercent: hero.connectorRise },
              {
                autoAlpha: 1,
                yPercent: 0,
                duration: hero.connectorIn,
                ease: ease.out,
              },
              atConnector
            );

            // State A masks out upward. Each char and line rides up inside its
            // own SplitText mask, so nothing bleeds outside the slot.
            // Split-flap: the char rotates away on its X axis as it rides up
            // inside its mask. transformOrigin is pushed back in Z so the flip
            // pivots on the "hinge" rather than through the glyph's middle.
            tl.to(
              roleA.chars,
              {
                yPercent: hero.outShift,
                rotationX: hero.flipOut,
                // Per-element, not a CSS `perspective` on an ancestor: the char
                // sits inside a SplitText mask wrapper, and CSS perspective
                // only reaches direct children, so an ancestor value would
                // leave the flip looking like a flat squash.
                transformPerspective: hero.perspective,
                transformOrigin: "50% 100% -0.5em",
                duration: hero.stateOut,
                ease: ease.in,
                stagger: { amount: staggerAmount.tight, from: "start" },
              },
              atOut
            );

            tl.to(
              stackA.lines,
              {
                yPercent: hero.outShift,
                duration: hero.stateOut,
                ease: ease.in,
                stagger: { amount: staggerAmount.tight },
              },
              atOut
            );

            tl.set(stateA, { autoAlpha: 0 }, atIn);
            tl.set(stateB, { autoAlpha: 1 }, atIn);

            // State B masks in from below, overlapping A's exit by design —
            // that overlap is what reads as one line replacing another rather
            // than a crossfade.
            tl.fromTo(
              roleB.chars,
              {
                yPercent: hero.inShift,
                rotationX: hero.flipIn,
                transformPerspective: hero.perspective,
              },
              {
                yPercent: 0,
                rotationX: 0,
                transformPerspective: hero.perspective,
                transformOrigin: "50% 0% -0.5em",
                duration: hero.stateIn,
                ease: ease.out,
                stagger: { amount: staggerAmount.base, from: "start" },
              },
              atIn
            );

            tl.fromTo(
              stackB.lines,
              { yPercent: hero.inShift },
              {
                yPercent: 0,
                duration: hero.stateIn,
                ease: ease.out,
                stagger: { amount: staggerAmount.base },
              },
              atIn
            );

            timeline = tl;

            // Carry the playhead across a re-split so a font swap or resize
            // does not visibly restart the cycle. totalTime, not time, because
            // the timeline repeats.
            if (elapsed > 0) tl.totalTime(elapsed);
          };

          // Four splits report independently; coalesce them into one rebuild
          // on the next frame so we construct a single master timeline.
          const scheduleBuild = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(build);
          };

          const split = (
            element: HTMLElement,
            type: "chars" | "lines"
          ): SplitText =>
            SplitText.create(element, {
              type,
              mask: type,
              autoSplit: true,
              onSplit: scheduleBuild,
            });

          // Split at mount. Deferring this to requestIdleCallback was measured
          // and rejected: it did not move Style & Layout (the cost is webfont
          // application, not splitting), and on a page this script-heavy the
          // idle callback did not fire until ~10s, which pushed the morph far
          // outside its 2.5s budget. Deterministic timing wins.
          //
          // Roles are two short display words, so chars. Stacks are wrapping
          // body lines, so lines. Both masked.
          roleA = split(roleAEl, "chars");
          stackA = split(stackAEl, "lines");
          roleB = split(roleBEl, "chars");
          stackB = split(stackBEl, "lines");

          return () => {
            cancelAnimationFrame(frame);
            timeline?.kill();
            roleA?.revert();
            stackA?.revert();
            roleB?.revert();
            stackB?.revert();
          };
        }
      );

      return () => mm.revert();
    },
    { scope }
  );

  return (
    <div ref={scope} className="w-full">
      {/*
        The accessible truth, as one coherent sentence. The visual layer below
        is aria-hidden because state A stays in the DOM after it is masked
        away, and would otherwise still be announced as present.
      */}
      <p className="sr-only">{copy.srSummary}</p>

      <div aria-hidden="true" data-hero-stage="">
        <div data-hero-state="a">
          <p
            data-hero-role=""
            className="text-role font-semibold text-foreground"
          >
            {copy.roleA}
          </p>
          <p
            data-hero-stack=""
            className="text-stack font-mono text-pretty text-muted-foreground"
          >
            {formatStack(copy.stackA)}
          </p>
        </div>

        <p
          data-hero-connector=""
          className="text-eyebrow font-mono uppercase text-hero-accent"
        >
          {copy.connector}
        </p>

        <div data-hero-state="b">
          <p
            data-hero-role=""
            className="text-role font-semibold text-foreground"
          >
            {copy.roleB}
          </p>
          <p
            data-hero-stack=""
            className="text-stack font-mono text-pretty text-muted-foreground"
          >
            {formatStack(copy.stackB)}
          </p>
        </div>
      </div>

      {/*
        The persistent honesty line. Server-rendered, always visible, never
        animated — so it stands even if the morph never initialises.
      */}
      <p className="mt-8 border-t border-hero-rule pt-5 text-note text-muted-foreground">
        {copy.current.prefix}{" "}
        <strong className="font-medium text-foreground">
          {copy.current.role}
        </strong>{" "}
        {copy.current.suffix}
      </p>
    </div>
  );
}

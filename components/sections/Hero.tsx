import Image from "next/image";

import { heroCopy } from "@/content/hero";
import portrait from "@/public/juliao_martins.jpg";

import SpriteBurst from "@/components/motion/SpriteBurst";

import HeroRoleMorph from "./HeroRoleMorph";

/**
 * Server component. Owns the photo and the <h1> — the two things that must
 * never depend on JavaScript, and that GSAP is never allowed to touch.
 *
 * The name and the alt text are proper nouns, identical in every locale, so
 * they are read straight from the English copy. Everything locale-dependent
 * lives in the client leaf.
 */
export default function Hero() {
  return (
    <section
      id="home"
      data-sprite-scope=""
      className="relative flex min-h-svh items-center justify-center px-5 py-24"
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        {/*
          LCP element. Static import supplies the intrinsic dimensions and the
          blur placeholder; the square CSS box fixes the layout before the
          bytes arrive, so there is no shift.
        */}
        {/*
          Fixed-size avatar, so explicit square width/height rather than
          `sizes`. Passing `sizes` made next/image emit a 15-candidate
          w-descriptor srcset whose `src` fallback was w=3840 — a 10x upscale
          of a 354px source. Square dimensions give a tight 1x/2x srcset and
          match the rendered box, so the aspect ratio reserves correctly.
        */}
        <Image
          src={portrait}
          alt={heroCopy.en.photoAlt}
          width={176}
          height={176}
          placeholder="blur"
          priority
          className="mb-7 size-32 rounded-full object-cover object-top ring-1 ring-border md:size-44"
        />

        <h1 className="text-name mb-6 font-semibold text-foreground">
          {heroCopy.en.name}
        </h1>

        <HeroRoleMorph />
      </div>

      {/*
        One emitter per role, each with its own logo set. Scoped to the whole
        section rather than the role line: the stage is only a couple of lines
        tall, and an overlay that size clipped every sprite before it could
        fall. Here they have the full hero to drop through.
      */}
      <SpriteBurst
        set="stack"
        trigger='[data-hero-state="a"] [data-hero-role]'
      />
      <SpriteBurst
        set="ai"
        trigger='[data-hero-state="b"] [data-hero-role]'
      />
    </section>
  );
}

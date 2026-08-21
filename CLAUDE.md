# CLAUDE.md — Stunning Website

Project rules for every session. Read this fully before writing code. Full reference and prompt library live in the project doc "Stunning Website — Project Instructions".

**What we are building:** a portfolio / creative-studio website that feels premium — smooth, responsive, fast, accessible. Motion is central, but content always works without it.

---

## Stack (locked — do not swap or add alternatives)

- **Next.js 16.3 App Router** · React 19.2 · TypeScript strict (no `any`)
- **Tailwind CSS v4.3** via `@tailwindcss/postcss`, CSS-first config. **No `tailwind.config.js` exists in this repo — do not create one.**
- **GSAP 3.15** + `@gsap/react` 2.1 (`useGSAP`). All plugins are free — ScrollTrigger, SplitText, ScrollSmoother, MorphSVG, DrawSVG.
- **Lenis 1.3** for smooth scroll (or GSAP ScrollSmoother — one of them, never both)
- pnpm. No other animation library: **no Framer Motion, no AOS, no Locomotive, no jQuery.**

## Next.js 16 — things that changed since your training data

Before writing Next-specific APIs, read the bundled docs in `node_modules/next/dist/docs/`.

- `params`, `searchParams`, `cookies()`, `headers()`, `draftMode()` are **async** — always `await`. Use `npx next typegen` → `PageProps<'/work/[slug]'>`.
- `middleware.ts` → **`proxy.ts`**, exporting `proxy()`. Node runtime only.
- `next lint` is **removed**. ESLint flat config / Biome CLI only.
- Turbopack is the default — no `--turbopack` flag in scripts.
- `next/image`: use `remotePatterns` (not `domains`); default `qualities` is `[75]`; default `minimumCacheTTL` is 4h.
- Parallel-route slots need an explicit `default.tsx`.
- `revalidateTag(tag, profile)` takes two args; use `updateTag()` in Server Actions for read-your-writes.
- PPR = top-level `cacheComponents: true`. Do not enable it without asking.

---

## Architecture

```
app/  components/{ui,layout,sections}  motion/{tokens.ts,registry.ts,primitives}  lib/  content/  styles/globals.css
```

- **Server Components by default.** `"use client"` goes on the smallest leaf that needs GSAP, state, or a browser API — never on a layout, a page, or a whole section.
- All animated content must be present in the server-rendered HTML and readable with JS disabled.
- Static rendering for all portfolio routes; `generateStaticParams` + `generateMetadata` on every dynamic route.

---

## Design system

- All tokens live in `@theme` inside `styles/globals.css`: colors in **OKLCH**, fluid type via `clamp()`, one spacing rhythm, 4 breakpoints, easing + duration tokens.
- **No arbitrary values** for anything that has a token (`text-[52px]` = bug, `text-h1` = correct).
- **No `@apply`** for component styling — compose utilities in JSX, or declare a real `@utility`.
- **Mobile-first**, always. Base styles target 360px, then `md:` / `lg:`. Use container queries for components that live in varying widths.
- Two font families max, via `next/font` only. Never a `<link>` to a font CDN.
- Every interactive element has rest / hover / focus-visible / active-disabled states.

---

## Motion rules (the part that gets broken most often)

1. **`useGSAP()` only** — never `useEffect` for animation. Always pass `{ scope: ref }`. Wrap post-mount handlers in `contextSafe()`.
2. **`gsap.registerPlugin` runs only in `motion/registry.ts`.** Import gsap and plugins from `@/motion/registry`, nowhere else.
3. **Durations, eases and staggers come from `motion/tokens.ts`.** No hardcoded numbers.
4. **Animate transform + opacity + clip-path only.** Never `width`, `height`, `top`, `left`, `margin`, or `filter` on scroll.
5. **Every animation has a `prefers-reduced-motion` branch** via `gsap.matchMedia()` that shows content instantly. Not "disabled" — a designed static state.
6. Entrances: 0.6–0.9s, `power3.out`, `start: "top 80%"`, `once: true`. Micro-interactions: 0.15–0.25s. Stagger 0.06–0.12s. Page transitions ≤ 1.0s total.
7. `ScrollTrigger.batch()` for grids of 6+ items. At most **one pinned section per page**, never below `md`. `ScrollTrigger.refresh()` after fonts/images load and after route transitions.
8. `SplitText`: lines for headings (`mask: "lines"`, `autoSplit: true`, animation created inside `onSplit()`), chars only for short display words. Always `revert()` on cleanup.
9. Magnetic buttons / custom cursor: desktop + `pointer: fine` only.
10. Maximum **three signature interactions site-wide** — a language, not a demo reel.

---

## Performance budget

LCP ≤ 2.0s · CLS ≤ 0.02 · INP ≤ 150ms · Lighthouse mobile ≥ 95 / 100 / 100 / 95 · home-route client JS ≤ 180KB gz · 60fps scroll on 4× throttled CPU.

- `next/image` everywhere, explicit dimensions or sized parent, correct `sizes`, `priority` on the LCP image only.
- Background video: `preload="metadata"`, poster, `playsInline`, paused off-screen. Never autoplaying video above the fold on mobile.
- `next/dynamic` for heavy below-the-fold sections (WebGL, maps, sliders).
- Check `npx @next/bundle-analyzer` before adding any dependency ≥ 20KB.

---

## Accessibility

One `<h1>` per page · real `<button>`/`<a>` · visible `:focus-visible` · skip link · focus trapped and restored in the mobile menu · contrast ≥ 4.5:1 body, ≥ 3:1 large/UI · meaningful `alt` (empty for decorative) · touch targets ≥ 44px · no horizontal overflow at any width or at 200% zoom.

---

## Definition of done (all must pass before you say a task is complete)

1. `pnpm build` clean — zero TS errors, zero lint errors
2. Page works with JavaScript disabled
3. No layout shift
4. 60fps scroll, no long tasks > 50ms
5. Reduced-motion path verified
6. Keyboard-only pass, no traps
7. Responsive at 360 / 768 / 1024 / 1440 / 1920 and at 200% zoom
8. Lighthouse mobile meets budget
9. No `console.log`, no `any`, no `tailwind.config.js`, no hardcoded motion values, no second animation library
10. `generateMetadata` + OG image on every new route

---

## Working agreement

- **Plan before code** on anything non-trivial. Show the plan, wait for approval.
- **One section or one route per change.** Do not scaffold the whole site in one pass.
- **Verify, don't claim.** Run the build, take screenshots, run Lighthouse, and report what you actually tested — including what you could not verify.
- If a requirement here conflicts with what the user asks for, say so and ask; do not silently break the rule.
- When migrating legacy code: rebuild with our tokens, never port the old CSS, and delete the old library in the same change.

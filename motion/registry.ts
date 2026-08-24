"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import { SplitText } from "gsap/SplitText";

/**
 * The ONLY place in this codebase where a GSAP plugin is registered.
 * Import gsap and every plugin from here — never from "gsap" directly —
 * so registration can never be duplicated or missed.
 */
gsap.registerPlugin(ScrollTrigger, SplitText, Physics2DPlugin);

export { gsap, ScrollTrigger, SplitText, Physics2DPlugin };

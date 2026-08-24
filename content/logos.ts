import type { IconType } from "react-icons";
import {
  SiAnthropic,
  SiCss3,
  SiGreensock,
  SiHtml5,
  SiHuggingface,
  SiJavascript,
  SiLangchain,
  SiNextdotjs,
  SiOpenai,
  SiPython,
  SiReact,
  SiTypescript,
} from "react-icons/si";

export type Logo = {
  Icon: IconType;
  /** Brand hex, or a theme token where the mark is monochrome. */
  color: string;
  label: string;
};

/**
 * `var(--color-foreground)` rather than a hex for marks that are monochrome in
 * their own branding (Next.js, OpenAI, Anthropic, LangChain). Two reasons:
 * a fixed black disappears on the dark theme, and inventing a brand hex I am
 * not sure of is worse than using the page's own ink. Supply exact values and
 * they can be swapped in here.
 */
const MONO = "var(--color-foreground)";

/** The stack Julião works in today — paired with the "Junior Developer" role. */
export const STACK_LOGOS: Logo[] = [
  { Icon: SiHtml5, color: "#E34F26", label: "HTML5" },
  { Icon: SiCss3, color: "#1572B6", label: "CSS3" },
  { Icon: SiJavascript, color: "#F7DF1E", label: "JavaScript" },
  { Icon: SiTypescript, color: "#3178C6", label: "TypeScript" },
  { Icon: SiReact, color: "#61DAFB", label: "React" },
  { Icon: SiNextdotjs, color: MONO, label: "Next.js" },
  { Icon: SiGreensock, color: "#88CE02", label: "GSAP" },
];

/** Where he is heading — paired with the "AI Engineer" role. */
export const AI_LOGOS: Logo[] = [
  { Icon: SiPython, color: "#3776AB", label: "Python" },
  { Icon: SiOpenai, color: MONO, label: "OpenAI" },
  { Icon: SiAnthropic, color: MONO, label: "Anthropic" },
  { Icon: SiHuggingface, color: "#FFD21E", label: "Hugging Face" },
  { Icon: SiLangchain, color: MONO, label: "LangChain" },
];

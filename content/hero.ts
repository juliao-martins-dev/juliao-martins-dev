/**
 * Hero copy. Every string here is supplied verbatim by Julião — nothing in
 * this file may be paraphrased, embellished or invented.
 */

export type HeroCopy = {
  /** Proper noun. Identical in every locale. Rendered as plain text in the <h1>. */
  name: string;
  photoAlt: string;
  roleA: string;
  stackA: readonly string[];
  connector: string;
  roleB: string;
  stackB: readonly string[];
  /** The persistent honesty line. Never animated, never hidden. */
  current: {
    prefix: string;
    role: string;
    suffix: string;
  };
  /**
   * The single coherent sentence assistive tech reads. The visual morph layer
   * is aria-hidden, because state A stays in the DOM after it is masked away
   * and would otherwise still be announced as present.
   */
  srSummary: string;
};

const en: HeroCopy = {
  name: "Julião Martins",
  photoAlt: "Julião Martins",
  roleA: "Junior Developer",
  stackA: ["TypeScript", "React", "React Native", "Next.js", "Tailwind CSS"],
  connector: "Transitioning to",
  roleB: "AI Engineer",
  stackB: ["Python", "NLP", "LLMs", "LangChain", "Hugging Face"],
  current: {
    prefix: "Currently",
    role: "IT Collaborator",
    suffix: "at Viettel Timor (Telemor)",
  },
  srSummary:
    "Junior Developer, transitioning to AI Engineer. " +
    "Current stack: TypeScript, React, React Native, Next.js, Tailwind CSS. " +
    "Moving into: Python, NLP, LLMs, LangChain, Hugging Face.",
};

/**
 * TODO — Tetum translation needed.
 *
 * `connector`, `current` and `srSummary` are real prose and must be translated
 * by Julião. Role titles and technology names stay in English by convention.
 * Until a translation is supplied this falls back to `en`, so the Tetum site
 * shows English hero copy rather than a missing-key error.
 */
const te: HeroCopy = { ...en };

export const heroCopy = { en, te } as const;

export type HeroLocale = keyof typeof heroCopy;

export const isHeroLocale = (value: string): value is HeroLocale =>
  Object.prototype.hasOwnProperty.call(heroCopy, value);

/** U+00A0 no-break space. */
const NBSP = " ";
/** U+00B7 middle dot, the stack separator. */
const SEPARATOR = "·";

/**
 * Join a stack for display. Spaces *inside* a technology name become
 * non-breaking, so "React Native" and "Hugging Face" can never be split across
 * two lines, while the list as a whole still wraps freely at 360px.
 */
export const formatStack = (stack: readonly string[]): string =>
  stack.map((item) => item.split(" ").join(NBSP)).join(` ${SEPARATOR} `);

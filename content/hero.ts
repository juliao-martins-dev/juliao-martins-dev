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
 * Tetum.
 *
 * Deliberately unchanged from `en`:
 *  - `name` / `photoAlt` — a proper noun.
 *  - `stackA` / `stackB` — technology names, which are not translated.
 *  - `roleA` / `roleB` — English role titles, matching how messages/te.json
 *    already writes "Junior developer" inside Tetum sentences.
 *
 * Everything else is real prose and is translated below.
 *
 * REVIEW NEEDED: written by Claude, who is not a native Tetum speaker.
 * Julião should check the wording before this ships.
 */
const te: HeroCopy = {
  ...en,
  connector: "Transisaun ba",
  current: {
    prefix: "Agora dadaun",
    role: "IT Kolaborador",
    suffix: "iha Viettel Timor (Telemor)",
  },
  srSummary:
    "Junior Developer, iha transisaun ba AI Engineer. " +
    "Teknolojia atuál: TypeScript, React, React Native, Next.js, Tailwind CSS. " +
    "Aprende hela: Python, NLP, LLMs, LangChain, Hugging Face.",
};

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

"use client";

import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useIntlSwitcher } from "./IntlProvider";

/* -------------------------------------------------------------------------- */
/*  Flag icons — inline SVG, no external deps                                 */
/* -------------------------------------------------------------------------- */

type FlagProps = { className?: string };

function FlagUS({ className }: FlagProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-block overflow-hidden rounded-[3px] ring-1 ring-black/10 shadow-sm",
        className
      )}
    >
      <svg
        viewBox="0 0 60 30"
        className="block h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Red field */}
        <rect width="60" height="30" fill="#B22234" />
        {/* 6 white stripes (13 total) */}
        {[1, 3, 5, 7, 9, 11].map((i) => (
          <rect
            key={i}
            y={(i * 30) / 13}
            width="60"
            height={30 / 13}
            fill="#FFFFFF"
          />
        ))}
        {/* Blue canton — covers the top 7 stripes */}
        <rect width="24" height={(30 * 7) / 13} fill="#3C3B6E" />
        {/* Tiny star dots — purely decorative at this size */}
        <g fill="#FFFFFF">
          {[3, 7, 11, 15, 19].map((x) =>
            [2.5, 6, 9.5, 13].map((y) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="0.6" />
            ))
          )}
        </g>
      </svg>
    </span>
  );
}

function FlagTL({ className }: FlagProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-block overflow-hidden rounded-[3px] ring-1 ring-black/10 shadow-sm",
        className
      )}
    >
      <svg
        viewBox="0 0 60 30"
        className="block h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Red field */}
        <rect width="60" height="30" fill="#DC241F" />
        {/* Yellow triangle */}
        <path d="M0 0 L30 15 L0 30 Z" fill="#FFC726" />
        {/* Black triangle */}
        <path d="M0 0 L22 15 L0 30 Z" fill="#000000" />
        {/* White 5-point star centred on the black triangle */}
        <path
          d="M9 10.2 L10.18 13.83 L14 13.83 L10.91 16.07 L12.09 19.7 L9 17.46 L5.91 19.7 L7.09 16.07 L4 13.83 L7.82 13.83 Z"
          fill="#FFFFFF"
        />
      </svg>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Language registry                                                         */
/* -------------------------------------------------------------------------- */

type Language = {
  code: string;
  name: string;
  Flag: (props: FlagProps) => React.ReactElement;
};

const LANGUAGES: Language[] = [
  { code: "en", name: "English", Flag: FlagUS },
  { code: "te", name: "Tetum", Flag: FlagTL },
];

const normalizeLocale = (locale: string) =>
  locale.toLowerCase().split(/[-_]/)[0];

/* -------------------------------------------------------------------------- */
/*  Switcher                                                                  */
/* -------------------------------------------------------------------------- */

type LanguageSwitcherProps = {
  className?: string;
};

export default function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, setLocale } = useIntlSwitcher();
  const activeCode = normalizeLocale(locale);
  const activeLang =
    LANGUAGES.find((l) => l.code === activeCode) ?? LANGUAGES[0];
  const ActiveFlag = activeLang.Flag;

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => setOpen(false), []);

  // Dismiss on outside click / Escape while open.
  useEffect(() => {
    if (!open) return;

    const handlePointer = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, close]);

  const handleSelect = (code: string) => {
    if (code !== activeCode) setLocale(code);
    close();
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* ---- Trigger ---- */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
        className={cn(
          "group flex cursor-pointer items-center gap-2 rounded-full",
          "border border-border/60 bg-background/70 px-3 py-1.5 text-sm font-medium text-foreground",
          "shadow-sm backdrop-blur-md transition-all duration-200",
          "hover:border-border hover:bg-background hover:shadow-md",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        <ActiveFlag className="h-3.5 w-7" />
        <span className="hidden sm:inline">{activeLang.name}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {/* ---- Dropdown ---- */}
      <div
        role="listbox"
        aria-label="Languages"
        className={cn(
          "absolute right-0 top-[calc(100%+10px)] z-50 min-w-[180px] origin-top-right",
          "overflow-hidden rounded-xl border border-border/60 bg-background/95 p-1.5",
          "shadow-[0_24px_48px_-18px_rgba(15,23,42,0.4)] backdrop-blur-xl",
          "transition-all duration-200 ease-out",
          open
            ? "translate-y-0 scale-100 opacity-100 pointer-events-auto"
            : "-translate-y-1 scale-95 opacity-0 pointer-events-none"
        )}
      >
        {LANGUAGES.map((lang) => {
          const isActive = lang.code === activeCode;
          const Flag = lang.Flag;
          return (
            <button
              key={lang.code}
              type="button"
              role="option"
              aria-selected={isActive}
              onClick={() => handleSelect(lang.code)}
              className={cn(
                "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                "transition-colors duration-150",
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <Flag className="h-3.5 w-7 shrink-0" />
              <span className="flex-1 text-left">{lang.name}</span>
              {isActive && (
                <Check
                  className="h-4 w-4 shrink-0 text-primary"
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

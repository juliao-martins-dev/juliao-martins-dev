"use client";

import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "te", label: "TE" }
];

const setLocaleCookie = (locale: string) => {
  document.cookie = `locale=${locale}; path=/`;
};

const normalizeLocale = (locale: string) =>
  locale.toLowerCase().split(/[-_]/)[0];

type LanguageSwitcherProps = {
  className?: string;
};

export default function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const router = useRouter();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const activeLanguage = normalizeLocale(locale);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
    ready: false
  });
  const glossWidth = Math.max(indicator.width - 8, 0);

  const updateIndicator = useCallback(() => {
    const index = LANGUAGES.findIndex((lang) => lang.code === activeLanguage);
    const activeButton = buttonRefs.current[index];

    if (!activeButton) return;

    setIndicator({
      left: activeButton.offsetLeft,
      width: activeButton.offsetWidth,
      ready: true
    });
  }, [activeLanguage]);

  useEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  useEffect(() => {
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  const changeLanguage = (code: string) => {
    if (code === activeLanguage || isPending) return;

    setLocaleCookie(code);
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center overflow-hidden rounded-full border border-border/60 bg-muted/30 p-1 dark:border-red-200/25 dark:bg-gradient-to-br dark:from-red-500/20 dark:via-rose-500/14 dark:to-red-900/22 dark:backdrop-blur-xl dark:ring-1 dark:ring-inset dark:ring-white/10 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),inset_0_-1px_0_rgba(127,29,29,0.45),0_18px_40px_-26px_rgba(248,113,113,0.98)]",
        className
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 dark:opacity-100 dark:bg-[radial-gradient(125%_110%_at_50%_0%,rgba(254,226,226,0.28),rgba(251,113,133,0.1)_45%,rgba(69,10,10,0.18)_100%)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-1 top-1 h-[42%] rounded-full opacity-0 transition-opacity duration-300 dark:opacity-100 dark:bg-gradient-to-b dark:from-white/30 dark:to-white/0"
      />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute bottom-1 top-1 rounded-full bg-background shadow-sm transition-[left,width,opacity,box-shadow,background-color,border-color] duration-300 ease-out dark:border dark:border-red-100/45 dark:bg-gradient-to-br dark:from-red-300/68 dark:via-rose-500/62 dark:to-red-700/52 dark:backdrop-blur-lg dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.42),inset_0_-1px_1px_rgba(127,29,29,0.55),0_14px_32px_-14px_rgba(248,113,113,0.95)]",
          !indicator.ready && "opacity-0"
        )}
        style={{
          left: indicator.left,
          width: indicator.width
        }}
      />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-[6px] h-[36%] rounded-full bg-gradient-to-b from-white/55 to-white/0 transition-[left,width,opacity] duration-300 ease-out",
          !indicator.ready && "opacity-0"
        )}
        style={{
          left: indicator.left + 4,
          width: glossWidth
        }}
      />
      {LANGUAGES.map((l, index) => (
        <button
          key={l.code}
          ref={(node) => {
            buttonRefs.current[index] = node;
          }}
          onClick={() => changeLanguage(l.code)}
          disabled={isPending}
          className={cn(
            "relative z-10 cursor-pointer rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-[color,transform] duration-300",
            activeLanguage === l.code
              ? "text-foreground dark:text-white dark:drop-shadow-[0_2px_5px_rgba(127,29,29,0.5)]"
              : "text-muted-foreground hover:text-foreground dark:text-red-100/82 dark:hover:text-white hover:scale-[1.03]",
            isPending && "cursor-not-allowed opacity-70"
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

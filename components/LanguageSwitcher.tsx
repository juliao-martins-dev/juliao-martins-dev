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
        "relative inline-flex items-center rounded-full border border-border/60 bg-muted/30 p-1",
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute bottom-1 top-1 rounded-full bg-background shadow-sm transition-[left,width,opacity] duration-300 ease-out",
          !indicator.ready && "opacity-0"
        )}
        style={{
          left: indicator.left,
          width: indicator.width
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
            "relative z-10 cursor-pointer rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-colors duration-300",
            activeLanguage === l.code
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
            isPending && "cursor-not-allowed opacity-70"
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

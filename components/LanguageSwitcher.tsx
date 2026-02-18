"use client";

import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

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
        "inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/30 p-1",
        className
      )}
    >
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          onClick={() => changeLanguage(l.code)}
          disabled={isPending}
          className={cn(
            "cursor-pointer rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-all duration-200",
            activeLanguage === l.code
              ? "bg-background text-foreground shadow-sm"
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

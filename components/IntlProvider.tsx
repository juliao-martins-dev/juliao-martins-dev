"use client";

import { NextIntlClientProvider } from "next-intl";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Messages = Record<string, unknown>;

type IntlSwitcherContextValue = {
  locale: string;
  setLocale: (locale: string) => void;
  availableLocales: string[];
};

const IntlSwitcherContext = createContext<IntlSwitcherContextValue | null>(null);

export function useIntlSwitcher() {
  const ctx = useContext(IntlSwitcherContext);
  if (!ctx) {
    throw new Error("useIntlSwitcher must be used within <IntlProvider>");
  }
  return ctx;
}

type Props = {
  initialLocale: string;
  messagesMap: Record<string, Messages>;
  children: ReactNode;
};

/**
 * Client-side i18n provider that holds every locale's messages in memory, so
 * language switching is a local React state update — no network round-trip,
 * no router refresh, instant even on slow connections.
 *
 * The cookie is still written so the next SSR request is served in the
 * correct locale.
 */
export default function IntlProvider({
  initialLocale,
  messagesMap,
  children,
}: Props) {
  const [locale, setLocaleState] = useState(() =>
    messagesMap[initialLocale] ? initialLocale : Object.keys(messagesMap)[0]
  );

  const setLocale = useCallback(
    (next: string) => {
      if (next === locale || !messagesMap[next]) return;
      // Persist for the next SSR request. 1 year, lax is fine for a pref cookie.
      document.cookie = `locale=${next}; path=/; max-age=31536000; samesite=lax`;
      setLocaleState(next);
    },
    [locale, messagesMap]
  );

  const switcherValue = useMemo<IntlSwitcherContextValue>(
    () => ({
      locale,
      setLocale,
      availableLocales: Object.keys(messagesMap),
    }),
    [locale, setLocale, messagesMap]
  );

  return (
    <IntlSwitcherContext.Provider value={switcherValue}>
      <NextIntlClientProvider locale={locale} messages={messagesMap[locale]}>
        {children}
      </NextIntlClientProvider>
    </IntlSwitcherContext.Provider>
  );
}

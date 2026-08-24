"use client";

import { useTranslations } from "next-intl";

/**
 * Keyboard escape hatch. Hidden off-screen until it receives focus, at which
 * point `.skip-link:focus-visible` (globals.css) slides it into the top-left.
 *
 * Client-only because the copy is translated and this project holds its
 * messages in a client provider — see IntlProvider.
 */
export default function SkipLink() {
  const t = useTranslations();

  return (
    <a
      href="#main-content"
      className="skip-link rounded-lg bg-primary px-4 py-3 text-control font-medium text-primary-foreground shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {t("a11y.skipToContent")}
    </a>
  );
}

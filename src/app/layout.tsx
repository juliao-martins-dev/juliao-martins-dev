import { Metadata } from "next";
import { cookies } from "next/headers";

import React from "react";

import IntlProvider from "../../components/IntlProvider";
import enMessages from "../../messages/en.json";
import teMessages from "../../messages/te.json";

import "./globals.css";

const messagesMap = {
  en: enMessages,
  te: teMessages,
} as const;

type SupportedLocale = keyof typeof messagesMap;

const isSupportedLocale = (value: string | undefined): value is SupportedLocale =>
  value === "en" || value === "te";


const THEME_SCRIPT = `
(() => {
  try {
    const storedTheme = localStorage.getItem("theme");
    const hasStoredTheme = storedTheme === "light" || storedTheme === "dark";
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const theme = hasStoredTheme ? storedTheme : systemTheme;

    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  } catch (_) {}
})();
`;


export const metadata: Metadata = {
  metadataBase: new URL("https://juliao-martins.vercel.app"),

  title: {
    default: "Julião Martins – Frontend Developer",
    template: "%s | Julião Martins",
  },

  description:
    "Portfolio of Julião Martins, Frontend Developer focused on React Native, Next.js and modern web technologies.",

  authors: [
    {
      name: "Julião Martins",
      url: "https://juliao-martins.vercel.app",
    },
  ],
  
  creator: "Julião Martins",
  publisher: "Julião Martins",
  
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },

  keywords: [
    "Julião Martins",
    "Juliao Martins",
    "Julião Martins Timor Leste",
    "Juliao Martins Timor Leste",
    "Julião Martins Dili",
    "mobile developer Timor Leste",
    "mobile developer Dili",
    "React Native developer Timor Leste",
    "React Native developer Dili",
    "Next.js developer Timor Leste",
    "frontend developer Timor Leste",
    "desenvolvedor mobile Timor-Leste",
    "desenvolvedor React Native Timor-Leste",
    "IT Timor Leste",
    "React Native Expo",
  ],

  openGraph: {
    title: "Julião Martins – Frontend Developer",
    description:
      "Portfolio of Julião Martins, Frontend Developer focused on React Native and Next.js.",
    url: "/",
    siteName: "Julião Martins",
    locale: "en_US",
    type: "website",

    images: [
      {
        url: "/juliao_martins.jpg",
        width: 1200,
        height: 630,
        alt: "Julião Martins Portfolio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Julião Martins – Frontend Developer",
    description: "Portfolio and projects built with React Native & Next.js",
    images: ["/juliao_martins.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};


export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("locale")?.value;
  const initialLocale: SupportedLocale = isSupportedLocale(cookieLocale)
    ? cookieLocale
    : "en";

  return (
    <html lang={initialLocale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <IntlProvider initialLocale={initialLocale} messagesMap={messagesMap}>
          {children}
        </IntlProvider>
      </body>
    </html>
  );
}

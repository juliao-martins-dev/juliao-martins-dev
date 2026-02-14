import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";

import React from "react";

import "./globals.css";


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


export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
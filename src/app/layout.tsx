import React from "react";

import { NextIntlClientProvider } from "next-intl";

import "./globals.css";

export default function RootLayout({
  children
}:{
  children: React.ReactNode
}) {
  return <html>
    <body>
      <NextIntlClientProvider>{children}</NextIntlClientProvider>
    </body>
  </html>
}
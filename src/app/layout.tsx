"use client";

import { SessionProvider } from "next-auth/react";
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <html lang="ja">
        <body>{children}</body>
      </html>
    </SessionProvider>
  );
}

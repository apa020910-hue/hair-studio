import type { Metadata } from "next";
import "@fontsource/tenor-sans/index.css";
import "@fontsource-variable/onest/wght.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

/**
 * Root layout. Locale-specific <html lang>, metadata and structured data
 * live in app/[lang]/layout.tsx — this shell only loads fonts and CSS once.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}

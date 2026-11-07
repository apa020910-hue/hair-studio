import Link from "next/link";
import { defaultLocale } from "@/lib/i18n";

export default function NotFound() {
  return (
    <html lang={defaultLocale}>
      <body className="grid min-h-screen place-items-center bg-fog px-6 text-center text-ink">
        <div>
          <p className="font-display text-8xl text-pine">404</p>
          <p className="mt-4 text-lg text-muted">Lapa nav atrasta.</p>
          <Link
            href={`/${defaultLocale}`}
            className="mt-8 inline-flex h-12 items-center rounded-full bg-honey px-6 font-medium text-pine"
          >
            Uz sākumu
          </Link>
        </div>
      </body>
    </html>
  );
}

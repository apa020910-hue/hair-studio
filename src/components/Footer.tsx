import Link from "next/link";
import { site } from "@/lib/site";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Facebook, Instagram } from "./Icons";
import { Logo } from "./Logo";

const NAV_KEYS = ["services", "team", "reviews", "faq", "contact"] as const;

export function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  return (
    <footer className="on-dark bg-abyss pb-28 pt-16 text-fog md:pb-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href={`/${lang}`} aria-label={site.name}>
              <Logo />
            </Link>
            <p className="mt-5 max-w-xs text-fog/70">{dict.footer.tagline}</p>
          </div>

          <nav aria-label={dict.a11y.mainNav}>
            <ul className="space-y-3">
              {NAV_KEYS.map((key) => (
                <li key={key}>
                  <a href={`#${key}`} className="text-fog/75 transition-colors hover:text-honey">
                    {dict.nav[key]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-3">
            <p>{site.address.street}</p>
            <p className="text-fog/75">
              {site.address.city}, {site.address.postalCode}
            </p>
            <p>
              <a href={site.phoneHref} className="transition-colors hover:text-honey">
                {site.phone}
              </a>
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href={site.instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid h-10 w-10 place-items-center rounded-full border border-fog/25 transition-colors hover:border-honey hover:text-honey"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={site.facebookHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="grid h-10 w-10 place-items-center rounded-full border border-fog/25 transition-colors hover:border-honey hover:text-honey"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-fog/15 pt-6 text-sm text-fog/60 md:flex-row md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. {dict.footer.rights}
          </p>
          <p>{dict.footer.demo}</p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { localeLabels, locales, type Dictionary, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { Close, Menu, Phone } from "./Icons";
import { Logo } from "./Logo";
import { buttonClasses, cn } from "./ui";

interface HeaderProps {
  lang: Locale;
  nav: Dictionary["nav"];
  a11y: Dictionary["a11y"];
  common: Dictionary["common"];
}

const NAV_KEYS = ["services", "team", "reviews", "faq", "contact"] as const;

export function Header({ lang, nav, a11y, common }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        open
          ? "on-dark bg-pine text-fog"
          : scrolled
            ? "border-b border-line bg-fog/90 text-ink backdrop-blur-md"
            : "on-dark bg-transparent text-fog",
      )}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href={`/${lang}`} aria-label="NOVA Hair Studio" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav aria-label={a11y.mainNav} className="hidden items-center gap-8 text-sm lg:flex">
          {NAV_KEYS.map((key) => (
            <a key={key} href={`#${key}`} className="opacity-80 transition-opacity hover:opacity-100">
              {nav[key]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-5">
          <LanguageSwitch lang={lang} label={a11y.language} />
          <a
            href={site.phoneHref}
            className="hidden items-center gap-2 text-sm opacity-80 transition-opacity hover:opacity-100 xl:flex"
          >
            <Phone className="h-4 w-4" />
            {site.phone}
          </a>
          <a href="#booking" className={buttonClasses("honey", "md", "hidden sm:inline-flex")}>
            {common.book}
          </a>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-current/25 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? a11y.closeMenu : a11y.openMenu}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <Close className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="on-dark fixed inset-x-0 bottom-0 top-[4.5rem] overflow-y-auto bg-pine px-5 pb-10 pt-8 text-fog sm:px-8 lg:hidden"
        >
          <nav aria-label={a11y.mainNav} className="flex flex-col">
            {NAV_KEYS.map((key) => (
              <a
                key={key}
                href={`#${key}`}
                onClick={() => setOpen(false)}
                className="border-b border-fog/15 py-4 font-display text-3xl"
              >
                {nav[key]}
              </a>
            ))}
          </nav>
          <div className="mt-8 flex flex-col gap-3">
            <a href="#booking" onClick={() => setOpen(false)} className={buttonClasses("honey", "lg")}>
              {common.bookNow}
            </a>
            <a href={site.phoneHref} className={buttonClasses("outline-light", "lg")}>
              <Phone className="h-5 w-5" />
              {site.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

function LanguageSwitch({ lang, label }: { lang: Locale; label: string }) {
  return (
    <nav aria-label={label} className="flex items-center gap-1 text-sm">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}`}
          hrefLang={locale}
          lang={locale}
          aria-current={locale === lang ? "true" : undefined}
          className={cn(
            "rounded-full px-2.5 py-1.5 transition-colors",
            locale === lang ? "bg-current/15 font-medium" : "opacity-70 hover:opacity-100",
          )}
        >
          {localeLabels[locale]}
        </Link>
      ))}
    </nav>
  );
}

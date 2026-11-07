import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileBar } from "@/components/MobileBar";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, ogLocales, type Locale } from "@/lib/i18n";
import { OPENING_HOURS, site } from "@/lib/site";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  if (!isLocale(rawLang)) return {};
  const lang = rawLang;
  const dict = getDictionary(lang);

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(locales.map((locale) => [locale, `/${locale}`])),
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: `/${lang}`,
      siteName: site.name,
      locale: ogLocales[lang],
      alternateLocale: locales.filter((locale) => locale !== lang).map((locale) => ogLocales[locale]),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
  };
}

function structuredData(lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: site.name,
    url: `${site.url}/${lang}`,
    telephone: site.phone,
    email: site.email,
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    openingHoursSpecification: [1, 2, 3, 4, 5, 6].map((day) => {
      const hours = OPENING_HOURS[day];
      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "https://schema.org/Sunday",
          "https://schema.org/Monday",
          "https://schema.org/Tuesday",
          "https://schema.org/Wednesday",
          "https://schema.org/Thursday",
          "https://schema.org/Friday",
          "https://schema.org/Saturday",
        ][day],
        opens: hours ? `${String(hours.open).padStart(2, "0")}:00` : undefined,
        closes: hours ? `${String(hours.close).padStart(2, "0")}:00` : undefined,
      };
    }),
    sameAs: [site.instagramHref, site.facebookHref],
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  if (!isLocale(rawLang)) notFound();
  const lang = rawLang;
  const dict = getDictionary(lang);

  return (
    <html lang={lang}>
      <body>
        <a
          href="#main"
          className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-full bg-honey px-5 py-2.5 font-medium text-pine transition-transform focus:translate-y-0"
        >
          {dict.a11y.skip}
        </a>

        <Header lang={lang} nav={dict.nav} a11y={dict.a11y} common={dict.common} />
        <main id="main" className="pb-16 md:pb-0">
          {children}
        </main>
        <Footer lang={lang} dict={dict} />
        <MobileBar common={dict.common} />

        <script
          type="application/ld+json"
          // Structured data has no user input; safe to inline.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(lang)) }}
        />
      </body>
    </html>
  );
}

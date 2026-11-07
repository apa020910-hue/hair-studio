import type { Dictionary, Locale } from "@/lib/i18n";
import { BookLink } from "./BookLink";
import { Star } from "./Icons";
import { QuickBook } from "./QuickBook";
import { Strands } from "./Strands";
import { buttonClasses } from "./ui";

export function Hero({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { hero } = dict;

  return (
    <section className="on-dark relative isolate overflow-hidden bg-pine text-fog">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(70%_90%_at_85%_15%,var(--color-spruce)_0%,transparent_65%)]"
      />
      <Strands
        animated
        className="absolute inset-0 -z-10 h-full w-full [-webkit-mask-image:linear-gradient(100deg,transparent_8%,#000_58%)] [mask-image:linear-gradient(100deg,transparent_8%,#000_58%)]"
      />

      <div className="mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16 lg:pb-28 lg:pt-44">
        <div>
          <h1 className="max-w-3xl text-[clamp(2.6rem,6.2vw,4.9rem)] leading-[1.04] tracking-[-0.01em]">
            {hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-fog/75">{hero.text}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <BookLink className={buttonClasses("honey", "lg")}>{hero.ctaPrimary}</BookLink>
            <a href="#services" className={buttonClasses("outline-light", "lg")}>
              {hero.ctaSecondary}
            </a>
          </div>

          <div className="mt-10 flex items-center gap-3 text-sm text-fog/75">
            <span className="flex gap-0.5 text-honey" role="img" aria-label={dict.a11y.stars}>
              {Array.from({ length: 5 }, (_, index) => (
                <Star key={index} className="h-4 w-4" />
              ))}
            </span>
            <span>{hero.rating}</span>
          </div>
        </div>

        <QuickBook
          lang={lang}
          quick={hero.quick}
          common={dict.common}
          categoryLabels={dict.services.tabs}
          serviceNames={dict.services.items}
        />
      </div>
    </section>
  );
}

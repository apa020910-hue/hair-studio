"use client";

import { useState } from "react";
import { CATEGORIES, servicesByCategory, type Category } from "@/lib/data";
import { formatDuration, formatPrice } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n";
import { BookLink } from "./BookLink";
import { buttonClasses, cn } from "./ui";

interface ServicesProps {
  dict: Dictionary["services"];
  common: Dictionary["common"];
}

export function Services({ dict, common }: ServicesProps) {
  const [active, setActive] = useState<Category>("barber");
  const items = servicesByCategory(active);

  return (
    <section id="services" className="bg-fog py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-4xl leading-[1.08] tracking-[-0.01em] sm:text-5xl">{dict.title}</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">{dict.text}</p>

          <div
            role="tablist"
            aria-orientation="vertical"
            className="no-scrollbar -mx-5 mt-9 flex gap-2 overflow-x-auto px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0"
          >
            {CATEGORIES.map((category) => {
              const selected = category === active;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  id={`tab-${category}`}
                  aria-selected={selected}
                  aria-controls="services-panel"
                  onClick={() => setActive(category)}
                  className={cn(
                    "shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors",
                    "lg:rounded-none lg:border-0 lg:border-l-2 lg:py-3.5 lg:pl-6 lg:text-left lg:font-display lg:text-2xl lg:font-normal",
                    selected
                      ? "border-pine bg-pine text-fog lg:bg-transparent lg:text-ink lg:border-honey"
                      : "border-line text-muted hover:border-pine hover:text-ink lg:border-line lg:hover:border-pine",
                  )}
                >
                  {dict.tabs[category]}
                </button>
              );
            })}
          </div>
          <p className="mt-5 hidden text-sm text-muted lg:block lg:pl-6">{dict.tabsHint[active]}</p>
        </div>

        <div id="services-panel" role="tabpanel" aria-labelledby={`tab-${active}`}>
          <p className="mb-2 text-sm text-muted lg:hidden">{dict.tabsHint[active]}</p>
          <ul className="divide-y divide-line border-y border-line">
            {items.map((service) => (
              <li key={service.id} className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:gap-8">
                <div className="min-w-0 flex-1">
                  <h3 className="font-sans text-lg font-medium">{dict.items[service.id].name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{dict.items[service.id].desc}</p>
                </div>
                <div className="flex items-center justify-between gap-6 sm:justify-end">
                  <div className="sm:min-w-[5.5rem] sm:text-right">
                    <p className="font-display text-2xl">{formatPrice(service.price, service.priceFrom, common)}</p>
                    <p className="text-xs text-muted">{formatDuration(service.durationMin, common)}</p>
                  </div>
                  <BookLink intent={{ serviceId: service.id }} className={buttonClasses("outline-dark", "md")}>
                    {common.book}
                  </BookLink>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-relaxed text-muted">{dict.note}</p>
        </div>
      </div>
    </section>
  );
}

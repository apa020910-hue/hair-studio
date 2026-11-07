"use client";

import { useMemo, useState } from "react";
import { findNextSlots } from "@/lib/availability";
import { CATEGORIES, getService, servicesByCategory, stylistsForCategory, type ServiceId } from "@/lib/data";
import { formatDayLabel, formatDuration, formatPrice } from "@/lib/format";
import { openBooking } from "@/lib/booking-events";
import type { Dictionary, Locale } from "@/lib/i18n";
import { useRigaNow } from "@/lib/use-riga-now";
import { BookLink } from "./BookLink";
import { ChevronDown } from "./Icons";

interface QuickBookProps {
  lang: Locale;
  quick: Dictionary["hero"]["quick"];
  common: Dictionary["common"];
  categoryLabels: Dictionary["services"]["tabs"];
  serviceNames: Dictionary["services"]["items"];
}

/** Hero shortcut: pick a service, tap a free time, land on the details step. */
export function QuickBook({ lang, quick, common, categoryLabels, serviceNames }: QuickBookProps) {
  const now = useRigaNow();
  const [serviceId, setServiceId] = useState<ServiceId>("mens-cut");
  const service = getService(serviceId);
  const today = now?.date ?? "";

  const slots = useMemo(() => {
    if (!now || !service) return null;
    const stylistIds = stylistsForCategory(service.category).map((stylist) => stylist.id);
    return findNextSlots({ durationMin: service.durationMin, stylistIds, now });
  }, [now, service]);

  return (
    <div className="rounded-[2rem] bg-fog/95 p-6 text-ink ring-1 ring-fog/30 backdrop-blur-sm sm:p-8">
      <h2 className="font-display text-3xl">{quick.title}</h2>

      <label htmlFor="quick-service" className="mt-6 block text-sm font-medium">
        {quick.service}
      </label>
      <div className="relative mt-2">
        <select
          id="quick-service"
          value={serviceId}
          onChange={(event) => setServiceId(event.target.value as ServiceId)}
          className="h-12 w-full appearance-none rounded-xl border border-line bg-paper pl-4 pr-11 text-base text-ink"
        >
          {CATEGORIES.map((category) => (
            <optgroup key={category} label={categoryLabels[category]}>
              {servicesByCategory(category).map((item) => (
                <option key={item.id} value={item.id}>
                  {serviceNames[item.id].name}, {formatPrice(item.price, item.priceFrom, common)}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
      </div>
      {service && <p className="mt-2 text-sm text-muted">{formatDuration(service.durationMin, common)}</p>}

      <div className="mt-6 min-h-[8.5rem]" aria-live="polite">
        {slots === null ? (
          <>
            <p className="sr-only">{quick.loading}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" aria-hidden="true">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="h-[3.75rem] rounded-xl bg-line/60" />
              ))}
            </div>
          </>
        ) : slots.length === 0 ? (
          <p className="text-muted">{quick.empty}</p>
        ) : (
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {slots.map((slot) => (
              <li key={`${slot.date}-${slot.time}`}>
                <button
                  type="button"
                  onClick={() => openBooking({ serviceId, date: slot.date, time: slot.time })}
                  className="group flex w-full flex-col items-start rounded-xl border border-line bg-paper px-3.5 py-2.5 text-left transition-colors hover:border-pine hover:bg-pine hover:text-fog"
                >
                  <span className="text-xs text-muted transition-colors group-hover:text-fog/75">
                    {formatDayLabel(slot.date, today, lang, common)}
                  </span>
                  <span className="text-lg font-medium tabular-nums">{slot.time}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <BookLink
        intent={{ serviceId }}
        className="mt-6 inline-block text-sm font-medium underline decoration-honey decoration-2 underline-offset-[6px] hover:decoration-pine"
      >
        {quick.all}
      </BookLink>
    </div>
  );
}

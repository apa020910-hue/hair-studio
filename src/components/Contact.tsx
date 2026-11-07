import { OPENING_HOURS, site, type DayHours } from "@/lib/site";
import type { Dictionary } from "@/lib/i18n";
import { MapPin, Message, Phone } from "./Icons";
import { buttonClasses } from "./ui";

function hoursLabel(hours: DayHours | null, closed: string): string {
  if (!hours) return closed;
  const format = (hour: number) => `${String(hour).padStart(2, "0")}:00`;
  return `${format(hours.open)}–${format(hours.close)}`;
}

export function Contact({ dict, common }: { dict: Dictionary["contact"]; common: Dictionary["common"] }) {
  const rows = [
    { label: dict.days.weekdays, value: hoursLabel(OPENING_HOURS[1], common.closed) },
    { label: dict.days.saturday, value: hoursLabel(OPENING_HOURS[6], common.closed) },
    { label: dict.days.sunday, value: hoursLabel(OPENING_HOURS[0], common.closed) },
  ];

  return (
    <section id="contact" className="bg-paper py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-4xl leading-[1.08] tracking-[-0.01em] sm:text-5xl">{dict.title}</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">{dict.text}</p>

          <dl className="mt-10 divide-y divide-line border-y border-line">
            <div className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="text-sm text-muted">{dict.hoursLabel}</dt>
              <dd>
                <ul className="space-y-1.5">
                  {rows.map((row) => (
                    <li key={row.label} className="flex justify-between gap-6 sm:max-w-xs">
                      <span>{row.label}</span>
                      <span className="tabular-nums">{row.value}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="text-sm text-muted">{dict.phoneLabel}</dt>
              <dd>
                <a href={site.phoneHref} className="underline decoration-line underline-offset-4 hover:decoration-pine">
                  {site.phone}
                </a>
              </dd>
            </div>
            <div className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="text-sm text-muted">{dict.emailLabel}</dt>
              <dd>
                <a
                  href={`mailto:${site.email}`}
                  className="underline decoration-line underline-offset-4 hover:decoration-pine"
                >
                  {site.email}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="on-dark relative isolate flex flex-col justify-between overflow-hidden rounded-[2rem] bg-pine p-8 text-fog sm:p-10">
          <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-spruce" />
          <div>
            <MapPin className="h-7 w-7 text-honey" />
            <p className="mt-6 text-sm text-fog/70">{dict.addressLabel}</p>
            <address className="mt-2 font-display text-4xl not-italic leading-tight">
              {site.address.street}
              <br />
              {site.address.city}, {site.address.postalCode}
            </address>
          </div>

          <div className="mt-14 flex flex-wrap gap-3">
            <a href={site.mapsHref} target="_blank" rel="noopener noreferrer" className={buttonClasses("honey", "md")}>
              <MapPin className="h-4 w-4" />
              {dict.directions}
            </a>
            <a href={site.phoneHref} className={buttonClasses("outline-light", "md")}>
              <Phone className="h-4 w-4" />
              {common.call}
            </a>
            <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className={buttonClasses("outline-light", "md")}>
              <Message className="h-4 w-4" />
              {dict.whatsapp}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

import { STYLISTS } from "@/lib/data";
import type { Dictionary } from "@/lib/i18n";
import { BookLink } from "./BookLink";
import { cn, toneClasses } from "./ui";

/** Concentric arches, a nod to Riga's Art Nouveau window frames. */
function ArchLines({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 250" className={className} fill="none" stroke="currentColor" aria-hidden="true" focusable="false">
      <path d="M14 250V100a86 86 0 0 1 172 0v150" strokeOpacity="0.28" />
      <path d="M34 250V102a66 66 0 0 1 132 0v148" strokeOpacity="0.22" />
      <path d="M54 250V104a46 46 0 0 1 92 0v146" strokeOpacity="0.16" />
    </svg>
  );
}

export function Team({ dict }: { dict: Dictionary["team"] }) {
  return (
    <section id="team" className="bg-fog py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <h2 className="text-4xl leading-[1.08] tracking-[-0.01em] sm:text-5xl">{dict.title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">{dict.text}</p>
        </div>

        <ul className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {STYLISTS.map((stylist) => {
            const member = dict.members[stylist.id];
            return (
              <li key={stylist.id}>
                <div
                  className={cn(
                    "relative flex aspect-[4/5] items-end justify-center overflow-hidden rounded-t-full rounded-b-lg",
                    toneClasses[stylist.tone],
                  )}
                >
                  <ArchLines className="absolute inset-0 h-full w-full" />
                  <span className="relative pb-8 font-display text-7xl tracking-wide">{stylist.initials}</span>
                </div>

                <h3 className="mt-6 text-2xl">{stylist.name}</h3>
                <p className="mt-1 text-sm font-medium text-lagoon">{member.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{member.bio}</p>

                <p className="mt-4 flex flex-wrap items-center gap-1.5 text-xs text-muted">
                  <span className="mr-1">{dict.speaks}</span>
                  {stylist.languages.map((code) => (
                    <span key={code} className="rounded-full border border-line px-2 py-0.5 font-medium text-ink">
                      {code}
                    </span>
                  ))}
                </p>

                <BookLink
                  intent={{ stylistId: stylist.id }}
                  className="mt-5 inline-block text-sm font-medium underline decoration-honey decoration-2 underline-offset-[6px] hover:decoration-pine"
                >
                  {dict.book}
                </BookLink>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

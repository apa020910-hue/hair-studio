import { site } from "@/lib/site";
import type { Dictionary } from "@/lib/i18n";
import { ChevronDown, Phone } from "./Icons";
import { buttonClasses } from "./ui";

export function Faq({ dict, callLabel }: { dict: Dictionary["faq"]; callLabel: string }) {
  return (
    <section id="faq" className="bg-fog py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div>
          <h2 className="text-4xl leading-[1.08] tracking-[-0.01em] sm:text-5xl">{dict.title}</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">{dict.text}</p>
          <a href={site.phoneHref} className={buttonClasses("outline-dark", "md", "mt-8")}>
            <Phone className="h-4 w-4" />
            {callLabel}
          </a>
        </div>

        <div className="border-t border-line">
          {dict.items.map((item) => (
            <details key={item.q} name="faq" className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-medium [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown className="h-5 w-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="max-w-2xl pb-6 leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

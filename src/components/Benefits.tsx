import type { Dictionary } from "@/lib/i18n";
import { Calendar, Clock, Globe, Message } from "./Icons";

const ICONS = [Clock, Message, Calendar, Globe] as const;

export function Benefits({ items }: { items: Dictionary["benefits"] }) {
  return (
    <section className="border-b border-line bg-paper">
      <ul className="mx-auto grid max-w-7xl gap-px px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {items.map((item, index) => {
          const Icon = ICONS[index] ?? Clock;
          return (
            <li key={item.title} className="flex gap-4 py-8 lg:px-6 lg:first:pl-0 lg:last:pr-0 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-line">
              <Icon className="mt-0.5 h-6 w-6 shrink-0 text-lagoon" />
              <div>
                <h3 className="font-sans text-base font-medium">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

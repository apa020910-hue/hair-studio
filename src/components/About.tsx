import type { Dictionary } from "@/lib/i18n";
import { Strands } from "./Strands";

export function About({ dict }: { dict: Dictionary["about"] }) {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-pine py-24 text-fog lg:py-32">
      <Strands variant="band" count={34} className="absolute inset-x-0 top-0 -z-10 h-40 w-full opacity-60" />

      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
        <div>
          <h2 className="max-w-2xl text-4xl leading-[1.08] tracking-[-0.01em] sm:text-5xl">{dict.title}</h2>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-fog/75">{dict.text}</p>
        </div>

        <dl className="divide-y divide-fog/15 border-y border-fog/15 self-end">
          {dict.values.map((value) => (
            <div key={value.title} className="py-6">
              <dt className="font-display text-2xl">{value.title}</dt>
              <dd className="mt-2 leading-relaxed text-fog/70">{value.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

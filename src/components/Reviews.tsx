import type { Dictionary } from "@/lib/i18n";
import { Star } from "./Icons";

export function Reviews({ dict, starsLabel }: { dict: Dictionary["reviews"]; starsLabel: string }) {
  return (
    <section id="reviews" className="bg-paper py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-4xl leading-[1.08] tracking-[-0.01em] sm:text-5xl">{dict.title}</h2>
          <div className="flex items-center gap-3 text-sm text-muted">
            <span className="flex gap-0.5 text-honey" role="img" aria-label={starsLabel}>
              {Array.from({ length: 5 }, (_, index) => (
                <Star key={index} className="h-5 w-5" />
              ))}
            </span>
            <span>{dict.summary}</span>
          </div>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-3 lg:gap-10">
          {dict.items.map((review) => (
            <figure key={review.name} className="flex flex-col border-t-2 border-pine pt-7">
              <blockquote className="font-display text-2xl leading-snug">{review.text}</blockquote>
              <figcaption className="mt-6 text-sm">
                <span className="font-medium">{review.name}</span>
                <span className="text-muted">, {review.service}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-12 text-sm text-muted">{dict.note}</p>
      </div>
    </section>
  );
}

"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { site } from "@/lib/site";

const COPY = {
  lv: { title: "Kaut kas nogāja greizi", text: "Pārlādē lapu vai piezvani mums tieši.", retry: "Mēģināt vēlreiz", call: "Zvanīt" },
  en: { title: "Something went wrong", text: "Reload the page, or call us directly.", retry: "Try again", call: "Call" },
  ru: { title: "Что-то пошло не так", text: "Перезагрузите страницу или позвоните нам напрямую.", retry: "Попробовать снова", call: "Позвонить" },
} as const;

/** Segment-level error boundary: keeps the header/footer chrome, swaps only the content. */
export default function LangError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const params = useParams<{ lang?: string }>();
  const lang = isLocale(params?.lang ?? "") ? (params!.lang as "lv" | "en" | "ru") : defaultLocale;
  const copy = COPY[lang];

  useEffect(() => {
    // Demo has no error-reporting backend wired up; log locally so it isn't silent.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-4xl">{copy.title}</p>
      <p className="mt-4 text-muted">{copy.text}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="inline-flex h-12 items-center rounded-full bg-honey px-6 font-medium text-pine">
          {copy.retry}
        </button>
        <a href={site.phoneHref} className="inline-flex h-12 items-center rounded-full border border-pine/30 px-6 font-medium text-pine">
          {copy.call}: {site.phone}
        </a>
      </div>
    </div>
  );
}

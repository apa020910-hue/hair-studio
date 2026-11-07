import { en } from "./en";
import { lv } from "./lv";
import { ru } from "./ru";
import type { Locale } from "./config";
import type { Dictionary } from "./types";

const dictionaries: Record<Locale, Dictionary> = { lv, en, ru };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export * from "./config";
export type { Dictionary } from "./types";

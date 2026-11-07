export const locales = ["lv", "en", "ru"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "lv";

export const localeLabels: Record<Locale, string> = { lv: "LV", en: "EN", ru: "RU" };
export const localeNames: Record<Locale, string> = { lv: "Latviešu", en: "English", ru: "Русский" };

/** BCP 47 tags for Intl formatting. */
export const intlLocales: Record<Locale, string> = { lv: "lv-LV", en: "en-GB", ru: "ru-RU" };
export const ogLocales: Record<Locale, string> = { lv: "lv_LV", en: "en_GB", ru: "ru_RU" };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

import { addDays } from "./availability";
import { intlLocales, type Dictionary, type Locale } from "./i18n";

type Common = Dictionary["common"];

export function formatPrice(price: number, from: boolean, common: Common): string {
  const amount = `${price} €`;
  return from ? `${common.from} ${amount}` : amount;
}

export function formatDuration(totalMinutes: number, common: Common): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const parts: string[] = [];
  if (hours) parts.push(`${hours} ${common.hour}`);
  if (minutes) parts.push(`${minutes} ${common.minute}`);
  return parts.join(" ");
}

/** Formats a YYYY-MM-DD string without any timezone shifting. */
export function formatDate(iso: string, locale: Locale, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(intlLocales[locale], { ...options, timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}

/** "Today", "Tomorrow" or a short date such as "Tue, 22 Sep". */
export function formatDayLabel(iso: string, todayIso: string, locale: Locale, common: Common): string {
  if (iso === todayIso) return common.today;
  if (iso === addDays(todayIso, 1)) return common.tomorrow;
  return formatDate(iso, locale, { weekday: "short", day: "numeric", month: "short" });
}

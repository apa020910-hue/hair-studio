import { STYLISTS, stylistWorksOn, type StylistId } from "./data";
import { OPENING_HOURS } from "./site";

/**
 * Demo availability engine.
 *
 * There is no real calendar behind this demo. Free/busy is derived from a stable hash
 * of (date, time, stylist), so the schedule looks realistic and is identical on the
 * server and in the browser. Swap `isTaken` for a real calendar lookup in production.
 */

export const SLOT_STEP_MIN = 30;
/** A slot must start at least this many minutes from now. */
export const MIN_LEAD_MIN = 60;
export const MAX_BOOKING_DAYS = 60;

export interface RigaNow {
  /** YYYY-MM-DD in Europe/Riga. */
  date: string;
  /** Minutes since midnight in Europe/Riga. */
  minutes: number;
}

export function nowInRiga(now: Date = new Date()): RigaNow {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Riga",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "0";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** 0 = Sunday ... 6 = Saturday. */
export function weekdayOf(iso: string): number {
  return new Date(`${iso}T00:00:00Z`).getUTCDay();
}

export function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function toTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/** FNV-1a 32-bit hash. */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Whether a specific stylist is already booked at this start time (demo data). */
export function isTaken(date: string, time: string, stylistId: StylistId): boolean {
  const weekday = weekdayOf(date);
  const hour = toMinutes(time) / 60;
  let load = 28;
  if (weekday === 6) load += 14;
  if (hour >= 17) load += 10;
  return hash(`${date}|${time}|${stylistId}`) % 100 < load;
}

export interface SlotQuery {
  date: string;
  durationMin: number;
  /** Stylists that could perform the service. */
  stylistIds: readonly StylistId[];
  now: RigaNow;
}

/** Start times (HH:MM) that are free for at least one of the given stylists. */
export function getAvailableTimes({ date, durationMin, stylistIds, now }: SlotQuery): string[] {
  if (date < now.date) return [];

  const weekday = weekdayOf(date);
  const hours = OPENING_HOURS[weekday];
  if (!hours) return [];

  const working = STYLISTS.filter(
    (stylist) => stylistIds.includes(stylist.id) && stylistWorksOn(stylist, weekday),
  );
  if (working.length === 0) return [];

  const times: string[] = [];
  for (let t = hours.open * 60; t + durationMin <= hours.close * 60; t += SLOT_STEP_MIN) {
    const isFuture = date > now.date || t >= now.minutes + MIN_LEAD_MIN;
    if (!isFuture) continue;
    const time = toTime(t);
    if (working.some((stylist) => !isTaken(date, time, stylist.id))) times.push(time);
  }
  return times;
}

export interface NextSlot {
  date: string;
  time: string;
}

/**
 * The soonest free times, spread across days: up to `perDay` per day
 * (one early, one later) for the first `days` days that have availability.
 */
export function findNextSlots(
  query: Omit<SlotQuery, "date">,
  { days = 3, perDay = 2, horizonDays = 14 }: { days?: number; perDay?: number; horizonDays?: number } = {},
): NextSlot[] {
  const result: NextSlot[] = [];
  let daysUsed = 0;

  for (let offset = 0; offset < horizonDays && daysUsed < days; offset += 1) {
    const date = addDays(query.now.date, offset);
    const times = getAvailableTimes({ ...query, date });
    if (times.length === 0) continue;

    const picks = new Set<string>([times[0]]);
    if (perDay > 1 && times.length > 1) picks.add(times[Math.floor(times.length / 2)]);
    for (const time of picks) result.push({ date, time });
    daysUsed += 1;
  }
  return result;
}

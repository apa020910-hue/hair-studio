import { toMinutes, toTime } from "./availability";

export interface IcsEvent {
  uid: string;
  title: string;
  description?: string;
  location: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:MM */
  time: string;
  durationMin: number;
}

function escapeText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/[,;]/g, (match) => `\\${match}`).replace(/\n/g, "\\n");
}

function localStamp(date: string, time: string): string {
  return `${date.replaceAll("-", "")}T${time.replace(":", "")}00`;
}

/** Builds an .ics file using floating local time (correct for a client in Riga). */
export function buildIcs(event: IcsEvent): string {
  const end = toTime(toMinutes(event.time) + event.durationMin);
  const created = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NOVA Hair Studio//Booking//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.uid}@nova-hair-studio`,
    `DTSTAMP:${created}`,
    `DTSTART:${localStamp(event.date, event.time)}`,
    `DTEND:${localStamp(event.date, end)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `LOCATION:${escapeText(event.location)}`,
    ...(event.description ? [`DESCRIPTION:${escapeText(event.description)}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcs(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

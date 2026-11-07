import type { ServiceId, StylistId } from "./data";

/** What a "Book" button can pre-fill in the booking widget. */
export interface BookIntent {
  serviceId?: ServiceId;
  stylistId?: StylistId;
  date?: string;
  time?: string;
}

export const BOOK_EVENT = "nova:book";

/** Pre-fills the booking widget and scrolls to it. Browser only. */
export function openBooking(intent: BookIntent = {}): void {
  window.dispatchEvent(new CustomEvent<BookIntent>(BOOK_EVENT, { detail: intent }));
  document.getElementById("booking")?.scrollIntoView();
}

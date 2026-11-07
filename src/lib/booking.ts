import { addDays, getAvailableTimes, MAX_BOOKING_DAYS, type RigaNow } from "./availability";
import { getService, getStylist, stylistHandles, STYLISTS, stylistsForCategory, type StylistId } from "./data";

export interface BookingInput {
  serviceId: string;
  stylistId: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  consent: boolean;
  lang: string;
  /** Honeypot field. Real people never fill it in. */
  company?: string;
}

export type BookingErrorCode = "required" | "invalid" | "consent" | "slot_taken";
export type BookingField = "service" | "stylist" | "slot" | "name" | "phone" | "email" | "notes" | "consent";
export type BookingErrors = Partial<Record<BookingField, BookingErrorCode>>;

export interface BookingResponse {
  ok: boolean;
  reference?: string;
  errors?: BookingErrors;
}

const PHONE_PATTERN = /^\+?[0-9\s()\-]{7,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Validates the contact fields. Used on the client (step 4) and on the server. */
export function validateContact(
  input: Pick<BookingInput, "name" | "phone" | "email" | "notes" | "consent">,
): BookingErrors {
  const errors: BookingErrors = {};
  const name = input.name.trim();
  const phone = input.phone.trim();
  const email = input.email.trim();

  if (!name) errors.name = "required";
  else if (name.length < 2 || name.length > 80) errors.name = "invalid";

  if (!phone) errors.phone = "required";
  else if (!PHONE_PATTERN.test(phone) || phone.replace(/\D/g, "").length < 7) errors.phone = "invalid";

  if (email && !EMAIL_PATTERN.test(email)) errors.email = "invalid";
  if (input.notes.length > 500) errors.notes = "invalid";
  if (!input.consent) errors.consent = "consent";

  return errors;
}

/** Full validation, including a re-check that the chosen slot is really free. */
export function validateBooking(input: BookingInput, now: RigaNow): BookingErrors {
  const errors = validateContact(input);

  const service = getService(input.serviceId);
  if (!service) {
    errors.service = "invalid";
    return errors;
  }

  let stylistIds: StylistId[] = stylistsForCategory(service.category).map((stylist) => stylist.id);
  if (input.stylistId !== "any") {
    const stylist = getStylist(input.stylistId);
    if (!stylist || !stylistHandles(stylist, service.category)) {
      errors.stylist = "invalid";
      return errors;
    }
    stylistIds = [stylist.id];
  }

  const validShape = DATE_PATTERN.test(input.date) && TIME_PATTERN.test(input.time);
  const inRange = validShape && input.date >= now.date && input.date <= addDays(now.date, MAX_BOOKING_DAYS);
  if (!inRange) {
    errors.slot = "invalid";
    return errors;
  }

  const free = getAvailableTimes({ date: input.date, durationMin: service.durationMin, stylistIds, now });
  if (!free.includes(input.time)) errors.slot = "slot_taken";

  return errors;
}

export function isKnownStylist(id: string): boolean {
  return id === "any" || STYLISTS.some((stylist) => stylist.id === id);
}

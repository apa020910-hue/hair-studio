import { NextResponse } from "next/server";
import { nowInRiga } from "@/lib/availability";
import { validateBooking, type BookingInput, type BookingResponse } from "@/lib/booking";
import { isLocale } from "@/lib/i18n";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const RATE_LIMIT = 8;
const RATE_WINDOW_MS = 10 * 60 * 1000;

/**
 * Demo booking endpoint.
 *
 * Validates the request (mirroring the client-side checks) and, if the slot is
 * genuinely free per the demo availability engine, returns a booking reference.
 * Nothing is persisted: there is no database behind this demo. Wire this up to
 * a real calendar/CRM and a notification (SMS/email) provider for production.
 */
export async function POST(request: Request): Promise<NextResponse<BookingResponse>> {
  const { ok: withinLimit, retryAfterSec } = rateLimit(clientKey(request), RATE_LIMIT, RATE_WINDOW_MS);
  if (!withinLimit) {
    // No `errors` field on purpose: the client falls back to its generic
    // notice instead of (wrongly) attaching this to a specific form field.
    return NextResponse.json({ ok: false }, { status: 429, headers: { "Retry-After": String(retryAfterSec) } });
  }

  let body: Partial<BookingInput>;
  try {
    body = (await request.json()) as Partial<BookingInput>;
  } catch {
    return NextResponse.json({ ok: false, errors: { service: "invalid" } }, { status: 400 });
  }

  // Honeypot: a filled hidden field means a bot. Pretend success, do nothing.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true, reference: "NOVA-0000" });
  }

  const input: BookingInput = {
    serviceId: String(body.serviceId ?? ""),
    stylistId: String(body.stylistId ?? "any"),
    date: String(body.date ?? ""),
    time: String(body.time ?? ""),
    name: String(body.name ?? ""),
    phone: String(body.phone ?? ""),
    email: String(body.email ?? ""),
    notes: String(body.notes ?? "").slice(0, 500),
    consent: Boolean(body.consent),
    lang: isLocale(String(body.lang ?? "")) ? String(body.lang) : "lv",
  };

  const errors = validateBooking(input, nowInRiga());
  if (Object.keys(errors).length > 0) {
    const status = errors.slot === "slot_taken" ? 409 : 400;
    return NextResponse.json({ ok: false, errors }, { status });
  }

  const reference = `NOVA-${input.date.replace(/-/g, "").slice(2)}-${Math.floor(1000 + Math.random() * 9000)}`;
  return NextResponse.json({ ok: true, reference });
}

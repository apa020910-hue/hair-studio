"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { addDays, getAvailableTimes } from "@/lib/availability";
import { validateContact, type BookingErrorCode, type BookingErrors, type BookingResponse } from "@/lib/booking";
import { BOOK_EVENT, type BookIntent } from "@/lib/booking-events";
import {
  CATEGORIES,
  getService,
  getStylist,
  servicesByCategory,
  stylistHandles,
  stylistsForCategory,
  type Category,
  type ServiceId,
  type StylistChoice,
  type StylistId,
} from "@/lib/data";
import { formatDate, formatDuration, formatPrice } from "@/lib/format";
import type { Dictionary, Locale } from "@/lib/i18n";
import { buildIcs, downloadIcs } from "@/lib/ics";
import { site } from "@/lib/site";
import { useRigaNow } from "@/lib/use-riga-now";
import { Calendar, Check, ChevronLeft, ChevronRight } from "./Icons";
import { Strands } from "./Strands";
import { buttonClasses, cn, inputClasses, toneClasses } from "./ui";

interface BookingProps {
  lang: Locale;
  dict: Dictionary["booking"];
  common: Dictionary["common"];
  categoryLabels: Dictionary["services"]["tabs"];
  serviceNames: Dictionary["services"]["items"];
  members: Dictionary["team"]["members"];
}

type Step = 0 | 1 | 2 | 3 | 4;

interface FormState {
  name: string;
  phone: string;
  email: string;
  notes: string;
  consent: boolean;
  /** Honeypot. Hidden from people, tempting for bots. */
  company: string;
}

const EMPTY_FORM: FormState = { name: "", phone: "", email: "", notes: "", consent: false, company: "" };
const DAYS_SHOWN = 14;

export function Booking({ lang, dict, common, categoryLabels, serviceNames, members }: BookingProps) {
  const now = useRigaNow();

  const [step, setStep] = useState<Step>(0);
  const [category, setCategory] = useState<Category>("barber");
  const [serviceId, setServiceId] = useState<ServiceId | null>(null);
  const [stylistId, setStylistId] = useState<StylistChoice>("any");
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moveFocus = useRef(false);

  const service = serviceId ? getService(serviceId) : undefined;
  const stylist = stylistId === "any" ? undefined : getStylist(stylistId);

  /** Stylists who could perform the selected service and are allowed by the current choice. */
  const stylistIds = useMemo<StylistId[]>(() => {
    if (!service) return [];
    if (stylistId !== "any") return [stylistId];
    return stylistsForCategory(service.category).map((item) => item.id);
  }, [service, stylistId]);

  /** Free start times for each of the next days. */
  const timesByDay = useMemo(() => {
    const map = new Map<string, string[]>();
    if (!now || !service) return map;
    for (let offset = 0; offset < DAYS_SHOWN; offset += 1) {
      const day = addDays(now.date, offset);
      map.set(day, getAvailableTimes({ date: day, durationMin: service.durationMin, stylistIds, now }));
    }
    return map;
  }, [now, service, stylistIds]);

  const days = useMemo(() => Array.from(timesByDay.keys()), [timesByDay]);
  const firstFreeDay = days.find((day) => (timesByDay.get(day)?.length ?? 0) > 0) ?? null;
  const activeDate = date && (timesByDay.get(date)?.length ?? 0) > 0 ? date : firstFreeDay;
  const activeTimes = activeDate ? (timesByDay.get(activeDate) ?? []) : [];

  const visibleCategories = CATEGORIES.filter((item) => (stylist ? stylistHandles(stylist, item) : true));
  const activeCategory = visibleCategories.includes(category) ? category : (visibleCategories[0] ?? "barber");

  function goTo(next: Step) {
    moveFocus.current = true;
    setNotice(null);
    setStep(next);
  }

  // Move focus to the step heading (and bring the panel into view) after user-driven step changes.
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    headingRef.current?.focus({ preventScroll: true });
    const panel = panelRef.current;
    if (panel && panel.getBoundingClientRect().top < 0) panel.scrollIntoView();
  }, [step]);

  // "Book" buttons elsewhere on the page pre-fill this widget through a window event.
  useEffect(() => {
    const onBook = (event: Event) => {
      const intent: BookIntent = (event as CustomEvent<BookIntent>).detail ?? {};
      const intentService = intent.serviceId ? getService(intent.serviceId) : undefined;
      const intentStylist = intent.stylistId ? getStylist(intent.stylistId) : undefined;
      const validStylist: StylistChoice =
        intentStylist && (!intentService || stylistHandles(intentStylist, intentService.category))
          ? intentStylist.id
          : "any";

      setReference(null);
      setErrors({});
      setNotice(null);
      setServiceId(intentService?.id ?? null);
      setStylistId(validStylist);
      setDate(intent.date ?? null);
      setTime(intent.time ?? null);
      if (intentService) setCategory(intentService.category);
      else if (intentStylist) setCategory(intentStylist.categories[0]);

      let next: Step = 0;
      if (intentService) {
        if (intent.date && intent.time) next = 3;
        else next = validStylist !== "any" ? 2 : 1;
      }
      moveFocus.current = true;
      setStep(next);
    };

    window.addEventListener(BOOK_EVENT, onBook);
    return () => window.removeEventListener(BOOK_EVENT, onBook);
  }, []);

  function chooseService(id: ServiceId) {
    const chosen = getService(id);
    if (!chosen) return;
    const keepStylist = stylist ? stylistHandles(stylist, chosen.category) : false;
    setServiceId(id);
    setCategory(chosen.category);
    if (!keepStylist) setStylistId("any");
    setDate(null);
    setTime(null);
    goTo(keepStylist ? 2 : 1);
  }

  function chooseStylist(choice: StylistChoice) {
    setStylistId(choice);
    setDate(null);
    setTime(null);
    goTo(2);
  }

  function chooseTime(value: string) {
    setDate(activeDate);
    setTime(value);
    goTo(3);
  }

  function reset() {
    setServiceId(null);
    setStylistId("any");
    setDate(null);
    setTime(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setReference(null);
    goTo(0);
  }

  function errorMessage(code: BookingErrorCode | undefined, field: "name" | "phone" | "email" | "consent"): string | null {
    if (!code) return null;
    if (code === "required") return dict.errors.required;
    if (code === "consent") return dict.errors.consent;
    if (field === "phone") return dict.errors.phone;
    if (field === "email") return dict.errors.email;
    return dict.errors.required;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!service || !date || !time || sending) return;

    const contactErrors = validateContact(form);
    setErrors(contactErrors);
    if (Object.keys(contactErrors).length > 0) return;

    setSending(true);
    setNotice(null);
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: service.id, stylistId, date, time, ...form, lang }),
      });
      const data = (await response.json()) as BookingResponse;

      if (response.ok && data.ok && data.reference) {
        setReference(data.reference);
        goTo(4);
      } else if (data.errors?.slot) {
        setTime(null);
        setNotice(dict.errors.slotTaken);
        goTo(2);
      } else if (data.errors) {
        setErrors(data.errors);
      } else {
        setNotice(dict.errors.generic);
      }
    } catch {
      setNotice(dict.errors.generic);
    } finally {
      setSending(false);
    }
  }

  function addToCalendar() {
    if (!service || !date || !time || !reference) return;
    const stylistName = stylist ? stylist.name : dict.stylist.any;
    downloadIcs(
      `nova-hair-studio-${reference}.ics`,
      buildIcs({
        uid: reference,
        title: `${serviceNames[service.id].name}, ${site.name}`,
        description: `${dict.success.reference}: ${reference}. ${dict.summary.stylist}: ${stylistName}.`,
        location: `${site.address.street}, ${site.address.city}, ${site.address.postalCode}`,
        date,
        time,
        durationMin: service.durationMin,
      }),
    );
  }

  const stepLabels = [dict.steps.service, dict.steps.stylist, dict.steps.time, dict.steps.details];
  const headings = [
    dict.service.title,
    dict.stylist.title,
    dict.time.title,
    dict.details.title,
    dict.success.title,
  ];

  const whenLabel =
    date && time
      ? `${formatDate(date, lang, { weekday: "long", day: "numeric", month: "long" })}, ${time}`
      : null;

  return (
    <section id="booking" className="on-dark relative isolate overflow-hidden bg-pine py-24 text-fog lg:py-32">
      <Strands variant="band" count={30} className="absolute inset-x-0 bottom-0 -z-10 h-48 w-full opacity-40" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <h2 className="text-4xl leading-[1.08] tracking-[-0.01em] sm:text-5xl">{dict.title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-fog/75">{dict.text}</p>
        </div>

        <div ref={panelRef} className="mt-12 grid scroll-mt-24 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div className="rounded-[2rem] bg-fog p-5 text-ink sm:p-8 lg:p-10">
            {/* Progress */}
            <ol className="flex items-center gap-2 sm:gap-3">
              {stepLabels.map((label, index) => {
                const state = step > index ? "done" : step === index ? "current" : "todo";
                const clickable = state === "done" && step < 4;
                return (
                  <li
                    key={label}
                    className={cn("flex items-center gap-2 sm:gap-3", index < 3 && "flex-1")}
                    aria-current={state === "current" ? "step" : undefined}
                  >
                    <button
                      type="button"
                      disabled={!clickable}
                      onClick={() => goTo(index as Step)}
                      className="flex items-center gap-2.5 text-left disabled:cursor-default"
                    >
                      <span
                        className={cn(
                          "grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-medium",
                          state === "done" && "bg-pine text-fog",
                          state === "current" && "bg-honey text-pine",
                          state === "todo" && "border border-line text-muted",
                        )}
                      >
                        {state === "done" ? <Check className="h-4 w-4" /> : index + 1}
                      </span>
                      <span
                        className={cn(
                          "text-sm",
                          state === "current" ? "font-medium" : "hidden sm:block",
                          state === "todo" && "text-muted",
                        )}
                      >
                        {label}
                      </span>
                    </button>
                    {index < 3 && <span aria-hidden="true" className="hidden h-px flex-1 bg-line sm:block" />}
                  </li>
                );
              })}
            </ol>

            <h3 ref={headingRef} tabIndex={-1} className="mt-8 text-3xl leading-tight outline-none sm:text-4xl">
              {headings[step]}
            </h3>

            {notice && (
              <p role="alert" className="mt-4 rounded-xl border border-red-700/30 bg-red-50 px-4 py-3 text-sm text-red-800">
                {notice}
              </p>
            )}

            {/* Step 1: service */}
            {step === 0 && (
              <div>
                {stylist && <p className="mt-3 text-sm text-muted">{dict.service.hintStylist}</p>}
                <div className="mt-6 flex flex-wrap gap-2">
                  {visibleCategories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={item === activeCategory}
                      onClick={() => setCategory(item)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                        item === activeCategory
                          ? "border-pine bg-pine text-fog"
                          : "border-line text-muted hover:border-pine hover:text-ink",
                      )}
                    >
                      {categoryLabels[item]}
                    </button>
                  ))}
                </div>
                <ul className="mt-5 divide-y divide-line border-y border-line">
                  {servicesByCategory(activeCategory).map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        aria-pressed={item.id === serviceId}
                        onClick={() => chooseService(item.id)}
                        className="-mx-3 flex w-[calc(100%+1.5rem)] items-center gap-4 rounded-xl px-3 py-4 text-left transition-colors hover:bg-paper"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium">{serviceNames[item.id].name}</span>
                          <span className="block text-sm text-muted">{formatDuration(item.durationMin, common)}</span>
                        </span>
                        <span className="font-display text-xl">{formatPrice(item.price, item.priceFrom, common)}</span>
                        <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Step 2: stylist */}
            {step === 1 && service && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <StylistOption
                  selected={stylistId === "any"}
                  onSelect={() => chooseStylist("any")}
                  title={dict.stylist.any}
                  subtitle={dict.stylist.anyHint}
                  badge={<span className="grid h-full w-full place-items-center bg-line text-lg text-pine">★</span>}
                />
                {stylistsForCategory(service.category).map((item) => (
                  <StylistOption
                    key={item.id}
                    selected={stylistId === item.id}
                    onSelect={() => chooseStylist(item.id)}
                    title={item.name}
                    subtitle={members[item.id].role}
                    badge={
                      <span className={cn("grid h-full w-full place-items-center font-display text-lg", toneClasses[item.tone])}>
                        {item.initials}
                      </span>
                    }
                  />
                ))}
              </div>
            )}

            {/* Step 3: day and time */}
            {step === 2 && service && (
              <div className="mt-6">
                {!now ? (
                  <p className="text-muted">{dict.time.loading}</p>
                ) : (
                  <>
                    <p className="text-sm font-medium">{dict.time.date}</p>
                    <div className="no-scrollbar -mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-2">
                      {days.map((day) => {
                        const free = (timesByDay.get(day)?.length ?? 0) > 0;
                        const selected = day === activeDate;
                        return (
                          <button
                            key={day}
                            type="button"
                            disabled={!free}
                            aria-pressed={selected}
                            onClick={() => {
                              setDate(day);
                              setTime(null);
                            }}
                            className={cn(
                              "flex w-[4.5rem] shrink-0 flex-col items-center rounded-2xl border px-2 py-3 transition-colors",
                              "disabled:cursor-not-allowed disabled:opacity-35",
                              selected ? "border-pine bg-pine text-fog" : "border-line bg-paper enabled:hover:border-pine",
                            )}
                          >
                            <span className={cn("text-xs", selected ? "text-fog/75" : "text-muted")}>
                              {formatDate(day, lang, { weekday: "short" })}
                            </span>
                            <span className="font-display text-2xl leading-tight">
                              {formatDate(day, lang, { day: "numeric" })}
                            </span>
                            <span className={cn("text-xs", selected ? "text-fog/75" : "text-muted")}>
                              {formatDate(day, lang, { month: "short" })}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <p className="mt-6 text-sm font-medium">{dict.time.times}</p>
                    {activeTimes.length === 0 ? (
                      <p className="mt-3 text-muted">{dict.time.none}</p>
                    ) : (
                      <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                        {activeTimes.map((value) => (
                          <li key={value}>
                            <button
                              type="button"
                              onClick={() => chooseTime(value)}
                              aria-pressed={value === time && activeDate === date}
                              className={cn(
                                "w-full rounded-xl border px-3 py-3 text-base font-medium tabular-nums transition-colors",
                                value === time && activeDate === date
                                  ? "border-pine bg-pine text-fog"
                                  : "border-line bg-paper hover:border-pine",
                              )}
                            >
                              {value}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Step 4: details */}
            {step === 3 && service && (
              <form onSubmit={submit} noValidate className="mt-6 grid gap-5">
                <Field
                  id="booking-name"
                  label={dict.details.name}
                  error={errorMessage(errors.name, "name")}
                  input={
                    <input
                      id="booking-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "booking-name-error" : undefined}
                      className={cn(inputClasses, errors.name && "border-red-700")}
                    />
                  }
                />
                <Field
                  id="booking-phone"
                  label={dict.details.phone}
                  error={errorMessage(errors.phone, "phone")}
                  input={
                    <input
                      id="booking-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+371"
                      value={form.phone}
                      onChange={(event) => setForm({ ...form, phone: event.target.value })}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? "booking-phone-error" : undefined}
                      className={cn(inputClasses, errors.phone && "border-red-700")}
                    />
                  }
                />
                <Field
                  id="booking-email"
                  label={dict.details.email}
                  error={errorMessage(errors.email, "email")}
                  input={
                    <input
                      id="booking-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(event) => setForm({ ...form, email: event.target.value })}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "booking-email-error" : undefined}
                      className={cn(inputClasses, errors.email && "border-red-700")}
                    />
                  }
                />
                <Field
                  id="booking-notes"
                  label={dict.details.notes}
                  hint={dict.details.notesHint}
                  error={null}
                  input={
                    <textarea
                      id="booking-notes"
                      name="notes"
                      rows={3}
                      maxLength={500}
                      value={form.notes}
                      onChange={(event) => setForm({ ...form, notes: event.target.value })}
                      className={cn(inputClasses, "h-auto resize-y py-3")}
                    />
                  }
                />

                {/* Honeypot: hidden from people and assistive tech. */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label>
                    Company
                    <input
                      type="text"
                      name="company"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.company}
                      onChange={(event) => setForm({ ...form, company: event.target.value })}
                    />
                  </label>
                </div>

                <div>
                  <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={(event) => setForm({ ...form, consent: event.target.checked })}
                      aria-invalid={Boolean(errors.consent)}
                      aria-describedby={errors.consent ? "booking-consent-error" : undefined}
                      className="mt-0.5 h-5 w-5 shrink-0 accent-pine"
                    />
                    <span>{dict.details.consent}</span>
                  </label>
                  {errors.consent && (
                    <p id="booking-consent-error" className="mt-2 text-sm text-red-700">
                      {errorMessage(errors.consent, "consent")}
                    </p>
                  )}
                </div>

                <button type="submit" disabled={sending} className={buttonClasses("pine", "lg", "w-full disabled:opacity-60 sm:w-auto sm:self-start")}>
                  {sending ? dict.details.sending : dict.details.submit}
                </button>
              </form>
            )}

            {/* Success */}
            {step === 4 && service && reference && (
              <div className="mt-6">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-honey text-pine">
                  <Check className="h-7 w-7" />
                </span>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">{dict.success.text}</p>
                <p className="mt-8 text-sm text-muted">{dict.success.reference}</p>
                <p className="font-display text-3xl tracking-wider">{reference}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button type="button" onClick={addToCalendar} className={buttonClasses("pine", "md")}>
                    <Calendar className="h-4 w-4" />
                    {dict.success.calendar}
                  </button>
                  <button type="button" onClick={reset} className={buttonClasses("outline-dark", "md")}>
                    {dict.success.another}
                  </button>
                </div>
                <p className="mt-8 border-t border-line pt-4 text-sm text-muted">{dict.success.demo}</p>
              </div>
            )}

            {step > 0 && step < 4 && (
              <button
                type="button"
                onClick={() => goTo((step - 1) as Step)}
                className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
              >
                <ChevronLeft className="h-4 w-4" />
                {dict.back}
              </button>
            )}
          </div>

          {/* Summary */}
          <aside className="rounded-[2rem] border border-fog/15 p-6 sm:p-8 lg:sticky lg:top-24" aria-label={dict.summary.title}>
            <h3 className="text-2xl">{dict.summary.title}</h3>
            {!service ? (
              <p className="mt-4 text-fog/65">{dict.summary.empty}</p>
            ) : (
              <dl className="mt-6 space-y-4">
                <SummaryRow label={dict.summary.service} value={serviceNames[service.id].name} />
                <SummaryRow label={dict.summary.stylist} value={stylist ? stylist.name : dict.stylist.any} />
                {whenLabel && <SummaryRow label={dict.summary.when} value={whenLabel} />}
                <SummaryRow label={dict.summary.duration} value={formatDuration(service.durationMin, common)} />
                <div className="border-t border-fog/15 pt-4">
                  <dt className="text-sm text-fog/65">{dict.summary.total}</dt>
                  <dd className="mt-1 font-display text-4xl">
                    {formatPrice(service.price, service.priceFrom, common)}
                  </dd>
                </div>
              </dl>
            )}
            <p className="mt-6 flex items-start gap-2 text-sm text-fog/70">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-honey" />
              {dict.summary.policy}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-fog/65">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}

function StylistOption({
  selected,
  onSelect,
  title,
  subtitle,
  badge,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  subtitle: string;
  badge: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "flex items-center gap-4 rounded-2xl border p-4 text-left transition-colors",
        selected ? "border-pine bg-paper" : "border-line hover:border-pine",
      )}
    >
      <span className="h-12 w-12 shrink-0 overflow-hidden rounded-full">{badge}</span>
      <span className="min-w-0">
        <span className="block font-medium">{title}</span>
        <span className="block text-sm text-muted">{subtitle}</span>
      </span>
    </button>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  input,
}: {
  id: string;
  label: string;
  hint?: string;
  error: string | null;
  input: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      {input}
      {hint && !error && <p className="mt-1.5 text-sm text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

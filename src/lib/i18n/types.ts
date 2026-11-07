import type { Category, ServiceId, StylistId } from "@/lib/data";

export interface Dictionary {
  meta: { title: string; description: string };
  a11y: { skip: string; openMenu: string; closeMenu: string; mainNav: string; language: string; stars: string };
  common: {
    book: string;
    bookNow: string;
    call: string;
    from: string;
    hour: string;
    minute: string;
    today: string;
    tomorrow: string;
    closed: string;
  };
  nav: { services: string; team: string; reviews: string; faq: string; contact: string };
  hero: {
    title: string;
    text: string;
    ctaPrimary: string;
    ctaSecondary: string;
    rating: string;
    quick: { title: string; service: string; loading: string; empty: string; all: string };
  };
  benefits: { title: string; text: string }[];
  services: {
    title: string;
    text: string;
    tabs: Record<Category, string>;
    tabsHint: Record<Category, string>;
    items: Record<ServiceId, { name: string; desc: string }>;
    note: string;
  };
  about: { title: string; text: string; values: { title: string; text: string }[] };
  team: {
    title: string;
    text: string;
    speaks: string;
    book: string;
    members: Record<StylistId, { role: string; bio: string }>;
  };
  reviews: {
    title: string;
    summary: string;
    note: string;
    items: { name: string; service: string; text: string }[];
  };
  booking: {
    title: string;
    text: string;
    steps: { service: string; stylist: string; time: string; details: string };
    service: { title: string; hintStylist: string };
    stylist: { title: string; any: string; anyHint: string };
    time: { title: string; date: string; times: string; pickDay: string; none: string; loading: string };
    details: {
      title: string;
      name: string;
      phone: string;
      email: string;
      notes: string;
      notesHint: string;
      consent: string;
      submit: string;
      sending: string;
    };
    summary: {
      title: string;
      empty: string;
      service: string;
      stylist: string;
      when: string;
      duration: string;
      total: string;
      policy: string;
    };
    back: string;
    success: {
      title: string;
      text: string;
      reference: string;
      calendar: string;
      another: string;
      demo: string;
    };
    errors: {
      required: string;
      phone: string;
      email: string;
      consent: string;
      slotTaken: string;
      generic: string;
    };
  };
  faq: { title: string; text: string; items: { q: string; a: string }[] };
  contact: {
    title: string;
    text: string;
    addressLabel: string;
    hoursLabel: string;
    phoneLabel: string;
    emailLabel: string;
    days: { weekdays: string; saturday: string; sunday: string };
    directions: string;
    whatsapp: string;
  };
  footer: { tagline: string; demo: string; privacy: string; rights: string };
}

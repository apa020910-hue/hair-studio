/**
 * Central place for business details.
 * Replace the placeholders below when you adapt this demo for a real client.
 */
export const site = {
  name: "NOVA Hair Studio",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  timezone: "Europe/Riga",
  phone: "+371 20 000 000",
  phoneHref: "tel:+37120000000",
  whatsappHref: "https://wa.me/37120000000",
  email: "hello@novahair.example",
  address: {
    street: "Vaļņu iela 12",
    postalCode: "LV-1050",
    city: "Rīga",
    country: "LV",
  },
  mapsHref: "https://www.google.com/maps/search/?api=1&query=Va%C4%BC%C5%86u+iela+12%2C+R%C4%ABga",
  instagramHref: "https://www.instagram.com/",
  facebookHref: "https://www.facebook.com/",
} as const;

export interface DayHours {
  open: number;
  close: number;
}

/** Opening hours by weekday (0 = Sunday ... 6 = Saturday). `null` means closed. */
export const OPENING_HOURS: Record<number, DayHours | null> = {
  0: null,
  1: { open: 10, close: 20 },
  2: { open: 10, close: 20 },
  3: { open: 10, close: 20 },
  4: { open: 10, close: 20 },
  5: { open: 10, close: 20 },
  6: { open: 10, close: 18 },
};

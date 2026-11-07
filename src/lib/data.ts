/** Service and stylist data. Names and descriptions live in the i18n dictionaries. */

export const CATEGORIES = ["barber", "cut", "color", "care"] as const;
export type Category = (typeof CATEGORIES)[number];

interface ServiceDef {
  id: string;
  category: Category;
  durationMin: number;
  /** Price in EUR. */
  price: number;
  /** Show the price as "from X". */
  priceFrom: boolean;
}

export const SERVICES = [
  { id: "mens-cut", category: "barber", durationMin: 45, price: 28, priceFrom: false },
  { id: "cut-beard", category: "barber", durationMin: 75, price: 42, priceFrom: false },
  { id: "beard", category: "barber", durationMin: 30, price: 18, priceFrom: false },

  { id: "womens-cut", category: "cut", durationMin: 60, price: 55, priceFrom: true },
  { id: "blowdry", category: "cut", durationMin: 45, price: 35, priceFrom: true },
  { id: "updo", category: "cut", durationMin: 75, price: 70, priceFrom: true },
  { id: "kids-cut", category: "cut", durationMin: 30, price: 20, priceFrom: false },

  { id: "root-color", category: "color", durationMin: 90, price: 65, priceFrom: true },
  { id: "full-color", category: "color", durationMin: 120, price: 95, priceFrom: true },
  { id: "balayage", category: "color", durationMin: 210, price: 190, priceFrom: true },
  { id: "toning-gloss", category: "color", durationMin: 45, price: 45, priceFrom: false },

  { id: "bond-repair", category: "care", durationMin: 45, price: 40, priceFrom: false },
  { id: "keratin", category: "care", durationMin: 150, price: 140, priceFrom: true },
  { id: "scalp-spa", category: "care", durationMin: 40, price: 35, priceFrom: false },
] as const satisfies readonly ServiceDef[];

export type Service = (typeof SERVICES)[number];
export type ServiceId = Service["id"];

export type StylistTone = "pine" | "spruce" | "lagoon" | "honey";

interface StylistDef {
  id: string;
  name: string;
  initials: string;
  categories: readonly Category[];
  /** Weekdays off (0 = Sunday ... 6 = Saturday). */
  daysOff: readonly number[];
  languages: readonly string[];
  tone: StylistTone;
}

export const STYLISTS = [
  {
    id: "marta",
    name: "Marta Ozola",
    initials: "MO",
    categories: ["cut", "color", "care"],
    daysOff: [0, 1],
    languages: ["LV", "EN", "RU"],
    tone: "spruce",
  },
  {
    id: "arturs",
    name: "Artūrs Liepiņš",
    initials: "AL",
    categories: ["barber"],
    daysOff: [0, 3],
    languages: ["LV", "RU"],
    tone: "pine",
  },
  {
    id: "kristina",
    name: "Kristina Volkova",
    initials: "KV",
    categories: ["color", "care"],
    daysOff: [0, 2],
    languages: ["RU", "LV", "EN"],
    tone: "honey",
  },
  {
    id: "roberts",
    name: "Roberts Kalniņš",
    initials: "RK",
    categories: ["barber", "cut"],
    daysOff: [0, 4],
    languages: ["LV", "EN"],
    tone: "lagoon",
  },
] as const satisfies readonly StylistDef[];

export type Stylist = (typeof STYLISTS)[number];
export type StylistId = Stylist["id"];
/** A concrete stylist or "any" (first available). */
export type StylistChoice = StylistId | "any";

export function getService(id: string): Service | undefined {
  return SERVICES.find((service) => service.id === id);
}

export function getStylist(id: string): Stylist | undefined {
  return STYLISTS.find((stylist) => stylist.id === id);
}

export function stylistHandles(stylist: Stylist, category: Category): boolean {
  return (stylist.categories as readonly Category[]).includes(category);
}

export function stylistsForCategory(category: Category): Stylist[] {
  return STYLISTS.filter((stylist) => stylistHandles(stylist, category));
}

export function stylistWorksOn(stylist: Stylist, weekday: number): boolean {
  return !(stylist.daysOff as readonly number[]).includes(weekday);
}

export function servicesByCategory(category: Category): Service[] {
  return SERVICES.filter((service) => service.category === category);
}

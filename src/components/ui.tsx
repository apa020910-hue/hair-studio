import type { StylistTone } from "@/lib/data";

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

type ButtonVariant = "honey" | "pine" | "outline-light" | "outline-dark";
type ButtonSize = "md" | "lg";

const buttonVariants: Record<ButtonVariant, string> = {
  honey: "bg-honey text-pine hover:bg-honey-hi",
  pine: "bg-pine text-fog hover:bg-spruce",
  "outline-light": "border border-fog/35 text-fog hover:border-fog hover:bg-fog/10",
  "outline-dark": "border border-pine/30 text-pine hover:border-pine hover:bg-pine hover:text-fog",
};

const buttonSizes: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-8 text-base",
};

/** Class list shared by every button-like link or button. */
export function buttonClasses(variant: ButtonVariant = "honey", size: ButtonSize = "md", extra?: string): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors duration-200",
    buttonSizes[size],
    buttonVariants[variant],
    extra,
  );
}

export const inputClasses =
  "h-12 w-full rounded-xl border border-line bg-paper px-4 text-base text-ink placeholder:text-muted/60 transition-colors focus:border-pine";

/** Colour pairs for stylist monograms. */
export const toneClasses: Record<StylistTone, string> = {
  pine: "bg-pine text-honey",
  spruce: "bg-spruce text-fog",
  lagoon: "bg-lagoon text-fog",
  honey: "bg-honey text-pine",
};

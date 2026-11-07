import { cn } from "./ui";

/**
 * The brand motif: fine parallel lines that flow like combed hair.
 * Generated from a few sine terms, so it is deterministic and needs no image files.
 */
type Variant = "hero" | "band";

const VIEWBOX: Record<Variant, string> = {
  hero: "0 0 1200 900",
  band: "0 0 1200 240",
};

function n(value: number): string {
  return value.toFixed(1);
}

function buildPath(variant: Variant, t: number): string {
  const a = t * 2 - 1;
  const bend = Math.sin(t * Math.PI);

  if (variant === "band") {
    const y = 120 + a * 70;
    return `M -40 ${n(y + 30 * a)} C 260 ${n(y - 120 - 30 * bend)}, 700 ${n(y + 120 + 30 * bend)}, 1240 ${n(y - 20 * a)}`;
  }

  const y = 450 + a * 340;
  return `M -40 ${n(y + 60 * a)} C 300 ${n(y - 320 - 100 * bend)}, 700 ${n(y + 300 + 120 * bend)}, 1240 ${n(y - 60 + 240 * a)}`;
}

interface StrandsProps {
  variant?: Variant;
  count?: number;
  /** Draw the lines in on load (hero only). */
  animated?: boolean;
  className?: string;
}

export function Strands({ variant = "hero", count = 46, animated = false, className }: StrandsProps) {
  const strands = Array.from({ length: count }, (_, index) => {
    const t = index / (count - 1);
    const accent = index % 5 === 0;
    return { index, d: buildPath(variant, t), accent };
  });

  return (
    <svg
      viewBox={VIEWBOX[variant]}
      preserveAspectRatio="xMidYMid slice"
      className={cn("pointer-events-none", className)}
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      {strands.map(({ index, d, accent }) => (
        <path
          key={index}
          d={d}
          pathLength={1}
          className={animated ? "strand" : undefined}
          style={animated ? ({ "--i": index } as React.CSSProperties) : undefined}
          stroke={accent ? "var(--color-honey)" : "var(--color-fog)"}
          strokeOpacity={accent ? 0.7 : 0.16}
          strokeWidth={accent ? 1.6 : 1.1}
        />
      ))}
    </svg>
  );
}

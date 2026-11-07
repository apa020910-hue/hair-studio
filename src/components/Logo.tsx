import { Sparkle } from "./Icons";
import { cn } from "./ui";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Sparkle className="h-6 w-6 text-honey" />
      <span className="flex items-baseline gap-2.5">
        <span className="font-display text-[1.6rem] leading-none tracking-[0.2em]">NOVA</span>
        <span className="hidden text-sm opacity-70 sm:inline">Hair Studio</span>
      </span>
    </span>
  );
}

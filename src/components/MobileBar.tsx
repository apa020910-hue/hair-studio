import { site } from "@/lib/site";
import type { Dictionary } from "@/lib/i18n";
import { Phone } from "./Icons";
import { buttonClasses } from "./ui";

/** Sticky call/book bar for phones. The fastest path to a booking. */
export function MobileBar({ common }: { common: Dictionary["common"] }) {
  return (
    <div className="on-dark fixed inset-x-0 bottom-0 z-40 border-t border-fog/10 bg-pine/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md md:hidden">
      <div className="mx-auto flex max-w-md gap-3">
        <a href={site.phoneHref} className={buttonClasses("outline-light", "md", "flex-1")}>
          <Phone className="h-4 w-4" />
          {common.call}
        </a>
        <a href="#booking" className={buttonClasses("honey", "md", "flex-[1.6]")}>
          {common.bookNow}
        </a>
      </div>
    </div>
  );
}

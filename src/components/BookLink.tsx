"use client";

import type { ComponentPropsWithoutRef } from "react";
import { openBooking, type BookIntent } from "@/lib/booking-events";

type BookLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href" | "onClick"> & {
  /** What to pre-fill in the booking widget. */
  intent?: BookIntent;
};

/** An anchor to #booking (works without JS) that also pre-fills the booking widget. */
export function BookLink({ intent, children, ...props }: BookLinkProps) {
  return (
    <a
      {...props}
      href="#booking"
      onClick={(event) => {
        event.preventDefault();
        openBooking(intent);
      }}
    >
      {children}
    </a>
  );
}

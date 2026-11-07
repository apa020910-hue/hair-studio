"use client";

import { useMemo, useSyncExternalStore } from "react";
import { nowInRiga, type RigaNow } from "./availability";

let snapshot: string | null = null;

const subscribe = () => () => {};

function getSnapshot(): string {
  if (snapshot === null) {
    const now = nowInRiga();
    snapshot = `${now.date}|${now.minutes}`;
  }
  return snapshot;
}

/** Server snapshot is null, so server and first client render match (no hydration mismatch). */
const getServerSnapshot = () => null;

/** Current date/time in Riga. `null` on the server and during hydration. */
export function useRigaNow(): RigaNow | null {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => {
    if (!raw) return null;
    const [date, minutes] = raw.split("|");
    return { date, minutes: Number(minutes) };
  }, [raw]);
}

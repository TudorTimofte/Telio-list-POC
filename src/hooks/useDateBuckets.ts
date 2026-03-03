import { useCallback, useRef } from "react";
import { diffInDays, parseDate } from "../utils/date.utils.js";

export type SubmittedBucket = "Today" | "Yesterday" | "Older";

/* ===============================
   Hook
================================ */

export function useDateBuckets(referenceDate?: Date) {
  const fallbackNowRef = useRef(new Date());
  const now = referenceDate ?? fallbackNowRef.current;

  const getBucket = useCallback(
    (value: unknown): SubmittedBucket => {
      const raw = String(value ?? "").toLowerCase();

      if (raw.includes("today")) return "Today";
      if (raw.includes("yesterday")) return "Yesterday";

      const parsed = parseDate(value, now);
      if (!parsed) return "Older";

      const daysDiff = diffInDays(now, parsed);

      if (daysDiff <= 0) return "Today";
      if (daysDiff === 1) return "Yesterday";

      return "Older";
    },
    [now],
  );

  return { getBucket };
}

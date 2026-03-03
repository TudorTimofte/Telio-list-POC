import { useCallback, useRef } from "react";
import { diffInDays, parseDate } from "../utils/date.utils.js";


/* ===============================
   Hook
================================ */

export function useDateBuckets(referenceDate?: Date) {
  const fallbackNowRef = useRef(new Date());
  const now = referenceDate ?? fallbackNowRef.current;

  // Format date as MM/DD/YYYY
  const formatDate = (date: Date): string => {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  // Returns MM/DD/YYYY string if valid date, else empty string
  const getBucket = useCallback(
    (value: unknown): string => {
      const parsed = parseDate(value, now);
      if (!parsed) return '';
      return formatDate(parsed);
    },
    [now],
  );

  return { getBucket };
}

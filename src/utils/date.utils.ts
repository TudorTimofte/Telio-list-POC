const MS_PER_DAY = 24 * 60 * 60 * 1000;

const MONTH_INDEX: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

export function normalizeToStartOfDay(date: Date): number {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
}

export function diffInDays(a: Date, b: Date): number {
  return Math.floor(
    (normalizeToStartOfDay(a) - normalizeToStartOfDay(b)) / MS_PER_DAY,
  );
}

export function parseDate(value: unknown, referenceDate: Date): Date | null {
  const raw = String(value ?? "").trim();

  const direct = new Date(raw);
  if (!Number.isNaN(direct.getTime())) return direct;

  const match = raw.match(/^(\d{1,2})\s+([a-zA-Z]{3,})$/);
  if (!match) return null;

  const day = Number(match[1]);
  const monthIndex = MONTH_INDEX[match[2].toLowerCase().slice(0, 3)];

  if (monthIndex === undefined || Number.isNaN(day)) return null;

  return new Date(referenceDate.getFullYear(), monthIndex, day);
}

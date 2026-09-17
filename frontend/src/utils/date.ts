export const WINTER_SEASON_WEEKS: number[] = [
  ...Array.from({ length: 13 }, (_, i) => 40 + i), // v.40 - v.52
  ...Array.from({ length: 16 }, (_, i) => 1 + i), // v.1 - v.16
];

export function getISOWeek(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

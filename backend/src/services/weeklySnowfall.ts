import { fetchHistoricalSnowfall } from "./openMeteo";
import { getISOWeek } from "../utils/date";
import { WINTER_SEASON_WEEKS } from "../utils/weeks";

export interface WeeklyAverageSnowfall {
  week: number;
  avgSnowfallCm: number;
}

export async function fetchWeeklyAverageSnowfall(
  latitude: number,
  longitude: number,
  years: number,
): Promise<WeeklyAverageSnowfall[]> {
  const currentYear = new Date().getFullYear();
  const startDate = `${currentYear - years}-01-01`;
  const endDate = `${currentYear - 1}-12-31`;

  const daily = await fetchHistoricalSnowfall(
    latitude,
    longitude,
    startDate,
    endDate,
  );

  // week -> year -> total snowfall that year during that week
  const weeklyTotalsByYear = new Map<number, Map<number, number>>();

  for (const day of daily) {
    const week = getISOWeek(day.date);
    const year = Number(day.date.slice(0, 4));

    if (!weeklyTotalsByYear.has(week)) {
      weeklyTotalsByYear.set(week, new Map());
    }
    const yearTotals = weeklyTotalsByYear.get(week)!;
    yearTotals.set(year, (yearTotals.get(year) ?? 0) + day.snowfallCm);
  }

  return WINTER_SEASON_WEEKS.map((week) => {
    const yearTotals = weeklyTotalsByYear.get(week);
    if (!yearTotals || yearTotals.size === 0) {
      return { week, avgSnowfallCm: 0 };
    }
    const totals = Array.from(yearTotals.values());
    const avg = totals.reduce((sum, total) => sum + total, 0) / totals.length;
    return { week, avgSnowfallCm: Math.round(avg * 10) / 10 };
  });
}

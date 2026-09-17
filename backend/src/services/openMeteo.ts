const ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive";

export interface DailySnowfall {
  date: string;
  snowfallCm: number;
}

export async function fetchHistoricalSnowfall(
  latitude: number,
  longitude: number,
  startDate: string,
  endDate: string,
): Promise<DailySnowfall[]> {
  const url = new URL(ARCHIVE_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("start_date", startDate);
  url.searchParams.set("end_date", endDate);
  url.searchParams.set("daily", "snowfall_sum");
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Open-Meteo request failed: ${response.status}`);
  }

  const data = (await response.json()) as {
    daily: { time: string[]; snowfall_sum: number[] };
  };

  return data.daily.time.map((date, i) => ({
    date,
    snowfallCm: data.daily.snowfall_sum[i],
  }));
}

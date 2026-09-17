export interface Resort {
  id: string;
  name: string;
  country: "SE" | "NO" | "AT" | "FR";
  latitude: number;
  longitude: number;
}

export interface DailySnowfall {
  date: string;
  snowfallCm: number;
}

export interface WeeklyAverageSnowfall {
  week: number;
  avgSnowfallCm: number;
}

const API_BASE = "/api";

export async function fetchResorts(): Promise<Resort[]> {
  const response = await fetch(`${API_BASE}/resorts`);
  if (!response.ok) {
    throw new Error(`Failed to fetch resorts: ${response.status}`);
  }
  return response.json();
}

export async function fetchSnowfall(resortId: string): Promise<DailySnowfall[]> {
  const response = await fetch(
    `${API_BASE}/snow?resortId=${encodeURIComponent(resortId)}`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch snowfall: ${response.status}`);
  }
  return response.json();
}

export async function fetchWeeklySnowfall(
  resortId: string,
  years = 10,
): Promise<WeeklyAverageSnowfall[]> {
  const response = await fetch(
    `${API_BASE}/snow/weekly?resortId=${encodeURIComponent(resortId)}&years=${years}`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch weekly snowfall: ${response.status}`);
  }
  return response.json();
}

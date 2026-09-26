import { Router } from "express";
import { fetchHistoricalSnowfall } from "../services/openMeteo";
import { fetchWeeklyAverageSnowfall } from "../services/weeklySnowfall";
import { findResortById, resorts } from "../data/resorts";

const router = Router();

const BATCH_CONCURRENCY = 4;

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += limit) {
    const chunk = items.slice(i, i + limit);
    results.push(...(await Promise.all(chunk.map(fn))));
  }
  return results;
}

router.get("/weekly/all", async (req, res) => {
  const { years } = req.query;
  const yearsCount = typeof years === "string" ? Number(years) : 10;

  const results = await mapWithConcurrency(
    resorts,
    BATCH_CONCURRENCY,
    async (resort) => {
      try {
        const weekly = await fetchWeeklyAverageSnowfall(
          resort.latitude,
          resort.longitude,
          yearsCount,
        );
        const bestWeek = weekly.reduce((best, current) =>
          current.avgSnowfallCm > best.avgSnowfallCm ? current : best,
        );
        return {
          resortId: resort.id,
          bestWeek: bestWeek.week,
          bestWeekAvgCm: bestWeek.avgSnowfallCm,
        };
      } catch (err) {
        console.error(`Failed to fetch weekly data for ${resort.id}:`, err);
        return { resortId: resort.id, bestWeek: null, bestWeekAvgCm: null };
      }
    },
  );

  res.json(results);
});

router.get("/weekly", async (req, res) => {
  const { resortId, years } = req.query;

  if (typeof resortId !== "string") {
    res.status(400).json({ error: "resortId is required" });
    return;
  }

  const resort = findResortById(resortId);
  if (!resort) {
    res.status(404).json({ error: `Unknown resortId: ${resortId}` });
    return;
  }

  const yearsCount = typeof years === "string" ? Number(years) : 10;

  try {
    const weekly = await fetchWeeklyAverageSnowfall(
      resort.latitude,
      resort.longitude,
      yearsCount,
    );
    res.json(weekly);
  } catch (err) {
    res.status(502).json({ error: "Failed to fetch snowfall data" });
  }
});

router.get("/", async (req, res) => {
  const { resortId, start, end } = req.query;

  if (typeof resortId !== "string") {
    res.status(400).json({ error: "resortId is required" });
    return;
  }

  const resort = findResortById(resortId);
  if (!resort) {
    res.status(404).json({ error: `Unknown resortId: ${resortId}` });
    return;
  }

  const startDate = typeof start === "string" ? start : "2015-01-01";
  const endDate = typeof end === "string" ? end : "2024-12-31";

  try {
    const snowfall = await fetchHistoricalSnowfall(
      resort.latitude,
      resort.longitude,
      startDate,
      endDate,
    );
    res.json(snowfall);
  } catch (err) {
    res.status(502).json({ error: "Failed to fetch snowfall data" });
  }
});

export default router;

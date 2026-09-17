import { Router } from "express";
import { fetchHistoricalSnowfall } from "../services/openMeteo";

const router = Router();

router.get("/", async (req, res) => {
  const { lat, lon, start, end } = req.query;

  if (typeof lat !== "string" || typeof lon !== "string") {
    res.status(400).json({ error: "lat and lon are required" });
    return;
  }

  const startDate = typeof start === "string" ? start : "2015-01-01";
  const endDate = typeof end === "string" ? end : "2024-12-31";

  try {
    const snowfall = await fetchHistoricalSnowfall(
      Number(lat),
      Number(lon),
      startDate,
      endDate,
    );
    res.json(snowfall);
  } catch (err) {
    res.status(502).json({ error: "Failed to fetch snowfall data" });
  }
});

export default router;

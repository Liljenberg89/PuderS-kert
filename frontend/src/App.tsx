import { useEffect, useState } from "react";
import Header from "./components/Header";
import SnowfallChart from "./components/SnowfallChart";
import { WINTER_SEASON_WEEKS } from "./utils/date";
import {
  fetchResorts,
  fetchWeeklySnowfall,
  type Resort,
  type WeeklyAverageSnowfall,
} from "./api";
import "./App.css";

const YEAR_OPTIONS = [5, 10, 15];

function App() {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [selectedResortId, setSelectedResortId] = useState("");
  const [compareResortId, setCompareResortId] = useState("");
  const [selectedWeek, setSelectedWeek] = useState<"all" | number>("all");
  const [selectedYears, setSelectedYears] = useState(10);
  const [weeklyData, setWeeklyData] = useState<WeeklyAverageSnowfall[] | null>(
    null,
  );
  const [compareWeeklyData, setCompareWeeklyData] =
    useState<WeeklyAverageSnowfall[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResorts()
      .then((data) => {
        setResorts(data);
        if (data.length > 0) setSelectedResortId(data[0].id);
      })
      .catch(() => setError("Kunde inte hämta skidorter."));
  }, []);

  useEffect(() => {
    if (!selectedResortId) return;
    setLoading(true);
    setError(null);
    fetchWeeklySnowfall(selectedResortId, selectedYears)
      .then(setWeeklyData)
      .catch(() => setError("Kunde inte hämta snödata."))
      .finally(() => setLoading(false));
  }, [selectedResortId, selectedYears]);

  useEffect(() => {
    if (compareResortId === selectedResortId) setCompareResortId("");
  }, [selectedResortId, compareResortId]);

  useEffect(() => {
    if (!compareResortId) {
      setCompareWeeklyData(null);
      return;
    }
    fetchWeeklySnowfall(compareResortId, selectedYears)
      .then(setCompareWeeklyData)
      .catch(() => setError("Kunde inte hämta jämförelsedata."));
  }, [compareResortId, selectedYears]);

  const getBestWeek = (data: WeeklyAverageSnowfall[] | null) =>
    data
      ? data.reduce((best, current) =>
          current.avgSnowfallCm > best.avgSnowfallCm ? current : best,
        )
      : null;

  const getWeekAvg = (
    data: WeeklyAverageSnowfall[] | null,
    week: number | "all",
  ) =>
    data && week !== "all"
      ? data.find((w) => w.week === week)?.avgSnowfallCm
      : undefined;

  const getPowderWeeksCount = (data: WeeklyAverageSnowfall[] | null) =>
    data
      ? (() => {
          const seasonAverage =
            data.reduce((sum, w) => sum + w.avgSnowfallCm, 0) / data.length;
          return data.filter((w) => w.avgSnowfallCm >= seasonAverage).length;
        })()
      : null;

  const bestWeek = getBestWeek(weeklyData);
  const selectedWeekAvg = getWeekAvg(weeklyData, selectedWeek);
  const powderWeeksCount = getPowderWeeksCount(weeklyData);

  const isComparing = Boolean(compareResortId && compareWeeklyData);
  const compareBestWeek = getBestWeek(compareWeeklyData);
  const compareSelectedWeekAvg = getWeekAvg(compareWeeklyData, selectedWeek);
  const comparePowderWeeksCount = getPowderWeeksCount(compareWeeklyData);

  const resortName = (id: string) =>
    resorts.find((resort) => resort.id === id)?.name ?? "";

  const chartData =
    weeklyData?.map((w) => ({
      week: w.week,
      primary: w.avgSnowfallCm,
      compare: compareWeeklyData?.find((c) => c.week === w.week)
        ?.avgSnowfallCm,
    })) ?? null;

  return (
    <div className="container">
      <Header />
      <div className="sectionOne">
        <div className="sectionOne-box">
          <div className="intro">
            <h1>Träffa rätt vecka.</h1>
            <h4>
              PuderSäkert räknar ut vilka veckor som oftast levererar puder –
              ort för ort, vecka för vecka.
            </h4>
          </div>
          <div className="filter">
            <label className="label-ort" htmlFor="resort-select">
              Ort
            </label>
            <label className="label-compare" htmlFor="compare-select">
              Jämför med
            </label>
            <label className="label-week" htmlFor="week-select">
              Vecka
            </label>
            <label className="label-years" htmlFor="years-select">
              Antal år
            </label>
            <div className="drop-down field-ort">
              <select
                id="resort-select"
                value={selectedResortId}
                onChange={(e) => setSelectedResortId(e.target.value)}
                disabled={resorts.length === 0}
              >
                {resorts.length === 0 && <option value="">Laddar...</option>}
                {resorts.map((resort) => (
                  <option key={resort.id} value={resort.id}>
                    {resort.name}
                  </option>
                ))}
              </select>
              <i className="fa-solid fa-angle-down" aria-hidden="true"></i>
            </div>
            <div className="drop-down field-compare">
              <select
                id="compare-select"
                value={compareResortId}
                onChange={(e) => setCompareResortId(e.target.value)}
                disabled={resorts.length === 0}
              >
                <option value="">Ingen</option>
                {resorts
                  .filter((resort) => resort.id !== selectedResortId)
                  .map((resort) => (
                    <option key={resort.id} value={resort.id}>
                      {resort.name}
                    </option>
                  ))}
              </select>
              <i className="fa-solid fa-angle-down" aria-hidden="true"></i>
            </div>
            <div className="drop-down field-week">
              <select
                id="week-select"
                value={selectedWeek}
                onChange={(e) =>
                  setSelectedWeek(
                    e.target.value === "all" ? "all" : Number(e.target.value),
                  )
                }
              >
                <option value="all">Alla veckor</option>
                {WINTER_SEASON_WEEKS.map((w) => (
                  <option key={w} value={w}>
                    v.{w}
                  </option>
                ))}
              </select>
              <i className="fa-solid fa-angle-down" aria-hidden="true"></i>
            </div>
            <div className="drop-down field-years">
              <select
                id="years-select"
                value={selectedYears}
                onChange={(e) => setSelectedYears(Number(e.target.value))}
              >
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>
                    {y} år
                  </option>
                ))}
              </select>
              <i className="fa-solid fa-angle-down" aria-hidden="true"></i>
            </div>
            <span className="loading-indicator">{loading ? "Hämtar..." : ""}</span>
          </div>
          {error && <p className="error">{error}</p>}
        </div>
      </div>

      <div className="graph">
        <div className="head-info">
          <div className="info">
            <span>Bästa vecka</span>
            {isComparing ? (
              <div className="info-compare">
                <span className="info-row">
                  <i className="dot dot-primary"></i>
                  {resortName(selectedResortId)}:{" "}
                  {bestWeek ? `v.${bestWeek.week}` : "–"}
                </span>
                <span className="info-row">
                  <i className="dot dot-compare"></i>
                  {resortName(compareResortId)}:{" "}
                  {compareBestWeek ? `v.${compareBestWeek.week}` : "–"}
                </span>
              </div>
            ) : (
              <h3>{bestWeek ? `v.${bestWeek.week}` : "–"}</h3>
            )}
          </div>
          <div className="info">
            <span>
              {selectedWeek !== "all"
                ? `Snitt nysnö v.${selectedWeek}`
                : "Snitt nysnö (välj vecka)"}
            </span>
            {isComparing ? (
              <div className="info-compare">
                <span className="info-row">
                  <i className="dot dot-primary"></i>
                  {resortName(selectedResortId)}:{" "}
                  {selectedWeekAvg !== undefined
                    ? `${selectedWeekAvg} cm`
                    : "–"}
                </span>
                <span className="info-row">
                  <i className="dot dot-compare"></i>
                  {resortName(compareResortId)}:{" "}
                  {compareSelectedWeekAvg !== undefined
                    ? `${compareSelectedWeekAvg} cm`
                    : "–"}
                </span>
              </div>
            ) : (
              <h3>
                {selectedWeekAvg !== undefined ? `${selectedWeekAvg} cm` : "–"}
              </h3>
            )}
          </div>
          <div className="info">
            <span>Puderveckor</span>
            {isComparing ? (
              <div className="info-compare">
                <span className="info-row">
                  <i className="dot dot-primary"></i>
                  {resortName(selectedResortId)}:{" "}
                  {weeklyData
                    ? `${powderWeeksCount} av ${weeklyData.length}`
                    : "–"}
                </span>
                <span className="info-row">
                  <i className="dot dot-compare"></i>
                  {resortName(compareResortId)}:{" "}
                  {compareWeeklyData
                    ? `${comparePowderWeeksCount} av ${compareWeeklyData.length}`
                    : "–"}
                </span>
              </div>
            ) : (
              <h3>
                {weeklyData
                  ? `${powderWeeksCount} av ${weeklyData.length}`
                  : "–"}
              </h3>
            )}
          </div>
        </div>
        <div className={chartData ? "staple-graph" : "staple-graph staple-graph--empty"}>
          {chartData && (
            <SnowfallChart
              data={chartData}
              selectedWeek={selectedWeek}
              bestWeek={bestWeek?.week ?? null}
              primaryLabel={resortName(selectedResortId)}
              compareLabel={
                compareResortId ? resortName(compareResortId) : undefined
              }
            />
          )}
        </div>
        <p className="data-note">
          Baserat på snödata från de senaste {selectedYears} åren, hämtad från
          väderanalysmodeller (Open-Meteo). Siffrorna är mest tillförlitliga
          för att jämföra veckor mot varandra – inte som exakta cm-mått.
        </p>
      </div>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import SnowfallChart from "../components/SnowfallChart";
import { useFavorites } from "../hooks/useFavorites";
import { WINTER_SEASON_WEEKS } from "../utils/date";
import {
  fetchResorts,
  fetchWeeklySnowfall,
  type Resort,
  type WeeklyAverageSnowfall,
} from "../api";
import "../App.css";

const YEAR_OPTIONS = [5, 10, 15];

function ResortPage() {
  const { resortId } = useParams<{ resortId: string }>();
  const selectedResortId = resortId ?? "";
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const compareResortId = searchParams.get("compare") ?? "";
  const rawWeek = searchParams.get("week");
  const selectedWeek: "all" | number =
    rawWeek && rawWeek !== "all" && !Number.isNaN(Number(rawWeek))
      ? Number(rawWeek)
      : "all";
  const rawYears = Number(searchParams.get("years"));
  const selectedYears = YEAR_OPTIONS.includes(rawYears) ? rawYears : 10;

  const { isFavorite, toggleFavorite } = useFavorites();
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyAverageSnowfall[] | null>(
    null,
  );
  const [compareWeeklyData, setCompareWeeklyData] =
    useState<WeeklyAverageSnowfall[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResorts()
      .then(setResorts)
      .catch(() => setError("Kunde inte hämta skidorter."));
  }, []);

  useEffect(() => {
    if (resorts.length > 0 && !resorts.some((r) => r.id === selectedResortId)) {
      navigate("/", { replace: true });
    }
  }, [resorts, selectedResortId, navigate]);

  useEffect(() => {
    if (!selectedResortId) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- cleanup below cancels stale responses
    setLoading(true);
    setError(null);
    fetchWeeklySnowfall(selectedResortId, selectedYears)
      .then((data) => {
        if (!cancelled) setWeeklyData(data);
      })
      .catch(() => {
        if (!cancelled) setError("Kunde inte hämta snödata.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedResortId, selectedYears]);

  useEffect(() => {
    if (compareResortId && compareResortId === selectedResortId) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("compare");
          return next;
        },
        { replace: true },
      );
      return;
    }
    if (!compareResortId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCompareWeeklyData(null);
      return;
    }
    let cancelled = false;
    fetchWeeklySnowfall(compareResortId, selectedYears)
      .then((data) => {
        if (!cancelled) setCompareWeeklyData(data);
      })
      .catch(() => {
        if (!cancelled) setError("Kunde inte hämta jämförelsedata.");
      });
    return () => {
      cancelled = true;
    };
  }, [compareResortId, selectedResortId, selectedYears, setSearchParams]);

  function updateParam(key: string, value: string | null) {
    const next = new URLSearchParams(searchParams);
    if (value === null || value === "") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  }

  function handleResortChange(newResortId: string) {
    const next = new URLSearchParams(searchParams);
    if (next.get("compare") === newResortId) {
      next.delete("compare");
    }
    navigate(`/skidort/${newResortId}?${next.toString()}`, { replace: true });
  }

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
            <div className="intro-heading">
              <h1>Träffa rätt vecka.</h1>
              {selectedResortId && (
                <button
                  className="favorite-toggle favorite-toggle--large"
                  onClick={() => toggleFavorite(selectedResortId)}
                  aria-label={
                    isFavorite(selectedResortId)
                      ? `Ta bort ${resortName(selectedResortId)} från favoriter`
                      : `Lägg till ${resortName(selectedResortId)} som favorit`
                  }
                >
                  <i
                    className={
                      isFavorite(selectedResortId)
                        ? "fa-solid fa-star"
                        : "fa-regular fa-star"
                    }
                    aria-hidden="true"
                  ></i>
                </button>
              )}
            </div>
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
                onChange={(e) => handleResortChange(e.target.value)}
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
                onChange={(e) => updateParam("compare", e.target.value)}
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
                onChange={(e) => updateParam("week", e.target.value)}
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
                onChange={(e) => updateParam("years", e.target.value)}
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
          Baserat på snösäsongerna {new Date().getFullYear() - selectedYears}–
          {new Date().getFullYear() - 1}, hämtad från väderanalysmodeller
          (Open-Meteo). Siffrorna är mest tillförlitliga för att jämföra
          veckor mot varandra – inte som exakta cm-mått.{" "}
          <Link to="/om">Läs mer om metoden</Link>.
        </p>
      </div>
    </div>
  );
}

export default ResortPage;

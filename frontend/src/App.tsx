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

function App() {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [selectedResortId, setSelectedResortId] = useState("");
  const [selectedWeek, setSelectedWeek] = useState<"all" | number>("all");
  const [weeklyData, setWeeklyData] = useState<WeeklyAverageSnowfall[] | null>(
    null,
  );
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

  const handleShow = async () => {
    if (!selectedResortId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeeklySnowfall(selectedResortId);
      setWeeklyData(data);
    } catch {
      setError("Kunde inte hämta snödata.");
    } finally {
      setLoading(false);
    }
  };

  const bestWeek = weeklyData
    ? weeklyData.reduce((best, current) =>
        current.avgSnowfallCm > best.avgSnowfallCm ? current : best,
      )
    : null;

  const selectedWeekAvg =
    weeklyData && selectedWeek !== "all"
      ? weeklyData.find((w) => w.week === selectedWeek)?.avgSnowfallCm
      : undefined;

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
            <h6>Ort</h6> <h6>Vecka</h6> <span></span>
            <div className="drop-down">
              <select
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
            <div className="drop-down">
              <select
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
            <button onClick={handleShow} disabled={loading || !selectedResortId}>
              {loading ? "Hämtar..." : "Visa"}
            </button>
          </div>
          {error && <p className="error">{error}</p>}
        </div>
      </div>

      <div className="graph">
        <div className="head-info">
          <div className="info">
            <span>Bästa vecka</span>
            <h3>{bestWeek ? `v.${bestWeek.week}` : "–"}</h3>
          </div>
          <div className="info">
            <span>
              {selectedWeek !== "all"
                ? `Snitt nysnö v.${selectedWeek}`
                : "Snitt nysnö (välj vecka)"}
            </span>
            <h3>{selectedWeekAvg !== undefined ? `${selectedWeekAvg} cm` : "–"}</h3>
          </div>
          <div className="info">
            <span>Puderveckor</span>
            <h3>10 av 21</h3>
          </div>
        </div>
        <div className={weeklyData ? "staple-graph" : "staple-graph staple-graph--empty"}>
          {weeklyData && (
            <SnowfallChart
              data={weeklyData}
              selectedWeek={selectedWeek}
              bestWeek={bestWeek?.week ?? null}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

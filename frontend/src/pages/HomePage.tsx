import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import { useFavorites } from "../hooks/useFavorites";
import {
  fetchAllResortsBestWeek,
  fetchResorts,
  type Resort,
  type ResortBestWeek,
} from "../api";
import "../App.css";
import "./HomePage.css";

const COUNTRY_LABELS: Record<Resort["country"], string> = {
  SE: "Sverige",
  NO: "Norge",
  AT: "Österrike",
  FR: "Frankrike",
  CH: "Schweiz",
};

const SORT_OPTIONS = {
  snow: "Mest snittsnö",
  name: "Namn (A-Ö)",
  country: "Land",
} as const;

type SortBy = keyof typeof SORT_OPTIONS;

interface Row {
  resort: Resort;
  stats: ResortBestWeek | null;
}

function ResortTable({
  rows,
  isFavorite,
  toggleFavorite,
}: {
  rows: Row[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
}) {
  return (
    <table className="home-table">
      <thead>
        <tr>
          <th></th>
          <th>Ort</th>
          <th>Land</th>
          <th>Bästa vecka</th>
          <th>Snitt nysnö</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ resort, stats }) => (
          <tr key={resort.id}>
            <td>
              <button
                className="favorite-toggle"
                onClick={() => toggleFavorite(resort.id)}
                aria-label={
                  isFavorite(resort.id)
                    ? `Ta bort ${resort.name} från favoriter`
                    : `Lägg till ${resort.name} som favorit`
                }
              >
                <i
                  className={
                    isFavorite(resort.id) ? "fa-solid fa-star" : "fa-regular fa-star"
                  }
                  aria-hidden="true"
                ></i>
              </button>
            </td>
            <td>
              <Link to={`/skidort/${resort.id}`}>{resort.name}</Link>
            </td>
            <td>{COUNTRY_LABELS[resort.country]}</td>
            <td>{stats?.bestWeek ? `v.${stats.bestWeek}` : "–"}</td>
            <td>
              {stats?.bestWeekAvgCm !== null &&
              stats?.bestWeekAvgCm !== undefined
                ? `${stats.bestWeekAvgCm} cm`
                : "–"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function HomePage() {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [bestWeeks, setBestWeeks] = useState<ResortBestWeek[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [searchParams, setSearchParams] = useSearchParams();

  const countryFilter = searchParams.get("land") ?? "";
  const rawSort = searchParams.get("sortera");
  const sortBy: SortBy =
    rawSort && rawSort in SORT_OPTIONS ? (rawSort as SortBy) : "snow";

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value === "") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  }

  useEffect(() => {
    Promise.all([fetchResorts(), fetchAllResortsBestWeek(10)])
      .then(([resortsData, bestWeeksData]) => {
        setResorts(resortsData);
        setBestWeeks(bestWeeksData);
      })
      .catch(() => setError("Kunde inte hämta översiktsdata."))
      .finally(() => setLoading(false));
  }, []);

  const allRows: Row[] = resorts.map((resort) => ({
    resort,
    stats: bestWeeks.find((b) => b.resortId === resort.id) ?? null,
  }));

  const filteredRows = countryFilter
    ? allRows.filter((row) => row.resort.country === countryFilter)
    : allRows;

  const rows = [...filteredRows].sort((a, b) => {
    if (sortBy === "name") {
      return a.resort.name.localeCompare(b.resort.name, "sv");
    }
    if (sortBy === "country") {
      return COUNTRY_LABELS[a.resort.country].localeCompare(
        COUNTRY_LABELS[b.resort.country],
        "sv",
      );
    }
    return (b.stats?.bestWeekAvgCm ?? -1) - (a.stats?.bestWeekAvgCm ?? -1);
  });

  const favoriteRows = rows.filter((row) => isFavorite(row.resort.id));

  return (
    <div className="container">
      <Header />
      <div className="sectionOne">
        <div className="sectionOne-box">
          <div className="intro">
            <h1>Alla skidorter, en lista.</h1>
            <h4>
              Se vilken vecka som historiskt bjudit på mest puder på varje
              ort – och klicka in dig för detaljer och jämförelser.
            </h4>
          </div>
          <div className="home-filter">
            <label className="label-land" htmlFor="country-select">
              Land
            </label>
            <label className="label-sort" htmlFor="sort-select">
              Sortera efter
            </label>
            <div className="drop-down field-land">
              <select
                id="country-select"
                value={countryFilter}
                onChange={(e) => updateParam("land", e.target.value)}
              >
                <option value="">Alla länder</option>
                {Object.entries(COUNTRY_LABELS).map(([code, label]) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
              </select>
              <i className="fa-solid fa-angle-down" aria-hidden="true"></i>
            </div>
            <div className="drop-down field-sort">
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => updateParam("sortera", e.target.value)}
              >
                {Object.entries(SORT_OPTIONS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <i className="fa-solid fa-angle-down" aria-hidden="true"></i>
            </div>
          </div>
        </div>
      </div>

      {favoriteRows.length > 0 && (
        <div className="graph home-table-card">
          <h3 className="home-table-heading">Dina favoriter</h3>
          <ResortTable
            rows={favoriteRows}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
          />
        </div>
      )}

      <div className="graph home-table-card">
        {loading && <p>Hämtar orter...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && rows.length === 0 && (
          <p>Inga orter matchar det valda landet.</p>
        )}
        {!loading && !error && rows.length > 0 && (
          <ResortTable
            rows={rows}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
          />
        )}
        <p className="data-note">
          Baserat på snösäsongerna {new Date().getFullYear() - 10}–
          {new Date().getFullYear() - 1}, hämtad från väderanalysmodeller
          (Open-Meteo). Klicka på en ort för att välja antal år, jämföra med
          en annan ort och se hela säsongen. <Link to="/om">Läs mer om metoden</Link>.
        </p>
      </div>
    </div>
  );
}

export default HomePage;

import { useState } from "react";

import "./App.css";

function App() {
  function getISOWeek(date: Date): number {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  const [week, setWeek] = useState<number>(getISOWeek(new Date()));
  return (
    <div className="container">
      <div className="sectionOne">
        <div className="intro">
          <h1>Träffa rätt vecka.</h1>
          <h4>
            PowderWeek räknar ut vilka veckor som oftast levererar puder – ort
            för ort, vecka för vecka.
          </h4>
        </div>
        <div className="filter">
          <h6>Ort</h6> <h6>Vecka</h6> <span></span>
          <div className="drop-down">Sälen</div>
          <div className="drop-down">Alla veckor</div>
          <button> Visa</button>
        </div>
      </div>

      <div className="graph">
        <div className="head-info">
          <div className="info">Bästa vecka</div>
          <div className="info">Snitt nysnö v.{week}</div>
          <div className="info"></div>
        </div>
      </div>
    </div>
  );
}

export default App;

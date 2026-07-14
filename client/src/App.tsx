import { useState } from "react";
import Header from "./components/header";
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
              Sälen <i className="fa-solid fa-angle-down"></i>
            </div>
            <div className="drop-down">
              Alla veckor <i className="fa-solid fa-angle-down"></i>
            </div>
            <button> Visa</button>
          </div>
        </div>
      </div>

      <div className="graph">
        <div className="head-info">
          <div className="info">
            <span>Bästa vecka</span>
            <span>v.8</span>
          </div>
          <div className="info">
            <span>Snitt nysnö v.{week}</span>
            <span>47 cm</span>
          </div>
          <div className="info">
            <span>Puderveckor</span>
            <span>10 av 21</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

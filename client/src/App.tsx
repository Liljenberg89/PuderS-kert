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
          <h1>PuderSäkert</h1>
          <h4>Av puderåkare, för puderåkare!</h4>
          <div className="week-input">
            <h2>Vecka {week}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

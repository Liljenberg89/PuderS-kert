import Header from "./components/Header";
import { getISOWeek } from "./utils/date";
import "./App.css";

function App() {
  const week = getISOWeek(new Date());
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
              Sälen <i className="fa-solid fa-angle-down" aria-hidden="true"></i>
            </div>
            <div className="drop-down">
              Alla veckor <i className="fa-solid fa-angle-down" aria-hidden="true"></i>
            </div>
            <button> Visa</button>
          </div>
        </div>
      </div>

      <div className="graph">
        <div className="head-info">
          <div className="info">
            <span>Bästa vecka</span>
            <h3>v.8</h3>
          </div>
          <div className="info">
            <span>Snitt nysnö v.{week}</span>
            <h3>47 cm</h3>
          </div>
          <div className="info">
            <span>Puderveckor</span>
            <h3>10 av 21</h3>
          </div>
        </div>
        <div className="staple-graph"></div>
      </div>
    </div>
  );
}

export default App;

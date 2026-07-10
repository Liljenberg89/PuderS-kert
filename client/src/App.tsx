import { useState } from "react";

import "./App.css";

function App() {
  const [week, setWeek] = useState<number>(19);
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

import { Link } from "react-router-dom";
import Header from "../components/Header";
import "./AboutPage.css";

function AboutPage() {
  return (
    <div className="container">
      <Header />
      <div className="sectionOne">
        <div className="sectionOne-box">
          <div className="intro">
            <h1>Om PuderSäkert</h1>
            <h4>Vad siffrorna betyder, och var de kommer från.</h4>
          </div>
        </div>
      </div>

      <div className="graph about-card">
        <h3>Vad gör sidan?</h3>
        <p>
          PuderSäkert räknar ut vilka veckor som historiskt sett har mest
          nysnö, ort för ort, för populära skidorter i Sverige, Norge,
          Österrike, Frankrike och Schweiz. Tanken är att göra det enklare att
          planera <em>när</em> under säsongen man ska åka, inte bara vart.
        </p>

        <h3>Varifrån kommer datan?</h3>
        <p>
          All snödata hämtas från{" "}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noreferrer"
          >
            Open-Meteo
          </a>
          s historiska väderarkiv, som bygger på väderanalysmodeller (ERA5 /
          ERA5-Land) snarare än mätningar från fysiska väderstationer på
          orten.
        </p>

        <h3>Vad betyder det i praktiken?</h3>
        <p>
          Modellerna räknar med en upplösning på ungefär 9×9 km. Snöfall är en
          av de svåraste variablerna att modellera, och i bergsterräng kan
          skillnaden mellan en dalstation och en topp ge stora avvikelser i
          exakt cm-mått. Vår bedömning: datan är tillförlitlig för att jämföra
          veckor mot varandra inom samma ort (relativ rankning), men bör inte
          läsas som en exakt prognos för hur många cm snö som faller en given
          vecka.
        </p>

        <h3>Hur räknas snittet ut?</h3>
        <p>
          För varje ort och vecka räknar vi ut den genomsnittliga
          nysnömängden över valt antal år (5, 10 eller 15). "Puderveckor" är
          de veckor som ligger på eller över ortens eget säsongssnitt – alltså
          en relativ jämförelse, inte ett fast cm-tröskelvärde.
        </p>

        <p>
          <Link to="/">← Tillbaka till startsidan</Link>
        </p>
      </div>
    </div>
  );
}

export default AboutPage;

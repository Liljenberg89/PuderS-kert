import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ResortPage from "./pages/ResortPage";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/skidort/:resortId" element={<ResortPage />} />
      <Route path="/om" element={<AboutPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

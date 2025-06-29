import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PresidentePage from "./pages/PresidentePage";
import ResultadosPage from "./pages/ResultadosPage";
import ElegirMunicipios from "./pages/ElegirMunicipios";
import DiputadosPage from "./pages/DiputadosPage";
import AlcaldePage from "./pages/AlcaldePage";
// Luego puedes importar DiputadosPage, AlcaldesPage, etc.

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/presidente" element={<PresidentePage />} />
        <Route path="/diputados" element={<DiputadosPage />} />
        <Route path="/alcaldes" element={<AlcaldePage />} />
        <Route path="/elegir-municipios" element={<ElegirMunicipios />} />
        <Route path="/confirmation" element={<h1>Gracias por votar</h1>} />
        <Route path="/resultados" element={<ResultadosPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PresidentePage from "./pages/PresidentePage";
import ResultadosPage from "./pages/ResultadosPage";
import ElegirMunicipios from "./pages/ElegirMunicipios";
import DiputadosPage from "./pages/DiputadosPage";
import AlcaldePage from "./pages/AlcaldePage";
import ConfirmacionPage from "./pages/ConfirmacionPage";
//import AlgoritmosPage from "./pages/AlgoritmosPage";
// Luego puedes importar DiputadosPage, AlcaldesPage, etc.

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/presidente" element={<PresidentePage />} />
        <Route path="/diputados" element={<DiputadosPage />} />
        <Route path="/alcalde" element={<AlcaldePage />} />
        <Route path="/elegir-municipios" element={<ElegirMunicipios />} />
        <Route path="/confirmacion" element={<ConfirmacionPage/>} />
        <Route path="/resultados" element={<ResultadosPage />} />
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;

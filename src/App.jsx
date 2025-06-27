import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PresidentePage from "./pages/PresidentePage";
import ResultadosPage from "./pages/ResultadosPage";

// Luego puedes importar DiputadosPage, AlcaldesPage, etc.

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/presidente" element={<PresidentePage />} />
        <Route path="/diputados" element={<h1>Página Diputados</h1>} />
        <Route path="/alcaldes" element={<h1>Página Alcaldes</h1>} />
        <Route path="/confirmation" element={<h1>Gracias por votar</h1>} />
        <Route path="/resultados" element={<ResultadosPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

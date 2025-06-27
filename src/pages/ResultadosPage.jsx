import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import "./ResultadosPage.css";

function ResultadosPage() {
  const [resultados, setResultados] = useState({
    Presidente: [],
    Diputado: [],
    Alcalde: []
  });

  const [error, setError] = useState("");

  useEffect(() => {
    // Simulación de carga de todos los tipos
    Promise.all([
      fetch("http://localhost/api/resultados?tipo=Presidente").then((res) => res.json()),
      fetch("http://localhost/api/resultados?tipo=Diputado").then((res) => res.json()),
      fetch("http://localhost/api/resultados?tipo=Alcalde").then((res) => res.json())
    ])
      .then(([presidente, diputado, alcalde]) => {
        setResultados({
          Presidente: presidente,
          Diputado: diputado,
          Alcalde: alcalde
        });
      })
      .catch(() => setError("No se pudieron cargar los resultados."));
  }, []);

  const renderSeccion = (titulo, datos) => (
    <div className="seccion-resultado">
      <h2>{titulo}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={datos} layout="vertical" margin={{ left: 60, right: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="nombre_completo" />
          <Tooltip />
          <Bar dataKey="votos" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="resultados-container">
      <div className="resultados-box">
        <h1 className="titulo">Resultados Generales</h1>
        {error && <p className="error">{error}</p>}

        {renderSeccion("Presidenciales", resultados.Presidente)}
        {renderSeccion("Diputados", resultados.Diputado)}
        {renderSeccion("Alcaldes", resultados.Alcalde)}
      </div>
    </div>
  );
}

export default ResultadosPage;

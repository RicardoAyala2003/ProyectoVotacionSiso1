import { useEffect, useState } from "react";
import "./ResultadosPage.css";

function ResultadosPage() {
  const [resultados, setResultados] = useState({
    Presidente: [],
    Diputado: [],
    Alcalde: [],
  });

  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/resultados.php?tipo=Presidente").then((res) => res.json()),
      fetch("/api/resultados.php?tipo=Diputado").then((res) => res.json()),
      fetch("/api/resultados.php?tipo=Alcalde").then((res) => res.json()),
    ])
      .then(([presidente, diputado, alcalde]) => {
        setResultados({
          Presidente: presidente || [],
          Diputado: diputado || [],
          Alcalde: alcalde || [],
        });
      })
      .catch((err) => {
        console.error("Error al cargar resultados:", err);
        setError("No se pudieron cargar los resultados.");
      });
  }, []);

  const obtenerGanador = (lista) =>
    lista.reduce((max, actual) => (actual.votos > max.votos ? actual : max), lista[0]);

  return (
    <div className="presidente-container">
      <div className="presidente-box">
        <h1 className="titulo-principal">Resultados de la Votación</h1>

        {error && <p className="error">{error}</p>}

        <div className="seccion-resultado">
          <h2 className="subtitulo">Presidente Electo</h2>
          {resultados.Presidente.length > 0 ? (
            <p className="ganador">
              ✅ {obtenerGanador(resultados.Presidente).nombre_completo} (
              {obtenerGanador(resultados.Presidente).votos} votos)
            </p>
          ) : (
            <p>No hubo votos para presidente.</p>
          )}
        </div>

        <div className="seccion-resultado">
          <h2 className="subtitulo">Top 3 Diputados Más Votados</h2>
          {resultados.Diputado.length > 0 ? (
            <ul className="lista-candidatos">
              {resultados.Diputado
                .sort((a, b) => b.votos - a.votos)
                .slice(0, 3)
                .map((dip) => (
                  <li key={dip.id}>
                    ✅ {dip.nombre_completo} ({dip.votos} votos)
                  </li>
                ))}
            </ul>
          ) : (
            <p>No hubo votos para diputados.</p>
          )}
        </div>

        <div className="seccion-resultado">
          <h2 className="subtitulo">Top 3 Alcaldes Más Votados</h2>
          {resultados.Alcalde.length > 0 ? (
            <ul className="lista-candidatos">
              {resultados.Alcalde
                .sort((a, b) => b.votos - a.votos)
                .slice(0, 3)
                .map((alc) => (
                  <li key={alc.id}>
                    ✅ {alc.nombre_completo} – {alc.municipio} ({alc.votos} votos)
                  </li>
                ))}
            </ul>
          ) : (
            <p>No hubo votos para alcaldes.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultadosPage;

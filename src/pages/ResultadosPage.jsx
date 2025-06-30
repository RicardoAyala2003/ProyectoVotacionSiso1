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
      fetch("/api/resultados?tipo=Presidente").then((res) => res.json()),
      fetch("/api/resultados?tipo=Diputado").then((res) => res.json()),
      fetch("/api/resultados?tipo=Alcalde").then((res) => res.json()),
    ])
      .then(([presidente, diputado, alcalde]) => {
        setResultados({
          Presidente: presidente,
          Diputado: diputado,
          Alcalde: alcalde,
        });
      })
      .catch(() => setError("No se pudieron cargar los resultados."));
  }, []);

  const obtenerGanador = (lista) =>
    lista.reduce((max, actual) => (actual.votos > max.votos ? actual : max), lista[0]);

  const agruparAlcaldesPorMunicipio = (lista) => {
    const mapa = {};
    for (const candidato of lista) {
      if (!candidato.municipio) continue;
      if (!mapa[candidato.municipio]) mapa[candidato.municipio] = [];
      mapa[candidato.municipio].push(candidato);
    }
    return mapa;
  };

  const alcaldesPorMunicipio = agruparAlcaldesPorMunicipio(resultados.Alcalde);

  return (
    <div className="resultados-container">
      <div className="resultados-box">
        <h1 className="titulo-principal">Resultados de la Votación</h1>

        {error && <p className="error">{error}</p>}

        <div className="seccion-resultado">
          <h2 className="subtitulo">Presidente Electo</h2>
          {resultados.Presidente.length > 0 ? (
            <p className="ganador">
              ✅ {obtenerGanador(resultados.Presidente).nombre_completo} ({obtenerGanador(resultados.Presidente).votos} votos)
            </p>
          ) : (
            <p>No hubo votos para presidente.</p>
          )}
        </div>

        <div className="seccion-resultado">
          <h2 className="subtitulo">Diputados Electos</h2>
          {resultados.Diputado.length > 0 ? (
            <ul className="lista-candidatos">
              {resultados.Diputado
                .sort((a, b) => b.votos - a.votos)
                .slice(0, 7)
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
          <h2 className="subtitulo">Alcaldes Electos por Municipio</h2>
          {Object.keys(alcaldesPorMunicipio).length > 0 ? (
            Object.entries(alcaldesPorMunicipio).map(([muni, lista]) => {
              const ganador = obtenerGanador(lista);
              return (
                <div key={muni} className="resultado-municipio">
                  <strong>{muni}:</strong> ✅ {ganador.nombre_completo} ({ganador.votos} votos)
                </div>
              );
            })
          ) : (
            <p>No hubo votos para alcaldes.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultadosPage;

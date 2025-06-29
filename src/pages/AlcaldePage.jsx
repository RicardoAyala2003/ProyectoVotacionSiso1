import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./PresidentePage.css";
import alcalde1 from "../assets/alcalde1.jpg";
import alcalde2 from "../assets/alcalde2.jpg";
import alcalde3 from "../assets/alcalde3.jpg";

function AlcaldePage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const usuario = state?.usuario;

  const [candidatos, setCandidatos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setCandidatos([
      {
        id: 1,
        nombre_completo: "Carlos Miranda Canales",
        partido: "Partido Liberal",
        foto_url: alcalde1
      },
      {
        id: 2,
        nombre_completo: "Luis Rene Suazo Peña",
        partido: "Partido Libre",
        foto_url: alcalde2
      },
      {
        id: 3,
        nombre_completo: "Rudbel Idail Barahona Ordoñez",
        partido: "Partido Nacional",
        foto_url: alcalde3
      }
    ]);
    // fetch("http://localhost/api/candidatos?tipo=Alcalde")
    //   .then((res) => res.json())
    //   .then((data) => setCandidatos(data))
    //   .catch(() => setError("No se pudieron cargar los candidatos."));
  }, []);

  const handleVotar = async () => {
    if (!seleccionado) {
      setError("Debe seleccionar un candidato.");
      return;
    }

    try {
      const res = await fetch("http://localhost/api/votos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: usuario.id,
          candidato_id: seleccionado,
          tipo: "Alcalde",
        }),
      });

      if (!res.ok) throw new Error("Error al registrar el voto.");

      // Redirigir a la siguiente página si querés
      navigate("/final", { state: { usuario: { ...usuario, ha_votado_alcalde: true } } });
    } catch (err) {
      setError("Error al registrar el voto.");
    }
  };

  return (
    <div className="presidente-container">
      <div className="presidente-box">
        <h1>Elección de Alcalde</h1>
        <h1 className="titulo-principal">Elección de Alcalde</h1>
        <p className="subtitulo">Por favor seleccione el candidato de su preferencia para emitir su voto.</p>

        {error && <p className="error">{error}</p>}

        <div className="candidato-grid">
          {candidatos.map((candidato) => (
            <div
              key={candidato.id}
              className={`candidato-card ${seleccionado === candidato.id ? "activo" : ""}`}
              onClick={() => setSeleccionado(candidato.id)}
            >
              <img src={candidato.foto_url} alt={candidato.nombre_completo} className="candidato-foto" />
              <div className="candidato-info">
                <h3>{candidato.nombre_completo}</h3>
                <p>{candidato.partido}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="votar-btn" onClick={handleVotar}>
          Confirmar Voto
        </button>
      </div>
    </div>
  );
}

export default AlcaldePage;

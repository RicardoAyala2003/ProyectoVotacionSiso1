import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./PresidentePage.css";
import salvadorImg from "../assets/salvador.jpeg";
import rixiImg from "../assets/rixi.jpeg";
import nasryImg from "../assets/nasry.jpeg";


function PresidentePage() {
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
        nombre_completo: "Salvador Nasralla",
        partido: "Partido Liberal",
        foto_url: salvadorImg
      },
      {
        id: 2,
        nombre_completo: "Rixi Moncada",
        partido: "Partido Libre",
        foto_url: rixiImg
      },
      {
        id: 3,
        nombre_completo: "Nasry Asfura",
        partido: "Partido Nacional",
        foto_url: nasryImg
      }
    ]);
   // fetch("http://localhost/api/candidatos?tipo=Presidente")
     // .then((res) => res.json())
     // .then((data) => setCandidatos(data))
      //.catch(() => setError("No se pudieron cargar los candidatos."));
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
          tipo: "Presidente",
        }),
      });

      if (!res.ok) throw new Error("Error al registrar el voto.");

      // Redirigir a la página de diputados
      navigate("/diputados", { state: { usuario: { ...usuario, ha_votado_presidente: true } } });
    } catch (err) {
      setError("Error al registrar el voto.");
    }
  };

  return (
    <div className="presidente-container">
      <div className="presidente-box">
        <h1>Elección Presidencial</h1>
        <h1 className="titulo-principal">Elección Presidencial</h1>
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

export default PresidentePage;

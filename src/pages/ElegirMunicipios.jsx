import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ElegirMunicipios.css";

const municipios = [
  "Comayagua",
  "Ajuterique",
  "Siguatepeque",
  "Esquias",
  "Humuya",
  "La Libertad",
  "Villa de San Antonio",
  "La Trinidad",
  "Lejamani",
  "Membar",
  "San Jerónimo",
  "Ojos de Agua",
  "San José de Comayagua",
  "Minas de Oro",
  "San José del Potrero",
  "Las Lajas",
  "San Luis",
];

function ElegirMunicipios() {
  const [seleccionado, setSeleccionado] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const usuario = location.state?.usuario;

  const handleConfirmar = () => {
    if (!seleccionado) {
      setError("Debe seleccionar un municipio.");
      return;
    }

    navigate("/alcalde", {
      state: { municipio: seleccionado, usuario },
    });
  };

  return (
    <div className="municipios-container">
      <div className="municipios-box">
        <h1 className="titulo-principal">Seleccione su Municipio</h1>
        <p className="subtitulo">Elija su municipio para continuar con la votación.</p>

        {error && <p className="error">{error}</p>}

        <div className="municipio-grid">
          {municipios.map((municipio, index) => (
            <div
              key={index}
              className={`municipio-card ${
                seleccionado === municipio ? "activo" : ""
              }`}
              onClick={() => setSeleccionado(municipio)}
            >
              {municipio}
            </div>
          ))}
        </div>

        <button className="votar-btn" onClick={handleConfirmar}>
          Confirmar Municipio
        </button>
      </div>
    </div>
  );
}

export default ElegirMunicipios;

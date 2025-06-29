import { useNavigate } from "react-router-dom";
import "./ConfirmacionPage.css";

function ConfirmacionPage() {
  const navigate = useNavigate();

  const handleVolver = () => {
    navigate("/");
  };

  return (
    <div className="municipios-container">
      <div className="municipios-box">
        <h1 className="titulo-principal">¡Gracias por votar!</h1>
        <p className="subtitulo">
          Tu voto ha sido registrado exitosamente. Si deseas permitir que otra persona vote, presiona el botón abajo.
        </p>
        <button className="votar-btn" onClick={handleVolver}>
          Volver a votar
        </button>
      </div>
    </div>
  );
}

export default ConfirmacionPage;

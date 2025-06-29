import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './LoginPage.css';

function LoginPage() {
  const [dni, setDni] = useState("");
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const nombreRegex = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/;
    const dniRegex = /^\d{13}$/;

    if (!nombre.trim()) {
      setError("Por favor, ingrese su nombre completo.");
      return;
    }

    if (!nombreRegex.test(nombre)) {
      setError("El nombre solo debe contener letras y espacios.");
      return;
    }

    if (!dni.trim()) {
      setError("Por favor, ingrese su número de identidad.");
      return;
    }

    if (!dniRegex.test(dni)) {
      setError("El DNI debe contener exactamente 13 números.");
      return;
    }

    try {
      const res = await fetch("/api/registrar_usuario.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni, nombre_completo: nombre })
      });

      if (!res.ok) throw new Error("Respuesta del servidor no válida");

      const usuario = await res.json();

      // Validar coincidencia de nombre (opcional, puedes quitar esto si no es necesario)
      if (usuario.nombre_completo.toLowerCase() !== nombre.trim().toLowerCase()) {
        setError("El nombre no coincide con el registrado.");
        return;
      }

      navigate("/elegir-municipios", { state: { usuario } });

    } catch (err) {
      setError("Ocurrió un error al procesar el login.");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Plataforma de Votación 2025</h1>
        <p>Ingrese su nombre completo y número de identidad para comenzar.</p>
        <form onSubmit={handleLogin}>
          <label htmlFor="nombre">Nombre completo</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Ana Cabrera"
          />

          <label htmlFor="dni">DNI</label>
          <input
            type="text"
            id="dni"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            placeholder="0801199012345"
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

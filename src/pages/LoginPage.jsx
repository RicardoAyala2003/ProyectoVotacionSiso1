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
      const response = await fetch("/api/registrar_usuario.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          dni: dni.trim(),
          nombre_completo: nombre.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error en la respuesta del servidor");
      }

      // Redirigir a página de votación presidencial
      navigate("/presidente", {
        state: {
          usuario: data // contiene id, dni, nombre, etc.
        }
      });

    } catch (err) {
      console.error("Error completo:", err);
      setError(err.message || "Ocurrió un error al procesar el login. Intente nuevamente.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Plataforma de Votación 2025</h1>
        <p>Ingrese su nombre completo y número de identidad para comenzar.</p>

        {error && <div className="error-message">{error}</div>}

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
            maxLength="13"
          />
          <button type="submit">Ingresar</button>
        </form>
        <button
  type="button"
  className="algoritmos-btn"
  onClick={() => navigate("/algoritmos")}
>
  💡 Página informativa de Algoritmos
</button>

      </div>
    </div>
  );
}

export default LoginPage;

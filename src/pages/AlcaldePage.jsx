import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./PresidentePage.css";

// Importar todas las imágenes de alcaldes
const imagenes = import.meta.glob("../assets/alcaldesXmunicipio/**/*.jpg", { eager: true });

function AlcaldePage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const usuario = state?.usuario;
  const municipioRaw = state?.municipio;
  const municipio = municipioRaw?.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const [candidatos, setCandidatos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!municipio) {
      setError("Municipio no especificado.");
      return;
    }

    const partidoIdMap = {
      liberal: 1,
      libre: 2,
      nacional: 3,
    };

    const nombreToId = {
      "alfredo_pineda_liberal": 31,
      "jose_rivera_libre": 32,
      "mario_palencia_nacional": 33,
      "carlos_canales_libre": 34,
      "luis_suazo_nacional": 35,
      "rubdel_barahona_libre": 36,
      "abelardo_flores_liberal": 37,
      "david_bueso_libre": 38,
      "maximiliano_rodriguez_nacional": 39,
      "abel_solorzano_nacional": 40,
      "cristian_martinez_libre": 41,
      "deybin_suazo_liberal": 42,
      "alex_zavala_liberal": 43,
      "jose_suazo_nacional": 44,
      "samuel_cubas_libre": 45,
      "carlos_chavez_libre": 46,
      "efrain_villeda_liberal": 47,
      "napoleon_amaya_nacional": 48,
      "eber_rodriguez_nacional": 49,
      "manuel_urbina_liberal": 50,
      "rafael_romero_libre": 51,
      "francisco_mendez_libre": 52,
      "jose_reyes_liberal": 53,
      "marvin_suazo_nacional": 54,
      "adan_rivera_nacional": 55,
      "france_nuñez_liberal": 56,
      "isaias_flores_libre": 57,
      "jorge_palma_libre": 58,
      "jose_ramos_nacional": 59,
      "mario_zuniga_liberal": 60,
      "gaspar_ulloa_libre": 61,
      "marvin_romero_liberal": 62,
      "xiomara_ulloa_nacional": 63,
      "jesus_martinez_liberal": 64,
      "olbin_bonilla_libre": 65,
      "wilmer_mendoza_nacional": 66,
      "jose_mancia_libre": 67,
      "melkin_muñoz_nacional": 68,
      "romualdo_hernandez_liberal": 69,
      "aldy_berrio_liberal": 70,
      "marco_corrales_nacional": 71,
      "renan_rodriguez_libre": 72,
      "eduin_bulnes_libre": 73,
      "leny_flores_liberal": 74,
      "sergio_guillen_nacional": 75,
      "carlos_reyes_liberal": 76,
      "jorge_valeriano_nacional": 77,
      "pablo_bonilla_libre": 78,
      "fabricio_velasquez_nacional": 79,
      "jose_escobar_libre": 80,
      "ramon_fuentes_liberal": 81,
    };

    const candidatosMunicipio = [];

    for (const path in imagenes) {
      if (path.toLowerCase().includes(`/alcaldesxmunicipio/${municipio.toLowerCase()}/`)) {
        const nombreArchivo = path.split("/").pop(); // ej: 'luis_suazo_nacional.jpg'
        const key = nombreArchivo.replace(/\.(jpg|jpeg|png)$/, "").toLowerCase();
        const partido = key.includes("liberal")
          ? "Partido Liberal"
          : key.includes("libre")
          ? "Partido Libre"
          : "Partido Nacional";

        const nombreBonito = key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        const idReal = nombreToId[key];

        if (idReal) {
          candidatosMunicipio.push({
            id: idReal,
            nombre_completo: nombreBonito,
            partido,
            foto_url: imagenes[path].default,
          });
        }
      }
    }

    setCandidatos(candidatosMunicipio);
  }, [municipio]);

  const handleVotar = async () => {
    if (!seleccionado) {
      setError("Debe seleccionar un candidato.");
      return;
    }

    try {
      const res = await fetch("/api/emitir_voto.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dni: usuario.dni,
          tipo: "Alcalde",
          candidato_id: seleccionado,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al registrar el voto.");

      navigate("/confirmacion", {
        state: { usuario: { ...usuario, ha_votado_alcalde: true } },
      });
    } catch (err) {
      setError(err.message || "Error al registrar el voto.");
    }
  };

  return (
    <div className="presidente-container">
      <div className="presidente-box">
        <h1 className="titulo-principal">Elección de Alcalde</h1>
        <p className="subtitulo">Seleccione el candidato de su preferencia para emitir su voto.</p>

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

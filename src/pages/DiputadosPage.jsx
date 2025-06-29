import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./DiputadosPage.css";

// Fotos importadas igual que en PresidentePage.jsx
import AlbertoCruz from "../assets/liberal/AlbertoCruz.jpg";
import HelmaEspinoza from "../assets/liberal/HelmaEspinoza.jpg";
import IrisRamirez from "../assets/liberal/IrisRamirez.jpg";
import JohnAlvarado from "../assets/liberal/JohnAlvarado.jpg";
import KelynOrdonez from "../assets/liberal/KelynOrdoñez.jpg";
import SalomonOsorio from "../assets/liberal/SalomonOsorio.jpg";
import YahveSabillon from "../assets/liberal/YavheSabillon.jpg";

import ElmerGarcia from "../assets/libre/ElmerGarcia.jpg";
import ElmerMatute from "../assets/libre/ElmerMatute.jpg";
import IngridCoello from "../assets/libre/IngridCoello.jpg";
import KarenCastillo from "../assets/libre/KarenCastillo.jpg";
import LindberghZavala from "../assets/libre/LindberghZavala.jpg";
import MarlonVialovo from "../assets/libre/MarlonVialovo.jpg";
import SeniaDiscua from "../assets/libre/SeniaDiscua.jpg";

import ErnestoRodriguez from "../assets/nacional/ErnestoRodriguez.jpg";
import KeydiUrbina from "../assets/nacional/KeydiUrbina.jpg";
import MarcosUmanzor from "../assets/nacional/MarcosUmanzor.jpg";
import MaryBonilla from "../assets/nacional/MaryBonilla.jpg";
import MauroSantos from "../assets/nacional/MauroSantos.jpg";
import MayteePetit from "../assets/nacional/MayteePetit.jpg";
import ReneSuazo from "../assets/nacional/ReneSuazo.jpg";

function DiputadosPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const usuario = state?.usuario;

  const [candidatos, setCandidatos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setCandidatos([
      { id: 10, nombre_completo: "Alberto Cruz", partido: "Partido Liberal", foto_url: AlbertoCruz },
      { id: 11, nombre_completo: "Helma Espinoza", partido: "Partido Liberal", foto_url: HelmaEspinoza },
      { id: 12, nombre_completo: "Iris Ramírez", partido: "Partido Liberal", foto_url: IrisRamirez },
      { id: 13, nombre_completo: "John Alvarado", partido: "Partido Liberal", foto_url: JohnAlvarado },
      { id: 14, nombre_completo: "Kelyn Ordóñez", partido: "Partido Liberal", foto_url: KelynOrdonez },
      { id: 15, nombre_completo: "Salomón Osorio", partido: "Partido Liberal", foto_url: SalomonOsorio },
      { id: 16, nombre_completo: "Yavhe Sabillón", partido: "Partido Liberal", foto_url: YahveSabillon },

      { id: 17, nombre_completo: "Elmer García", partido: "Partido Libre", foto_url: ElmerGarcia },
      { id: 18, nombre_completo: "Elmer Matute", partido: "Partido Libre", foto_url: ElmerMatute },
      { id: 19, nombre_completo: "Ingrid Coello", partido: "Partido Libre", foto_url: IngridCoello },
      { id: 20, nombre_completo: "Karen Castillo", partido: "Partido Libre", foto_url: KarenCastillo },
      { id: 21, nombre_completo: "Lindbergh Zavala", partido: "Partido Libre", foto_url: LindberghZavala },
      { id: 22, nombre_completo: "Marlon Vialovo", partido: "Partido Libre", foto_url: MarlonVialovo },
      { id: 23, nombre_completo: "Senia Discua", partido: "Partido Libre", foto_url: SeniaDiscua },

      { id: 24, nombre_completo: "Ernesto Rodríguez", partido: "Partido Nacional", foto_url: ErnestoRodriguez },
      { id: 25, nombre_completo: "Keydi Urbina", partido: "Partido Nacional", foto_url: KeydiUrbina },
      { id: 26, nombre_completo: "Marcos Umanzor", partido: "Partido Nacional", foto_url: MarcosUmanzor },
      { id: 27, nombre_completo: "Mary Bonilla", partido: "Partido Nacional", foto_url: MaryBonilla },
      { id: 28, nombre_completo: "Mauro Santos", partido: "Partido Nacional", foto_url: MauroSantos },
      { id: 29, nombre_completo: "Maytee Petit", partido: "Partido Nacional", foto_url: MayteePetit },
      { id: 30, nombre_completo: "René Suazo", partido: "Partido Nacional", foto_url: ReneSuazo },
    ]);
  }, []);

  const toggleSeleccion = (id) => {
    if (seleccionados.includes(id)) {
      setSeleccionados(seleccionados.filter((x) => x !== id));
    } else {
      if (seleccionados.length >= 7) {
        setError("Solo puede seleccionar hasta 7 diputados.");
        return;
      }
      setSeleccionados([...seleccionados, id]);
      setError("");
    }
  };

  const handleVotar = async () => {
    if (seleccionados.length < 1 || seleccionados.length > 7) {
      setError("Debe seleccionar entre 1 y 7 diputados.");
      return;
    }

    try {
      const res = await fetch("/api/emitir_voto.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dni: usuario.dni,
          tipo: "Diputado",
          candidatos_ids: seleccionados,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al registrar el voto.");
      }

      navigate("/elegir-municipios", {
        state: { usuario: { ...usuario, ha_votado_diputados: true } },
      });
    } catch (err) {
      setError(err.message || "Error al registrar el voto.");
    }
  };

  return (
    <div className="presidente-container">
      <div className="presidente-box">
        <h1 className="titulo-principal">Elección de Diputados</h1>
        <p className="subtitulo">
          Por favor seleccione entre 1 y 7 candidatos para emitir su voto.
        </p>

        {error && <p className="error">{error}</p>}

        <div className="candidato-grid" style={{ flexWrap: "wrap", maxHeight: "400px", overflowY: "auto" }}>
          {candidatos.map((candidato) => (
            <div
              key={candidato.id}
              className={`candidato-card ${seleccionados.includes(candidato.id) ? "activo" : ""}`}
              onClick={() => toggleSeleccion(candidato.id)}
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

export default DiputadosPage;

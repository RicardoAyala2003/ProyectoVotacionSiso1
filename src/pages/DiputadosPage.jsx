import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./DiputadosPage.css";

// Importaciones
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
      { id: "liberal-1", nombre_completo: "Alberto Cruz", partido: "Partido Liberal", foto_url: AlbertoCruz },
      { id: "liberal-2", nombre_completo: "Helma Espinoza", partido: "Partido Liberal", foto_url: HelmaEspinoza },
      { id: "liberal-3", nombre_completo: "Iris Ramírez", partido: "Partido Liberal", foto_url: IrisRamirez },
      { id: "liberal-4", nombre_completo: "John Alvarado", partido: "Partido Liberal", foto_url: JohnAlvarado },
      { id: "liberal-5", nombre_completo: "Kelyn Ordóñez", partido: "Partido Liberal", foto_url: KelynOrdonez },
      { id: "liberal-6", nombre_completo: "Salomón Osorio", partido: "Partido Liberal", foto_url: SalomonOsorio },
      { id: "liberal-7", nombre_completo: "Yavhe Sabillón", partido: "Partido Liberal", foto_url: YahveSabillon },
      { id: "libre-1", nombre_completo: "Elmer García", partido: "Partido Libre", foto_url: ElmerGarcia },
      { id: "libre-2", nombre_completo: "Elmer Matute", partido: "Partido Libre", foto_url: ElmerMatute },
      { id: "libre-3", nombre_completo: "Ingrid Coello", partido: "Partido Libre", foto_url: IngridCoello },
      { id: "libre-4", nombre_completo: "Karen Castillo", partido: "Partido Libre", foto_url: KarenCastillo },
      { id: "libre-5", nombre_completo: "Lindbergh Zavala", partido: "Partido Libre", foto_url: LindberghZavala },
      { id: "libre-6", nombre_completo: "Marlon Vialovo", partido: "Partido Libre", foto_url: MarlonVialovo },
      { id: "libre-7", nombre_completo: "Senia Discua", partido: "Partido Libre", foto_url: SeniaDiscua },
      { id: "nacional-1", nombre_completo: "Ernesto Rodríguez", partido: "Partido Nacional", foto_url: ErnestoRodriguez },
      { id: "nacional-2", nombre_completo: "Keydi Urbina", partido: "Partido Nacional", foto_url: KeydiUrbina },
      { id: "nacional-3", nombre_completo: "Marcos Umanzor", partido: "Partido Nacional", foto_url: MarcosUmanzor },
      { id: "nacional-4", nombre_completo: "Mary Bonilla", partido: "Partido Nacional", foto_url: MaryBonilla },
      { id: "nacional-5", nombre_completo: "Mauro Santos", partido: "Partido Nacional", foto_url: MauroSantos },
      { id: "nacional-6", nombre_completo: "Maytee Petit", partido: "Partido Nacional", foto_url: MayteePetit },
      { id: "nacional-7", nombre_completo: "René Suazo", partido: "Partido Nacional", foto_url: ReneSuazo },
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
    }
    setError(""); // Limpiar error
  };

  const handleVotar = async () => {
    if (seleccionados.length < 1 || seleccionados.length > 7) {
      setError("Debe seleccionar entre 1 y 7 diputados.");
      return;
    }

    try {
      const res = await fetch("http://localhost/api/votos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: usuario.id,
          candidatos_ids: seleccionados,
          tipo: "Diputado",
        }),
      });

      if (!res.ok) throw new Error("Error al registrar el voto.");
      navigate("/alcalde", { state: { usuario: { ...usuario, ha_votado_diputado: true } } });
    } catch (err) {
      setError("Error al registrar el voto.");
    }
  };

  return (
    <div className="presidente-container">
      <div className="presidente-box">
        <h1 className="titulo-principal">Elección de Diputados</h1>
        <p className="subtitulo">Por favor seleccione entre 1 y 7 candidatos de su preferencia para emitir su voto.</p>

        {error && <p className="error">{error}</p>}

        <div className="candidato-grid" style={{ flexWrap: "wrap", maxHeight: "400px", overflowY: "auto" }}>
          {candidatos.map((candidato) => (
            <div
              key={candidato.id}
              tabIndex={-1}
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

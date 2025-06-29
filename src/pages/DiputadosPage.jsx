import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./DiputadosPage.css";

import ElmerGarcia from "../assets/libre/ElmerGarcia.jpg";
import ElmerMatute from "../assets/libre/ElmerMatute.jpg";
import IngridCoello from "../assets/libre/IngridCoello.jpg";
import KarenCastillo from "../assets/libre/KarenCastillo.jpg";
import LindberghZavala from "../assets/libre/LindberghZavala.jpg";
import MarlonVialovo from "../assets/libre/MarlonVialovo.jpg";
import SeniaDiscua from "../assets/libre/SeniaDiscua.jpg";

import AlbertoCruz from "../assets/liberal/AlbertoCruz.jpg";
import HelmaEspinoza from "../assets/liberal/HelmaEspinoza.jpg";
import IrisRamirez from "../assets/liberal/IrisRamirez.jpg";
import JohnAlvarado from "../assets/liberal/JohnAlvarado.jpg";
import KelynOrdonez from "../assets/liberal/KelynOrdoñez.jpg";
import SalomonOsorio from "../assets/liberal/SalomonOsorio.jpg";
import YavheSabillon from "../assets/liberal/YavheSabillon.jpg";

import ErnestoRodriguez from "../assets/nacional/ErnestoRodriguez.jpg";
import KeydiUrbina from "../assets/nacional/KeydiUrbina.jpg";
import MarcosUmanzor from "../assets/nacional/MarcosUmanzor.jpg";
import MaryBonilla from "../assets/nacional/MaryBonilla.jpg";
import MauroSantos from "../assets/nacional/MauroSantos.jpg";
import MayteePetit from "../assets/nacional/MayteePetit.jpg";
import ReneSuazo from "../assets/nacional/ReneSuazo.jpg";

const todosDiputados = [
  { nombre: "Elmer Garcia", partido: "Libre", foto: ElmerGarcia },
  { nombre: "Elmer Matute", partido: "Libre", foto: ElmerMatute },
  { nombre: "Ingrid Coello", partido: "Libre", foto: IngridCoello },
  { nombre: "Karen Castillo", partido: "Libre", foto: KarenCastillo },
  { nombre: "Lindbergh Zavala", partido: "Libre", foto: LindberghZavala },
  { nombre: "Marlon Vialovo", partido: "Libre", foto: MarlonVialovo },
  { nombre: "Senia Discua", partido: "Libre", foto: SeniaDiscua },
  { nombre: "Alberto Cruz", partido: "Liberal", foto: AlbertoCruz },
  { nombre: "Helma Espinoza", partido: "Liberal", foto: HelmaEspinoza },
  { nombre: "Iris Ramirez", partido: "Liberal", foto: IrisRamirez },
  { nombre: "John Alvarado", partido: "Liberal", foto: JohnAlvarado },
  { nombre: "Kelyn Ordoñez", partido: "Liberal", foto: KelynOrdonez },
  { nombre: "Salomon Osorio", partido: "Liberal", foto: SalomonOsorio },
  { nombre: "Yavhe Sabillon", partido: "Liberal", foto: YavheSabillon },
  { nombre: "Ernesto Rodriguez", partido: "Nacional", foto: ErnestoRodriguez },
  { nombre: "Keydi Urbina", partido: "Nacional", foto: KeydiUrbina },
  { nombre: "Marcos Umanzor", partido: "Nacional", foto: MarcosUmanzor },
  { nombre: "Mary Bonilla", partido: "Nacional", foto: MaryBonilla },
  { nombre: "Mauro Santos", partido: "Nacional", foto: MauroSantos },
  { nombre: "Maytee Petit", partido: "Nacional", foto: MayteePetit },
  { nombre: "Rene Suazo", partido: "Nacional", foto: ReneSuazo },
];

function DiputadosPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const usuario = state?.usuario;

  const [candidatos, setCandidatos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [error, setError] = useState("");

  useState(() => {
    setCandidatos(todosDiputados.map((diputado, index) => ({
      id: index + 1,
      nombre_completo: diputado.nombre,
      partido: diputado.partido,
      foto_url: diputado.foto
    })));
  }, []);

  const handleVotar = async () => {
    if (!seleccionado) {
      setError("Debe seleccionar un diputado.");
      return;
    }

    try {
      const res = await fetch("http://localhost/api/votos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: usuario.id,
          candidato_id: seleccionado,
          tipo: "Diputado",
        }),
      });

      if (!res.ok) throw new Error("Error al registrar el voto.");

      navigate("/confirmacion", { state: { usuario: { ...usuario, ha_votado_diputado: true } } });
    } catch (err) {
      setError("Error al registrar el voto.");
    }
  };

  return (
    <div className="presidente-container">
      <div className="presidente-box">
        <h1>Elección de Diputados</h1>
        <p className="subtitulo">Por favor seleccione el diputado de su preferencia para emitir su voto.</p>

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

export default DiputadosPage;
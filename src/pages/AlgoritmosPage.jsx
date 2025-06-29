import React, { useState, useEffect } from "react";
import { algoritmos } from "./algoritmos";
import "./AlgoritmosPage.css";

function AlgoritmosPage() {
  const [mostrar, setMostrar] = useState(null);
  const [mostrarBotonArriba, setMostrarBotonArriba] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setMostrarBotonArriba(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMostrarCodigo = (index) => {
    setMostrar(mostrar === index ? null : index);
    const element = document.getElementById(`alg-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="algoritmos-container">
      <h1 className="algoritmos-title">Algoritmos de Sincronización y Concurrencia</h1>
      <p className="algoritmos-subtitle">
        Selecciona un algoritmo para ver su código en C++ y ejecutarlo como simulación.
      </p>

      {algoritmos.map((alg, i) => (
        <div 
            key={i} 
            className="algoritmo-card" 
            id={`alg-${i}`}
            style={i === 0 ? { marginTop: "800px" } : {}}
            >
          <h2>{alg.titulo}</h2>
          <p>{alg.descripcion}</p>

          <button onClick={() => handleMostrarCodigo(i)} className="mostrar-codigo-btn">
            {mostrar === i ? "Ocultar Código" : "Ver Código"}
          </button>
          <button onClick={alg.ejecutar} className="ejecutar-btn">
            Ejecutar
          </button>

          {mostrar === i && (
            <pre className="codigo-box">
              <code>{alg.codigo}</code>
            </pre>
          )}
        </div>
      ))}

      {mostrarBotonArriba && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#0d2b52",
            color: "white",
            border: "none",
            padding: "12px 18px",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            zIndex: 1000
          }}
        >
          ↑ Volver arriba
        </button>
      )}
    </div>
  );
}

export default AlgoritmosPage;

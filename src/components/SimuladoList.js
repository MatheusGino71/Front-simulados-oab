import React from 'react';
import { Link } from 'react-router-dom';
import './SimuladoList.css';

const SimuladoList = ({ simulados }) => {
  return (
    <div className="simulados-grid">
      {simulados.map((simulado) => (
        <div key={simulado.id} className="simulado-card">
          <h3>{simulado.nome}</h3>
          <p>{simulado.descricao}</p>
          <p>Questões: {simulado.total_questoes}</p>
          <Link to={`/simulado/${simulado.id}`} className="start-button">
            Iniciar Simulado
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SimuladoList;
import React from 'react';
import { useLocation } from 'react-router-dom';
import Resultado from '../components/Resultado';

const ResultadoPage = () => {
  const location = useLocation();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="no-result">
        <h2>Nenhum resultado encontrado</h2>
        <a href="/" className="button">Voltar para a lista de simulados</a>
      </div>
    );
  }

  return <Resultado result={result} />;
};

export default ResultadoPage;
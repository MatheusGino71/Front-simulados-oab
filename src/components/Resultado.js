import React from 'react';

function Resultado({ resultado, onBack }) {
  return (
    <div className="resultado-container">
      <div className="resultado-header">
        <h2>Resultado do Simulado</h2>
        <button onClick={onBack} className="back-button">Voltar</button>
      </div>
      
      <div className="resumo">
        <div className="resumo-item correct">
          <h3>Acertos</h3>
          <p>{resultado.acertos}</p>
        </div>
        <div className="resumo-item wrong">
          <h3>Erros</h3>
          <p>{resultado.erros.length}</p>
        </div>
        <div className="resumo-item percentage">
          <h3>Percentual</h3>
          <p>{Math.round((resultado.acertos / (resultado.acertos + resultado.erros.length)) * 100)}%</p>
        </div>
      </div>
      
      <div className="diagnostico">
        <h3>Análise do Simulado</h3>
        <p>{resultado.analiseSimulado}</p>
        
        <h3>Diagnóstico e Plano de Estudos</h3>
        <p>{resultado.diagnostico}</p>
      </div>
      
      {resultado.erros.length > 0 && (
        <div className="questoes-erradas">
          <h3>Questões Erradas</h3>
          <ul>
            {resultado.erros.map((erro, index) => (
              <li key={index}>
                <p><strong>Questão {erro.questao_id}:</strong></p>
                <p>Sua resposta: <span className="wrong-answer">{erro.resposta_usuario}</span></p>
                <p>Resposta correta: <span className="correct-answer">{erro.resposta_correta}</span></p>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <button onClick={onBack} className="back-button">Voltar para Simulados</button>
    </div>
  );
}

export default Resultado;
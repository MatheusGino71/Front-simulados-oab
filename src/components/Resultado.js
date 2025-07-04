import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Resultado() {
  const location = useLocation();
  const navigate = useNavigate();
  const resultado = location.state?.resultado;


  // Corrige possíveis undefined/null para evitar erro de leitura de length
  // Limpa o enunciado das questões erradas, removendo HTML e blocos de código
  const limparEnunciado = (enunciado) => {
    if (!enunciado) return '';
    return enunciado
      .replace(/<[^>]*>/g, '') // Remove tags HTML
      .replace(/\s*Código[s]?:?(.|\n)*$/gi, '') // Remove "Código:" e tudo após
      .trim();
  };

  const erros = Array.isArray(resultado?.erros)
    ? resultado.erros.map(e => ({ ...e, enunciado: limparEnunciado(e.enunciado) }))
    : [];
  const acertos = typeof resultado?.acertos === 'number' ? resultado.acertos : 0;
  const total = typeof resultado?.total === 'number' ? resultado.total : 0;
  const diagnostico = resultado?.diagnostico || '';

  if (!resultado) return <p>Nenhum resultado encontrado.</p>;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: 32 }}>
      <h2>Resultado</h2>
      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        <div style={{ background: '#eafaf1', borderRadius: 6, padding: 16, flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 22, color: '#27ae60', fontWeight: 700 }}>{acertos}</div>
          <div>Acertos</div>
        </div>
        <div style={{ background: '#faeaea', borderRadius: 6, padding: 16, flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 22, color: '#c0392b', fontWeight: 700 }}>{erros.length}</div>
          <div>Erros</div>
        </div>
        <div style={{ background: '#f7f7f7', borderRadius: 6, padding: 16, flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 22, color: '#2c3e50', fontWeight: 700 }}>{total > 0 ? Math.round((acertos / total) * 100) : 0}%</div>
          <div>Percentual</div>
        </div>
      </div>
      <h3>Diagnóstico</h3>
      <div style={{ whiteSpace: 'pre-line', background: '#f7f7f7', borderRadius: 6, padding: 16, marginBottom: 24 }}>{diagnostico}</div>
      <h3>Questões Erradas</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {erros.map((erro, idx) => (
          <li key={idx} style={{ background: '#faeaea', borderRadius: 6, marginBottom: 10, padding: 12, color: '#c0392b' }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Questão {erro.questao_id}: {erro.enunciado}</div>
            Sua resposta: <span style={{ color: '#c0392b' }}>{erro.respostaAluno}</span> | Correta: <span style={{ color: '#27ae60' }}>{erro.respostaCerta}</span>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/')} style={{ background: '#2c3e50', color: '#fff', border: 'none', borderRadius: 4, padding: '12px 28px', fontSize: 18, cursor: 'pointer', marginTop: 16 }}>Voltar para Simulados</button>
    </div>
  );
}

export default Resultado;
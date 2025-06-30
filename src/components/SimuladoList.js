import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SimuladoList() {
  const [simulados, setSimulados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/simulados')
      .then(res => res.json())
      .then(data => {
        setSimulados(data.simulados || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Erro ao buscar simulados.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Carregando simulados...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>Escolha um Simulado</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
        {simulados.map(nome => (
          <div key={nome} style={{ background: '#f9f9f9', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: 24, minWidth: 220, textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{nome.replace('.json', '')}</div>
            <button style={{ background: '#2c3e50', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer', fontSize: 16 }}
              onClick={() => navigate(`/simulado/${encodeURIComponent(nome)}`)}>
              Iniciar Simulado
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SimuladoList;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function SimuladoForm() {
  const { nome } = useParams();
  const [questoes, setQuestoes] = useState([]);
  const [respostas, setRespostas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/simulados/${nome}`)
      .then(res => res.json())
      .then(data => {
        setQuestoes(data.questoes || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Erro ao carregar questões.');
        setLoading(false);
      });
  }, [nome]);

  const handleChange = (questao_id, letra) => {
    setRespostas({ ...respostas, [questao_id]: letra });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const respostasArray = Object.entries(respostas).map(([questao_id, resposta_usuario]) => ({
      questao_id: Number(questao_id),
      resposta_usuario
    }));
    fetch('http://localhost:3000/corrigir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(respostasArray)
    })
      .then(res => res.json())
      .then(data => {
        navigate('/resultado', { state: { resultado: data } });
      });
  };

  if (loading) return <p>Carregando questões...</p>;
  if (error) return <p>{error}</p>;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 700, margin: '0 auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: 32 }}>
      <h2>{nome.replace('.json', '')}</h2>
      <div style={{ marginBottom: 24 }}>
        <div style={{ height: 8, background: '#eee', borderRadius: 4, marginBottom: 16 }}>
          <div style={{ width: `${(Object.keys(respostas).length / questoes.length) * 100}%`, height: 8, background: '#1abc9c', borderRadius: 4, transition: 'width 0.3s' }} />
        </div>
        <span>Respondidas: {Object.keys(respostas).length} / {questoes.length}</span>
      </div>
      {questoes.map((q, idx) => (
        <div key={q.questao_id} style={{ marginBottom: 28, padding: 16, background: '#f7f7f7', borderRadius: 6 }}>
          <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Questão {idx + 1}</div>
          <div dangerouslySetInnerHTML={{ __html: q.questao }} style={{ marginBottom: 10 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {q.alternativas.map(a => (
              <label key={a.letra} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', borderRadius: 4, border: '1px solid #ddd', padding: 6, cursor: 'pointer' }}>
                <input
                  type="radio"
                  name={`questao_${q.questao_id}`}
                  value={a.letra}
                  checked={respostas[q.questao_id] === a.letra}
                  onChange={() => handleChange(q.questao_id, a.letra)}
                  required
                />
                <span style={{ fontWeight: 500 }}>{a.letra})</span> {a.texto}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button type="submit" style={{ background: '#2c3e50', color: '#fff', border: 'none', borderRadius: 4, padding: '12px 28px', fontSize: 18, cursor: 'pointer', marginTop: 16 }}>Enviar Respostas</button>
    </form>
  );
}

export default SimuladoForm;

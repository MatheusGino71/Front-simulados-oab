import React, { useEffect, useState } from 'react';
import styles from './SimuladoForm.module.css';
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


  if (loading) return (
    <div className={styles.simuladoContainer} style={{ textAlign: 'center' }}>
      <span style={{ fontSize: 22, color: '#ff6b6b', fontWeight: 600 }}>Carregando questões...</span>
    </div>
  );
  if (error) return (
    <div className={styles.simuladoContainer} style={{ textAlign: 'center' }}>
      <span style={{ fontSize: 22, color: '#ff6b6b', fontWeight: 600 }}>{error}</span>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className={styles.simuladoContainer}>
      <div className={styles.titulo}>{nome.replace('.json', '')}</div>
      <div style={{ marginBottom: 24 }}>
        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: `${(Object.keys(respostas).length / questoes.length) * 100}%` }} />
        </div>
        <span style={{ color: '#2d3a4b', fontWeight: 500 }}>Respondidas: {Object.keys(respostas).length} / {questoes.length}</span>
      </div>
      {questoes.map((q, idx) => (
        <div key={q.questao_id} className={styles.questaoBox}>
          <div className={styles.questaoTitulo}>Questão {idx + 1}</div>
          <div className={styles.questaoEnunciado} dangerouslySetInnerHTML={{ __html: q.questao }} />
          <div className={styles.alternativas}>
            {q.alternativas.map(a => (
              <label
                key={a.letra}
                className={
                  styles.alternativaLabel +
                  (respostas[q.questao_id] === a.letra ? ' ' + styles.selected : '')
                }
              >
                <input
                  type="radio"
                  name={`questao_${q.questao_id}`}
                  value={a.letra}
                  checked={respostas[q.questao_id] === a.letra}
                  onChange={() => handleChange(q.questao_id, a.letra)}
                  required
                  style={{ accentColor: '#ff6b6b' }}
                />
                <span>{a.letra})</span> {a.texto}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button type="submit" className={styles.enviarBtn}>Enviar Respostas</button>
    </form>
  );
}

export default SimuladoForm;

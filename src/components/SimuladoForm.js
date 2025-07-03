import React, { useEffect, useState } from 'react';
import styles from './SimuladoForm.module.css';
import { useParams, useNavigate } from 'react-router-dom';

function SimuladoForm() {
  const { nome } = useParams();
  const [questoes, setQuestoes] = useState([]);
  const [respostas, setRespostas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagina, setPagina] = useState(1);
  const porPagina = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/simulados/${nome}`)
      .then(res => res.json())
      .then(data => {
        // Remove todas as tags <p> e </p> das questões ao carregar
        const questoesLimpa = (data.questoes || []).map(q => ({
          ...q,
          questao: q.questao.replace(/<\/?p>/g, '')
        }));
        setQuestoes(questoesLimpa);
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

  // Paginação
  const totalPaginas = Math.ceil(questoes.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const fim = pagina === totalPaginas ? questoes.length : inicio + porPagina;
  const questoesPagina = questoes.slice(inicio, fim);

  return (
    <form onSubmit={handleSubmit} className={styles.simuladoContainer}>
      <div className={styles.titulo}>{nome.replace('.json', '')}</div>
      <div style={{ marginBottom: 24 }}>
        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: `${(Object.keys(respostas).length / questoes.length) * 100}%` }} />
        </div>
        <span style={{ color: '#2d3a4b', fontWeight: 500 }}>Respondidas: {Object.keys(respostas).length} / {questoes.length}</span>
      </div>
      {questoesPagina.map((q, idx) => (
        <div key={q.questao_id} className={styles.questaoBox}>
          <div className={styles.questaoTitulo}>Questão {inicio + idx + 1}</div>
          <span className={styles.questaoEnunciado} style={{display: 'block', marginBottom: 14, fontWeight: 500}}>{q.questao}</span>
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
                <span style={{fontWeight:600}}>{a.letra})</span> <span>{a.texto}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className={styles.paginacao}>
        <button type="button" className={styles.enviarBtn} onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}>
          ⬅ Anterior
        </button>
        <span className={styles.paginaAtual}>
          Página {pagina} de {totalPaginas}
        </span>
        {pagina < totalPaginas ? (
          <button type="button" className={styles.enviarBtn} onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}>
            Próxima ➡
          </button>
        ) : (
          <button type="submit" className={styles.enviarBtn}>Enviar Respostas</button>
        )}
      </div>
    </form>
  );
}

export default SimuladoForm;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSimuladoById, getQuestoesBySimuladoId, postRespostas } from '../services/api';
import SimuladoForm from '../components/SimuladoForm';
import Loading from '../components/Loading';

const Simulado = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [simulado, setSimulado] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSimuladoData = async () => {
      try {
        const [simuladoResponse, questionsResponse] = await Promise.all([
          getSimuladoById(id),
          getQuestoesBySimuladoId(id)
        ]);
        
        setSimulado(simuladoResponse.data);
        setQuestions(questionsResponse.data.questoes);
      } catch (err) {
        setError('Erro ao carregar o simulado. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimuladoData();
  }, [id]);

  const handleSubmit = async (respostas) => {
    try {
      setLoading(true);
      const response = await postRespostas(id, respostas);
      navigate('/resultado', { state: { result: response.data } });
    } catch (err) {
      setError('Erro ao enviar respostas. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="error-message">{error}</div>;
  if (!simulado || questions.length === 0) return <div>Simulado não encontrado</div>;

  return (
    <div className="simulado-page">
      <h2>{simulado.nome}</h2>
      <SimuladoForm questions={questions} onSubmit={handleSubmit} />
    </div>
  );
};

export default Simulado;
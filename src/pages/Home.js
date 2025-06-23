import React, { useState, useEffect } from 'react';
import { getSimulados } from '../services/api';
import SimuladoList from '../components/SimuladoList';
import Loading from '../components/Loading';

const Home = () => {
  const [simulados, setSimulados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSimulados = async () => {
      try {
        const response = await getSimulados();
        setSimulados(response.data.simulados);
      } catch (err) {
        setError('Erro ao carregar simulados. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimulados();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="home-container">
      <h2>Simulados Disponíveis</h2>
      <SimuladoList simulados={simulados} />
    </div>
  );
};

export default Home;

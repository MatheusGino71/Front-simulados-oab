import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // Altere para a porta do seu backend
});

export const getSimulados = () => api.get('/simulados');
export const getSimuladoById = (id) => api.get(`/simulados/${id}`);
export const getQuestoesBySimuladoId = (id) => api.get(`/simulados/${id}/questoes`);
export const postRespostas = (simuladoId, respostas) => 
  api.post('/corrigir', { simulado_id: simuladoId, respostas });

export default api;
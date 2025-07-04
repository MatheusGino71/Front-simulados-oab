import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SimuladoList from './components/SimuladoList';
import TelaInicial from './components/TelaInicial';
import SimuladoForm from './components/SimuladoForm';
import Resultado from './components/Resultado';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<TelaInicial />} />
        <Route path="/escolher" element={<SimuladoList />} />
        <Route path="/simulado/:nome" element={<SimuladoForm />} />
        <Route path="/resultado" element={<Resultado />} />
        <Route path="*" element={<div style={{padding: 40, textAlign: 'center', fontSize: 22}}>Página não encontrada</div>} />
      </Routes>
    </div>
  );
}

export default App;




import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SimuladoList from './components/SimuladoList';
import SimuladoForm from './components/SimuladoForm';
import Resultado from './components/Resultado';

function App() {
  return (
    <div className="App">
      <h1>Simulados OAB</h1>
      <Routes>
        <Route path="/" element={<SimuladoList />} />
        <Route path="/simulado/:nome" element={<SimuladoForm />} />
        <Route path="/resultado" element={<Resultado />} />
        <Route path="*" element={<div style={{padding: 40, textAlign: 'center', fontSize: 22}}>Página não encontrada</div>} />
      </Routes>
    </div>
  );
}

export default App;




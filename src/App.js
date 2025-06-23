import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Simulado from './pages/Simulado';
import Resultado from './pages/Resultado';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulado/:id" element={<Simulado />} />
          <Route path="/resultado" element={<Resultado />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
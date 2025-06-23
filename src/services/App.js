import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Simulado from './pages/Simulado';
import ResultadoPage from './pages/Resultado';
import './App.css';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="header">
          <a href="/">
            <h1>Simulados OAB</h1>
          </a>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simulado/:id" element={<Simulado />} />
            <Route path="/resultado" element={<ResultadoPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

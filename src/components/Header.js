import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; 

const Header = () => {
  return (
    <header className="header simulado-header-animado">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h1 className="simulado-titulo-animado">
          <span className="simulado-titulo-gradient">Simulados</span>
          <span className="simulado-titulo-oab"> OAB</span>
        </h1>
      </Link>
    </header>
  );
};

export default Header;
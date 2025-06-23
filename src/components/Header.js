import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; 

const Header = () => {
  return (
    <header className="header">
      <Link to="/">
        <h1>Simulados OAB</h1>
      </Link>
    </header>
  );
};

export default Header;
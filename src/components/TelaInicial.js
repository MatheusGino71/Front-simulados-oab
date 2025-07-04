import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TelaInicial.module.css';

function TelaInicial() {
  const navigate = useNavigate();
  return (
    <div className={styles.telaInicialBg}>
      <div className={styles.tituloGameIcon} role="img" aria-label="game controller">🎮</div>
      <div className={styles.tituloGame}>
        <span>SIMULADO</span> <span style={{color:'#fff'}}>OAB</span>
      </div>
      <button className={styles.botaoStart} onClick={() => navigate('/escolher')}>
        Iniciar Jogo
      </button>
      <div className={styles.credito}>
        Inspirado em plataformas de jogos e aprendizado moderno
      </div>
    </div>
  );
}

export default TelaInicial;

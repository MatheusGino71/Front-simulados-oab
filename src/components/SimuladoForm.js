import React, { useState, useEffect } from 'react';
import './SimuladoForm.css';

const SimuladoForm = ({ questions, onSubmit }) => {
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Exemplo de uso do useEffect (se necessário)
  useEffect(() => {
    // Inicializa todas as respostas como vazias
    const initialAnswers = {};
    questions.forEach(q => {
      initialAnswers[q.numero] = '';
    });
    setAnswers(initialAnswers);
  }, [questions]); // Executa quando as questions mudam

  const handleOptionChange = (questionNumber, option) => {
    setAnswers({
      ...answers,
      [questionNumber]: option
    });
  };

  const handleNext = () => {
    setCurrentQuestion(prev => Math.min(prev + 1, questions.length - 1));
  };

  const handlePrevious = () => {
    setCurrentQuestion(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    const formattedAnswers = Object.keys(answers)
      .filter(key => answers[key] !== '') // Filtra apenas questões respondidas
      .map(key => ({
        questao_id: parseInt(key),
        resposta_usuario: answers[key]
      }));
    
    onSubmit(formattedAnswers);
  };

  const progress = questions.length > 0 
    ? ((currentQuestion + 1) / questions.length) * 100 
    : 0;

  return (
    <div className="simulado-form">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        <span>{currentQuestion + 1} de {questions.length}</span>
      </div>

      <div className="question-card">
        <h3>Questão {questions[currentQuestion]?.numero}</h3>
        <p>{questions[currentQuestion]?.enunciado}</p>
        <div className="options">
          {['a', 'b', 'c', 'd'].map((option) => (
            <div key={option} className="option">
              <input
                type="radio"
                id={`q${questions[currentQuestion]?.numero}-${option}`}
                name={`q${questions[currentQuestion]?.numero}`}
                value={option}
                checked={answers[questions[currentQuestion]?.numero] === option}
                onChange={() => handleOptionChange(questions[currentQuestion]?.numero, option)}
              />
              <label htmlFor={`q${questions[currentQuestion]?.numero}-${option}`}>
                {option.toUpperCase()}) {questions[currentQuestion]?.[`alternativa_${option}`]}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="navigation-buttons">
        <button 
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Anterior
        </button>
        
        {currentQuestion < questions.length - 1 ? (
          <button onClick={handleNext}>
            Próxima
          </button>
        ) : (
          <button 
            className="submit-button" 
            onClick={handleSubmit}
            disabled={!answers[questions[currentQuestion]?.numero]}
          >
            Enviar Respostas
          </button>
        )}
      </div>
    </div>
  );
};

export default SimuladoForm;
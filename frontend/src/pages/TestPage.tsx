// src/pages/TestPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuestionsForTest, submitTestResults } from '../services/api';
import { type IQuestion, type IUserAnswer } from '../types';
import './TestPage.css';

const TestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<IUserAnswer[]>([]);

  useEffect(() => {
    if (id) {
      const getQuestions = async () => {
        try {
          const data = await fetchQuestionsForTest(id);
          setQuestions(data);
        } catch (err) {
          setError('No se pudieron cargar las preguntas para esta prueba.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      getQuestions();
    }
  }, [id]);

  const handleAnswerSelect = (questionId: number, answer: string) => {
    const newAnswer: IUserAnswer = { question_id: questionId, answer: answer };
    const updatedAnswers = [...userAnswers, newAnswer];
    setUserAnswers(updatedAnswers);

    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    if (isLastQuestion) {
      handleSubmit(updatedAnswers);
    } else {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 300); // Pequeña pausa para mejor UX
    }
  };
  
  const handleSubmit = async (finalAnswers: IUserAnswer[]) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const result = await submitTestResults(id, finalAnswers);
      navigate('/results', { state: { score: result.iq_score } });
    } catch (err) {
      setError('Hubo un error al enviar tus resultados.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="test-container">
        <div className="loading-container">
          <div className="loading-spinner-large"></div>
          <div className="loading-text">Cargando preguntas...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="test-container">
        <div className="error-container">
          <div className="error-text">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="test-container">
        <div className="no-questions">
          <h3>No se encontraron preguntas</h3>
          <p>No hay preguntas disponibles para esta prueba en este momento.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const options = [
    { text: currentQuestion.option1, value: 'option1', letter: 'A' },
    { text: currentQuestion.option2, value: 'option2', letter: 'B' },
    { text: currentQuestion.option3, value: 'option3', letter: 'C' },
    { text: currentQuestion.option4, value: 'option4', letter: 'D' },
  ];

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="test-container">
      {isSubmitting && (
        <div className="submitting-overlay">
          <div className="submitting-content">
            <div className="submitting-spinner"></div>
            <div className="submitting-text">Enviando resultados...</div>
            <div className="submitting-subtext">Por favor espera mientras procesamos tus respuestas</div>
          </div>
        </div>
      )}
      
      <div className="test-wrapper">
        {/* Barra de progreso */}
        <div className="progress-container">
          <div className="progress-header">
            <div className="progress-title">Progreso del Test</div>
            <div className="progress-counter">
              {currentQuestionIndex + 1} de {questions.length}
            </div>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Tarjeta de la pregunta */}
        <div className="question-card" key={currentQuestion.id}>
          <div className="question-number">
            Pregunta {currentQuestionIndex + 1}
          </div>
          <h2 className="question-text">{currentQuestion.text}</h2>
          
          <div className="options-container">
            {options.map((option) => (
              <button
                key={option.value}
                className="option-button"
                onClick={() => handleAnswerSelect(currentQuestion.id, option.value)}
                disabled={isSubmitting}
              >
                <div className="option-letter">{option.letter}</div>
                <div className="option-text">{option.text}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
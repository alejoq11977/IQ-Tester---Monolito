// src/pages/TestPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchQuestionsForTest, submitTestResults } from '../services/api';
import { type IQuestion, type IUserAnswer } from '../types';
import './TestPage.css';

const TestPage: React.FC = () => {
  // Hooks para navegación y parámetros de URL
  const { id: testId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Extrae los datos pasados desde HomePage
  // El '|| {}' es un fallback por si el usuario llega aquí sin estado
  const { attemptId, timeLimit } = location.state || {};

  // Estados para la lógica de la prueba
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<IUserAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit ? timeLimit * 60 : 0);

  // Estados para la UI (carga, errores, envío)
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Efecto para la lógica del temporizador
  useEffect(() => {
    // No hacer nada si se están cargando las preguntas o si ya se están enviando los resultados
    if (loading || isSubmitting) return;

    // Si el tiempo se acaba, auto-enviar las respuestas actuales
    if (timeLeft <= 0) {
      handleSubmit(userAnswers);
      return; // Detiene el intervalo
    }

    // Configura un intervalo que reste 1 al tiempo restante cada segundo
    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    // Función de limpieza: se ejecuta cuando el componente se desmonta para evitar fugas de memoria
    return () => clearInterval(timerId);
  }, [timeLeft, loading, isSubmitting]); // Dependencias del efecto

  // Efecto para cargar las preguntas y verificar el estado inicial
  useEffect(() => {
    // Redirigir al inicio si no hay un ID de intento (acceso inválido)
    if (!attemptId) {
      console.error("No se encontró attemptId, redirigiendo al inicio.");
      navigate('/');
      return;
    }

    if (testId) {
      fetchQuestionsForTest(testId)
        .then(data => setQuestions(data))
        .catch(err => {
          setError('No se pudieron cargar las preguntas.');
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [testId, attemptId, navigate]);

  // Maneja la selección de una respuesta
  const handleAnswerSelect = (questionId: string, answer: string) => {
    const newAnswer: IUserAnswer = { question_id: questionId, answer: answer };
    const updatedAnswers = [...userAnswers, newAnswer];
    setUserAnswers(updatedAnswers);

    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    if (isLastQuestion) {
      handleSubmit(updatedAnswers);
    } else {
      setTimeout(() => setCurrentQuestionIndex(currentQuestionIndex + 1), 300); // Pausa para UX
    }
  };
  
  // Maneja el envío de los resultados al backend
  const handleSubmit = async (finalAnswers: IUserAnswer[]) => {
    if (!attemptId || isSubmitting) return; // Chequeo de seguridad

    setIsSubmitting(true);
    try {
      // Llama a la API con el ID del intento
      const result = await submitTestResults(attemptId, finalAnswers);
      navigate('/results', { state: { score: result.iq_score } });
    } catch (err) {
      setError('Hubo un error al enviar tus resultados.');
      setIsSubmitting(false); // Permite reintentar si falla
    }
  };

  // --- Renderizado Condicional de la UI ---

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
          <p>No hay preguntas disponibles para esta prueba.</p>
        </div>
      </div>
    );
  }

  // --- Variables para el renderizado principal ---
  const currentQuestion = questions[currentQuestionIndex];
  const options = [
    { text: currentQuestion.option1, value: 'option1', letter: 'A' },
    { text: currentQuestion.option2, value: 'option2', letter: 'B' },
    { text: currentQuestion.option3, value: 'option3', letter: 'C' },
    { text: currentQuestion.option4, value: 'option4', letter: 'D' },
  ];

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="test-container">
      {isSubmitting && (
        <div className="submitting-overlay">
          <div className="submitting-content">
            <div className="submitting-spinner"></div>
            <div className="submitting-text">Procesando tus respuestas...</div>
          </div>
        </div>
      )}
      
      <div className="test-wrapper">
        <div className="test-top-bar">
          <div className="progress-container">
            <div className="progress-header">
              <div className="progress-title">Progreso del Test</div>
              <div className="progress-counter">{currentQuestionIndex + 1} de {questions.length}</div>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>

          <div className={`timer ${timeLeft < 60 && timeLeft > 0 ? 'timer-low' : ''}`}>
            <svg className="timer-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
          </div>
        </div>

        <div className="question-card" key={currentQuestion.id}>
          <div className="question-number">Pregunta {currentQuestionIndex + 1}</div>
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
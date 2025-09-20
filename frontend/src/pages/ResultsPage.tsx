// src/pages/ResultsPage.tsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './ResultsPage.css';

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const score = location.state?.score;

  // Función para determinar el nivel de IQ
  const getIQClassification = (iqScore: number): { level: string; description: string; emoji: string } => {
    if (iqScore >= 140) {
      return {
        level: "Genio",
        description: "Capacidad intelectual excepcional, presente en menos del 1% de la población",
        emoji: "🧠"
      };
    } else if (iqScore >= 130) {
      return {
        level: "Muy Superior",
        description: "Inteligencia muy alta, excelente capacidad de razonamiento",
        emoji: "🎓"
      };
    } else if (iqScore >= 120) {
      return {
        level: "Superior",
        description: "Inteligencia por encima del promedio, muy buena capacidad analítica",
        emoji: "⭐"
      };
    } else if (iqScore >= 110) {
      return {
        level: "Promedio Alto",
        description: "Buena capacidad intelectual, por encima de la media",
        emoji: "👍"
      };
    } else if (iqScore >= 90) {
      return {
        level: "Promedio",
        description: "Capacidad intelectual dentro del rango normal",
        emoji: "✅"
      };
    } else if (iqScore >= 80) {
      return {
        level: "Promedio Bajo",
        description: "Capacidad intelectual ligeramente por debajo del promedio",
        emoji: "📚"
      };
    } else {
      return {
        level: "Por Debajo del Promedio",
        description: "Capacidad intelectual que requiere apoyo adicional",
        emoji: "💪"
      };
    }
  };

  const classification = score ? getIQClassification(score) : null;

  return (
    <div className="results-container">
      {/* Partículas de confeti */}
      <div className="confetti-particle"></div>
      <div className="confetti-particle"></div>
      <div className="confetti-particle"></div>
      <div className="confetti-particle"></div>
      
      <div className="results-wrapper">
        <div className="results-card">
          {score !== undefined ? (
            <>
              {/* Icono de celebración */}
              <div className="celebration-icon">
                <div className="celebration-emoji">{classification?.emoji || "🎉"}</div>
              </div>
              
              {/* Título */}
              <h1 className="results-title">¡Felicitaciones!</h1>
              
              {/* Contenedor del puntaje */}
              <div className="score-container">
                <div className="score-label">Tu Puntaje de IQ</div>
                <div className="score-value">{Math.round(score)}</div>
                <div className="score-subtitle">Puntos de Coeficiente Intelectual</div>
              </div>
              
              {/* Clasificación */}
              {classification && (
                <div className="iq-classification">
                  <div className="classification-title">
                    Nivel: {classification.level}
                  </div>
                  <div className="classification-text">
                    {classification.description}
                  </div>
                </div>
              )}
              
              {/* Mensaje motivacional */}
              <div className="results-message">
                Has completado exitosamente la prueba. Tu resultado refleja tus habilidades de 
                razonamiento lógico y capacidad de resolución de problemas.
              </div>
            </>
          ) : (
            <>
              {/* Estado de error */}
              <div className="error-state">
                <div className="error-icon">⚠️</div>
                <div className="error-title">Resultado No Disponible</div>
                <div className="error-text">
                  No se pudo obtener tu puntaje. Esto puede deberse a un problema técnico 
                  o a que no se completó correctamente la prueba.
                </div>
              </div>
              
              <div className="results-message">
                Te recomendamos intentar la prueba nuevamente para obtener tu resultado.
              </div>
            </>
          )}
          
          {/* Botones de acción */}
          <div className="results-actions">
            <Link to="/" className="primary-button">
              🏠 Volver al Inicio
            </Link>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
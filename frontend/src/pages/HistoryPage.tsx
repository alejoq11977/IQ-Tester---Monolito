// src/pages/HistoryPage.tsx
import React, { useState, useEffect } from 'react';
import { fetchResultHistory } from '../services/api';
import { type IResultHistory } from '../types';
import './HistoryPage.css';

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<IResultHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getHistory = async () => {
      try {
        const data = await fetchResultHistory();
        setHistory(data);
      } catch (err) {
        setError('No se pudo cargar el historial.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getHistory();
  }, []);

  if (loading) {
    return (
      <div className="history-container">
        <div className="loading-container">
          <div className="loading-spinner-large"></div>
          <div className="loading-text">Cargando historial...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-container">
        <div className="error-container">
          <div className="error-text">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-wrapper">
        {/* Header */}
        <div className="history-header">
          <div className="header-content">
            <h1 className="history-title">Mi Historial de Resultados</h1>
            <div className="history-subtitle">
              Revisa tu progreso y mejora continua
            </div>
          </div>
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-number">{history.length}</div>
              <div className="stat-label">Pruebas Completadas</div>
            </div>
            {history.length > 0 && (
              <div className="stat-item">
                <div className="stat-number">
                  {Math.round(history.reduce((acc, result) => acc + result.score, 0) / history.length)}
                </div>
                <div className="stat-label">IQ Promedio</div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {history.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3 className="empty-title">Aún no has completado ninguna prueba</h3>
            <p className="empty-description">
              Comienza tu primer test de IQ para ver tus resultados aquí
            </p>
            <button 
              className="start-test-button"
              onClick={() => window.location.href = '/'}
            >
              Comenzar Primer Test
            </button>
          </div>
        ) : (
          <div className="results-grid">
            {history.map((result, index) => (
              <div 
                key={result.id} 
                className="result-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="result-header">
                  <div className="test-name">{result.test.name}</div>
                </div>
                
                <div className="score-section">
                  <div className="score-container">
                    <div className="score-value">{result.score.toFixed(0)}</div>
                    <div className="score-label">Puntaje IQ</div>
                  </div>
                  
                  <div className="score-indicator">
                    <div className="score-bar">
                      <div 
                        className="score-fill"
                        style={{ 
                          width: `${Math.min((result.score / 200) * 100, 100)}%`,
                          backgroundColor: getScoreColor(result.score)
                        }}
                      ></div>
                    </div>
                    <div className="score-category">
                      {getScoreCategory(result.score)}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Función auxiliar para obtener el color basado en el puntaje
const getScoreColor = (score: number): string => {
  if (score >= 140) return '#10B981'; // Verde brillante
  if (score >= 130) return '#38BDF8'; // Azul
  if (score >= 115) return '#818CF8'; // Púrpura
  if (score >= 100) return '#F59E0B'; // Amarillo
  if (score >= 85) return '#F97316';  // Naranja
  return '#EF4444'; // Rojo
};

// Función auxiliar para obtener la categoría del puntaje
const getScoreCategory = (score: number): string => {
  if (score >= 140) return 'Excepcional';
  if (score >= 130) return 'Muy Superior';
  if (score >= 115) return 'Superior';
  if (score >= 100) return 'Promedio Alto';
  if (score >= 85) return 'Promedio';
  return 'Bajo Promedio';
};

export default HistoryPage;
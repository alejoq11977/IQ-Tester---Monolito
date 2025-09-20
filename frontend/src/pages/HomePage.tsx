// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchTests } from '../services/api';
import { type ITest } from '../types';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [tests, setTests] = useState<ITest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getTests = async () => {
      try {
        const data = await fetchTests();
        setTests(data);
      } catch (err) {
        setError('No se pudieron cargar las pruebas.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getTests();
  }, []);

  if (loading) {
    return (
      <div className="homepage-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Cargando pruebas...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="homepage-container">
        <div className="error-container">
          <div className="error-text">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage-container">
      <div className="main-header">
        <h1 className="welcome-title">Elige tu Prueba</h1>
        <p className="welcome-subtitle">
          Selecciona una de las pruebas disponibles y demuestra tus conocimientos
        </p>
      </div>

      {tests.length === 0 ? (
        <div className="empty-state">
          <h3>No hay pruebas disponibles</h3>
          <p>Vuelve más tarde para ver las nuevas pruebas</p>
        </div>
      ) : (
        <ul className="tests-grid">
          {tests.map((test, index) => (
            <li
              key={test.id}
              className="test-card"
              style={{ '--card-index': index + 1 } as React.CSSProperties}
            >
              <div className="test-header">
                <h2 className="test-name">{test.name}</h2>
                <p className="test-description">{test.description}</p>
              </div>
              
              <div className="test-meta">
                <div className="time-info">
                  <svg className="time-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{test.time_limit_minutes} min</span>
                </div>
                <div className="difficulty-badge">
                  Nivel Medio
                </div>
              </div>

              <Link to={`/test/${test.id}`} className="start-test-button">
                Comenzar Prueba
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomePage;

// src/pages/HistoryPage.tsx
import React, { useState, useEffect } from 'react';
import { fetchResultHistory } from '../services/api';
import { type IResultHistory } from '../types';


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

  if (loading) return <div>Cargando historial...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>     
      <h1>Mi Historial de Resultados</h1>
      {history.length === 0 ? (
        <p>Aún no has completado ninguna prueba.</p>
      ) : (
        <ul>
          {history.map((result) => (
            <li key={result.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <h3>Prueba: {result.test.name}</h3>
              <p><strong>Puntaje de IQ Obtenido: {result.score.toFixed(2)}</strong></p>
              <p>Fecha: {new Date(result.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoryPage;
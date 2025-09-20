// src/services/api.ts
import axios from 'axios';
import { type ITest, type IQuestion, type IUserAnswer, type ISubmissionResponse, type IResultHistory } from '../types';

// La URL base para la instancia configurada. No la necesitamos fuera de la instancia.
const API_BASE_URL = '/api';

// --- Instancia de Axios con Interceptor ---
// Creamos una instancia específica para las llamadas autenticadas.
const axiosInstance = axios.create({
  baseURL: API_BASE_URL
});

// El interceptor se adjunta a ESTA instancia.
// Se ejecutará ANTES de cada petición hecha con 'axiosInstance'.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Si hay un token, lo añade a la cabecera de autorización.
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// --- Funciones de la API ---
// Todas estas funciones ahora deben usar 'axiosInstance' para que el token se añada automáticamente.

export const fetchTests = async (): Promise<ITest[]> => {
  // Hacemos la petición con la instancia que tiene el interceptor
  const response = await axiosInstance.get(`/tests/`);
  return response.data;
};


export const fetchQuestionsForTest = async (testId: string): Promise<IQuestion[]> => {
  // Usamos axiosInstance
  const response = await axiosInstance.get(`/questions/`, {
    params: { test_id: testId }
  });
  return response.data;
};

// CORRECCIÓN PRINCIPAL: Esta función ya no necesita recibir el user_id.
// El backend lo deduce del token que el interceptor está añadiendo.
export const submitTestResults = async (testId: string, answers: IUserAnswer[]): Promise<ISubmissionResponse> => {
  // El payload ya no incluye el user_id
  const payload = {
    test_id: parseInt(testId, 10),
    answers: answers
  };
  // Usamos axiosInstance
  const response = await axiosInstance.post(`/results/submit/`, payload);
  return response.data;
};

export const fetchResultHistory = async (): Promise<IResultHistory[]> => {
  const response = await axiosInstance.get(`/results/history/`);
  return response.data;
};
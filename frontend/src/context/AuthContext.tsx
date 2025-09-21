// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// Define la forma de los datos del usuario y del contexto
interface User {
  id: number;
  username: string;
  email: string;
}

// Define la forma del payload decodificado del token JWT
interface DecodedToken {
    user_id: number;
    username: string;
    email: string;
    // Simple JWT también incluye 'exp' (expiración) y 'jti' (JWT ID)
    exp: number;
    jti: string;
}


interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (tokens: { access: string; refresh: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        // 2. Decodifica el token usando el tipo que definimos
        const decodedUser: DecodedToken = jwtDecode(accessToken);
        
        // Comprueba si el token ha expirado
        if (decodedUser.exp * 1000 > Date.now()) {
          setUser({ id: decodedUser.user_id, username: decodedUser.username, email: decodedUser.email });
        } else {
          // Si el token ha expirado, limpia el almacenamiento
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        // Limpia en caso de un token inválido
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
    setLoading(false); 
  }, []);

  const login = (tokens: { access: string; refresh: string }) => {
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
    
    // 2. Decodifica el token usando el tipo que definimos
    const decodedUser: DecodedToken = jwtDecode(tokens.access);
    setUser({ id: decodedUser.user_id, username: decodedUser.username, email: decodedUser.email });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
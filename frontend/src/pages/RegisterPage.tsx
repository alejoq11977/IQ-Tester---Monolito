// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './RegisterPage.css';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const formatErrorMessage = (errorData: any): string => {
        if (typeof errorData === 'string') return errorData;
        
        if (errorData.username) return `Usuario: ${errorData.username[0]}`;
        if (errorData.email) return `Email: ${errorData.email[0]}`;
        if (errorData.password) return `Contraseña: ${errorData.password[0]}`;
        if (errorData.non_field_errors) return errorData.non_field_errors[0];
        
        return 'Error en el registro. Por favor, verifica los datos ingresados.';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validación: contraseñas deben coincidir
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setIsLoading(true);

        try {
            await axios.post('/api/auth/register/', { 
                username, 
                email, 
                password 
            });
            
            setSuccess('¡Registro exitoso! Redirigiendo al login...');
            
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            
        } catch (err: any) {
            const errorMessage = err.response?.data 
                ? formatErrorMessage(err.response.data)
                : 'Error de conexión. Por favor, intenta nuevamente.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = username.trim() && 
                       email.trim() && 
                       password.trim() && 
                       confirmPassword.trim() && 
                       password === confirmPassword;

    return (
        <div className="register-container">
            <div className="register-wrapper">
                <div className="register-card">
                    <div className="register-header">
                        <div className="welcome-icon">👋</div>
                        <h2 className="register-title">Crear Cuenta</h2>
                        <p className="register-subtitle">
                            Únete a nuestra comunidad y comienza a evaluar tus habilidades intelectuales
                        </p>
                    </div>
                    
                    <form className="register-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="input-label" htmlFor="username">
                                <span>👤</span>
                                Nombre de Usuario
                            </label>
                            <div className="input-with-icon">
                                <input
                                    id="username"
                                    type="text"
                                    className="register-input"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Elige tu nombre de usuario"
                                    required
                                    disabled={isLoading}
                                    minLength={3}
                                />
                            </div>
                        </div>
                        
                        <div className="input-group">
                            <label className="input-label" htmlFor="email">
                                <span>📧</span>
                                Correo Electrónico
                            </label>
                            <div className="input-with-icon">
                                <input
                                    id="email"
                                    type="email"
                                    className="register-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu.email@ejemplo.com"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        
                        <div className="input-group">
                            <label className="input-label" htmlFor="password">
                                <span>🔒</span>
                                Contraseña
                            </label>
                            <div className="input-with-icon">
                                <input
                                    id="password"
                                    type="password"
                                    className="register-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Crea una contraseña"
                                    required
                                    disabled={isLoading}
                                    minLength={8}
                                />
                            </div>
                        </div>
                        
                        <div className="input-group">
                            <label className="input-label" htmlFor="confirmPassword">
                                <span>🔐</span>
                                Confirmar Contraseña
                            </label>
                            <div className="input-with-icon">
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    className="register-input"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repite tu contraseña"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        
                        <button 
                            type="submit" 
                            className="register-button"
                            disabled={isLoading || !isFormValid}
                        >
                            {isLoading ? (
                                <>
                                    <span className="loading-spinner-small"></span>
                                    Creando Cuenta...
                                </>
                            ) : (
                                '🚀 Crear Mi Cuenta'
                            )}
                        </button>
                        
                        {error && (
                            <div className="error-message">{error}</div>
                        )}

                        {success && (
                            <div className="success-message">{success}</div>
                        )}
                    </form>
                    
                    <div className="register-links">
                        <p className="login-link">
                            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

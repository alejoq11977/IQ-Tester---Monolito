import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';
import ResultsPage from './pages/ResultsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HistoryPage from './pages/HistoryPage';
import ProtectedRoute from './components/ProtectedRoute'; 
import { useAuth } from './context/AuthContext'; 
import './App.css';

function App() {
  const { user, logout } = useAuth(); 

  return (
    <div>
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/" className="nav-logo">IQ Tester</Link>
          {user && <Link to="/history" className="nav-link">Mi Historial</Link>}
        </div>
        <div className="nav-right">
          {user ? (
            <>
              <button onClick={logout} className="nav-button">Logout</button>
            </>
          ) : (
            <Link to="/login" className="nav-button">Login</Link>
          )}
        </div>
      </nav>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/test/:id" element={<TestPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

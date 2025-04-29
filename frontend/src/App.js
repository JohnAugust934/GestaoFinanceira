import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Componentes de autenticação
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Componentes principais
import Dashboard from './components/dashboard/Dashboard';
import TransactionList from './components/transactions/TransactionList';
import TransactionForm from './components/transactions/TransactionForm';

// Componente de navegação
import Navbar from './components/layout/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar se o usuário está autenticado ao carregar a aplicação
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Componente de rota privada
  const PrivateRoute = ({ children }) => {
    if (loading) return <div>Carregando...</div>;
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
        
        <main className="container">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" /> : <Login setAuth={setIsAuthenticated} />
            } />
            <Route path="/registrar" element={
              isAuthenticated ? <Navigate to="/" /> : <Register setAuth={setIsAuthenticated} />
            } />
            
            {/* Rotas privadas */}
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/transacoes" element={
              <PrivateRoute>
                <TransactionList />
              </PrivateRoute>
            } />
            <Route path="/transacoes/nova" element={
              <PrivateRoute>
                <TransactionForm />
              </PrivateRoute>
            } />
            <Route path="/transacoes/editar/:id" element={
              <PrivateRoute>
                <TransactionForm />
              </PrivateRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

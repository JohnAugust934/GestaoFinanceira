import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem('token'); // Remove token from storage
    setIsAuthenticated(false); // Update auth state
    navigate('/login'); // Redirect to login page
    console.log('Logout successful');
  };

  return (
    <nav className="navbar">
      <h1>Gestão Financeira PWA</h1>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/transacoes">Transações</Link></li>
        {/* Add links to other sections like Orçamento, Metas later */}
        <li>
          <button onClick={onLogout} className="logout-button">
            Sair
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;


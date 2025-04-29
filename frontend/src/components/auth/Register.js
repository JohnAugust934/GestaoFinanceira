import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../services/api';

const Register = ({ setAuth }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '', // For password confirmation
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { name, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    if (password !== password2) {
      setError('As senhas não coincidem');
      return;
    }
    try {
      const res = await apiClient.post('/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token); // Store token
      // setAuth(true); // Update auth state in parent component
      console.log('Registro bem-sucedido, token armazenado.');
      navigate('/'); // Redirect to dashboard after registration
    } catch (err) {
      console.error('Erro no registro:', err.response ? err.response.data : err.message);
      const errorMsg = err.response && err.response.data && err.response.data.msg
                       ? err.response.data.msg
                       : 'Erro ao registrar. Verifique os dados informados.';
      setError(errorMsg);
      // setAuth(false);
      localStorage.removeItem('token');
    }
  };

  return (
    <div>
      <h2>Registrar</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6" // Example: enforce minimum password length
            required
          />
        </div>
        <div>
          <label htmlFor="password2">Confirmar Senha:</label>
          <input
            type="password"
            id="password2"
            name="password2"
            value={password2}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        <button type="submit">Registrar</button>
      </form>
      <p>
        Já tem uma conta? <Link to="/login">Faça login</Link>
      </p>
    </div>
  );
};

export default Register;


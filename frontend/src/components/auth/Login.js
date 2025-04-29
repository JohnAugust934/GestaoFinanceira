import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/api';

const Login = ({ setAuth }) => { // Assume setAuth is passed down to update auth state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token); // Store token
      // setAuth(true); // Update auth state in parent component
      console.log('Login successful, token stored.');
      navigate('/'); // Redirect to dashboard after login
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      const errorMsg = err.response && err.response.data && err.response.data.msg
                       ? err.response.data.msg
                       : 'Erro ao fazer login. Verifique suas credenciais.';
      setError(errorMsg);
      // setAuth(false);
      localStorage.removeItem('token');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={onSubmit}>
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
            required
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
      <p>
        Não tem uma conta? <button onClick={() => navigate('/registrar')}>Registre-se</button>
      </p>
    </div>
  );
};

export default Login;


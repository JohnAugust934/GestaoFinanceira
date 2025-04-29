import axios from 'axios';

// Define a URL base da API (ajuste conforme necessário, pode vir de .env)
const API_URL = '/api'; // Usando proxy do React dev server ou URL completa

// Configura uma instância do axios para incluir o token automaticamente se disponível
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT a cada requisição
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Ou de onde você armazenar o token
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;


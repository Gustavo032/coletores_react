import axios from 'axios';

// Substitua com a URL correta da sua API (incluindo a porta)
export const api = axios.create({
  baseURL: 'http://api-g.codematch.com.br:3380', // Ajuste a URL de acordo com sua API
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');  // Ajuste para como você armazena o token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


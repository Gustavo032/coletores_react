import axios from 'axios';

const API_URL = 'http://localhost:3000/api';  // Substitua pela URL do seu back-end

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;  // Retorna o token JWT
  } catch (error) {
    throw new Error('Erro ao autenticar: ' + error.message);
  }
};

export const getUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/user`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter usuário: ' + error.message);
  }
};

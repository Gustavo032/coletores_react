import axios from 'axios';

const API_URL = 'http://localhost:3333';  // Substitua pela URL do seu back-end

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
		const token = localStorage.getItem('token')
    const response = await axios.get(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter usuário: ' + error.message);
  }
};

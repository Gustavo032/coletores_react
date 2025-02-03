import axios from "axios";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [user, setUser] = useState<{ role: string; roles: string | string[] } | null>(null);
  const [loading, setLoading] = useState(true);  // Para controlar a tela de carregamento
  const [error, setError] = useState<string | null>(null); // Para armazenar erros

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);  // Se não houver token, parar o loading
      return;
    }

    try {
      const response = await axios.get('https://api-g.codematch.com.br:3380/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data.user);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      setUser(null);
    } finally {
      setLoading(false); // Parar o loading depois de tentar
    }
  };

  useEffect(() => {
    fetchUser(); // Chama fetchUser para pegar os dados do usuário ao montar o hook
  }, []); // Só chama uma vez quando o hook é montado

  return { user, loading, fetchUser };
};

import { useState, useEffect } from 'react';

// Hook para pegar informações do usuário autenticado
export const useAuth = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');  // ou sessionStorage
    if (token) {
      // Verifique o token e recupere as informações do usuário
      const decodedUser = JSON.parse(atob(token.split('.')[1]));  // Decodifica o JWT
      setUser(decodedUser);
    }
  }, []);

  return { user };
};

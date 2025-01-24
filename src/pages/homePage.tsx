// src/pages/HomePage.tsx

import React, { useEffect, useState } from 'react';
import { getUser } from '../services/authService';

const HomePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error('Erro ao obter dados do usuário:', error);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>Bem-vindo, {user.name}!</h1>
      <p>Você tem permissões de: {user.role}</p>
    </div>
  );
};

export default HomePage;

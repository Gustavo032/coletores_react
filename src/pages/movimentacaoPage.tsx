// src/pages/MovimentacaoPage.tsx

import React from 'react';
import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MovimentacaoForm from '../components/movimentacaoForm';

const MovimentacaoPage: React.FC = () => {
  const navigate = useNavigate();

  // Aqui você obtém o JWT e decodifica para pegar o setor de origem do usuário (exemplo: usando jwt-decode)
  const setorOrigem = 'setorX'; // Substitua com a lógica real para obter o setor do JWT

  return (
      <MovimentacaoForm setorOrigem={setorOrigem} />
  );
};

export default MovimentacaoPage;

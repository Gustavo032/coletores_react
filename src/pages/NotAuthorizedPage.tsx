// Exemplo de página de "Não autorizado"
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotAuthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Typography variant="h4" color="error" gutterBottom>
        Acesso Não Autorizado
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Você não tem permissão para acessar esta página.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/home')}>
        Voltar para a Página Inicial
      </Button>
    </Box>
  );
};

export default NotAuthorizedPage;
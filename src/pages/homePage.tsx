import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography, Grid } from '@mui/material';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const pages = [
    { label: 'Movimentação', path: '/movimentacao' },
    { label: 'Setores', path: '/setores' },
    { label: 'Histórico', path: '/historic' },
    { label: 'Relatórios', path: '/relatorios' },
    { label: 'Usuários', path: '/usuarios' },
    { label: 'Adicionar Setor', path: '/setores/adicionar' },
    { label: 'Página Não Autorizada', path: '/unauthorized' },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f4f6f8',
        padding: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Bem-vindo ao Sistema de Gestão
      </Typography>
      <Typography variant="body1" gutterBottom>
        Escolha uma das opções abaixo para navegar:
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {pages.map((page) => (
          <Grid item key={page.path}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(page.path)}
              sx={{ minWidth: 200 }}
            >
              {page.label}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HomePage;

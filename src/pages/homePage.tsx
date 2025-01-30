import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography, Grid, Paper } from '@mui/material';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const pages = [
    { label: 'Movimentação', path: '/movimentacao' },
    { label: 'Setores', path: '/setores' },
    { label: 'Histórico', path: '/historic' },
    // { label: 'Relatórios', path: '/relatorios' },
    { label: 'Usuários', path: '/usuarios' },
    // { label: 'Adicionar Setor', path: '/setores/adicionar' },
    // { label: 'Página Não Autorizada', path: '/unauthorized' },
  ];

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      background: 'linear-gradient(135deg, #007aff, #00c4b4)',
      // background: 'linear-gradient(135deg, #007fff, #00e1ff)',
        color: '#fff',
        padding: 4,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 4,
          padding: 4,
          maxWidth: 600,
          textAlign: 'center',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Typography variant="h3" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#007fff' }}>
          Bem-vindo ao Sistema de Gestão
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 4, color: '#333' }}>
          Escolha uma das opções abaixo para navegar:
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {pages.map((page) => (
            <Grid item key={page.path}>
              <Button
                variant="contained"
                onClick={() => navigate(page.path)}
                sx={{
                  backgroundColor: '#007fff',
                  color: '#fff',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  padding: '10px 20px',
                  minWidth: 200,
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: '#005bbb',
                  },
                }}
              >
                {page.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default HomePage;

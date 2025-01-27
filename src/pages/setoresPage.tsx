import React, { useEffect, useState } from 'react';
import { Button, Container, Grid2, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api';

const SetoresPage = () => {
  const [setores, setSetores] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, loading: userLoading } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  console.log('Token recuperado no SetoresPage:', token);

  useEffect(() => {
    // Verifique se o usuário ainda está sendo carregado
    if (userLoading) return;

    console.log('Usuário no SetoresPage:', user); // Adicionando mais informações

    // Converte o campo 'roles' para array se for uma string
    const roles = Array.isArray(user?.roles) ? user.roles : JSON.parse(user?.roles || '[]');

    // Checando as roles do usuário
    if (!user || (!roles.includes('fullAdmin') && !roles.includes('admin_setor') && user.role !== 'fullAdmin')) {
      console.log('Redirecionando para unauthorized devido à role do usuário.');
      navigate('/unauthorized');
    } else {
      console.log('Usuário autorizado, carregando setores...');
      api
        .get('/sectors', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setSetores(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Erro ao carregar setores:', error);
          setLoading(false);
        });
    }
  }, [user, userLoading, navigate]);

  const handleAddSetor = () => {
    navigate('/setores/adicionar');
  };

  const handleEditSetor = (id: number) => {
    navigate(`/setores/editar/${id}`);
  };

  const handleDeleteSetor = (id: number) => {
    if (window.confirm('Tem certeza de que deseja excluir este setor?')) {
      api.delete(`/sectors/${id}`)
        .then(() => {
          setSetores(setores.filter(setor => setor.id !== id));
        })
        .catch((error) => {
          console.error('Erro ao excluir setor:', error);
        });
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Setores
      </Typography>
      {loading ? (
        <Typography>Carregando setores...</Typography>
      ) : (
        <Grid2 container spacing={2}>
          {setores.map(setor => (
            <Grid2 key={setor.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6">{setor.nome}</Typography>
                <Typography variant="body2">ID: {setor.id}</Typography>
                <Button variant="outlined" color="primary" onClick={() => handleEditSetor(setor.id)}>Editar</Button>
                <Button variant="outlined" color="secondary" onClick={() => handleDeleteSetor(setor.id)}>Excluir</Button>
              </Paper>
            </Grid2>
          ))}
        </Grid2>
      )}
      <Button variant="contained" color="primary" onClick={handleAddSetor}>Adicionar Setor</Button>
    </Container>
  );
};

export default SetoresPage;

import React, { useEffect, useState } from 'react';
import { Button, Container, Grid2, Paper, Typography } from '@mui/material';  // Mantendo Grid2
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Usando useNavigate para navegação
import { useAuth } from '../hooks/useAuth';  // Hook para pegar informações de usuário logado

const SetoresPage = () => {
  const [setores, setSetores] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();  // Pegando o usuário logado
  const navigate = useNavigate();  // Usando useNavigate agora

  useEffect(() => {
    // Só permite que administradores vejam a página de setores
    if (!user || (user.role !== 'admin' && user.role !== 'admin_setor')) {
      navigate('/unauthorized');  // Redireciona se não for autorizado
    }

    axios.get('/setores')
      .then(response => {
        setSetores(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao carregar setores:', error);
        setLoading(false);
      });
  }, [user, navigate]);

  const handleAddSetor = () => {
    navigate('/setores/adicionar');
  };

  const handleEditSetor = (id: number) => {
    navigate(`/setores/editar/${id}`);
  };

  const handleDeleteSetor = (id: number) => {
    if (window.confirm('Tem certeza de que deseja excluir este setor?')) {
      axios.delete(`/setores/${id}`)
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
            <Grid2 key={setor.id} size={{xs:12, sm:6, md:4}}>  {/* Não precisa de "item" no Grid2 */}
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

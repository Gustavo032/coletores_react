import React, { useEffect, useState } from 'react';
import { Button, Container, Grid, Paper, Typography, Modal, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api';
import AddEditSetorModal from '../components/addEditSetorModal';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Importando o ícone

const SetoresPage = () => {
  const [setores, setSetores] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSetor, setSelectedSetor] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const { user, loading: userLoading } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (userLoading) return;

    if (!user) {
      navigate('/unauthorized');
    } else {
      api
        .get('/sectors', { headers: { Authorization: `Bearer ${token}` } })
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

  const openAddModal = () => {
    setSelectedSetor(null);
    setModalMode('add');
    setModalOpen(true);
  };

  const openEditModal = (setor: any) => {
    setSelectedSetor(setor);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDeleteSetor = (id: number) => {
    if (window.confirm('Tem certeza de que deseja excluir este setor?')) {
      api
        .delete(`/sectors/${id}`)
        .then(() => {
          setSetores(setores.filter((setor) => setor.id !== id));
        })
        .catch((error) => {
          console.error('Erro ao excluir setor:', error);
        });
    }
  };

  const handleModalClose = (updatedSetor: any | null) => {
    setModalOpen(false);
    if (updatedSetor) {
      if (modalMode === 'add') {
        setSetores([...setores, updatedSetor]);
      } else {
        setSetores(
          setores.map((setor) => (setor.id === updatedSetor.id ? updatedSetor : setor))
        );
      }
    }
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #2C3E50, #3498DB)', // Gradiente azul
        minHeight: '100vh',
        width: '100vw', // Garantir que ocupe toda a largura da tela
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative', // Para permitir o posicionamento absoluto da seta
      }}
    >
      {/* Seta de Voltar */}
      <Button
        onClick={() => navigate('/home')}
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 1000, // Para garantir que a seta fique acima de outros elementos
          color: 'white',
        }}
      >
        <ArrowBackIcon />
      </Button>

      <Box
        sx={{
          backgroundColor: 'white',
          padding: 3,
          borderRadius: 2,
          width: '80%',
          maxWidth: '1200px',
        }}
      >
        <Typography variant="h4" color="primary" align="center" gutterBottom>
          Gerenciamento de Setores
        </Typography>
        {loading ? (
          <Typography align="center">Carregando setores...</Typography>
        ) : (
          <Grid container spacing={3}>
            {setores.map((setor) => (
              <Grid key={setor.id} item xs={12} sm={6} md={4}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                  <Typography variant="h6" color="primary">
                    {setor.nome}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ID: {setor.id}
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => openEditModal(setor)}
                      >
                        Editar
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDeleteSetor(setor.id)}
                      >
                        Excluir
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
        <Box sx={{ textAlign: 'center', marginTop: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={openAddModal}
            sx={{ padding: '10px 20px' }}
          >
            Adicionar Setor
          </Button>
        </Box>
      </Box>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{ maxWidth: 600, margin: 'auto', marginTop: '10%', padding: 2 }}>
          <AddEditSetorModal
            mode={modalMode}
            setor={selectedSetor}
            onClose={handleModalClose}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default SetoresPage;

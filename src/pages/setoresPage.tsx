import React, { useEffect, useState } from 'react';
import { Button, Container, Grid, Paper, Typography, Modal, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api';
import AddEditSetorModal from '../components/addEditSetorModal';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ArrowBack } from '@mui/icons-material';

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
        setSetores(setores.map((setor) => (setor.id === updatedSetor.id ? updatedSetor : setor)));
      }
    }
  };

  return (
		<Box sx={{ 
			padding: 3, 
			background: 'linear-gradient(135deg, #007aff, #00c4b4)',
			minHeight: '100vh',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center'
		}}>
				<IconButton onClick={() => navigate('/home')} sx={{ alignSelf: 'flex-start', color: 'white' }}>
		 <ArrowBack fontSize="large" />
	 </IconButton>

      <Paper
        elevation={6}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: 4,
          borderRadius: 3,
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
                <Paper
                  elevation={3}
                  sx={{
                    padding: 2,
                    borderRadius: 2,
                    backgroundColor: '#F8F9FA',
                    '&:hover': { backgroundColor: '#E3E6E8' },
                    transition: '0.3s',
                  }}
                >
                  <Typography variant="h6" color="primary">
                    {setor.nome}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ID: {setor.id}
                  </Typography>
                  <Grid container spacing={1} sx={{ marginTop: 1 }}>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => openEditModal(setor)}
                        sx={{ borderRadius: 2 }}
                      >
                        Editar
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeleteSetor(setor.id)}
                        sx={{ borderRadius: 2 }}
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
            sx={{
              padding: '10px 20px',
              borderRadius: 3,
              backgroundColor: '#1E88E5',
              '&:hover': { backgroundColor: '#1565C0' },
            }}
          >
            Adicionar Setor
          </Button>
        </Box>
      </Paper>

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

import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Grid, Snackbar, Alert, TextField, MenuItem, Select, FormControl, InputLabel, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import AddEditColetorModal from '../components/AddEditColetorModal';
import { ArrowBack } from '@mui/icons-material';

const ColetoresPage: React.FC = () => {
  const [coletores, setColetores] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]); // List of sectors
  const [errorMessage, setErrorMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [coletorToEdit, setColetorToEdit] = useState<any>(null);
  const navigate = useNavigate();

  // Fetch coletores and sectors
  useEffect(() => {
    api.get('/coletores')
      .then((response) => setColetores(response.data.coletores))
      .catch((error) => setErrorMessage('Erro ao carregar coletores'));

    api.get('/sectors')
      .then((response) => setSectors(response.data))
      .catch((error) => setErrorMessage('Erro ao carregar setores'));
  }, []);

  const handleCreateColetor = () => {
    setMode('add');
    setColetorToEdit(null);
    setOpenModal(true);
  };

  const handleEditColetor = (coletor: any) => {
    setMode('edit');
    setColetorToEdit(coletor);
    setOpenModal(true);
  };

  const handleDeleteColetor = (id: number) => {
    api.delete(`/coletores/${id}`)
      .then(() => {
        setColetores(coletores.filter((coletor) => coletor.id !== id));
      })
      .catch((error) => setErrorMessage('Erro ao excluir coletor'));
  };

  const handleModalClose = (updatedColetor: any | null) => {
    if (updatedColetor) {
      if (mode === 'add') {
        setColetores([...coletores, updatedColetor]);
      } else if (mode === 'edit') {
        setColetores(coletores.map((coletor) => (coletor.id === updatedColetor.id ? updatedColetor : coletor)));
      }
    }
    setOpenModal(false);
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
            </IconButton><Paper elevation={4} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 4, padding: 4, width: '100%', maxWidth: 900, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)' }}>
        <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#007fff' }}>
          Gerenciar Coletores
        </Typography>

        <Grid container spacing={3} justifyContent="center" sx={{ marginBottom: 4 }}>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateColetor}
              fullWidth
              sx={{ fontWeight: 'bold', textTransform: 'uppercase', padding: '12px 20px', borderRadius: '8px' }}
            >
              Criar Coletor
            </Button>
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Lista de Coletores:
        </Typography>

        <Grid container spacing={2}>
          {coletores.map((coletor) => (
            <Grid item xs={12} sm={6} md={4} key={coletor.id}>
              <Paper sx={{ padding: 2, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Typography variant="h6">{coletor.modelo}</Typography>
                <Typography variant="body2">{coletor.hostname}</Typography>
                <Typography variant="body2">Setor: {coletor.sector?.nome}</Typography>

                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', marginTop: 1 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate(`/coletores/${coletor.id}`)}
                    sx={{ width: '100%' }}
                  >
                    Detalhes
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteColetor(coletor.id)}
                    sx={{ width: '100%' }}
                  >
                    Excluir
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditColetor(coletor)}
                    sx={{ width: '100%' }}
                  >
                    Editar
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage('')}>
        <Alert severity="error" onClose={() => setErrorMessage('')} sx={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
          {errorMessage}
        </Alert>
      </Snackbar>

      {openModal && (
        <AddEditColetorModal
          mode={mode}
          coletor={coletorToEdit}
          sectors={sectors}
          onClose={handleModalClose}
        />
      )}
    </Box>
  );
};

export default ColetoresPage;

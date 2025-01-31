import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Grid, Snackbar, Alert, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const ColetoresPage: React.FC = () => {
  const [coletores, setColetores] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [modelo, setModelo] = useState('');
  const [hostname, setHostname] = useState('');
  const [setorId, setSetorId] = useState('');
  const [sectors, setSectors] = useState<any[]>([]); // List of sectors
  const navigate = useNavigate();

  // Fetch coletores and sectors
  useEffect(() => {
    // Fetch coletores
    api.get('/coletores')
      .then((response) => setColetores(response.data.coletores))
      .catch((error) => setErrorMessage('Erro ao carregar coletores'));

    // Fetch setores (assuming there's an endpoint to fetch them)
    api.get('/sectors')
      .then((response) => setSectors(response.data))
      .catch((error) => setErrorMessage('Erro ao carregar setores'));
  }, []);

  const handleCreateColetor = () => {
    api.post('/coletores', { modelo, hostname, setor_id: setorId })
      .then((response) => {
        setColetores([...coletores, response.data.coletor]);
        setModelo('');
        setHostname('');
        setSetorId('');
        setErrorMessage('');
      })
      .catch((error) => setErrorMessage('Erro ao criar coletor'));
  };

  const handleDeleteColetor = (id: number) => {
    api.delete(`/coletores/${id}`)
      .then(() => {
        setColetores(coletores.filter((coletor) => coletor.id !== id));
      })
      .catch((error) => setErrorMessage('Erro ao excluir coletor'));
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #007aff, #00c4b4)',
        padding: 4,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 4,
          padding: 4,
          maxWidth: 800,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#007fff' }}>
          Gerenciar Coletores
        </Typography>

        <Grid container spacing={3} justifyContent="center" sx={{ marginBottom: 4 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Modelo"
              fullWidth
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Hostname"
              fullWidth
              value={hostname}
              onChange={(e) => setHostname(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Setor</InputLabel>
              <Select
                value={setorId}
                onChange={(e) => setSetorId(e.target.value)}
                label="Setor"
              >
                {sectors.map((sector) => (
                  <MenuItem key={sector.id} value={sector.id}>
                    {sector.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateColetor}
              fullWidth
              sx={{
                fontWeight: 'bold',
                textTransform: 'uppercase',
                padding: '10px 20px',
                borderRadius: '8px',
              }}
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
              <Paper sx={{ padding: 2, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h6">{coletor.modelo}</Typography>
                <Typography variant="body2">{coletor.hostname}</Typography>
                <Typography variant="body2">Setor: {coletor.sector?.nome}</Typography>

                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate(`/coletores/${coletor.id}`)}
                  sx={{ marginTop: 1 }}
                >
                  Detalhes
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteColetor(coletor.id)}
                  sx={{ marginTop: 1, marginLeft: 1 }}
                >
                  Excluir
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
      >
        <Alert severity="error" onClose={() => setErrorMessage('')} sx={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ColetoresPage;

import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid, Button, Snackbar, Alert, IconButton } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { ArrowBack } from '@mui/icons-material';

const DetalhesColetorPage: React.FC = () => {
  const { id } = useParams(); // Pega o ID da URL
  const [coletor, setColetor] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Fetch do coletor
  useEffect(() => {
    if (id) {
      api.get(`/coletores/${id}`)
        .then((response) => {
          setColetor(response.data.coletor); // Supondo que a resposta seja algo como { coletor: {...} }
        })
        .catch((error) => {
          setErrorMessage('Erro ao carregar os detalhes do coletor');
        });
    }
  }, [id]);

  if (!coletor) {
    return (
      <Box sx={{ textAlign: 'center', padding: 3 }}>
        <Typography variant="h6" color="error">
          Carregando detalhes...
        </Typography>
      </Box>
    );
  }

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
      
      <Paper elevation={4} sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 4, 
        padding: 4, 
        width: '100%', 
        maxWidth: 900, 
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)'
      }}>
        <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#007fff' }}>
          Detalhes do Coletor
        </Typography>

        <Grid container spacing={3} sx={{ marginBottom: 4 }}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Modelo: {coletor.modelo}
            </Typography>
            <Typography variant="body1">
              Hostname: {coletor.hostname}
            </Typography>
            <Typography variant="body1">
              Setor: {coletor?.sector?.nome}
            </Typography>
          </Grid>

          {/* Exibindo as movimentações */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Movimentações:
            </Typography>
              {coletor.movimentacoes.length > 0 ? (
              <Grid container spacing={2}>
                {coletor.movimentacoes.map((movimentacao: any) => (
                  <Grid item xs={12} sm={6} key={movimentacao.id}>
                    <Paper sx={{ padding: 2, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                      <Typography variant="body2">
                        Status: {movimentacao.status === 'entregue' ? 'Entregue' : 'Retirado'}
                      </Typography>
                      <Typography variant="body2">
                        Setor de Origem: {movimentacao.setorOrigem?.nome}  {/* Ajustado aqui */}
                      </Typography>
                      <Typography variant="body2">
                        Data: {new Date(movimentacao.dataMovimentacao).toLocaleString()}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2">Não há movimentações registradas.</Typography>
            )}
          </Grid>

        </Grid>

        <Button variant="outlined" color="primary" onClick={() => navigate(`/coletores`)} sx={{ marginTop: 2 }}>
          Voltar
        </Button>
      </Paper>

      <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage('')}>
        <Alert severity="error" onClose={() => setErrorMessage('')} sx={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DetalhesColetorPage;

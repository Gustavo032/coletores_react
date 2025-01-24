// src/pages/RelatoriosPage.tsx

import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, Button, Typography, CircularProgress, Snackbar } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { Alert } from '@mui/lab';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RelatoriosPage: React.FC = () => {
  const [setor, setSetor] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [relatorioData, setRelatorioData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRelatorio = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/relatorios/movimentacoes', {
        params: { setor, dataInicio, dataFim }
      });
      setRelatorioData(response.data);
    } catch (error) {
      setError('Erro ao carregar o relatório');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelatorio();
  }, []);

  const chartData = {
    labels: relatorioData ? relatorioData.dates : [],
    datasets: [
      {
        label: 'Movimentações por Data',
        data: relatorioData ? relatorioData.movimentacoesPorData : [],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
    ],
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>Relatórios de Movimentações</Typography>
      
      {/* Filtros */}
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <TextField
            label="Setor"
            fullWidth
            value={setor}
            onChange={(e) => setSetor(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            type="date"
            label="Data Início"
            fullWidth
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            type="date"
            label="Data Fim"
            fullWidth
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
      
      <Button
        variant="contained"
        color="primary"
        onClick={fetchRelatorio}
        sx={{ marginTop: 2 }}
      >
        Gerar Relatório
      </Button>

      {/* Gráfico */}
      {loading ? (
        <CircularProgress sx={{ marginTop: 2 }} />
      ) : error ? (
        <Snackbar open={!!error} autoHideDuration={6000}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      ) : (
        <Box sx={{ marginTop: 3 }}>
          <Line data={chartData} />
        </Box>
      )}
    </Box>
  );
};

export default RelatoriosPage;

import React, { useState, useEffect } from 'react';
import { Box, Grid, Button, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { api } from '../api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RelatoriosPage: React.FC = () => {
  const [relatorioData, setRelatorioData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Função para formatar o mês atual no formato YYYY-MM
  const getCurrentMonth = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês atual
    return `${year}-${month}-01`; // Data de início do mês
  };

  // Função para obter o último dia do mês
  const getEndOfMonth = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    date.setDate(0); // Último dia do mês
    return date.toISOString().split('T')[0];
  };

  const fetchRelatorio = async () => {
    setLoading(true);

    try {
      const response = await api.get('/movimentacoes', {
        params: {
          dataInicio: getCurrentMonth(),
          dataFim: getEndOfMonth(),
        },
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

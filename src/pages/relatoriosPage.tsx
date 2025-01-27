import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, CircularProgress, Snackbar } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Alert } from '@mui/lab';
import { api } from '../api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RelatoriosPage: React.FC = () => {
  const [relatorioData, setRelatorioData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Função para obter o mês atual em formato ISO
  const getCurrentMonthRange = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    return { startDate, endDate };
  };

  const fetchRelatorio = async () => {
    setLoading(true);
    setError('');

    const { startDate, endDate } = getCurrentMonthRange();

    try {
      const response = await api.get('/movimentacoes', { params: { dataInicio: startDate, dataFim: endDate } });
      setRelatorioData(response.data);
    } catch (err) {
      setError('Erro ao carregar os dados do relatório.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelatorio();
  }, []);

  const renderCharts = () => {
    if (relatorioData.length === 0) {
      return <Typography>Sem dados disponíveis para o mês atual.</Typography>;
    }

    return relatorioData.map((setor, index) => (
      <Box key={index} sx={{ marginBottom: 3 }}>
        <Typography variant="h6">{setor.name}</Typography>
        <Line
          data={{
            labels: setor.dates,
            datasets: [
              {
                label: 'Movimentações',
                data: setor.movimentacoesPorData,
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
              },
            ],
          }}
        />
      </Box>
    ));
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>Relatórios de Movimentações</Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Snackbar open={!!error} autoHideDuration={6000}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      ) : (
        <Box sx={{ marginTop: 3 }}>{renderCharts()}</Box>
      )}
    </Box>
  );
};

export default RelatoriosPage;

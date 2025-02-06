import React, { useState, useEffect } from 'react';
import { Box, TextField, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Alert, Snackbar, Button, IconButton, TableSortLabel } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { api } from '../api';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const HistorialPage: React.FC = () => {
  const navigate = useNavigate();
  const [setorOrigem, setSetorOrigem] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [status, setStatus] = useState('');
  const [colaborador, setColaborador] = useState('');
  const [hostname, setHostname] = useState('');
  const [movimentacoes, setMovimentacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Estados para ordenação
  const [orderBy, setOrderBy] = useState<string>('dataMovimentacao');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');

  const fetchMovimentacoes = async () => {
    setLoading(true);
    setError('');
    try {
      const params: any = {};
      if (setorOrigem) params.setorOrigemId = setorOrigem;
      if (dataInicio) params.dataInicio = dataInicio;
      if (dataFim) params.dataFim = dataFim;
      if (status) params.status = status;
      if (colaborador) params.nomeColaborador = colaborador;
      if (hostname) params.hostname = hostname;

      const response = await api.get('/movimentacoes', { params });
      setMovimentacoes(response.data);
    } catch (error) {
      setError('Erro ao carregar as movimentações.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovimentacoes();
  }, [setorOrigem, dataInicio, dataFim, status, colaborador, hostname]);

  // Função para ordenar a lista com base na escolha do usuário
  const sortedMovimentacoes = [...movimentacoes].sort((a, b) => {
    const valueA = a[orderBy] || '';
    const valueB = b[orderBy] || '';

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return orderDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return orderDirection === 'asc' ? valueA - valueB : valueB - valueA;
    }

    if (valueA instanceof Date && valueB instanceof Date) {
      return orderDirection === 'asc' ? valueA.getTime() - valueB.getTime() : valueB.getTime() - valueA.getTime();
    }

    return 0;
  });

  // Manipulador de evento para ordenar por uma coluna específica
  const handleSort = (column: string) => {
    const isAsc = orderBy === column && orderDirection === 'asc';
    setOrderBy(column);
    setOrderDirection(isAsc ? 'desc' : 'asc');
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
      
      <Paper elevation={5} sx={{ width: '90%', padding: 4, background: 'rgba(255, 255, 255, 0.9)', borderRadius: 3 }}>  
        <Typography variant="h4" gutterBottom color="#007aff" fontWeight="bold" textAlign="center">
          Consulta e Relatórios de Movimentações
        </Typography>

        <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center" sx={{ marginBottom: 3 }}>
          <TextField label="Setor de Origem" value={setorOrigem} onChange={(e) => setSetorOrigem(e.target.value)} sx={{ width: { xs: '100%', sm: '48%', md: '30%' } }} />
          <TextField type="date" label="Data Início" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ width: { xs: '100%', sm: '48%', md: '30%' } }} />
          <TextField type="date" label="Data Fim" value={dataFim} onChange={(e) => setDataFim(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ width: { xs: '100%', sm: '48%', md: '30%' } }} />
          <TextField label="Status" value={status} onChange={(e) => setStatus(e.target.value)} sx={{ width: { xs: '100%', sm: '48%', md: '30%' } }} />
          <TextField label="Colaborador" value={colaborador} onChange={(e) => setColaborador(e.target.value)} sx={{ width: { xs: '100%', sm: '48%', md: '30%' } }} />
          <TextField label="Hostname" value={hostname} onChange={(e) => setHostname(e.target.value)} sx={{ width: { xs: '100%', sm: '48%', md: '30%' } }} />
        </Box>

        {loading ? (
          <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
        ) : error ? (
          <Snackbar open={!!error} autoHideDuration={6000}>
            <Alert severity="error">{error}</Alert>
          </Snackbar>
        ) : (
          <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3, marginTop: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#007aff' }}>
                <TableRow>
                  {[
                    { label: 'Data/Hora', key: 'dataMovimentacao' },
                    { label: 'Setor de Origem', key: 'setorOrigem.nome' },
                    { label: 'Nome do Colaborador', key: 'nomeColaborador' },
                    { label: 'Status', key: 'status' },
                    { label: 'Hostname', key: 'coletor.hostname' }
                  ].map((col) => (
                    <TableCell key={col.key} sx={{ color: 'white', fontWeight: 'bold' }}>
                      <TableSortLabel
                        active={orderBy === col.key}
                        direction={orderBy === col.key ? orderDirection : 'asc'}
                        onClick={() => handleSort(col.key)}
                      >
                        {col.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedMovimentacoes.map((movimentacao: any) => (
                  <TableRow key={movimentacao.id}>
                    <TableCell>{format(new Date(movimentacao.dataMovimentacao), 'dd/MM/yyyy HH:mm')}</TableCell>
                    <TableCell>{movimentacao.setorOrigem?.nome}</TableCell>
                    <TableCell>{movimentacao.nomeColaborador}</TableCell>
                    <TableCell>{movimentacao.status}</TableCell>
                    <TableCell>{movimentacao.coletor?.hostname}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default HistorialPage;

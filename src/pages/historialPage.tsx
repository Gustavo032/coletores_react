// src/pages/HistorialPage.tsx

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Grid, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, Alert } from '@mui/material';
import axios from 'axios';

import { debounce } from 'lodash';

const HistorialPage: React.FC = () => {
  const [setorOrigem, setSetorOrigem] = useState('');
  const [setorDestino, setSetorDestino] = useState('');
  const [dataInicio, setDataInicio] = useState<string>('');
  const [dataFim, setDataFim] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [colaborador, setColaborador] = useState('');
  const [modelo, setModelo] = useState('');
  const [movimentacoes, setMovimentacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchMovimentacoes = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/movimentacoes', {
        params: {
          setorOrigem,
          setorDestino,
          dataInicio,
          dataFim,
          status,
          colaborador,
          modelo
        }
      });
      setMovimentacoes(response.data);
    } catch (error) {
      setError('Erro ao carregar as movimentações.');
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = debounce(fetchMovimentacoes, 2000);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'setorOrigem') setSetorOrigem(value);
    if (name === 'setorDestino') setSetorDestino(value);
    if (name === 'dataInicio') setDataInicio(value);
    if (name === 'dataFim') setDataFim(value);
    if (name === 'status') setStatus(value);
    if (name === 'colaborador') setColaborador(value);
    if (name === 'modelo') setModelo(value);
    debouncedFetch();
  };

  useEffect(() => {
    fetchMovimentacoes();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>Consulta e Relatórios de Movimentações</Typography>
      
      {/* Filtros */}
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <TextField
            label="Setor de Origem"
            fullWidth
            name="setorOrigem"
            value={setorOrigem}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Setor de Destino"
            fullWidth
            name="setorDestino"
            value={setorDestino}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            type="date"
            label="Data Início"
            fullWidth
            name="dataInicio"
            value={dataInicio}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            type="date"
            label="Data Fim"
            fullWidth
            name="dataFim"
            value={dataFim}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Status"
            fullWidth
            name="status"
            value={status}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Colaborador"
            fullWidth
            name="colaborador"
            value={colaborador}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Modelo/Hostname"
            fullWidth
            name="modelo"
            value={modelo}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      
      {/* Exibindo a tabela de movimentações */}
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Snackbar open={!!error} autoHideDuration={6000}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      ) : (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data/Hora</TableCell>
                <TableCell>Setor de Origem</TableCell>
                <TableCell>Setor de Destino</TableCell>
                <TableCell>Nome do Colaborador</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Modelo/Hostname</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movimentacoes.map((movimentacao: any) => (
                <TableRow key={movimentacao.id}>
                  <TableCell>{new Date(movimentacao.dataHora).toLocaleString()}</TableCell>
                  <TableCell>{movimentacao.setorOrigem}</TableCell>
                  <TableCell>{movimentacao.setorDestino}</TableCell>
                  <TableCell>{movimentacao.nomeColaborador}</TableCell>
                  <TableCell>{movimentacao.status}</TableCell>
                  <TableCell>{movimentacao.modelo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default HistorialPage;

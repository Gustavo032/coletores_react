import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Grid, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, Alert } from '@mui/material';
import { debounce } from 'lodash';
import { api } from '../api';
import { format } from 'date-fns';

const HistorialPage: React.FC = () => {
  const [setorOrigem, setSetorOrigem] = useState('');
  const [dataInicio, setDataInicio] = useState<string>('');
  const [dataFim, setDataFim] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [colaborador, setColaborador] = useState('');
  const [modelo, setModelo] = useState('');
  const [movimentacoes, setMovimentacoes] = useState<any[]>([]);
  const [filteredMovimentacoes, setFilteredMovimentacoes] = useState<any[]>([]); // Estado para armazenar os dados filtrados
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Função para filtrar movimentações
  const filterMovimentacoes = () => {
    let filteredData = movimentacoes;

    // Quando todos os filtros estiverem vazios, mostramos todos os dados
    if (!setorOrigem && !dataInicio && !dataFim && !status && !colaborador && !modelo) {
        setFilteredMovimentacoes(movimentacoes);  // Exibe todos os dados
        return; // Não aplica mais filtros quando todos estão vazios
    }

    // Quando houver filtros, aplica-os
    if (setorOrigem) filteredData = filteredData.filter(item => item.setorOrigem?.nome.includes(setorOrigem));
    if (dataInicio) filteredData = filteredData.filter(item => new Date(item.dataMovimentacao) >= new Date(dataInicio));
    if (dataFim) filteredData = filteredData.filter(item => new Date(item.dataMovimentacao) <= new Date(dataFim));
    if (status) filteredData = filteredData.filter(item => item.status.includes(status));
    if (colaborador) filteredData = filteredData.filter(item => item.nomeColaborador.includes(colaborador));

    // Filtro para Modelo/Hostname
    if (modelo) {
        filteredData = filteredData.filter(item => {
            const modeloHostname = `${item.coletor?.modelo} ${item.coletor?.hostname}`;
            return modeloHostname.toLowerCase().includes(modelo.toLowerCase());
        });
    }

    // Atualiza a lista filtrada
    setFilteredMovimentacoes(filteredData);
};

	

  const fetchMovimentacoes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/movimentacoes');
      setMovimentacoes(response.data); // Armazena todos os dados
      setFilteredMovimentacoes(response.data); // Inicialmente, os dados filtrados são todos os dados
    } catch (error) {
      setError('Erro ao carregar as movimentações.');
    } finally {
      setLoading(false);
    }
  };

  const debouncedFilter = debounce(filterMovimentacoes, 2000); // Função de filtro com debounce

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name === 'setorOrigem') setSetorOrigem(value);
		if (name === 'dataInicio') setDataInicio(value);
		if (name === 'dataFim') setDataFim(value);
		if (name === 'status') setStatus(value);
		if (name === 'colaborador') setColaborador(value);
		if (name === 'modelo') setModelo(value);
	
		debouncedFilter(); // Chama a função de filtro após debounce
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
                <TableCell>Nome do Colaborador</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Modelo/Hostname</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMovimentacoes.map((movimentacao: any) => (
                <TableRow key={movimentacao.id}>
                  <TableCell>{format(new Date(movimentacao.dataMovimentacao), 'dd/MM/yyyy HH:mm')}</TableCell>
                  <TableCell>{movimentacao.setorOrigem?.nome}</TableCell>
                  <TableCell>{movimentacao.nomeColaborador}</TableCell>
                  <TableCell>{movimentacao.status}</TableCell>
                  <TableCell>{movimentacao.coletor?.modelo + "/" + movimentacao.coletor?.hostname }</TableCell>
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

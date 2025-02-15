import React, { useState, useEffect } from 'react';
import { Box, TextField, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Alert, Snackbar, Button, IconButton, TableSortLabel } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { api } from '../api';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HistorialPage: React.FC = () => {
  const navigate = useNavigate();
  const [setorOrigem, setSetorOrigem] = useState('');
  const { user, loading: loadingUser } = useAuth();  // Pegando as informações do usuário


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
      if (setorOrigem) params.setorOrigem = setorOrigem;
      if (dataInicio) params.dataInicio = dataInicio; // Verifique se está no formato correto
      if (dataFim) params.dataFim = dataFim; // Verifique se está no formato correto
      if (status) params.status = status;
      if (colaborador) params.nomeColaborador = colaborador;
      if (hostname) params.hostname = hostname;
  
      console.log("Parametros da requisição:", params); // Adicionei um log aqui para inspecionar os parâmetros
  
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
  
  useEffect(() => {
    if (loadingUser) return;  // Espera carregar as informações do usuário

    if (!user || !['admin', 'fullAdmin', 'user'].includes(user.role)) {
      // Se o usuário não estiver logado ou não for admin/fullAdmin/user, redireciona para outra página
      navigate('/not-authorized');  // Redireciona para uma página de "Não autorizado"
    }
  }, [user, loadingUser, navigate]);

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

  // Função para calcular a diferença em horas
  const diffInHours = (date: Date) => {
    const now = new Date();
    return Math.abs(now.getTime() - new Date(date).getTime()) / (1000 * 3600);
  };

  // Função para agrupar movimentações de "retirado" e "entregue" com base em movimentacaoReferenciaId
  const groupMovimentacoes = () => {
    const groupedMovimentacoes: any = [];

    movimentacoes.forEach((mov) => {
      if (mov.movimentacaoReferenciaId) {
        const reference = groupedMovimentacoes.find((item: any) => item.id === mov.movimentacaoReferenciaId);
        if (reference) {
          reference.entregue = mov;
        }
      } else {
        groupedMovimentacoes.push({ id: mov.id, retirado: mov });
      }
    });

    return groupedMovimentacoes;
  };

  // Variáveis para contagens
  const entregues = movimentacoes.filter((mov) => mov.status === 'entregue').length;
  const totalMovimentacoes = movimentacoes.length - entregues;

  // Coletores ausentes (retirado há mais de 8 horas)
  const ausentes = movimentacoes.filter((mov) => mov.status === 'retirado' && diffInHours(mov.dataMovimentacao) > 8).length - entregues;

  // Coletores em uso (retirado há menos de 8 horas)
  const emUso = movimentacoes.filter((mov) => mov.status === 'retirado' && diffInHours(mov.dataMovimentacao) <= 8).length;

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
          <TextField label="Setor" value={setorOrigem} onChange={(e) => setSetorOrigem(e.target.value)} sx={{ width: { xs: '100%', sm: '48%', md: '30%' } }} />
          <TextField type="date" label="Data Início" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ width: { xs: '100%', sm: '48%', md: '30%' } }} />
          <TextField type="date" label="Data Fim" value={dataFim} onChange={(e) => setDataFim(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ width: { xs: '100%', sm: '48%', md: '30%' } }} />
          {/* <TextField label="Status" value={status} onChange={(e) => setStatus(e.target.value)} sx={{ width: { xs: '100%', sm: '48%', md: '30%' } }} /> */}
          <TextField label="Colaborador" value={colaborador} onChange={(e) => setColaborador(e.target.value)} sx={{ width: { xs: '100%', sm: '48%', md: '30%' } }} />
          <TextField label="Hostname" value={hostname} onChange={(e) => setHostname(e.target.value)} sx={{ width: { xs: '100%', sm: '48%', md: '30%' } }} />
        </Box>

        <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
          <Typography variant="h6" color="black">
            Total de Movimentações: {totalMovimentacoes}
          </Typography>
          <Typography variant="body1" color="black">
            Coletores Entregues: {entregues} | Coletores Ausentes: {ausentes} | Coletores em Uso: {emUso}
          </Typography>
        </Box>

        {/* Legenda de Cores */}
        <Box sx={{ marginBottom: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="blacks" alignItems={"center"} textAlign={"center"}>
            <Box sx={{ display: 'inline-block', backgroundColor: '#00d60066', width: '20px', height: '20px', marginRight: '10px' }} />
            Verde: Movimentação Entregue
            <Box sx={{ display: 'inline-block', backgroundColor: '#ffeb3b', width: '20px', height: '20px', marginLeft: '20px', marginRight: '10px' }} />
            Amarelo: Retirada realizada há mais de 8 horas
            <Box sx={{ display: 'inline-block', backgroundColor: '#fff', width: '20px', height: '20px', marginLeft: '20px', marginRight: '10px' }} />
            branco: Movimentação recente
          </Typography>
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
                  {[{ label: 'Data/Hora', key: 'dataMovimentacao' }, { label: 'Setor', key: 'setorOrigem.nome' }, { label: 'Nome do Colaborador', key: 'nomeColaborador' }, { label: 'Status', key: 'status' }, { label: 'Hostname', key: 'coletor.hostname' }].map((col) => (
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
                {groupMovimentacoes().map((movimentacao: any) => {
                  const rowStyle = movimentacao.entregue
                    ? { backgroundColor: '#00d60066' }
                    : diffInHours(movimentacao.retirado.dataMovimentacao) > 8
                    ? { backgroundColor: '#ffeb3b' }
                    : { backgroundColor: '#fffff' };

                  return (
                    <TableRow key={movimentacao.id} sx={rowStyle}>
                      <TableCell>
                        {format(new Date(movimentacao.retirado.dataMovimentacao), 'dd/MM/yyyy HH:mm')} 
                        {movimentacao.entregue &&  <><br /><br /> {format(new Date(movimentacao.entregue.dataMovimentacao), 'dd/MM/yyyy HH:mm')}</>}
                      </TableCell>
                      <TableCell>
                        {movimentacao.retirado.setorOrigem?.nome} 
                        {movimentacao.entregue && <><br /><br /> {movimentacao.entregue.setorOrigem?.nome}</>}
                      </TableCell>
                      <TableCell>
                        {movimentacao.retirado.nomeColaborador} 
                        {movimentacao.entregue && <><br /><br /> {movimentacao.entregue.nomeColaborador}</>}
                      </TableCell>
                      <TableCell>
                        {movimentacao.retirado.status} 
                        {movimentacao.entregue &&  <><br /><br /> {movimentacao.entregue.status}</>}
                      </TableCell>
                      <TableCell>
                        {movimentacao.retirado.coletor?.hostname}
                        {movimentacao.entregue && <><br /><br />{movimentacao.entregue.coletor?.hostname}</>}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default HistorialPage;

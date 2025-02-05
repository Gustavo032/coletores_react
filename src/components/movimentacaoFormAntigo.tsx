  import React, { useState, useEffect } from 'react';
  import { TextField, Button, Box, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, Typography, Snackbar, Alert, Paper, IconButton } from '@mui/material';
  import { api } from '../api';
  import { useAuth } from '../hooks/useAuth';
  import { getUser } from '../services/authService';
  import { ArrowBack } from '@mui/icons-material';
  import { useNavigate } from 'react-router-dom';

  interface MovimentacaoFormProps {
    setorOrigem: string;
  }

  const MovimentacaoFormAntigo: React.FC<MovimentacaoFormProps> = ({ setorOrigem }) => {
    const [tipo, setTipo] = useState<string>('normal');
    const [modelo, setModelo] = useState<string>('CT45');
    const [coletorId, setcoletorId] = useState<number | string>('');
    const [nomeColaborador, setNomeColaborador] = useState<string>('');
    const [hostname, setHostname] = useState<string>('');
    const [acao, setAcao] = useState<string>('Retirar');
    const [erro, setErro] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    const gerarHostname = (tipo: string, modelo: string, id: string) => {
      if (modelo === 'CT45') {
        return tipo === 'aud' ? `gfl_ct45_aud_${id}-CT45` : `gfl_ct45_${id}-CT45`;
      } else if (modelo === 'TC22') {
        return tipo === 'aud' ? `gfl_tc22_aud_${id}-TC22` : `gfl_tc22_${id}-TC22`;
      }
      return '';
    };

    useEffect(() => {
      if (coletorId) {
        setHostname(gerarHostname(tipo, modelo, String(coletorId)));
      }
    }, [tipo, modelo, coletorId]);

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      setIsLoading(true);
      const user = await getUser();
      const acaoFormatada = acao === 'Retirar' ? 'retirado' : 'entregue';

      const data = {
        coletorId,
        nomeColaborador,
        hostname,
        acao: acaoFormatada,
        setorOrigemId: user?.user?.sectorId
      };

      try {
        const response = await api.post('/movimentacoesOld', data);
        alert('Movimentação registrada com sucesso!');
        setcoletorId('');
        setNomeColaborador('');
        setErro('');
      } catch (error: any) {
        setErro(error.response?.data?.message || 'Erro ao registrar movimentação');
      } finally {
        setIsLoading(false);
      }
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
        <Paper elevation={4} sx={{ padding: 4, borderRadius: 3, backdropFilter: 'blur(8px)', maxWidth: 500 }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#333' }}>
            Cadastro de Movimentação
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <FormControl component="fieldset" fullWidth margin="normal">
              <FormLabel component="legend">Tipo de Coletor</FormLabel>
              <RadioGroup row value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <FormControlLabel value="normal" control={<Radio />} label="Normal" />
                <FormControlLabel value="aud" control={<Radio />} label="Auditoria" />
              </RadioGroup>
            </FormControl>

            <FormControl component="fieldset" fullWidth margin="normal">
              <FormLabel component="legend">Modelo</FormLabel>
              <RadioGroup row value={modelo} onChange={(e) => setModelo(e.target.value)}>
                <FormControlLabel value="CT45" control={<Radio />} label="CT45" />
                <FormControlLabel value="TC22" control={<Radio />} label="TC22" />
              </RadioGroup>
            </FormControl>

            <TextField label="ID do Coletor" variant="outlined" fullWidth margin="normal" value={coletorId} onChange={(e) => setcoletorId(e.target.value)} required />
            <TextField label="Nome do Colaborador" variant="outlined" fullWidth margin="normal" value={nomeColaborador} onChange={(e) => setNomeColaborador(e.target.value)} required />
            <TextField label="Hostname" variant="outlined" fullWidth margin="normal" value={hostname} InputProps={{ readOnly: true }} />

            <FormControl component="fieldset" fullWidth margin="normal">
              <FormLabel component="legend">Ação</FormLabel>
              <RadioGroup row value={acao} onChange={(e) => setAcao(e.target.value)}>
                <FormControlLabel value="Retirar" control={<Radio />} label="Retirar" />
                <FormControlLabel value="Entregar" control={<Radio />} label="Entregar" />
              </RadioGroup>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, fontWeight: 'bold', backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
              disabled={isLoading || !coletorId || !nomeColaborador}
            >
              {isLoading ? 'Carregando...' : 'Registrar Movimentação'}
            </Button>
          </Box>

          <Snackbar open={!!erro} autoHideDuration={6000} onClose={() => setErro('')}>
            <Alert severity="error" onClose={() => setErro('')}>
              {erro}
            </Alert>
          </Snackbar>
        </Paper>
      </Box>
    );
  };

  export default MovimentacaoFormAntigo;

import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const EscolhaAcao: React.FC<{ onSelect: (acao: string) => void }> = ({ onSelect }) => (
  <Box sx={{ textAlign: 'center' }}>
    <Typography variant="h5" gutterBottom>Selecione a ação:</Typography>
    <Button variant="contained" color="primary" onClick={() => onSelect('Retirar')} sx={{ mr: 2 }}>Retirar</Button>
    <Button variant="contained" color="secondary" onClick={() => onSelect('Entregar')}>Entregar</Button>
  </Box>
);

const EntradaUUID: React.FC<{ 
  titulo: string, 
  onNext: (uuid: string) => void, 
  erro: string, 
  setErro: (erro: string) => void, 
  tipo: 'user' | 'coletor' 
}> = ({ titulo, onNext, erro, setErro, tipo }) => {
  const [uuid, setUuid] = useState('');
  const [loading, setLoading] = useState(false);

  const validarUUID = async () => {
    if (uuid.trim().length !== 36) {
      setErro('UUID inválido. Verifique e tente novamente.');
      return;
    }

    setLoading(true);
    try {
      await api.get(`/${tipo === 'user' ? 'users' : 'coletores'}/validate/${uuid}`);
      setErro('');
      onNext(uuid);
    } catch (error: any) {
      setErro(error.response?.data?.message || `UUID inválido. Verifique e tente novamente.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>{titulo}</Typography>
      <TextField
        label="UUID"
        variant="outlined"
        fullWidth
        margin="normal"
        value={uuid}
        onChange={(e) => setUuid(e.target.value)}
      />
      <Button 
        variant="contained" 
        color="primary" 
        onClick={validarUUID} 
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Confirmar'}
      </Button>
      {erro && <Typography color="error">{erro}</Typography>}
    </Box>
  );
};

const Movimentacao: React.FC = () => {
  const [etapa, setEtapa] = useState(1);
  const [acao, setAcao] = useState('');
  const [usuarioUUID, setUsuarioUUID] = useState('');
  const [coletorUUID, setColetorUUID] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleAcaoSelecionada = (acaoSelecionada: string) => {
    setAcao(acaoSelecionada);
    setEtapa(2);
  };

  const handleUsuarioUUID = (uuid: string) => {
    setUsuarioUUID(uuid);
    setEtapa(3);
  };

  const handleColetorUUID = async (uuid: string) => {
    setColetorUUID(uuid);

    try {
      await api.post('/movimentacoes', {
        user_uuid: usuarioUUID,
        coletor_uuid: uuid,
        acao
      });

      setErro('');
      setEtapa(4);
      setTimeout(() => navigate('/home'), 3000);
    } catch (error: any) {
      setErro(error.response?.data?.message || 'Erro ao criar movimentação.');
    }
  };

  return (
    <Box sx={{ 
      padding: 3, 
      background: 'linear-gradient(135deg, #007aff, #00c4b4)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Paper elevation={4} sx={{ padding: 4, borderRadius: 3, maxWidth: 400, textAlign: 'center' }}>
        {etapa === 1 && <EscolhaAcao onSelect={handleAcaoSelecionada} />}
        {etapa === 2 && <EntradaUUID titulo="Escaneie o crachá do usuário" onNext={handleUsuarioUUID} erro={erro} setErro={setErro} tipo="user" />}
        {etapa === 3 && <EntradaUUID titulo="Escaneie o código do coletor" onNext={handleColetorUUID} erro={erro} setErro={setErro} tipo="coletor" />}
        {etapa === 4 && <Typography variant="h5" color="success">Movimentação concluída!</Typography>}
      </Paper>
    </Box>
  );
};

export default Movimentacao;

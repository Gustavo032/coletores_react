import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, CircularProgress, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { ArrowBack } from '@mui/icons-material';

const EscolhaAcao: React.FC<{    erro: string, 
  setErro: (erro: string) => void,  onSelect: (acao: string) => void }> = ({ onSelect, erro, setErro }) => (
  <Box sx={{ textAlign: 'center' }}>
    <Typography variant="h5" gutterBottom>Selecione a ação:</Typography>
    <Button variant="contained" color="primary" onClick={() => {setErro(''); onSelect('Retirar')}} sx={{ mr: 2 }}>Retirar</Button>
    <Button variant="contained" color="secondary" onClick={() => {setErro(''); onSelect('Entregar')}}>Entregar</Button>
    {erro && <Typography marginTop="2rem  " color="error">{erro}</Typography>}
    </Box>
);

const EntradaUUID: React.FC<{ 
    titulo: string, 
    onNext: (uuid: string) => void, 
    erro: string, 
    setErro: (erro: string) => void, 
    tipo: 'user' | 'coletor' ,
    setEtapa: (etaoa: number) => void, 

  }> = ({ titulo, onNext, erro, setErro, tipo, setEtapa }) => {
  const [uuid, setUuid] = useState('');
  const [loading, setLoading] = useState(false);

  const validarUUID = async () => {
    if (uuid.trim().length !== 36) {
      setErro('UUID inválido. Verifique e tente novamente.');
      setEtapa(1)

      return;
    }

    setLoading(true);
    try {
      await api.get(`/${tipo === 'user' ? 'users' : 'coletores'}/validate/${uuid}`);
      setErro('');
      onNext(uuid);
    } catch (error: any) {
      setErro("Erro ao validar UUID: " + error.response?.data?.message  || `UUID inválido. Verifique e tente novamente.`);
      setUuid(''); // Reseta o valor do input em caso de erro
      
      setEtapa(1)
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Se o usuário pressionar "Enter", validamos o UUID
    if (event.key === 'Enter') {
      validarUUID();
    }
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>{titulo}</Typography>
      <TextField
        autoFocus={true}
        label="UUID"
        variant="outlined"
        fullWidth
        margin="normal"
        value={uuid}
        onChange={(e) => setUuid(e.target.value)}
        onKeyDown={handleKeyDown}  // Adicionando o evento de tecla
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
  <>
    <IconButton onClick={() => navigate('/home')} sx={{  position:"absolute",  top:"2rem", left:"2rem", alignSelf: 'flex-start', color: 'white' }}>
      <ArrowBack fontSize="large" />
    </IconButton>

    <Box sx={{ 
      padding: 3, 
      background: 'linear-gradient(135deg, #007aff, #00c4b4)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      
      <Paper elevation={4} sx={{ padding: 4, borderRadius: 3, maxWidth: 400, textAlign: 'center' }}>
        {etapa === 1 && <EscolhaAcao onSelect={handleAcaoSelecionada} erro={erro} setErro={setErro} />}
        {etapa === 2 && <EntradaUUID titulo="Escaneie o crachá do usuário" onNext={handleUsuarioUUID} erro={erro} setErro={setErro}  setEtapa={setEtapa} tipo="user" />}
        {etapa === 3 && <EntradaUUID titulo="Escaneie o código do coletor" onNext={handleColetorUUID} erro={erro} setErro={setErro} setEtapa={setEtapa} tipo="coletor" />}
        {etapa === 4 && <Typography variant="h5" color="success">Movimentação concluída!</Typography>}
      </Paper>
    </Box>
  </>
  );

  
};

export default Movimentacao;

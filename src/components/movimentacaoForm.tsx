// src/components/MovimentacaoForm.tsx

import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, Typography, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

interface MovimentacaoFormProps {
  setorOrigem: string; // Setor de origem do usuário, passado pelo JWT
}

const MovimentacaoForm: React.FC<MovimentacaoFormProps> = ({ setorOrigem }) => {
  const [tipo, setTipo] = useState<string>('normal'); // Tipo do coletor: normal ou aud
  const [modelo, setModelo] = useState<string>('CT45'); // Modelo do coletor: CT45 ou TC22
  const [idColetor, setIdColetor] = useState<number | string>(''); // ID do coletor
  const [nomeColaborador, setNomeColaborador] = useState<string>(''); // Nome do colaborador
  const [hostname, setHostname] = useState<string>(''); // Hostname gerado
  const [acao, setAcao] = useState<string>('Retirar'); // Ação: Retirar ou Entregar
  const [erro, setErro] = useState<string>(''); // Mensagem de erro
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Função para gerar o hostname com base no tipo, modelo e ID
  const gerarHostname = (tipo: string, modelo: string, id: string) => {
    if (modelo === 'CT45') {
      return tipo === 'aud' ? `gfl_ct45_aud_${id}-CT45` : `gfl_ct45_${id}-CT45`;
    } else if (modelo === 'TC22') {
      return tipo === 'aud' ? `gfl_tc22_aud_${id}-TC22` : `gfl_tc22_${id}-TC22`;
    }
    return '';
  };

  // Atualiza o hostname sempre que o tipo, modelo ou ID mudar
  useEffect(() => {
    if (idColetor) {
      setHostname(gerarHostname(tipo, modelo, String(idColetor)));
    }
  }, [tipo, modelo, idColetor]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const data = {
      setorOrigem,
      tipo,
      modelo,
      idColetor,
      nomeColaborador,
      hostname,
      acao
    };

    try {
      const response = await axios.post('http://localhost:5000/api/movimentacoes', data);
      // Redirecionar ou exibir sucesso
      alert('Movimentação registrada com sucesso!');
      // Limpar campos após sucesso
      setIdColetor('');
      setNomeColaborador('');
      setErro('');
    } catch (error: any) {
      setErro(error.response?.data?.message || 'Erro ao registrar movimentação');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">Cadastro de Movimentação</Typography>
      
      {/* Tipo de Coletor */}
      <FormControl component="fieldset" fullWidth margin="normal">
        <FormLabel component="legend">Tipo de Coletor</FormLabel>
        <RadioGroup row value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <FormControlLabel value="normal" control={<Radio />} label="Normal" />
          <FormControlLabel value="aud" control={<Radio />} label="Auditoria" />
        </RadioGroup>
      </FormControl>

      {/* Modelo */}
      <FormControl component="fieldset" fullWidth margin="normal">
        <FormLabel component="legend">Modelo</FormLabel>
        <RadioGroup row value={modelo} onChange={(e) => setModelo(e.target.value)}>
          <FormControlLabel value="CT45" control={<Radio />} label="CT45" />
          <FormControlLabel value="TC22" control={<Radio />} label="TC22" />
        </RadioGroup>
      </FormControl>

      {/* ID do Coletor */}
      <TextField
        label="ID do Coletor"
        variant="outlined"
        fullWidth
        margin="normal"
        value={idColetor}
        onChange={(e) => setIdColetor(e.target.value)}
        required
      />

      {/* Nome do Colaborador Responsável */}
      <TextField
        label="Nome do Colaborador"
        variant="outlined"
        fullWidth
        margin="normal"
        value={nomeColaborador}
        onChange={(e) => setNomeColaborador(e.target.value)}
        required
      />

      {/* Hostname gerado */}
      <TextField
        label="Hostname"
        variant="outlined"
        fullWidth
        margin="normal"
        value={hostname}
        InputProps={{
          readOnly: true,
        }}
      />

      {/* Ação: Retirar ou Entregar */}
      <FormControl component="fieldset" fullWidth margin="normal">
        <FormLabel component="legend">Ação</FormLabel>
        <RadioGroup row value={acao} onChange={(e) => setAcao(e.target.value)}>
          <FormControlLabel value="Retirar" control={<Radio />} label="Retirar" />
          <FormControlLabel value="Entregar" control={<Radio />} label="Entregar" />
        </RadioGroup>
      </FormControl>

      {/* Botão de envio */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={isLoading || !idColetor || !nomeColaborador}
      >
        {isLoading ? 'Carregando...' : 'Registrar Movimentação'}
      </Button>

      {/* Exibindo erro caso haja */}
      <Snackbar open={!!erro} autoHideDuration={6000} onClose={() => setErro('')}>
        <Alert severity="error" onClose={() => setErro('')}>
          {erro}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MovimentacaoForm;

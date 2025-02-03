import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress, Box, FormControl, InputLabel, Select, MenuItem, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { api } from '../api';

interface AddEditColetorModalProps {
  mode: 'add' | 'edit';
  coletor?: any; // Coletor data when in edit mode
  sectors: any[]; // List of sectors
  onClose: (updatedColetor: any | null) => void; // Callback to handle the result
}

const AddEditColetorModal: React.FC<AddEditColetorModalProps> = ({ mode, coletor, sectors, onClose }) => {
  // Definindo estados para cada campo do formulário
  const [tipo, setTipo] = useState<string>('normal');
  const [modelo, setModelo] = useState<string>('CT45');
  const [setorId, setSetorId] = useState<number>(1);
  const [coletorId, setColetorId] = useState<number | string>('');
  const [hostnameId, setHostnameId] = useState<number | string>('');
  const [hostname, setHostname] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && coletor) {
      // Regex ajustada para capturar tanto o caso com 'aud' quanto o caso sem 'aud'
      const tipoRegex = /gfl_(ct45|tc22)_(aud_)?(\d+)-([A-Za-z0-9]+)/;
      const tipoMatch = coletor.hostname.match(tipoRegex);
  
      if (tipoMatch) {
        // Se for 'aud', então é tipo 'auditoria', caso contrário, tipo 'normal'
        const tipoExtraido = tipoMatch[2] === 'aud_' ? 'aud' : 'normal';
        setTipo(tipoExtraido);
  
        // O modelo deve ser ajustado conforme o hostname, convertendo para maiúsculo
        const modeloExtraido = tipoMatch[1].toUpperCase(); // ct45 ou tc22
        setModelo(modeloExtraido);
        console.log('Modelo extraído:', modeloExtraido);
  
        // Extrair o ID do hostname (posição 3 no match, que é o número após '_aud_' ou '_')
        const idExtraido = tipoMatch[3];
        console.log('ID extraído:', idExtraido);
        setHostnameId(idExtraido); // Atualiza o ID do coletor com o ID extraído do hostname
      } else {
        // Caso o hostname não siga o formato esperado, definimos valores padrões
        setTipo('normal');
        setModelo('CT45');
        setHostnameId(''); // ID vazio
      }
  
      // Atribuindo valores ao setor e hostname
      setSetorId(coletor.setorId || 1);  // Garantindo que setorId tenha um valor
      setHostname(coletor.hostname); // Preenche o hostname com o valor do coletor editado
    }
  }, [mode, coletor]);
  
  

  
  // Função para gerar o hostname dinamicamente
  const gerarHostname = (tipo: string, modelo: string, id: string) => {
    if (modelo === 'CT45') {
      return tipo === 'aud' ? `gfl_ct45_aud_${hostnameId}-CT45` : `gfl_ct45_${hostnameId}-CT45`;
    } else if (modelo === 'TC22') {
      return tipo === 'aud' ? `gfl_tc22_aud_${hostnameId}-TC22` : `gfl_tc22_${hostnameId}-TC22`;
    }
    return '';
  };

  // Atualiza o hostname toda vez que o tipo, modelo ou ID do coletor mudar
  useEffect(() => {
    if (hostnameId) {
      setHostname(gerarHostname(tipo, modelo, String(hostnameId)));
    }
  }, [tipo, modelo, hostnameId]);

  // Função para manipulação do envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSend = {
        modelo, 
        tipo,
        hostname,
        setorId
      };

      if (mode === 'add') {
        const response = await api.post('/coletores', dataToSend);
        onClose(response.data.coletor);
      } else if (mode === 'edit' && coletor) {
        const response = await api.put(`/coletores/${coletor.id}`, dataToSend);
        onClose(response.data.coletor);
      }
    } catch (err) {
      setError('Erro ao salvar coletor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onClose={() => onClose(null)} maxWidth="xs" fullWidth>
      <DialogTitle>{mode === 'add' ? 'Adicionar Coletor' : 'Editar Coletor'}</DialogTitle>
      <DialogContent>
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
            <RadioGroup row name="modelo" value={modelo} onChange={(e) => setModelo(e.target.value)}>
              <FormControlLabel value="CT45" control={<Radio />} label="CT45" />
              <FormControlLabel value="TC22" control={<Radio />} label="TC22" />
            </RadioGroup>
          </FormControl>

        
          <TextField
            label="ID do Coletor"
            variant="outlined"
            fullWidth
            margin="normal"
            value={hostnameId} // Agora vai mostrar o ID extraído do hostname
            onChange={(e) => setHostnameId(e.target.value)} // Atualiza o valor no estado
            required
          />

          <TextField 
            name="hostname" 
            label="Hostname" 
            variant="outlined" 
            fullWidth 
            margin="normal" 
            value={hostname} 
            InputProps={{ readOnly: true }} 
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Setor</InputLabel>
            <Select
              name="setor_id"
              value={setorId}
              onChange={(e) => setSetorId(Number(e.target.value))}
              label="Setor"
            >
              {sectors.map((sector) => (
                <MenuItem key={sector.id} value={sector.id}>
                  {sector.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {error && <Box sx={{ marginTop: 2 }}><p style={{ color: 'red' }}>{error}</p></Box>}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, fontWeight: 'bold', backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
            disabled={isLoading || !hostnameId}
          >
            {isLoading ? 'Carregando...' : 'Salvar'}
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(null)} variant="outlined" color="secondary">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditColetorModal;

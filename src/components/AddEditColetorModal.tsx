import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { api } from '../api';

interface AddEditColetorModalProps {
  mode: 'add' | 'edit';
  coletor?: any; // Coletor data when in edit mode
  sectors: any[]; // List of sectors
  onClose: (updatedColetor: any | null) => void; // Callback to handle the result
}

const AddEditColetorModal: React.FC<AddEditColetorModalProps> = ({ mode, coletor, sectors, onClose }) => {
  const [formData, setFormData] = useState<{ modelo: string; tipo: string; coletorId: string; hostname: string; setor_id: string }>({
    modelo: '',
    tipo: 'normal', // Definido como normal por padrão
    coletorId: '',
    hostname: '',
    setor_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && coletor) {
      setFormData({
        modelo: coletor.modelo,
        tipo: coletor.tipo,
        coletorId: coletor.coletorId,
        hostname: coletor.hostname,
        setor_id: coletor.setorId || '',
      });
    }
  }, [mode, coletor]);

  const gerarHostname = (tipo: string, modelo: string, id: string) => {
    if (modelo === 'CT45') {
      return tipo === 'aud' ? `gfl_ct45_aud_${id}-CT45` : `gfl_ct45_${id}-CT45`;
    } else if (modelo === 'TC22') {
      return tipo === 'aud' ? `gfl_tc22_aud_${id}-TC22` : `gfl_tc22_${id}-TC22`;
    }
    return '';
  };

  useEffect(() => {
    if (formData.coletorId) {
      const generatedHostname = gerarHostname(formData.tipo, formData.modelo, formData.coletorId);
      setFormData((prevData) => ({
        ...prevData,
        hostname: generatedHostname,
      }));
    }
  }, [formData.tipo, formData.modelo, formData.coletorId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSend = {
        ...formData,
        hostname: formData.hostname, // Garantindo que o hostname esteja no formato correto
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
        <form onSubmit={handleSubmit}>
          <TextField
            label="Modelo"
            name="modelo"
            value={formData.modelo}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Tipo de Coletor</InputLabel>
            <Select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              label="Tipo de Coletor"
            >
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="aud">Auditoria</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="ID do Coletor"
            name="coletorId"
            value={formData.coletorId}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Hostname"
            name="hostname"
            value={formData.hostname}
            InputProps={{ readOnly: true }}
            fullWidth
            margin="normal"
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Setor</InputLabel>
            <Select
              value={formData.setor_id}
              onChange={(e) => setFormData({ ...formData, setor_id: e.target.value })}
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
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(null)} variant="outlined" color="secondary">
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditColetorModal;

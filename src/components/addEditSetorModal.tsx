import React, { useState, useEffect } from 'react';
import { TextField, Button, CircularProgress, Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { api } from '../api';

interface AddEditSetorModalProps {
  mode: 'add' | 'edit';
  setor?: any;
  onClose: (updatedSetor: any | null) => void;
}

const AddEditSetorModal: React.FC<AddEditSetorModalProps> = ({ mode, setor, onClose }) => {
  const [formData, setFormData] = useState<{ nome: string; descricao: string }>({
    nome: '',
    descricao: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && setor) {
      setFormData({
        nome: setor.nome,
        descricao: setor.descricao
      });
    }
  }, [mode, setor]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'add') {
        const response = await api.post('/sectors', formData);
        onClose(response.data);
      } else if (mode === 'edit' && setor) {
        const response = await api.put(`/sectors/${setor.id}`, formData);
        onClose(response.data);
      }
    } catch (err) {
      setError('Erro ao salvar setor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={true}
      onClose={() => onClose(null)} // Fechar ao clicar fora
      maxWidth="xs"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
        },
      }}
    >
      <DialogTitle sx={{ color: '#1e3d58', fontWeight: 'bold' }}>
        {mode === 'add' ? 'Adicionar Setor' : 'Editar Setor'}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
            sx={{
              '& .MuiInputLabel-root': { color: '#1e3d58' },
              '& .MuiInputBase-root': { backgroundColor: '#f1f9fe', borderRadius: '8px' },
              '& .MuiInputBase-root:focus': { borderColor: '#1e3d58' },
              '& .MuiOutlinedInput-root': { borderColor: '#1e3d58' },
            }}
          />
          <TextField
            label="Descrição"
            name="descricao"
            value={formData.descricao}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
            sx={{
              '& .MuiInputLabel-root': { color: '#1e3d58' },
              '& .MuiInputBase-root': { backgroundColor: '#f1f9fe', borderRadius: '8px' },
              '& .MuiInputBase-root:focus': { borderColor: '#1e3d58' },
              '& .MuiOutlinedInput-root': { borderColor: '#1e3d58' },
            }}
          />
          {error && (
            <Box sx={{ marginTop: 2 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onClose(null)}
          variant="outlined"
          color="secondary"
          sx={{
            borderRadius: '20px',
            padding: '10px 20px',
            textTransform: 'none',
          }}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{
            backgroundColor: '#1e3d58',
            '&:hover': { backgroundColor: '#00608c' },
            borderRadius: '20px',
            padding: '10px 20px',
            textTransform: 'none',
          }}
          onClick={handleSubmit}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditSetorModal;

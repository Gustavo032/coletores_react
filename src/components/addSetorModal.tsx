import React, { useState } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import { api } from '../api';

interface AddSetorModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddSetorModal: React.FC<AddSetorModalProps> = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<{ nome: string; descricao: string }>({
    nome: '',
    descricao: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post('/sectors', formData);
      onSuccess(); // Chama a função de sucesso para atualizar a lista
      onClose();
    } catch (err) {
      setError('Erro ao adicionar setor.');
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-add-setor" aria-describedby="modal-add-setor-desc">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography id="modal-add-setor" variant="h6" component="h2" gutterBottom>
          Adicionar Setor
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Descrição"
            name="descricao"
            value={formData.descricao}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={onClose} sx={{ mr: 2 }} color="secondary">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Salvar'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddSetorModal;
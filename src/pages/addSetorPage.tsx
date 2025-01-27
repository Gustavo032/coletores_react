import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, CircularProgress, Box, Typography } from '@mui/material';
import { api } from '../api';

const AddSetorPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{ nome: string; descricao: string }>({
    nome: '',
    descricao: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      // Realiza a requisição POST para adicionar o setor
      await api.post('/sectors', formData);
      navigate('/setores');  // Redireciona para a página de setores após sucesso
    } catch (err) {
      setError('Erro ao adicionar setor.');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
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
          <Box sx={{ marginTop: 2 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddSetorPage;
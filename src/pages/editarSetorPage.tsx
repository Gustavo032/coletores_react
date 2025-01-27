import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, CircularProgress, Box, Typography } from '@mui/material';
import { api } from '../api';

const EditSetorPage = () => {
  const { id } = useParams();  // Obter o ID do setor da URL
  const navigate = useNavigate();
  const [sector, setSector] = useState<{ nome: string; descricao: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ nome: string; descricao: string }>({
    nome: '',
    descricao: ''
  });

  // Buscar os dados do setor
  useEffect(() => {
    const fetchSector = async () => {
      try {
        const response = await api.get(`/sectors/${id}`);
        setSector(response.data);
        setFormData({
          nome: response.data.nome,
          descricao: response.data.descricao
        });
        setLoading(false);
      } catch (err) {
        setError('Setor não encontrado.');
        setLoading(false);
      }
    };

    fetchSector();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.put(`/sectors/${id}`, formData);
      navigate('/setores');  // Redireciona para a página de setores após sucesso
    } catch (err) {
      setError('Erro ao atualizar setor.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Editar Setor
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
          <Button type="submit" variant="contained" color="primary">
            Salvar
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditSetorPage;

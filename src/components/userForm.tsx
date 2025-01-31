import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Typography, CircularProgress, Box, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { api } from '../api';

const UserForm = ({ isEditMode = false, userId = null }: any) => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    fullName: '',
    email: '',
    roles: '',
    sector_id: '',
  });
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isEditMode && userId) {
      api.get(`/users/search/${userId}`)
        .then(response => {
          const userData = response.data.user;
          setUser({
            ...userData,
            sector_id: userData.sectorId,
          });
          setLoading(false);
        })
        .catch(err => {
          setError('Erro ao carregar os dados do usuário.');
          setLoading(false);
        });
    }

    api.get('/sectors')
      .then(response => {
        setSectors(response.data);
      })
      .catch(err => {
        setError('Erro ao carregar setores.');
      });
  }, [isEditMode, userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requestMethod = isEditMode ? 'put' : 'post';
    const endpoint = isEditMode ? `/users/${userId}` : '/users';

    api[requestMethod](endpoint, user)
      .then(response => {
        setSuccessMessage(isEditMode ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
        navigate('/usuarios');
      })
      .catch(err => {
        setError('Erro ao salvar usuário.');
      });
  };

  const handleDelete = () => {
    if (userId) {
      api.delete(`/users/${userId}`)
        .then(response => {
          navigate('/usuarios');
        })
        .catch(err => {
          setError('Erro ao excluir usuário.');
        });
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        {isEditMode ? 'Editar Usuário' : 'Criar Usuário'}
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField 
          label="Nome Completo" 
          variant="outlined" 
          fullWidth 
          margin="normal" 
          name="fullName" 
          value={user.fullName} 
          onChange={handleChange} 
          required 
        />
        <TextField 
          label="Email" 
          variant="outlined" 
          fullWidth 
          margin="normal" 
          name="email" 
          type="email" 
          value={user.email} 
          onChange={handleChange} 
          required 
        />
        <TextField 
          label="Função" 
          variant="outlined" 
          fullWidth 
          margin="normal" 
          name="roles" 
          value={user.roles} 
          onChange={handleChange} 
          required 
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="sector-label">Setor</InputLabel>
          <Select
            labelId="sector-label"
            label="Setor"
            name="sector_id"
            value={user.sector_id}
            onChange={handleChange}
            required
          >
            {sectors.map(sector => (
              <MenuItem key={sector.id} value={sector.id}>
                {sector?.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
          {isEditMode ? 'Salvar Alterações' : 'Criar Usuário'}
        </Button>
        {isEditMode && (
          <Button 
            variant="contained" 
            color="secondary" 
            fullWidth 
            sx={{ marginTop: 2 }} 
            onClick={handleDelete}
          >
            Excluir Usuário
          </Button>
        )}
      </form>
    </Box>
  );
};

export default UserForm;

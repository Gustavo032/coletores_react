import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Typography, CircularProgress, Box, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { api } from '../api';

const EditUserPage = () => {
  const { userId } = useParams(); // Pegando o ID do usuário da URL
  const history = useNavigate();
  
  // Estados para armazenar os dados do usuário, setores e status da requisição
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

  // Função para buscar os dados do usuário a partir da API
  useEffect(() => {
		// Carrega os dados do usuário
		api.get(`/users/search/${userId}`)
			.then(response => {
				const userData = response.data.user;
				// Ajustando para pegar o 'id' correto do setor
				setUser({
					...userData, 
					sector_id: userData.sectorId // Usando 'sectorId' do usuário diretamente
				});
				setLoading(false);
			})
			.catch(err => {
				setError('Erro ao carregar os dados do usuário.');
				setLoading(false);
			});
	
		// Carrega os setores disponíveis
		api.get('/sectors')
			.then(response => {
				setSectors(response.data); // Assumindo que a resposta contém um array de setores
			})
			.catch(err => {
				setError('Erro ao carregar setores.');
			});
	}, [userId]);
		

  // Função para tratar as mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Função para enviar os dados do formulário para atualizar o usuário
  const handleSubmit = (e) => {
    e.preventDefault();
    
    api.put(`/users/${userId}`, user)
      .then(response => {
        setSuccessMessage('Usuário atualizado com sucesso!');
        history('/usuarios'); // Redireciona para a lista de usuários
      })
      .catch(err => {
        setError('Erro ao atualizar usuário.');
      });
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Editar Usuário
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
			value={user.sector_id} // Usando o 'sector_id' no value
			onChange={handleChange}
			required
		>
			{sectors.map(sector => (
				<MenuItem key={sector.id} value={sector.id}>
					{sector.nome}
				</MenuItem>
			))}
		</Select>
	</FormControl>


        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
          Salvar
        </Button>
      </form>
    </Box>
  );
};

export default EditUserPage;

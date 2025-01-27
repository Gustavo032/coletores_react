import React, { useEffect, useState } from 'react';
import { Button, Container, Grid2, Paper, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';  // Hook para pegar informações de usuário logado
import { api } from '../api';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, loading: userLoading } = useAuth();  // Pegando o usuário logado e o estado de carregamento do usuário
  const navigate = useNavigate();  // Usando useNavigate
  const token = localStorage.getItem('token');
  console.log('Token recuperado na UsuariosPage:', token);

  useEffect(() => {
    // Verifique se o usuário ainda está sendo carregado
    if (userLoading) return;

    console.log('Usuário na UsuariosPage:', user); // Adicionando mais informações

    // Converte o campo 'roles' para array se for uma string
    const roles = Array.isArray(user?.roles) ? user.roles : JSON.parse(user?.roles || '[]');

    // Checando as roles do usuário
    if (!user || (!roles.includes('fullAdmin') && !roles.includes('admin'))) {
      console.log('Redirecionando para unauthorized devido à role do usuário.');
      navigate('/unauthorized');
    } else {
      console.log('Usuário autorizado, carregando usuários...');
      api
        .get('/users', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUsuarios(response.data.users);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Erro ao carregar usuários:', error);
          setLoading(false);
        });
    }
  }, [user, userLoading, navigate]);

  const handleEditPermissions = (id: number) => {
    navigate(`/usuarios/editar/${id}`);
  };

  const handleChangePermissions = (id: number, permission: string) => {
    api.patch(`/users/${id}/permissions`, { permission })
      .then(() => {
        setUsuarios(usuarios.map(usuario => 
          usuario.id === id ? { ...usuario, role: permission } : usuario
        ));
      })
      .catch(error => {
        console.error('Erro ao alterar permissões:', error);
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Usuários
      </Typography>
      {loading ? (
        <Typography>Carregando usuários...</Typography>
      ) : (
        <Grid2 container spacing={2}>
          {usuarios.map(usuario => (
            <Grid2 key={usuario.id} size={{xs:12, sm:6, md:4}}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6">{usuario.nome}</Typography>
                <Typography variant="body2">Email: {usuario.email}</Typography>
                <FormControl fullWidth>
                  <InputLabel>Permissão</InputLabel>
                  <Select
                    value={usuario.role}
                    onChange={(e) => handleChangePermissions(usuario.id, e.target.value)}
                    label="Permissão"
                  >
                    <MenuItem value="admin">Administrador</MenuItem>
                    <MenuItem value="admin_setor">Administrador de Setor</MenuItem>
                    <MenuItem value="usuario">Usuário</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="outlined" color="primary" onClick={() => handleEditPermissions(usuario.id)}>Editar</Button>
              </Paper>
            </Grid2>
          ))}
        </Grid2>
      )}
    </Container>
  );
};

export default UsuariosPage;

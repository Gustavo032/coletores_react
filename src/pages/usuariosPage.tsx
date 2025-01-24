import React, { useEffect, useState } from 'react';
import { Button, Container, Grid2, Paper, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';  // Certifique-se de importar Grid2
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';  // Hook para pegar informações de usuário logado

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();  // Pegando o usuário logado
  const navigate = useNavigate();  // Usando useNavigate

  useEffect(() => {
    // Só permite que administradores vejam a página de usuários
    if (!user || user.role !== 'admin') {
      navigate('/unauthorized');  // Redireciona se o usuário não for administrador
    }
    
    axios.get('/usuarios')
      .then(response => {
        setUsuarios(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao carregar usuários:', error);
        setLoading(false);
      });
  }, [user, navigate]);

  const handleEditPermissions = (id: number) => {
    navigate(`/usuarios/editar/${id}`);
  };

  const handleChangePermissions = (id: number, permission: string) => {
    axios.patch(`/usuarios/${id}/permissions`, { permission })
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
        <Grid2 container spacing={2}>  {/* Mantendo Grid2 para o container */}
          {usuarios.map(usuario => (
            <Grid2 key={usuario.id} size={{xs:12, sm:6, md:4}}>  {/* Agora não precisa de "component" para esse Grid2 */}
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

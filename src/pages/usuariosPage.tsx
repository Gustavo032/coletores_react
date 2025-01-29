import React, { useEffect, useState } from 'react';
import { Button, Container, Grid, Paper, Typography, Box, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api';
import AddEditUserModal from '../components/addEditUserModal';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const { user, loading: userLoading } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (userLoading) return;
    if (token) {
      fetchUsuarios();
    } else {
      navigate('/login');
    }
  }, [userLoading]);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsuarios(response.data.users);
    } catch (error) {
      console.error('Erro ao buscar usuários', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setModalMode('add');
    setModalOpen(true);
  };

  const handleEditUser = (user: any) => {
    setModalMode('edit');
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleModalClose = (updatedUser: any | null) => {
    setModalOpen(false);
    if (updatedUser) {
      if (modalMode === 'add') {
        setUsuarios([...usuarios, updatedUser]);
      } else {
        setUsuarios(usuarios.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
      }
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
        <Button variant="contained" onClick={handleAddUser}>Adicionar Usuário</Button>
      </Box>
      <Grid container spacing={2}>
        {usuarios.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user.id}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">{user.fullName}</Typography>
              <Typography>{user.email}</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleEditUser(user)}
                sx={{ marginTop: 2 }}
              >
                Editar
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <AddEditUserModal
          mode={modalMode}
          user={selectedUser}
          onClose={handleModalClose}
        />
      </Modal>
    </Container>
  );
};

export default UsuariosPage;

import React, { useEffect, useState } from 'react';
import { Button, Container, Grid, Paper, Typography, Box, Modal, CircularProgress, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api';
import AddEditUserModal from '../components/addEditUserModal';
import { ArrowBack } from '@mui/icons-material';
import QRCodeGenerator from '../components/QRCodeGenerator';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const { user, loading: userLoading } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [openQR, setOpenQR] = useState(false);
  const [selectedUUID, setSelectedUUID] = useState<string | null>(null);

  const handleOpenQR = (uuid: string) => {
    setSelectedUUID(uuid);
    setOpenQR(true);
  };

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
// Função para definir a cor do cargo
function getRoleColor(role) {
  switch (role) {
    case 'admin':
      return '#ff4747'; // Vermelho para admin
    case 'user':
      return '#28a745'; // Verde para user
    case 'manager':
      return '#ffc107'; // Amarelo para manager
    default:
      return '#007fff'; // Azul padrão
  }
}

  return (
    <Box sx={{ 
			padding: 3, 
			background: 'linear-gradient(135deg, #007aff, #00c4b4)',
			minHeight: '100vh',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center'
		}}>
				<IconButton onClick={() => navigate('/home')} sx={{ alignSelf: 'flex-start', color: 'white' }}>
		 <ArrowBack fontSize="large" />
	 </IconButton>
      <Paper
        elevation={4}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 4,
          padding: 4,
          maxWidth: 800,
          textAlign: 'center',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
          width: '100%',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#007fff', marginBottom: 2 }}>
          Gerenciamento de Usuários
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
          <Button
            variant="contained"
            onClick={handleAddUser}
            sx={{
              backgroundColor: '#007fff',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              borderRadius: '8px',
              padding: '10px 20px',
              '&:hover': { backgroundColor: '#005bbb' },
            }}
          >
            Adicionar Usuário
          </Button>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
<Grid container spacing={3} justifyContent="center">
  {usuarios.map((user) => (
    <Grid item xs={12} sm={6} md={4} key={user.id}>
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 3,
          borderRadius: '10px',
          backgroundColor: '#f5f5f5',
          textAlign: 'center',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
          transition: '0.3s',
          minHeight: '350px',
          '&:hover': { transform: 'scale(1.05)', boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.3)' },
        }}
        
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#007fff' }}>
          {user.fullName}
        </Typography>
        
        <Typography  sx={{textOverflow:"ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap", maxWidth: "-webkit-fill-available", color: '#333' }}>{user.email}</Typography>

        <Typography sx={{ color: '#555', fontSize: '0.9rem', marginTop: 1 }}>
          <strong>Setor:</strong> {user.sector?.nome}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
          <Typography
            sx={{
              color: '#fff',
              backgroundColor: getRoleColor(user.role),
              padding: '6px 12px',
              borderRadius: '16px',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              textTransform: 'capitalize',
            }}
          >
            {user.role}
          </Typography>
        </Box>

       {/* Gerar QR Code */}
        <Button 
        variant="outlined"
        color="info"
        sx={{  marginTop: 2, fontWeight:"bold", width: '100%' }}
        onClick={() => handleOpenQR(user.id)}>Gerar QR Code</Button>
        <Button
          variant="contained"
          onClick={() => handleEditUser(user)}
          sx={{
           
            backgroundColor: '#007fff',
            fontWeight: 'bold',
            borderRadius: '8px',
            padding: '8px 16px',
            '&:hover': { backgroundColor: '#005bbb' },
          }}
        >
          Editar
        </Button>
      </Paper>
    </Grid>
  ))}
</Grid>
				
        )}
      </Paper>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <AddEditUserModal mode={modalMode} user={selectedUser} onClose={handleModalClose} />
      </Modal>
      {selectedUUID && (
        <QRCodeGenerator uuid={selectedUUID} open={openQR} onClose={() => setOpenQR(false)} />
      )}
    </Box>
  );
};

export default UsuariosPage;

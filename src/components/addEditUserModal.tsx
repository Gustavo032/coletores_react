import React, { useState, useEffect } from 'react';
import { TextField, Button, CircularProgress, Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { api } from '../api';

interface AddEditUserModalProps {
  mode: 'add' | 'edit';
  user?: any;
  onClose: (updatedUser: any | null) => void;
}

const AddEditUserModal: React.FC<AddEditUserModalProps> = ({ mode, user, onClose }) => {
  const [formData, setFormData] = useState<{ fullName: string; email: string; password: string; role: string; sector_id: number | null; roles: string }>({
    fullName: '',
    email: '',
    password: '',
    role: 'fullAdmin',
    sector_id: null, // Inicializando com null
    roles: '["fullAdmin"]'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sectors, setSectors] = useState<any[]>([]);  // Estado para armazenar os setores

  // Buscar os setores ao abrir o modal
  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const response = await api.get('/sectors');
        setSectors(response.data);

        // Atualiza o setor_id com o primeiro setor se não houver nenhum pré-selecionado
        if (mode === 'add' && response.data.length > 0) {
          setFormData((prevData) => ({
            ...prevData,
            sector_id: response.data[0].id, // Ajusta o setor_id para o primeiro setor carregado
          }));
        } else if (mode === 'edit' && user) {
          setFormData({
            fullName: user.fullName,
            email: user.email,
            password: '', // Não vamos mostrar a senha ao editar
            role: user.role,
            sector_id: user.sectorId, // Mantém o setor correto para edição
            roles: user.roles || '["fullAdmin"]', // Manter as roles do usuário
          });
        }
      } catch (err) {
        console.error('Erro ao buscar setores', err);
      }
    };
    fetchSectors();
  }, [mode, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setFormData({ ...formData, sector_id: e.target.value as number });
  };

  const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
	
		try {
			// Exclui o campo de senha se não for preenchido
			const dataToSend = { ...formData };
			if (!formData.password) {
				delete dataToSend.password;
			}
	
			let response;
			if (mode === 'add') {
				response = await api.post('/users', dataToSend);
				onClose(response.data.user);
			} else if (mode === 'edit' && user) {
				response = await api.put(`/users/${user.id}`, dataToSend);
				onClose(response.data.user);
			}
		} catch (err) {
			setError('Erro ao salvar usuário.');
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
        {mode === 'add' ? 'Adicionar Usuário' : 'Editar Usuário'}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome Completo"
            name="fullName"
            value={formData.fullName}
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
            label="Email"
            name="email"
            value={formData.email}
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
          {mode === 'add' || mode === 'edit' && (
            <TextField
              label="Senha"
              name="password"
              type="password"
              value={formData.password}
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
          )}
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              label="Role"
              sx={{
                '& .MuiInputLabel-root': { color: '#1e3d58' },
                '& .MuiOutlinedInput-root': { borderColor: '#1e3d58' },
              }}
            >
              <MenuItem value="fullAdmin">Full Admin</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="sector-id-label">Setor</InputLabel>
            <Select
              labelId="sector-id-label"
              name="sector_id"
              value={formData.sector_id || ''}
              onChange={(e: any) => handleSelectChange(e)}
              label="Setor"
              sx={{
                '& .MuiInputLabel-root': { color: '#1e3d58' },
                '& .MuiOutlinedInput-root': { borderColor: '#1e3d58' },
              }}
            >
              {sectors.map((sector) => (
                <MenuItem key={sector.id} value={sector.id}>
                  {sector.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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

export default AddEditUserModal;

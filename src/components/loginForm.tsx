import React, { useState } from 'react';
import { login } from '../services/authService';
import { Box, Button, TextField, Typography } from '@mui/material';

interface LoginFormProps {
  onLoginSuccess: () => void;
  onLoginError: (message: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onLoginError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token.token); // Salva o token no localStorage
			
      onLoginSuccess();
    } catch (error) {
      onLoginError('Credenciais inválidas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom align="center">Login</Typography>
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField
        label="Senha"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={isLoading}
        sx={{ marginTop: 2 }}
      >
        {isLoading ? 'Carregando...' : 'Entrar'}
      </Button>
    </Box>
  );
};

export default LoginForm;

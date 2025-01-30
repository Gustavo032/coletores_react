import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Snackbar, Alert, Paper, Box } from '@mui/material';
import LoginForm from '../components/loginForm';

const LoginPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/home');  // Redireciona para a página principal após o login
  };

  const handleLoginError = (message: string) => {
    setErrorMessage(message);
  };

  return (
    <Box
      // maxWidth="xs":
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #007fff, #00e1ff)',
        padding: 4,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 4,
          padding: 6,
          // maxWidth: 400,
          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <LoginForm onLoginSuccess={handleLoginSuccess} onLoginError={handleLoginError} />
      </Paper>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
      >
        <Alert severity="error" onClose={() => setErrorMessage('')} sx={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;

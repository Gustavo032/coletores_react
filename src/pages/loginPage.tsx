// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Snackbar, Alert } from '@mui/material';
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
    <Container maxWidth="xs">
      <LoginForm onLoginSuccess={handleLoginSuccess} onLoginError={handleLoginError} />
      
      {/* Snackbar para exibir erros */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
      >
        <Alert severity="error" onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginPage;

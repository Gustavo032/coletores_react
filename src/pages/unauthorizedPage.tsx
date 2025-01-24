import React from 'react';
import { Typography, Container } from '@mui/material';

const UnauthorizedPage = () => {
  return (
    <Container>
      <Typography variant="h4" color="error">
        Você não tem permissão para acessar esta página!
      </Typography>
    </Container>
  );
};

export default UnauthorizedPage;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MovimentacaoPage from './pages/movimentacaoPage';
import { CssBaseline } from '@mui/material';
import LoginPage from './pages/loginPage';
import HomePage from './pages/homePage';
import UnauthorizedPage from './pages/unauthorizedPage';
import UsuariosPage from './pages/usuariosPage';
import SetoresPage from './pages/setoresPage';

const App: React.FC = () => {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/movimentacao" element={<MovimentacaoPage />} />
        <Route path="/setores" element={<SetoresPage />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

      </Routes>
    </Router>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MovimentacaoPage from './pages/movimentacaoPage';
import { CssBaseline } from '@mui/material';
import LoginPage from './pages/loginPage';
import HomePage from './pages/homePage';
import UnauthorizedPage from './pages/unauthorizedPage';
import UsuariosPage from './pages/usuariosPage';
import SetoresPage from './pages/setoresPage';
import EditSetorPage from './pages/editarSetorPage';
import AddSetorPage from './pages/addSetorPage';
import HistorialPage from './pages/historialPage';
import EditUserPage from './pages/editUserPage';
import RelatoriosPage from './pages/relatoriosPage';
import ColetoresPage from './pages/coletoresPage';
import DetalhesColetorPage from './pages/detalhesColetorPage';
import MovimentacaoFormAntigo from './components/movimentacaoFormAntigo';
import NotAuthorizedPage from './pages/NotAuthorizedPage';
import NotFound from './pages/notFoundPage';

const App: React.FC = () => {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/movimentacao" element={<MovimentacaoPage />} />
        <Route path="/movimentacaoOld" element={<MovimentacaoFormAntigo setorOrigem='setor x' />} />
        <Route path="/setores" element={<SetoresPage />} />
        <Route path="/historic" element={<HistorialPage />} />
        <Route path="/relatorios" element={<RelatoriosPage />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
				<Route path="/usuarios/editar/:userId" element={<EditUserPage />} />
				
        <Route path="/coletores" element={<ColetoresPage />} />
				<Route path="/coletores/:id" element={<DetalhesColetorPage />} />

				<Route path="/setores/adicionar" element={<AddSetorPage />} />
				<Route path="/setores/editar/:id" element={<EditSetorPage />} />
        <Route path="/unauthorized" element={<NotAuthorizedPage />} />
        <Route path="/notAuthorized" element={<NotAuthorizedPage />} />
        <Route path="/*" element={<NotFound />} />


      </Routes>
    </Router>
  );
};

export default App;

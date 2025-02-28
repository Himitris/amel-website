import React from 'react';
import Admin from '../components/Admin';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const { currentUser } = useAuth();

  // Si nous sommes sur /admin et que l'utilisateur est déjà connecté,
  // redirigeons-le vers /admin-panel où se trouve le vrai panneau d'administration protégé
  if (currentUser && window.location.pathname === '/admin') {
    return <Navigate to="/admin-panel" replace />;
  }

  // Sinon, afficher le composant Admin qui contient soit le formulaire de connexion
  // soit l'interface d'administration selon l'état de connexion
  return <Admin />;
};

export default AdminPage;
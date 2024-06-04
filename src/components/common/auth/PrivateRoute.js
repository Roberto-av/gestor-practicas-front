import React, { useContext, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';

const PrivateRoute = () => {
  const { authState, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { token, authorities } = authState;

  useEffect(() => {
    if (!token) {
      logout();
      navigate('/login');
    }
  }, [token, logout, navigate]);

  const isAuthenticated = token && authorities &&
    authorities.split(',').some(authority =>
      ['ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_DEVELOPER'].includes(authority.trim())
    );

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
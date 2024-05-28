import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const { authState } = useContext(AuthContext);
  
  const isAuthenticated = authState.token && authState.authorities && 
    authState.authorities.split(',').some(authority => {
      return ['ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_DEVELOPER'].includes(authority.trim());
    });
  
  return isAuthenticated ? <Outlet />  : <Navigate to="/" replace />;
};

export default PrivateRoute;
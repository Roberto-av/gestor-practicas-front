import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../context/AuthContext';
import Loader from '../../../admin/dashboard/loader';

const PrivateRouteSudent = () => {
  const { authState, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { token, authorities } = authState;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!token) {
        console.log('No token found, logging out and navigating to /login');
        logout();
        navigate('/login');
      } else {
        setLoading(false);
      }
    }, 2000);

    return () => clearTimeout(timer); 
  }, [token, logout, navigate]);

  if (loading) {
    return <Loader />; 
  }

  const isAuthenticated = token && authorities &&
    authorities.split(',').some(authority =>
      ['ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_DEVELOPER', 'ROLE_STUDENT'].includes(authority.trim())
    );

  console.log('isAuthenticated:', isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRouteSudent;

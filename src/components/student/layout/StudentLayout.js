import { Outlet } from "react-router-dom";
import React, { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Layout() {
  const { authState, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      {authState.token && (
        <button onClick={handleLogout}>Cerrar sesión</button>
      )}
      <h1>Hola</h1>
      <Outlet />
    </div>
  );
}

export default Layout;
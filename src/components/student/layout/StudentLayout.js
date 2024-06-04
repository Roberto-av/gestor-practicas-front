import { Outlet } from "react-router-dom";
import React, { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../../styles/student/index.css';
import { createTheme, ThemeProvider } from "@mui/material/styles";

function Layout() {
  const theme = createTheme({
    typography: {
      fontFamily: '"Montserrat", sans-serif',
    },
  });
  
  const { authState, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <ThemeProvider theme={theme}>
    <div className="app-student">
      {authState.token && (
        <button onClick={handleLogout}>Cerrar sesión</button>
      )}
      <h1>Hola</h1>
      <Outlet />
    </div>
    </ThemeProvider>
  );
}

export default Layout;
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token') || null,
    user: localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null,
    authorities: localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')).authorities : null
  });

  useEffect(() => {
    if (authState.token) {
      try {
        const decodedToken = jwtDecode(authState.token);
        if (decodedToken.exp * 1000 < Date.now()) {
          logout();
        } else {
          setAuthState((prevState) => ({
            ...prevState,
            user: decodedToken,
            authorities: decodedToken.authorities // Agrega las autoridades al estado de autenticación
          }));
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        logout(); // Logout en caso de error de decodificación
      }
    }
  }, [authState.token]);

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({ token: null, user: null, authorities: null }); // Limpia las autoridades al hacer logout
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de tener instalada esta dependencia

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token') || null,
    user: localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null,
    authorities: localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')).authorities : null,
    loading: true 
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          logout();
        } else {
          setAuthState({
            token,
            user: decodedToken,
            authorities: decodedToken.authorities,
            loading: false
          });
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        logout();
      }
    } else {
      setAuthState((prevState) => ({
        ...prevState,
        loading: false
      }));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({ token: null, user: null, authorities: null, loading: false });
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

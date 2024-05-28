import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Typography, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import { AuthContext } from '../../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

function StudentRegistrationPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const { setAuthState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Token de registro no encontrado.');
    }
  }, []);

  const handleRegister = async () => {
    if (!token) {
      setError('Token de registro no encontrado.');
      return;
    }
    try {
      await api.post(`/auth/register/student?token=${token}`, { username, password });
      console.log("El usuario se ha registrado");
      
      // Autologin después del registro
      const loginResponse = await api.post('/auth/login', { username, password });
      const { jwt } = loginResponse.data;
      localStorage.setItem('token', jwt);
      setAuthState({
        jwt,
        user: jwtDecode(jwt),
      });
      
      navigate("/");
    } catch (error) {
      console.error('Error al registrar al estudiante:', error);
      setError('Error al registrar al estudiante. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={10} sm={6} md={4} lg={3}>
        <Paper elevation={3} style={{ padding: 20 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Registro de Estudiante
          </Typography>
          <TextField
            label="Nombre de Usuario"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Contraseña"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Typography color="error" variant="body2" gutterBottom>{error}</Typography>}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: 20 }}
            onClick={handleRegister}
          >
            Registrarse
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default StudentRegistrationPage;

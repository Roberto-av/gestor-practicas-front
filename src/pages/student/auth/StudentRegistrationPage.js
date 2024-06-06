import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Typography, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import { AuthContext } from '../../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import Loader from '../../../components/admin/dashboard/loader';
import dascLogo from "../../../assets/img/dascLogo.png";

function StudentRegistrationPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [errors, setErrors] = useState('');
  const { setAuthState } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setErrors('Token de registro no encontrado.');
    }
  }, []);

  const validate = () => {
    let tempErrors = {};
    tempErrors.username = username ? "" : "El nombre de usuario es requerido";
    tempErrors.password = password ? "" : "La contraseña es requerida";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    }

    if (isSubmitted) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: value ? "" : `El ${name === "username" ? "nombre de usuario" : "contraseña"} es requerido`,
      }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    if (!token) {
      setErrors('Token de registro no encontrado.');
      return;
    }

    if (!validate()) return;
    setLoading(true);
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
      window.location.reload(true);
    } catch (error) {
      console.error("Error en el login:", error);
      if (error.response && error.response.data) {
        const serverErrors = error.response.data || "Error desconocido";
        setServerError(serverErrors);
      } else {
        setServerError("Error con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="60px"
      mb={2}
    >
      <img src={dascLogo} alt="Logo" height="40" />
    </Box>
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "50vh" }}
    >
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="80vh"
        >
          <Loader />
        </Box>
      ) : (
        <Grid item xs={11} sm={8} md={6} lg={4}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            p={3}
            borderRadius={2}
          >
            <Typography variant="h5" mb={2}>
              Registro
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <TextField
                label="Username"
                name="username"
                type="text"
                fullWidth
                margin="normal"
                value={username}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#454545",
                    padding: "7px",
                  },
                  "& .MuiInputLabel-outlined": {
                    transform: "translate(14px, 14px) scale(1)",
                  },
                  "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
                    transform: "translate(14px, -6px) scale(0.75)",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#0f0f0f",
                    },
                    "&:hover fieldset": {
                      borderColor: "#0f0f0f",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#0f0f0f",
                    },
                    borderRadius: "16px",
                    padding: "5px",
                  },
                }}
                onChange={handleChange}
                error={isSubmitted && !!errors.username}
                helperText={isSubmitted && errors.username}
                variant="outlined"
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                sx={{
                  marginBottom: "20px",
                  "& .MuiInputLabel-root": {
                    color: "#454545",
                    padding: "7px",
                  },
                  "& .MuiInputLabel-outlined": {
                    transform: "translate(14px, 14px) scale(1)",
                  },
                  "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
                    transform: "translate(14px, -6px) scale(0.75)",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#0f0f0f",
                    },
                    "&:hover fieldset": {
                      borderColor: "#0f0f0f",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#0f0f0f",
                    },
                    borderRadius: "16px",
                    padding: "5px",
                  },
                }}
                onChange={handleChange}
                error={isSubmitted && !!errors.password}
                helperText={isSubmitted && errors.password}
                variant="outlined"
              />
              {serverError && (
                <Typography color="error" variant="body2" mb={2}>
                  {serverError}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#0F0F0F",
                  color: "#FFFFFF",
                  height: "65px",
                  "&:hover": {
                    backgroundColor: "#222222",
                  },
                  borderRadius: "16px",
                }}
                fullWidth
              >
                REGISTRARSE
              </Button>
            </form>
          </Box>
        </Grid>
      )}
    </Grid>
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="60px"
      mt={4}
    >
      <Typography variant="body2" color="textSecondary">
        2024 © Departamento Académico de Sistemas Computacionales
      </Typography>
    </Box>
  </>
  );
};


export default StudentRegistrationPage;

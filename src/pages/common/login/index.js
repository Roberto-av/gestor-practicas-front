import React, { useState, useContext } from "react";
import { Box, Button, TextField, Typography, Grid } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../utils/api";
import Loader from "../../../components/admin/dashboard/loader";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const { setAuthState } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { username, password });
      const { jwt } = response.data;
      localStorage.setItem("token", jwt);
      setAuthState({
        jwt,
        user: jwtDecode(jwt),
      });
      navigate('/');
      window.location.reload(true);
    } catch (error) {
      console.error("Error en el login:", error);
      if (error.response && error.response.data) {
        const serverErrors = error.response.data || "Error desconocido";
        setServerError(serverErrors);
      } else {
        setServerError("Usuario o constraseña incorrectos.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "80vh" }}
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
            <Typography variant="h4" mb={2}>
              Login
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
                    color: "#0f0f0f",
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
                    color: "#0f0f0f",
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
                }}
                fullWidth
              >
                INGRESAR
              </Button>
            </form>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default Login;

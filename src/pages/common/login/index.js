import React, { useState, useContext } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../utils/api";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const { setAuthState } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("/auth/login", { username, password });
      const { jwt } = response.data;
      localStorage.setItem("token", jwt);
      setAuthState({
        jwt,
        user: jwtDecode(jwt),
      });
    } catch (error) {
      setError("Invalid credentials");
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
      <Typography variant="h4">Login</Typography>
      <form
        onSubmit={handleSubmit}
        style={{ width: "300px", marginTop: "20px" }}
      >
        <TextField
          label="Username"
          type="text"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
    </Box>
  );
};

export default Login;

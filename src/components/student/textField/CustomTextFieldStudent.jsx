import React from 'react';
import { TextField } from '@mui/material';

const CustomTextField = ({ label, variant = "outlined", ...props }) => {
  return (
    <TextField
      label={label}
      variant={variant}
      fullWidth
      margin="normal"
      sx={{ fontSize: { xs: "0.9rem", sm: "0.8rem", md: "0.8rem" } }}
      InputLabelProps={{ style: { fontSize: { xs: "0.9rem", sm: "0.8rem", md: "0.8rem" } } }}
      {...props}
    />
  );
};

export default CustomTextField;

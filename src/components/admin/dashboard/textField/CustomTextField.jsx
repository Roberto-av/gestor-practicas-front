import React from 'react';
import { TextField, useTheme } from '@mui/material';
import { tokens } from '../../../../theme';

const CustomTextField = ({ label, ...props }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <TextField
      label={label}
      fullWidth
      margin="normal"
      InputLabelProps={{ style: { color: colors.grey[100] } }}
      InputProps={{
        style: { color: colors.grey[100] },
        sx: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: colors.grey[100],
            },
            '&:hover fieldset': {
              borderColor: colors.grey[100],
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.grey[100],
            },
          },
        },
      }}
      {...props}
    />
  );
};

export default CustomTextField;

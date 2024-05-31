import React from "react";
import Button from "@mui/material/Button";

const CustomButton = ({ text, icon, onClick, customColor, hoverColor  }) => {
    return (
        <Button
          variant="contained"
          sx={{
            backgroundColor: customColor,
            color: '#fff',
            '&:hover': {
              backgroundColor: hoverColor,
            },
            margin: '0 10px',
          }}
          onClick={onClick}
          startIcon={icon}
        >
          {text}
        </Button>
    );
  };
  
  export default CustomButton;

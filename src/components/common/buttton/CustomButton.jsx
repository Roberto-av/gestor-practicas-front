import React from "react";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";

const CustomButton = ({ text, icon, onClick }) => {
    return (
      <Box
        mb="30px"
        m="20px"
        display="flex"
        justifyContent="flex-end"
        p={2}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={onClick}
          startIcon={icon}
        >
          {text}
        </Button>
      </Box>
    );
  };
  
  export default CustomButton;

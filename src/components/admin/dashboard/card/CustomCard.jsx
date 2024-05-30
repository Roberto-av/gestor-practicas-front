import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  useTheme,
} from "@mui/material";
import { tokens } from "../../../../theme";

const CustomCard = ({ title, subtitles = [], sx = {}, icon }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Card
      sx={{
        width: 400,
        height: 320,
        overflow: "hidden",
        margin: "20px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: colors.primary[400],
        color: colors.grey[100],
        ...sx,
      }}
    >
      <CardContent
        sx={{
          overflowY: "auto", // Permite el desplazamiento vertical
          flex: "1 1 auto", // Permite que el contenido se expanda
        }}
      >
        <Box display="flex" alignItems="center" marginBottom="10px" padding="5px" sx={{ backgroundColor: colors.blueAccent[700], borderRadius:"8px" }}>
          {icon &&
            React.cloneElement(icon, {
              sx: {
                fontSize: 40,
                ml:5,
                marginRight: "10px",
              },
            })}
          <Typography
            variant="h5"
            component="div"
            sx={{ color: colors.grey[100] }}
          >
            {title}
          </Typography>
        </Box>
        <Divider sx={{ marginBottom: "10px" }} />
        {subtitles.map((subtitle, index) => (
          <Typography key={index} sx={{ mb: 1, color: colors.grey[300] }}>
            {subtitle}
          </Typography>
        ))}
      </CardContent>
    </Card>
  );
};

export default CustomCard;
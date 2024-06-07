import { Outlet } from "react-router-dom";
import "../../../styles/student/index.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import StudentTopbar from "../topbar";
import { Box, Typography } from "@mui/material";

function Layout() {
  const theme = createTheme({
    typography: {
      fontFamily: '"Montserrat", sans-serif',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="app-student">
        <main className="content-app">
          <StudentTopbar />
          <Outlet />
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="60px"
            mt={4}
          >
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontSize: { xs: "0.7rem" } }}
            >
              2024 © Departamento Académico de Sistemas Computacionales
            </Typography>
          </Box>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default Layout;

import { Outlet } from "react-router-dom";
import '../../../styles/student/index.css';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import StudentTopbar from "../topbar";

function Layout() {
  const theme = createTheme({
    typography: {
      fontFamily: '"Montserrat", sans-serif',
    },
  });

  return (
    <ThemeProvider theme={theme}>
        <div className="app">
          <main className="content">
            <StudentTopbar /> 
            <Outlet /> 
          </main>
        </div>
    </ThemeProvider>
  );
}

export default Layout;
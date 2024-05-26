import React from 'react';
import { Outlet } from 'react-router-dom';
import { ColorModeContext, useMode } from '../../../theme.js';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Sidebar from '../dashboard/sidebar';
import Topbar from '../dashboard/topbar';

import '../../../styles/admin/index.css';

const AdminLayout = () => {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = React.useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} /> 
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} /> 
            <Outlet /> 
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default AdminLayout;
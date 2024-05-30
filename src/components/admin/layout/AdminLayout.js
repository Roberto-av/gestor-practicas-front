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
        <div className="app" style={{ display: 'flex', height: '100vh' }}>
          <Sidebar isSidebar={isSidebar} style={{ flex: '0 0 240px' }}/>
          <main className="content" style={{ flex: '1', overflowY: 'auto' }}>
            <Topbar setIsSidebar={setIsSidebar} /> 
            <Outlet /> 
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default AdminLayout;
// StudentTopbar.js
import { Box, IconButton, Button, Menu, MenuItem } from "@mui/material";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";
import dascLogo from "../../../assets/img/dascLogo.png";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import StudentSidebar from "../sidebar";

const StudentTopbar = () => {
  const { authState, logout } = useContext(AuthContext);
  const { authorities } = authState;
  const [activeButton, setActiveButton] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const open = Boolean(anchorEl);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleButtonClick = (button, route) => {
    setActiveButton(button);
    navigate(route);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const buttonStyles = (isActive) => ({
    color: isActive ? "#fff" : "#0f0f0f",
    backgroundColor: isActive ? "#0f0f0f" : "transparent",
    '&:hover': {
      backgroundColor: "#222222",
      color: "#fff",
    },
  });

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const hasPermission = authorities?.split(',').some(authority =>
    ['ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_DEVELOPER'].includes(authority.trim())
  );

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        bgcolor="#fff"
        position="fixed"
        borderBottom="1px solid #DCDCDC"
        top={0}
        left={0}
        width="100%"
        zIndex={1000}
      >
        {/* Left Section with Icons */}
        <Box display="flex" alignItems="center">
          {hasPermission && !isSmallScreen && (
            <IconButton>
              <Link to="/admin/dashboard">
                <DashboardOutlinedIcon sx={{ color: "#0f0f0f" }} />
              </Link>
            </IconButton>
          )}
          {isSmallScreen && (
            <IconButton onClick={handleDrawerOpen}>
              <MenuIcon sx={{ color: "#0f0f0f" }} />
            </IconButton>
          )}
        </Box>

        {/* Center Section with Navigation */}
        <Box display="flex" alignItems="center" gap={4}>
          {!isSmallScreen && (
            <>
              <Button
                onClick={() => handleButtonClick("Inicio","/")}
                sx={buttonStyles(activeButton === "Inicio")}
              >
                Inicio
              </Button>
              <Button
                onClick={() => handleButtonClick("Grupo", "/group")}
                sx={buttonStyles(activeButton === "Grupo")}
              >
                Grupo
              </Button>
            </>
          )}
          <Link to="/">
          <img src={dascLogo} alt="Logo" height="40" />
          </Link>
          {!isSmallScreen && (
            <>
              <Button
                onClick={() => handleButtonClick("Instituciones", "#")}
                sx={buttonStyles(activeButton === "Instituciones")}
              >
                Instituciones
              </Button>
              <Button
                onClick={() => handleButtonClick("Información", "#")}
                sx={buttonStyles(activeButton === "Información")}
              >
                Información
              </Button>
            </>
          )}
        </Box>

        {/* Right Section with Logout */}
        <Box display="flex" alignItems="center" mr={3}>
          <IconButton onClick={handleMenuOpen} sx={{ ml: 1 }}>
            <PersonOutlinedIcon sx={{ color: "#0f0f0f" }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 3, color: "#0f0f0f" }} />
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <StudentSidebar
        open={drawerOpen}
        onClose={handleDrawerClose}
        handleButtonClick={handleButtonClick}
        activeButton={activeButton}
        buttonStyles={buttonStyles}
        hasPermission={hasPermission}
      />
    </>
  );
};

export default StudentTopbar;

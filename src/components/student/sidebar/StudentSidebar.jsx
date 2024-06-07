// Sidebar.js
import { Drawer, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';

const StudentSidebar = ({ open, onClose, handleButtonClick, activeButton, buttonStyles, hasPermission }) => {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: "80%",
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: "80%",
        },
      }}
    >
      <IconButton onClick={onClose} sx={{ alignSelf: 'flex-end', m: 1 }}>
        <CloseIcon />
      </IconButton>
      <List>
        <ListItem button onClick={() => { handleButtonClick("Inicio", "/"); onClose(); }} selected={activeButton === "Inicio"}>
          <ListItemText primary="Inicio" sx={{ padding: '10px 20px',borderRadius:"16px" , ...buttonStyles(activeButton === "Inicio") }} />
        </ListItem>
        <ListItem button onClick={() => { handleButtonClick("Grupo", "/group"); onClose(); }} selected={activeButton === "Grupo"}>
          <ListItemText primary="Grupo" sx={{ padding: '10px 20px',borderRadius:"16px" , ...buttonStyles(activeButton === "Grupo") }} />
        </ListItem>
        <ListItem button onClick={() => { handleButtonClick("Instituciones", "/"); onClose(); }} selected={activeButton === "Instituciones"}>
          <ListItemText primary="Instituciones" sx={{ padding: '10px 20px',borderRadius:"16px" , ...buttonStyles(activeButton === "Instituciones") }} />
        </ListItem>
        <ListItem button onClick={() => { handleButtonClick("Información", "/"); onClose(); }} selected={activeButton === "Información"}>
          <ListItemText primary="Información" sx={{ padding: '10px 20px',borderRadius:"16px" , ...buttonStyles(activeButton === "Información") }} />
        </ListItem>
        {hasPermission && (
          <ListItem button component={Link} to="/admin/dashboard" onClick={onClose}>
            <ListItemText primary="Dashboard" sx={{ padding: '10px 20px', ...buttonStyles(false) }} />
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default StudentSidebar;

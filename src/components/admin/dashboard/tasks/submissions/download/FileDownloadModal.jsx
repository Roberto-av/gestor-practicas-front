import React from "react";
import { Box, Button, Modal, Typography, List, ListItem, ListItemText, IconButton, useTheme } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import api from "../../../../../../utils/api";
import { tokens } from "../../../../../../theme";

const FileDownloadModal = ({ open, onClose, files }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleDownload = async (file) => {
    try {
      const response = await api.get(`/api/tasks/submissions/files/${file.id}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        width: '80%',  // Increase width for a wider modal
        maxWidth: 800,  // Ensure it doesn't get too wide on larger screens
        bgcolor: colors.primary[400], 
        color: colors.grey[100],
        boxShadow: 24, 
        p: 4, 
        borderRadius: 2,
        outline: 'none'
      }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Descargar Archivos
        </Typography>
        <List>
          {files.map((file) => (
            <ListItem key={file.id} secondaryAction={
              <IconButton edge="end" aria-label="download" onClick={() => handleDownload(file)} sx={{ color: colors.grey[100] }}>
                <FileDownloadOutlinedIcon />
              </IconButton>
            }>
              <ListItemText primary={file.name} />
            </ListItem>
          ))}
        </List>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={onClose} sx={{ bgcolor: colors.redAccent[500], color: colors.grey[100] }}>
            Cerrar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FileDownloadModal;

// ConfirmDeleteModal.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../../../../theme";

const ConfirmDeleteModal = ({ open, onClose, onConfirm, name, customText }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        style={{
          backgroundColor: colors.primary[400],
          color: colors.grey[100],
        }}
      >
        <Typography variant="h3" color={colors.grey[100]}>
          Confirmar Eliminación
        </Typography>
      </DialogTitle>
      <DialogContent
        style={{
          backgroundColor: colors.primary[400],
          color: colors.grey[100],
        }}
      >
        <Typography variant="h6" color={colors.grey[100]}>
          ¿Estás seguro de que deseas eliminar {customText} {name}?
        </Typography>
      </DialogContent>
      <DialogActions
        style={{ backgroundColor: colors.primary[400], padding: "10px" }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: colors.grey[100],
            "&:hover": { backgroundColor: colors.redAccent[700] },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          sx={{
            backgroundColor: colors.redAccent[600],
            color: colors.grey[100],
            "&:hover": { backgroundColor: colors.redAccent[700] },
          }}
          variant="contained"
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteModal;

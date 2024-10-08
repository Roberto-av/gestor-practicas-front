import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  Typography,
  Grid,
} from "@mui/material";
import { tokens } from "../../../../theme";
import CustomTextField from "../textField";
import api from "../../../../utils/api";

const CommonModal = ({ open, onClose, onSuccess, group }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialFormData = {
    name: "",
    description: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (group) {
      setFormData(group);
    }
  }, [group]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = group
        ? await api.put(`/api/groups/update`, formData)
        : await api.post("/api/groups/create", formData);

      if (response.status !== 200) {
        throw new Error("Failed to save group data");
      }

      const savedGroup = response.data;
      onSuccess(
        group ? "Grupo actualizado con éxito" : "Grupo creado con éxito",
        savedGroup
      );
      setFormData(initialFormData);
      onClose();
    } catch (error) {
      console.error("Error al guardar el grupo:", error);
      alert("Error al guardar el grupo. Por favor, inténtalo de nuevo más tarde.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle style={{ backgroundColor: colors.blueAccent[600], color: colors.grey[100] }}>
        <Typography variant="h3" color={colors.grey[100]}>
          {group ? "Actualizar Grupo" : "Agregar Grupo"}
        </Typography>
      </DialogTitle>
      <DialogContent style={{ backgroundColor: colors.primary[400], color: colors.grey[100] }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomTextField
              label="Nombre del Grupo"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              label="Descripción"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions style={{ backgroundColor: colors.primary[400], padding: "10px" }}>
        <Button
          onClick={onClose}
          sx={{ color: colors.grey[100], "&:hover": { backgroundColor: colors.redAccent[700] } }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          sx={{
            backgroundColor: colors.greenAccent[600],
            color: colors.grey[100],
            "&:hover": { backgroundColor: colors.greenAccent[700] },
          }}
          variant="contained"
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommonModal;

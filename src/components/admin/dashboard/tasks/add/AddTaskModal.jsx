import React, { useState, useEffect, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  Typography,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { tokens } from "../../../../../theme";
import CustomTextField from "../../textField";
import api from "../../../../../utils/api";
import { AuthContext } from "../../../../../context/AuthContext";

const AddTaskModal = ({ open, onClose, onSuccess }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { authState } = useContext(AuthContext);

  const initialFormData = {
    tittle: "",
    description: "",
    initialDate: "",
    endDate: "",
    user: {
      id: authState.user?.userId || "",
    },
    group: {
      id: "",
    },
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [groups, setGroups] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/api/groups/find-all");
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  const validate = () => {
    let tempErrors = {};
    tempErrors.tittle = formData.tittle ? "" : "El título es requerido";
    tempErrors.description = formData.description ? "" : "La descripción es requerida";
    tempErrors.initialDate = formData.initialDate ? "" : "La fecha inicial es requerida";
    tempErrors.endDate = formData.endDate ? "" : "La fecha final es requerida";
    tempErrors.groupId = formData.group.id ? "" : "El grupo es requerido";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      const newFormData = { ...prevFormData };
      if (name === "groupId") {
        newFormData.group.id = value;
      } else {
        newFormData[name] = value;
      }
      return newFormData;
    });

    if (isSubmitted) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validateSingleField(name, value),
      }));
    }
  };

  const validateSingleField = (name, value) => {
    switch (name) {
      case "tittle":
        return value ? "" : "El título es requerido";
      case "description":
        return value ? "" : "La descripción es requerida";
      case "initialDate":
        return value ? "" : "La fecha inicial es requerida";
      case "endDate":
        return value ? "" : "La fecha final es requerida";
      case "groupId":
        return value ? "" : "El grupo es requerido";
      default:
        return "";
    }
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    if (validate()) {
      try {
        const taskData = {
          tittle: formData.tittle,
          description: formData.description,
          initialDate: formData.initialDate,
          endDate: formData.endDate,
          user: {
            id: formData.user.id,
          },
          group: {
            id: formData.group.id,
          },
        };

        const response = await api.post("/api/tasks/create", taskData);

        if (response.status !== 200) {
          throw new Error("Failed to create task");
        }
        const newTask = response.data;

        onSuccess("Tarea creada con éxito", newTask);
        onClose();
        setFormData(initialFormData);
        setIsSubmitted(false);
      } catch (error) {
        console.error("Error creating task:", error);
        alert("Error al crear la tarea. Por favor, inténtalo de nuevo más tarde.");
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        style={{
          backgroundColor: colors.primary[400],
          color: colors.grey[100],
        }}
      >
        <Typography variant="h3" color={colors.grey[100]}>
          Agregar Tarea
        </Typography>
      </DialogTitle>
      <DialogContent
        style={{
          backgroundColor: colors.primary[400],
          color: colors.grey[100],
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label="Título *"
              name="tittle"
              value={formData.tittle}
              onChange={handleChange}
              error={isSubmitted && !!errors.tittle}
              helperText={isSubmitted && errors.tittle}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label="Descripción *"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={isSubmitted && !!errors.description}
              helperText={isSubmitted && errors.description}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              color={colors.grey[100]}
              sx={{ m: "10px 0 0 0" }}
            >
              Fecha inicial
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              color={colors.grey[100]}
              sx={{ m: "10px 0 0 0" }}
            >
              Fecha Fin
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              name="initialDate"
              type="datetime-local"
              value={formData.initialDate}
              onChange={handleChange}
              error={isSubmitted && !!errors.initialDate}
              helperText={isSubmitted && errors.initialDate}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              name="endDate"
              type="datetime-local"
              value={formData.endDate}
              onChange={handleChange}
              error={isSubmitted && !!errors.endDate}
              helperText={isSubmitted && errors.endDate}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={isSubmitted && !!errors.groupId}>
              <InputLabel>Grupo *</InputLabel>
              <Select
                label="Grupo *"
                name="groupId"
                value={formData.group.id}
                onChange={handleChange}
              >
                {groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
              {isSubmitted && errors.groupId && (
                <FormHelperText>{errors.groupId}</FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>
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

export default AddTaskModal;

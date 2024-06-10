import React, { useState, useContext, useEffect } from "react";
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
  IconButton,
  Box,
} from "@mui/material";
import { tokens } from "../../../../../theme";
import CustomTextField from "../../textField";
import api from "../../../../../utils/api";
import { AuthContext } from "../../../../../context/AuthContext";
import { useDropzone } from "react-dropzone";
import DeleteIcon from "@mui/icons-material/Delete";

const UpdateTaskModal = ({ open, onClose, task, onSuccess }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { authState } = useContext(AuthContext);

  const initialFormData = {
    tittle: task?.tittle || "",
    description: task?.description || "",
    initialDate: task?.initialDate || "",
    endDate: task?.endDate || "",
    user: {
      id: task?.user?.id || authState.user?.userId || "",
    },
    group: {
      id: task?.group?.id || "",
    },
    statusTask: task?.statusTask || "DISABLE",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [groups, setGroups] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showDropzone, setShowDropzone] = useState(task?.files.length > 0);
  const [filePreviews, setFilePreviews] = useState(task?.files || []);
  const [fileNames, setFileNames] = useState(
    task?.files.map((file) => file.name) || []
  );
  const [errorMessage, setErrorMessage] = useState("");

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

  useEffect(() => {
    if (task) {
      setFormData({
        tittle: task.tittle,
        description: task.description,
        initialDate: task.initialDate,
        endDate: task.endDate,
        user: {
          id: task.user?.id || authState.user?.userId || "",
        },
        group: {
          id: task.group?.id || "",
        },
        statusTask: task?.statusTask || "DISABLE",
      });
      setFilePreviews(task.files || []);
      setFileNames(task.files.map((file) => file.name) || []);
    }
  }, [task, authState.user?.userId]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (filePreviews.length + acceptedFiles.length > 2) {
        setErrorMessage("Solo se permiten un máximo de dos archivos.");
      } else if (rejectedFiles.length > 0) {
        setErrorMessage(
          "Solo se permiten archivos .pdf, .doc, .docx, .jpg, .png y .xlsx"
        );
      } else {
        const previews = acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
        setFilePreviews((prev) => [...prev, ...previews]);
        setFileNames((prev) => [
          ...prev,
          ...acceptedFiles.map((file) => file.name),
        ]);
        setErrorMessage("");
      }
    },
  });

  const handleRemoveFile = (index) => {
    const newFilePreviews = [...filePreviews];
    newFilePreviews.splice(index, 1);
    setFilePreviews(newFilePreviews);
    const newFileNames = [...fileNames];
    newFileNames.splice(index, 1);
    setFileNames(newFileNames);
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.tittle = formData.tittle ? "" : "El título es requerido";
    tempErrors.description = formData.description
      ? ""
      : "La descripción es requerida";
    tempErrors.initialDate = formData.initialDate
      ? ""
      : "La fecha inicial es requerida";
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
        const updatedTaskData = {
          id: task.id,
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
          statusTask: formData.statusTask,
        };

        const formDataToSend = new FormData();
        formDataToSend.append(
          "task",
          new Blob([JSON.stringify(updatedTaskData)], {
            type: "application/json",
          })
        );
        filePreviews.forEach((file) => {
          if (file instanceof File) {
            formDataToSend.append("files", file, file.name);
          }
        });

        const response = await api.put("/api/tasks/update", formDataToSend);

        if (response.status !== 200) {
          throw new Error("Failed to update task");
        }

        const updatedTask = response.data;
        onSuccess("Tarea actualizada con éxito", updatedTask);
        onClose();
        setFormData(initialFormData);
        setIsSubmitted(false);
      } catch (error) {
        console.error("Error updating task:", error);
        alert(
          "Error al actualizar la tarea. Por favor, inténtalo de nuevo más tarde."
        );
      }
    }
  };

  const toggleDropzone = () => {
    setShowDropzone((prevShowDropzone) => !prevShowDropzone);
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
          Actualizar Tarea
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
              type="datetime-local"
              name="initialDate"
              value={formData.initialDate}
              onChange={handleChange}
              error={isSubmitted && !!errors.initialDate}
              helperText={isSubmitted && errors.initialDate}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              error={isSubmitted && !!errors.endDate}
              helperText={isSubmitted && errors.endDate}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl
              fullWidth
              error={isSubmitted && !!errors.groupId}
              variant="filled"
            >
              <InputLabel>Grupo *</InputLabel>
              <Select
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
              <FormHelperText>{isSubmitted && errors.groupId}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="filled">
              <InputLabel>Estado de la Tarea *</InputLabel>
              <Select
                name="statusTask"
                value={formData.statusTask}
                onChange={handleChange}
              >
                <MenuItem value="ENABLE">Habilitada</MenuItem>
                <MenuItem value="DISABLE">Deshabilitada</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <Button
                variant="contained"
                onClick={() => setShowDropzone(!showDropzone)}
                style={{
                  backgroundColor: colors.blueAccent[600],
                  color: colors.grey[100],
                  borderRadius: "16px",
                  padding: "16px",
                  marginTop: "20px",
                }}
              >
                {showDropzone ? "Cerrar" : "Subir Archivos"}
              </Button>
            </Box>
          </Grid>
          {showDropzone && (
            <>
              <Grid item xs={12}>
                <Box
                  {...getRootProps()}
                  sx={{
                    border: "2px dashed",
                    borderColor: colors.grey[100],
                    padding: "20px",
                    cursor: "pointer",
                    width: "100%", // Ensure it takes the full width
                    marginTop: "10px", // Add some space between the button and the dropzone
                  }}
                >
                  <input {...getInputProps()} />
                  <Typography align="center">
                    Arrastra y suelta archivos aquí, o haz clic para seleccionar
                    archivos.
                  </Typography>
                </Box>
              </Grid>
              {errorMessage && (
                <Grid item xs={12}>
                  <Typography color="error">{errorMessage}</Typography>
                </Grid>
              )}
              {filePreviews.length > 0 && (
                <Grid item xs={12}>
                  <Box mt={2}>
                    {filePreviews.map((file, index) => (
                      <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={1}
                        p={1}
                      >
                        <Typography>Archivo: {file.name}</Typography>
                        <IconButton onClick={() => handleRemoveFile(index)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions
        style={{
          backgroundColor: colors.primary[400],
          color: colors.grey[100],
        }}
      >
        <Button onClick={onClose} style={{ color: colors.grey[100] }}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          style={{
            backgroundColor: colors.greenAccent[500],
            color: colors.grey[100],
          }}
        >
          Actualizar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateTaskModal;

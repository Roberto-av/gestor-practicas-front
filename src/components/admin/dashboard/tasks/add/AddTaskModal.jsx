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
  IconButton,
  Box,
} from "@mui/material";
import { tokens } from "../../../../../theme";
import CustomTextField from "../../textField";
import api from "../../../../../utils/api";
import { AuthContext } from "../../../../../context/AuthContext";
import { useDropzone } from "react-dropzone";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const [showDropzone, setShowDropzone] = useState(false);
  const [filePreviews, setFilePreviews] = useState([]);
  const [fileNames, setFileNames] = useState([]);
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
        setErrorMessage("Solo se permiten archivos .pdf, .doc, .docx, .jpg, .png y .xlsx");
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

        let response;
        if (showDropzone && filePreviews.length > 0) {
          const formDataToSend = new FormData();
          formDataToSend.append(
            "task",
            new Blob([JSON.stringify(taskData)], { type: "application/json" })
          );
          filePreviews.forEach((file) => {
            formDataToSend.append("files", file, file.name);
          });

          response = await api.post(
            "/api/tasks/create-with-files",
            formDataToSend,
            {
              headers: {},
            }
          );
        } else {
          response = await api.post("/api/tasks/create", taskData, {
            headers: {
              "Content-Type": "application/json",
            },
          });
        }

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
        alert(
          "Error al crear la tarea. Por favor, inténtalo de nuevo más tarde."
        );
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
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={isSubmitted && !!errors.groupId}>
              <InputLabel id="group-label" style={{ color: colors.grey[100] }}>
                Grupo
              </InputLabel>
              <Select
                labelId="group-label"
                name="groupId"
                value={formData.group.id}
                onChange={handleChange}
                style={{ color: colors.grey[100] }}
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
            <Grid item xs={12}>
              <Box
                {...getRootProps()}
                border="2px dashed #cccccc"
                borderRadius={2}
                p={4}
                textAlign="center"
                mb={2}
              >
                <input {...getInputProps()} />
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                  }}
                >
                  Arrastra y suelta archivos aquí, o haz clic para seleccionar
                </Typography>
              </Box>

              {errorMessage && (
                <Typography
                  color="error"
                  variant="body2"
                  sx={{
                    fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                    mt: 2,
                  }}
                >
                  {errorMessage}
                </Typography>
              )}
              {filePreviews.length > 0 && (
                <Box textAlign="left" mb={2} width="100%">
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                    }}
                    mb={1}
                  >
                    <Box component="span" fontWeight="bold">
                      Archivos seleccionados:
                    </Box>
                  </Typography>
                  {filePreviews.map((file, index) => (
                    <Box key={index} textAlign="center" mb={2} width="100%">
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: {
                              xs: "0.8rem",
                              sm: "0.9rem",
                              md: "1rem",
                            },
                            overflowWrap: "break-word",
                            wordBreak: "break-word",
                          }}
                        >
                          {fileNames[index]}
                        </Typography>
                        <IconButton
                          onClick={() => handleRemoveFile(index)}
                          sx={{
                            color: "red",
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions
        style={{
          backgroundColor: colors.primary[400],
          color: colors.grey[100],
        }}
      >
        <Button
          onClick={onClose}
          style={{
            backgroundColor: colors.redAccent[500],
            color: colors.grey[100],
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          style={{
            backgroundColor: colors.greenAccent[500],
            color: colors.grey[100],
          }}
        >
          Crear Tarea
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTaskModal;

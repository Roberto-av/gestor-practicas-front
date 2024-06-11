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
  Box,
} from "@mui/material";
import { tokens } from "../../../../../theme";
import CustomTextField from "../../textField";
import api from "../../../../../utils/api";
import Validation from "../../../../../utils/validations/Validation";
import Loader from "../../loader";
import CustomSelect from "../../Select/CustomSelect";
import { shiftOptions, semesterOptions } from "../../../../../utils/variables/options";

const UpdateStudentModal = ({ open, onClose, onSuccess, student }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialFormData = {
    controlNumber: "",
    name: "",
    email: "",
    program: "",
    semester: "",
    shift: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        id: student.id || "",
        controlNumber: student.controlNumber || "",
        name: student.name || "",
        email: student.email || "",
        program: student.program || "",
        semester: student.semester || "",
        shift: student.shift || "",
      });
    }
  }, [student]);

  const validate = () => {
    let tempErrors = {};
    tempErrors.controlNumber = Validation.validateControlNumber(
      formData.controlNumber
    );
    tempErrors.name = Validation.isEmpty(formData.name)
      ? "El nombre es requerido"
      : "";
    tempErrors.email = Validation.validateEmail(formData.email);
    tempErrors.program = Validation.isEmpty(formData.program)
      ? "La carrera es requerida"
      : "";
    tempErrors.semester = Validation.isEmpty(formData.semester)
      ? "El semestre es requerido"
      : "";
    tempErrors.shift = Validation.isEmpty(formData.shift)
      ? "El turno es requerido"
      : "";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (isSubmitted) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validateSingleField(name, value),
      }));
    }
  };

  const validateSingleField = (name, value) => {
    switch (name) {
      case "controlNumber":
        return Validation.validateControlNumber(value);
      case "name":
        return Validation.isEmpty(value) ? "El nombre es requerido" : "";
      case "email":
        return Validation.validateEmail(value);
      case "program":
        return Validation.isEmpty(value) ? "La carrera es requerida" : "";
      case "semester":
        return Validation.isEmpty(value) ? "El semestre es requerido" : "";
      case "shift":
        return Validation.isEmpty(value) ? "El turno es requerido" : "";
      default:
        return "";
    }
  };

  const handleSubmit = async () => {
    console.log(validate);
    setIsSubmitted(true);
    setLoading(true);
    try {
      const response = await api.put("/api/students/update", {
        ...formData,
        id: student.id,
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to update student data");
      }
      const updatedStudent = response.data;

      onSuccess("Estudiante actualizado con éxito", updatedStudent);
      onClose();
      setFormData(initialFormData);
      handleReset();
      setIsSubmitted(false);
    } catch (error) {
      console.error("Error al actualizar al estudiante:", error);
      if (error.response && error.response.data) {
        const serverErrors = error.response.data || "Error desconocido";
        setServerError(serverErrors);
      } else {
        setServerError(
          "Error al actualizar al estudiante. Por favor, inténtalo de nuevo más tarde."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setIsSubmitted(false);
    setServerError("");
    setLoading(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
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
          Actualizar Estudiante
        </Typography>
      </DialogTitle>
      <DialogContent
        style={{
          backgroundColor: colors.primary[400],
          color: colors.grey[100],
        }}
      >
        {loading ? ( 
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="200px"
          >
            <Loader />
          </Box>
        ) : serverError ? (
          <Typography
            color="error"
            variant="body1"
            style={{ marginTop: 10, textAlign: "center" }}
          >
            {serverError}
          </Typography>
        ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label="Numero de control"
              name="controlNumber"
              value={formData.controlNumber}
              onChange={handleChange}
              error={isSubmitted && !!errors.controlNumber}
              helperText={isSubmitted && errors.controlNumber}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label="Nombre"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={isSubmitted && !!errors.name}
              helperText={isSubmitted && errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={isSubmitted && !!errors.email}
              helperText={isSubmitted && errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <CustomTextField
              label="Carrera"
              name="program"
              value={formData.program}
              onChange={handleChange}
              error={isSubmitted && !!errors.program}
              helperText={isSubmitted && errors.program}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
              <CustomSelect
                label="Semestre"
                value={formData.semester}
                options={semesterOptions}
                onChange={(e) =>
                  setFormData({ ...formData, semester: e.target.value })
                }
              />
            </Grid>
          <Grid item xs={12} sm={6}>
              <CustomSelect
                label="Turno"
                value={formData.shift}
                options={shiftOptions}
                onChange={(e) =>
                  setFormData({ ...formData, shift: e.target.value })
                }
              />
            </Grid>
        </Grid>
        )}
      </DialogContent>
      <DialogActions
        style={{ backgroundColor: colors.primary[400], padding: "10px" }}
      >
        <Button
          onClick={handleClose}
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

export default UpdateStudentModal;

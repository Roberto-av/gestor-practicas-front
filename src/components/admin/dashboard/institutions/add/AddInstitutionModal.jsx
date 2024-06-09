import React, { useState } from "react";
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
import {
  sectorOptions,
  supportOptionsAdmin,
  modalityOptions,
} from "../../../../../utils/variables/options";
import { tokens } from "../../../../../theme";
import CustomTextField from "../../textField";
import api from "../../../../../utils/api";
import Validation from "../../../../../utils/validations/Validation";
import CustomSelect from "../../Select/CustomSelect";
import Loader from "../../loader";

const AddInstitutionModal = ({ open, onClose, onSuccess }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialFormData = {
    name: "",
    rfc: "",
    companyName: "",
    giro: "",
    web: "",
    support: "",
    sector: "",
    modality: "",
    telephoneNumber: "",
    status: "ACCEPTED",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    responsible: {
      name: "",
      position: "",
      email: "",
      phone: "",
      education: "",
    },
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    let tempErrors = {};
    tempErrors.name = Validation.validateStringSpecial(formData.name) || "";
    tempErrors.rfc = Validation.isEmpty(formData.rfc)
      ? "El RFC es requerido"
      : "";
    tempErrors.companyName = Validation.isEmpty(formData.companyName)
      ? "La Razón social de la empresa es requerida"
      : "";
    tempErrors.giro = Validation.isEmpty(formData.giro)
      ? "El giro es requerido"
      : "";
    tempErrors.web = Validation.validateWeb(formData.web) || "";
    tempErrors.telephoneNumber =
      Validation.validatePhoneNumber(formData.telephoneNumber) || "";
    tempErrors.support = Validation.isEmpty(formData.support)
      ? "El apoyo es requerido"
      : "";
    tempErrors.sector = Validation.isEmpty(formData.sector)
      ? "El sector es requerido"
      : "";
    tempErrors.modality = Validation.isEmpty(formData.modality)
      ? "La modalidad es requerida"
      : "";

    tempErrors.address = {
      street: Validation.isEmpty(formData.address.street)
        ? "La calle es requerida"
        : "",
      city: Validation.validateString(formData.address.city) || "",
      state: Validation.validateString(formData.address.state) || "",
      postalCode:
        Validation.validatePostalCode(formData.address.postalCode) || "",
      country: Validation.validateString(formData.address.country) || "",
    };

    tempErrors.responsible = {
      name: Validation.validateString(formData.responsible.name) || "",
      email: Validation.validateEmail(formData.responsible.email) || "",
      phone: Validation.validatePhoneNumber(formData.responsible.phone) || "",
      position: Validation.validateString(formData.responsible.position) || "",
      education:
        Validation.validateString(formData.responsible.education) || "",
    };

    setErrors(tempErrors);

    console.log("Errors object:", tempErrors);

    // Check for top-level errors
    const topLevelValid = Object.keys(tempErrors).every((key) => {
      if (typeof tempErrors[key] === "object") return true; // Skip nested objects
      return tempErrors[key] === "";
    });

    console.log("Top-level errors:", tempErrors);
    console.log("Top-level valid:", topLevelValid);

    // Validate nested errors for address and responsible
    const addressValid = Object.values(tempErrors.address).every(
      (x) => x === ""
    );
    const responsibleValid = Object.values(tempErrors.responsible).every(
      (x) => x === ""
    );

    const isValid = topLevelValid && addressValid && responsibleValid;
    console.log("Validation result:", isValid);
    console.log("Validation address:", addressValid);
    console.log("Validation responsible:", responsibleValid);
    return isValid;
  };

  const handleChange = (e) => {
    console.log(e);
    const { name, value } = e.target;
    let fieldName = name;

    if (!fieldName) {
      console.error("El nombre del campo es indefinido.");
      return;
    }
    const keys = fieldName.split(".");
    if (keys.length === 1) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [keys[0]]: {
          ...prevFormData[keys[0]],
          [keys[1]]: value,
        },
      }));
    }

    if (isSubmitted) {
      const fieldError = validateSingleField(name, value);
      console.log("Validating field:", name, "Error:", fieldError);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: fieldError,
      }));
    }
  };

  const validateSingleField = (name, value) => {
    const keys = name.split(".");
    if (keys.length === 1) {
      switch (name) {
        case "name":
          return Validation.validateStringSpecial(value);
        case "rfc":
          return Validation.isEmpty(value) ? "El RFC es requerido" : "";
        case "companyName":
          return Validation.isEmpty(value)
            ? "El nombre de la empresa es requerido"
            : "";
        case "giro":
          return Validation.isEmpty(value) ? "El giro es requerido" : "";
        case "web":
          return Validation.validateWeb(value);
        case "telephoneNumber":
          return Validation.validatePhoneNumber(value);
        case "support":
          return Validation.isEmpty(value) ? "El apoyo es requerido" : "";
        case "sector":
          return Validation.isEmpty(value) ? "El sector es requerido" : "";
        case "modality":
          return Validation.isEmpty(value)
            ? "La modalidad de la empresa es requerida"
            : "";
        default:
          return "";
      }
    } else {
      switch (keys[0]) {
        case "address":
          if (keys[1] === "postalCode") {
            return Validation.isEmpty(value)
              ? "El código postal es requerido"
              : "";
          }
          return Validation.validateString(value);
        case "responsible":
          if (keys[1] === "email") {
            return Validation.validateEmail(value);
          }
          if (keys[1] === "phone") {
            return Validation.validatePhoneNumber(value);
          }
          return Validation.validateString(value);
        default:
          return "";
      }
    }
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    console.log("Form data before validation:", formData);
    if (!validate()) {
      return;
    }
    setLoading(true);
    console.log("Validation passed");

    try {
      const response = await api.post("/api/institutions/create", formData);
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to save institution data");
      }
      const newInstitution = response.data;
      onSuccess("Institución creada con éxito", newInstitution);
      onClose();
      setFormData(initialFormData);
      setIsSubmitted(false);
    } catch (error) {
      console.error("Error al agregar una institución:", error);
      if (error.response && error.response.data) {
        const serverErrors = error.response.data || "Error desconocido";
        setServerError(serverErrors);
      } else {
        setServerError(
          "Error al tratar de añadir una nueva institución."
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
          Agregar Institución
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
          <Grid item xs={12} sm={12}>
            <CustomTextField
              label="Nombre *"
              name="name"
              variant="filled"
              value={formData.name}
              onChange={handleChange}
              error={isSubmitted && !!errors.name}
              helperText={isSubmitted && errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <CustomTextField
              label="Razón social *"
              name="companyName"
              variant="filled"
              value={formData.companyName}
              onChange={handleChange}
              error={isSubmitted && !!errors.companyName}
              helperText={isSubmitted && errors.companyName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label="RFC *"
              name="rfc"
              variant="filled"
              value={formData.rfc}
              onChange={handleChange}
              error={isSubmitted && !!errors.rfc}
              helperText={isSubmitted && errors.rfc}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label="Giro *"
              name="giro"
              variant="filled"
              value={formData.giro}
              onChange={handleChange}
              error={isSubmitted && !!errors.giro}
              helperText={isSubmitted && errors.giro}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label="Web"
              name="web"
              variant="filled"
              value={formData.web}
              onChange={handleChange}
              error={isSubmitted && !!errors.web}
              helperText={isSubmitted && errors.web}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label="Teléfono *"
              name="telephoneNumber"
              variant="filled"
              value={formData.telephoneNumber}
              onChange={handleChange}
              error={isSubmitted && !!errors.telephoneNumber}
              helperText={isSubmitted && errors.telephoneNumber}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomSelect
              label="Sector"
              name="sector"
              value={formData.sector}
              options={sectorOptions}
              onChange={handleChange}
              error={isSubmitted && !!errors.sector}
              formHelperText={isSubmitted && errors.sector}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomSelect
              label="Apoyo"
              name="support"
              value={formData.support}
              options={supportOptionsAdmin}
              onChange={handleChange}
              error={isSubmitted && !!errors.support}
              formHelperText={isSubmitted && errors.support}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomSelect
              label="Modalidad"
              name="modality"
              value={formData.modality}
              options={modalityOptions}
              onChange={handleChange}
              error={isSubmitted && !!errors.modality}
              formHelperText={isSubmitted && errors.modality}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Dirección</Typography>
          </Grid>
          <Grid item xs={12} sm={12}>
            <CustomTextField
              label="Calle *"
              name="address.street"
              variant="filled"
              value={formData.address.street}
              onChange={handleChange}
              error={isSubmitted && !!errors.address?.street}
              helperText={isSubmitted && errors.address?.street}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label="Ciudad *"
              name="address.city"
              variant="filled"
              value={formData.address.city}
              onChange={handleChange}
              error={isSubmitted && !!errors.address?.city}
              helperText={isSubmitted && errors.address?.city}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label="Estado *"
              name="address.state"
              variant="filled"
              value={formData.address.state}
              onChange={handleChange}
              error={isSubmitted && !!errors.address?.state}
              helperText={isSubmitted && errors.address?.state}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label="Código Postal *"
              name="address.postalCode"
              variant="filled"
              value={formData.address.postalCode}
              onChange={handleChange}
              error={isSubmitted && !!errors.address?.postalCode}
              helperText={isSubmitted && errors.address?.postalCode}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label="País *"
              name="address.country"
              variant="filled"
              value={formData.address.country}
              onChange={handleChange}
              error={isSubmitted && !!errors.address?.country}
              helperText={isSubmitted && errors.address?.country}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Responsable</Typography>
          </Grid>
          <Grid item xs={12} sm={12}>
            <CustomTextField
              label="Nombre *"
              name="responsible.name"
              variant="filled"
              value={formData.responsible.name}
              onChange={handleChange}
              error={isSubmitted && !!errors.responsible?.name}
              helperText={isSubmitted && errors.responsible?.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label="Cargo *"
              name="responsible.position"
              variant="filled"
              value={formData.responsible.position}
              onChange={handleChange}
              error={isSubmitted && !!errors.responsible?.position}
              helperText={isSubmitted && errors.responsible?.position}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label="Educación *"
              name="responsible.education"
              variant="filled"
              value={formData.responsible.education}
              onChange={handleChange}
              error={isSubmitted && !!errors.responsible?.education}
              helperText={isSubmitted && errors.responsible?.education}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <CustomTextField
              label="Email *"
              name="responsible.email"
              variant="filled"
              value={formData.responsible.email}
              onChange={handleChange}
              error={isSubmitted && !!errors.responsible?.email}
              helperText={isSubmitted && errors.responsible?.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              label="Teléfono *"
              name="responsible.phone"
              variant="filled"
              value={formData.responsible.phone}
              onChange={handleChange}
              error={isSubmitted && !!errors.responsible?.phone}
              helperText={isSubmitted && errors.responsible?.phone}
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

export default AddInstitutionModal;

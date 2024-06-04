import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Grid, Typography, useTheme, Snackbar } from "@mui/material";
import api from "../../../../../utils/api";
import { tokens } from "../../../../../theme";
import Header from "../../../../../components/common/header";
import Loader from "../../../../../components/admin/dashboard/loader";
import CustomTextField from "../../../../../components/admin/dashboard/textField";
import CustomButton from "../../../../../components/common/buttton";
import Update from "@mui/icons-material/Update";
import Delete from "@mui/icons-material/Delete";
import { Save } from "@mui/icons-material";
import CustomSelect from "../../../../../components/admin/dashboard/Select/CustomSelect";
import {
  sectorOptions,
  supportOptions,
  modalityOptions,
  statusOptions,
} from "../../../../../utils/variables/options";
import ConfirmDeleteModal from "../../../../../components/admin/dashboard/students/delete/ConfirmDeleteModal";

const InstitutionDetailPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const [institution, setInstitution] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [institutionToDelete, setInstitutionToDelete] = useState(null);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        const response = await api.get(`/api/institutions/${id}`);
        setInstitution(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al agregar una institución:", error);
        if (error.response && error.response.data) {
          const serverErrors = error.response.data || "Error desconocido";
          setServerError(serverErrors);
        } else {
          setServerError(
            "Error al tratar de obtener la institucion."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInstitution();
  }, [id]);

  const handleUpdateClick = () => {
    setIsEditing(true);
    setSuccessMessage("Modo de edición activado");
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setSuccessMessage("Modo de edición cancelado");
  };

  const handleOpenConfirmDeleteModal = () => {
    setInstitutionToDelete(institution);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleCloseConfirmDeleteModal = () => {
    setIsConfirmDeleteModalOpen(false);
    setInstitutionToDelete(null);
  };

  const handleSaveClick = async () => {
    setLoading(true);
    try {
      await api.put(`/api/institutions/update`, institution);
      setIsEditing(false);
      setSuccessMessage("Institución actualizada con éxito");
      setLoading(false);
    } catch (error) {
      console.error("Error al agregar una institución:", error);
      if (error.response && error.response.data) {
        const serverErrors = error.response.data || "Error desconocido";
        setSuccessMessage(serverErrors);
      } else {
        setSuccessMessage(
          "Error al tratar de actualizar la institucion."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async () => {
    if (!institutionToDelete) return;
    try {
      await api.delete(`/api/institutions/delete/${id}`);
      setSuccessMessage(
        `Institución ${institutionToDelete.name} eliminada con éxito`
      );
      navigate("/admin/dashboard/institutions");
    } catch (error) {
      console.error("Error deleting institución:", error);
      setSuccessMessage(
        `Error al eliminar la institución ${institutionToDelete.name}`
      );
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return "#ffb74d";
      case 'ACCEPTED':
        return colors.greenAccent[500];
      case 'NOT_ACCEPTED':
        return colors.redAccent[400];
      default:
        return colors.text.primary;
    }
  };

  if (!institution) {
    return <Loader />;
  }

  return (
    <Box>
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
      <>
      <Header title="Instituciones" subtitle={institution.name} />
      <Box
        mb="30px"
        m="20px"
        display="flex"
        flexDirection="row"
        justifyContent="flex-end"
        p={2}
      >
        {isEditing ? (
          <>
            <CustomButton
              text="Cancelar"
              onClick={handleCancelClick}
              customColor={colors.redAccent[600]}
              hoverColor={colors.redAccent[700]}
            />
            <CustomButton
              text="Guardar"
              icon={<Save />}
              onClick={handleSaveClick}
              customColor={colors.greenAccent[600]}
              hoverColor={colors.greenAccent[700]}
            />
          </>
        ) : (
          <>
            <CustomButton
              text="Actualizar"
              icon={<Update />}
              onClick={handleUpdateClick}
              customColor={colors.blueAccent[600]}
              hoverColor={colors.blueAccent[700]}
            />
            <CustomButton
              text="Eliminar"
              icon={<Delete />}
              onClick={handleOpenConfirmDeleteModal}
              customColor={colors.redAccent[600]}
              hoverColor={colors.redAccent[700]}
            />
            <ConfirmDeleteModal
              open={isConfirmDeleteModalOpen}
              onClose={handleCloseConfirmDeleteModal}
              onConfirm={handleDeleteClick}
              customText="a la institución"
              name={institution?.name}
            />
          </>
        )}
      </Box>
      <Grid container spacing={2} sx={{ ml: "5px" }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Institución</Typography>
          <Typography variant="h6" color={statusColor(institution.status)}>
            STATUS: {institution.status}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Nombre"
                value={institution.name}
                variant="filled"
                InputProps={{
                  readOnly: !isEditing,
                }}
                onChange={(e) =>
                  setInstitution({ ...institution, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="RFC"
                value={institution.rfc}
                variant="filled"
                InputProps={{
                  readOnly: !isEditing,
                }}
                onChange={(e) =>
                  setInstitution({ ...institution, rfc: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <CustomTextField
                label="Razón Social"
                value={institution.companyName}
                variant="filled"
                InputProps={{
                  readOnly: !isEditing,
                }}
                onChange={(e) =>
                  setInstitution({
                    ...institution,
                    companyName: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <CustomTextField
                label="Giro"
                value={institution.giro}
                variant="filled"
                InputProps={{
                  readOnly: !isEditing,
                }}
                onChange={(e) =>
                  setInstitution({ ...institution, giro: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Web"
                value={institution.web}
                variant="filled"
                InputProps={{
                  readOnly: !isEditing,
                }}
                onChange={(e) =>
                  setInstitution({ ...institution, web: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Teléfono"
                value={institution.telephoneNumber}
                variant="filled"
                InputProps={{
                  readOnly: !isEditing,
                }}
                onChange={(e) =>
                  setInstitution({
                    ...institution,
                    telephoneNumber: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomSelect
                label="Sector"
                value={institution.sector}
                options={sectorOptions}
                readOnly={!isEditing}
                onChange={(e) =>
                  setInstitution({ ...institution, sector: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomSelect
                label="Apoyo"
                value={institution.support}
                options={supportOptions}
                readOnly={!isEditing}
                onChange={(e) =>
                  setInstitution({ ...institution, support: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomSelect
                label="Modalidad"
                value={institution.modality}
                options={modalityOptions}
                readOnly={!isEditing}
                onChange={(e) =>
                  setInstitution({ ...institution, modality: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomSelect
                label="Status"
                value={institution.status}
                options={statusOptions}
                readOnly={!isEditing}
                onChange={(e) =>
                  setInstitution({ ...institution, status: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Dirección</Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <CustomTextField
                label="Calle"
                value={institution.address.street}
                variant="filled"
                InputProps={{
                  readOnly: !isEditing,
                }}
                onChange={(e) =>
                  setInstitution({
                    ...institution,
                    address: { ...institution.address, street: e.target.value },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                label="Ciudad"
                value={institution.address.city}
                variant="filled"
                InputProps={{
                  readOnly: !isEditing,
                }}
                onChange={(e) =>
                  setInstitution({
                    ...institution,
                    address: { ...institution.address, city: e.target.value },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                label="Estado"
                value={institution.address.state}
                variant="filled"
                InputProps={{
                  readOnly: !isEditing,
                }}
                onChange={(e) =>
                  setInstitution({
                    ...institution,
                    address: { ...institution.address, state: e.target.value },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                label="Código Postal"
                value={institution.address.postalCode}
                variant="filled"
                InputProps={{
                  readOnly: !isEditing,
                }}
                onChange={(e) =>
                  setInstitution({
                    ...institution,
                    address: {
                      ...institution.address,
                      postalCode: e.target.value,
                    },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={12} mb="40px">
              <CustomTextField
                label="País"
                value={institution.address.country}
                variant="filled"
                InputProps={{
                  readOnly: !isEditing,
                }}
                onChange={(e) =>
                  setInstitution({
                    ...institution,
                    address: {
                      ...institution.address,
                      country: e.target.value,
                    },
                  })
                }
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} p="60px">
          <Typography variant="h6">Responsable</Typography>
          <Typography variant="h6">*</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Nombre del Responsable"
                value={institution.responsible.name}
                variant="filled"
                InputProps={{
                  readOnly: !isEditing,
                }}
                onChange={(e) =>
                  setInstitution({
                    ...institution,
                    responsible: {
                      ...institution.responsible,
                      name: e.target.value,
                    },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Cargo del Responsable"
                value={institution.responsible.position}
                variant="filled"
                InputProps={{
                  readOnly: !isEditing,
                }}
                onChange={(e) =>
                  setInstitution({
                    ...institution,
                    responsible: {
                      ...institution.responsible,
                      position: e.target.value,
                    },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <CustomTextField
                label="Email del Responsable"
                value={institution.responsible.email}
                variant="filled"
                InputProps={{
                  readOnly: !isEditing,
                }}
                onChange={(e) =>
                  setInstitution({
                    ...institution,
                    responsible: {
                      ...institution.responsible,
                      email: e.target.value,
                    },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Teléfono del Responsable"
                value={institution.responsible.phone}
                variant="filled"
                InputProps={{
                  readOnly: !isEditing,
                }}
                onChange={(e) =>
                  setInstitution({
                    ...institution,
                    responsible: {
                      ...institution.responsible,
                      phone: e.target.value,
                    },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Educación del Responsable"
                value={institution.responsible.education}
                variant="filled"
                InputProps={{
                  readOnly: !isEditing,
                }}
                onChange={(e) =>
                  setInstitution({
                    ...institution,
                    responsible: {
                      ...institution.responsible,
                      education: e.target.value,
                    },
                  })
                }
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {successMessage && (
        <Snackbar
          open={true}
          autoHideDuration={5000}
          onClose={() => setSuccessMessage("")}
          message={successMessage}
        />
      )}
      </>
    )}
    </Box>
  );
};

export default InstitutionDetailPage;

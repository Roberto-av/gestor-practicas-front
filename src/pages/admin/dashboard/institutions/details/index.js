// src/pages/InstitutionDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import api from "../../../../../utils/api";
import { tokens } from "../../../../../theme";
import Header from "../../../../../components/common/header";
import Loader from "../../../../../components/admin/dashboard/loader";
import CustomTextField from "../../../../../components/admin/dashboard/textField";

const InstitutionDetailPage = () => {
  const { id } = useParams();
  const [institution, setInstitution] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        const response = await api.get(`/api/institutions/${id}`);
        setInstitution(response.data);
      } catch (error) {
        console.error("Error fetching institution:", error);
      }
    };

    fetchInstitution();
  }, [id]);

  if (!institution) {
    return <Loader />; // Mostrar el componente Loader mientras se cargan los datos
  }

  return (
    <Box>
      <Header title="Instituciones" subtitle={institution.name} />
      <Grid container spacing={2} sx={{ ml: "5px" }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Institución</Typography>
          <Typography variant="h6" color={colors.redAccent[400]}>STATUS: {institution.status} </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Nombre"
                value={institution.name}
                variant="filled"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="RFC"
                value={institution.rfc}
                variant="filled"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <CustomTextField
                label="Razón Social"
                value={institution.companyName}
                variant="filled"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Giro"
                value={institution.giro}
                variant="filled"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Web"
                value={institution.web}
                variant="filled"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Teléfono"
                value={institution.telephoneNumber}
                variant="filled"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label=""
                value={institution.sector}
                variant="filled"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Apoyo"
                value={institution.support}
                variant="filled"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Modalidad"
                value={institution.modality}
                variant="filled"
                InputProps={{
                  readOnly: true,
                }}
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
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                label="Ciudad"
                value={institution.address.city}
                variant="filled"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                label="Estado"
                value={institution.address.state}
                variant="filled"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                label="Código Postal"
                value={institution.address.postalCode}
                variant="filled"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <CustomTextField
                label="País"
                value={institution.address.country}
                variant="filled"
                InputProps={{
                  readOnly: true,
                }}
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
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Cargo del Responsable"
                value={institution.responsible.position}
                variant="filled"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <CustomTextField
                label="Email del Responsable"
                value={institution.responsible.email}
                variant="filled"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Teléfono del Responsable"
                value={institution.responsible.phone}
                variant="filled"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Educación del Responsable"
                value={institution.responsible.education}
                variant="filled"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InstitutionDetailPage;

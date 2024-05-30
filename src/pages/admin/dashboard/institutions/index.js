// src/pages/InstitutionsPage.js
import React, { useEffect, useState } from "react";
import { Grid, Box, useTheme, Snackbar, Link } from "@mui/material";
import CustomCard from "../../../../components/admin/dashboard/card";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import AddIcon from "@mui/icons-material/Add";
import Header from "../../../../components/common/header";
import CustomButton from "../../../../components/common/buttton";
import api from "../../../../utils/api";
import { tokens } from "../../../../theme";
import AddInstitutionModal from "../../../../components/admin/dashboard/institutions/add";
import { useNavigate } from "react-router-dom";

const InstitutionsPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [institutions, setInstitutions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const response = await api.get("/api/institutions/find-all");
        setInstitutions(response.data);
      } catch (error) {
        console.error("Error fetching institutions:", error);
      }
    };

    fetchInstitutions();
  }, []);

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleAddSuccess = (message, newInstitution) => {
    setInstitutions([...institutions, newInstitution]);
    console.log(message);
  };

  return (
    <Box style={{ position: "relative" }}>
      <Header title="Instituciones" subtitle="Gestionar instituciones" />
      <CustomButton
        text="Agregar"
        icon={<AddIcon />}
        onClick={handleModalOpen}
        style={{ position: "absolute", bottom: "20px", right: "20px" }}
      />
      <AddInstitutionModal
        open={openModal}
        onClose={handleModalClose}
        onSuccess={handleAddSuccess}
      />

      <Grid container spacing={2}>
        {institutions.map((institution) => (
          <Grid item xs={12} sm={8} md={6} lg={4} key={institution.id}>
            <Link
              onClick={() =>
                navigate(`/admin/dashboard/institutions/${institution.id}`)
              }
              style={{ textDecoration: "none" }}
            >
              <CustomCard
                icon={<BusinessOutlinedIcon />}
                title={institution.name}
                subtitles={[
                  `${institution.id}`,
                  `Responsable: ${institution.responsible.name}`,
                  `Giro: ${institution.giro}`,
                  `telefono: ${institution.telephoneNumber}`,
                  `Web: ${institution.web}`,
                ]}
              />
            </Link>
          </Grid>
        ))}
      </Grid>
      {successMessage && (
        <Snackbar
          open={true}
          autoHideDuration={10000}
          onClose={() => setSuccessMessage("")}
          message={successMessage}
        />
      )}
    </Box>
  );
};

export default InstitutionsPage;

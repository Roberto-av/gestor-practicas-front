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
import Loader from "../../../../components/admin/dashboard/loader";

const InstitutionsPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(true);
  const [institutions, setInstitutions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const response = await api.get("/api/institutions/find-all");
        setInstitutions(response.data);
        setLoading(false);
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
      {loading ? (
        <Loader />
      ) : (
        <>
          <Header title="Instituciones" subtitle="Gestionar instituciones" />
          <Box
            mb="30px"
            m="20px"
            display="flex"
            flexDirection="row"
            justifyContent="flex-end"
            p={2}
          >
            <CustomButton
              text="Agregar"
              icon={<AddIcon />}
              onClick={handleModalOpen}
              customColor={colors.greenAccent[600]}
              hoverColor={colors.greenAccent[700]}
            />
            <AddInstitutionModal
              open={openModal}
              onClose={handleModalClose}
              onSuccess={handleAddSuccess}
            />
          </Box>
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
        </>
      )}
    </Box>
  );
};

export default InstitutionsPage;

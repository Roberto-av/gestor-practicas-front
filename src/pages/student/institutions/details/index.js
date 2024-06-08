import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Snackbar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import api from "../../../../utils/api";
import CustomTextField from "../../../../components/student/textField";
import Loader from "../../../../components/admin/dashboard/loader";
import {
  sectorOptions,
  supportOptions,
  modalityOptions,
} from "../../../../utils/variables/options";
import { AuthContext } from "../../../../context/AuthContext";

const InstitutionDetailPageStudent = () => {
  const { institutionId } = useParams();
  const { authState } = useContext(AuthContext);
  const [institution, setInstitution] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [studentId, setStudentId] = useState(null);
  const [studentInstitutionId, setStudentInstitutionId] = useState(null);
  const [open, setOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    // Fetch student info from the API endpoint
    if (authState.user) {
      const userId = authState.user.userId;
      api
        .get(`/api/users/${userId}`)
        .then((response) => {
          console.log("data", response.data);
          const studentData = response.data;
          if (studentData.student) {
            setStudentId(studentData.student.id);
            if (studentData.student.institution) {
              setStudentInstitutionId(studentData.student.institution.id);
              setIsSubscribed(
                studentData.student.institution.id ===
                  parseInt(institutionId, 10)
              );
            }
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching student data:", error);
          setServerError("Error al obtener la información del estudiante");
          setIsLoading(false);
        });
    }
  }, [authState, institutionId]);

  useEffect(() => {
    setIsLoading(true);
    const fetchInstitution = async () => {
      try {
        const response = await api.get(`/api/institutions/${institutionId}`);
        setInstitution(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching institution:", error);
        if (error.response && error.response.data) {
          const serverErrors = error.response.data || "Error desconocido";
          setServerError(serverErrors);
        } else {
          setServerError("Error al tratar de obtener la institución.");
        }
        setIsLoading(false);
      }
    };

    fetchInstitution();
  }, [institutionId]);

  const handleSubscribe = async () => {
    if (studentId) {
      try {
        await api.post("/api/students/subscribe-institution", {
          studentId,
          institutionId,
        });
        setSuccessMessage("Inscripción exitosa");
        setIsSubscribed(true);
        setStudentInstitutionId(parseInt(institutionId, 10));
      } catch (error) {
        console.error("Error al inscribirse:", error);
        setServerError("Error al intentar inscribirse en la institución.");
      }
      setOpen(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (studentId) {
      try {
        await api.post("/api/students/unsubscribe-institution", {
          studentId,
          institutionId,
        });
        setSuccessMessage("Desuscripción exitosa");
        setIsSubscribed(false);
        setStudentInstitutionId(null);
      } catch (error) {
        console.error("Error al desuscribirse:", error);
        setServerError("Error al intentar desuscribirse de la institución.");
      }
      setOpen(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!institution) {
    return (
      <Typography>Error al cargar la información de la institución.</Typography>
    );
  }

  return (
    <Box>
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="70vh"
          margin="auto"
          borderRadius="16px"
          p={2}
          mt={2}
        >
          <Loader />
        </Box>
      ) : serverError ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="70vh"
          margin="auto"
          borderRadius="16px"
          p={2}
          mt={2}
        >
          <Typography
            color="error"
            variant="body1"
            style={{ marginTop: 10, textAlign: "center" }}
          >
            {serverError}
          </Typography>
        </Box>
      ) : (
        <>
          <Box width="100%" margin="auto">
            <Box
              width="80%"
              margin="auto"
              borderRadius="16px"
              p={4}
              mt={2}
              minHeight="1000px"
              boxShadow={2}
            >
              <Box mb="30px">
                <Box mb={3}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
                      fontWeight: "bold",
                    }}
                    mb={2}
                  >
                    Institución
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                    }}
                    mb={5}
                  >
                    {institution.name}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  sx={{
                    justifyContent: {
                      xs: "flex-left",
                      sm: "flex-end",
                      md: "flex-end",
                    },
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleClickOpen}
                    disabled={
                      studentInstitutionId &&
                      studentInstitutionId !== parseInt(institutionId, 10)
                    }
                    sx={{
                      backgroundColor: "#1d4ed8",
                      color: "#ffffff",
                      borderRadius: "16px",
                      "&:hover": {
                        backgroundColor: "#1e40af",
                      },
                      fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                      padding: { xs: "8px", sm: "10px", md: "12px" },
                      width: "100%",
                      maxWidth: "200px",
                    }}
                  >
                    {isSubscribed ? "Desuscribirse" : "Suscribirse"}
                  </Button>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                    }}
                  >
                    Institución
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                      <CustomTextField
                        label="Nombre"
                        value={institution.name || ""}
                        variant="filled"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <CustomTextField
                        label="Giro"
                        value={institution.giro || ""}
                        variant="filled"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        label="Web"
                        value={institution.web || ""}
                        variant="filled"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        label="Teléfono"
                        value={institution.telephoneNumber || ""}
                        variant="filled"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        label="Sector"
                        value={
                          sectorOptions.find(
                            (option) => option.value === institution.sector
                          )?.label || ""
                        }
                        variant="filled"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        label="Apoyo"
                        value={
                          supportOptions.find(
                            (option) => option.value === institution.support
                          )?.label || ""
                        }
                        variant="filled"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        label="Modalidad"
                        value={
                          modalityOptions.find(
                            (option) => option.value === institution.modality
                          )?.label || ""
                        }
                        variant="filled"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: {
                            xs: "0.7rem",
                            sm: "0.8rem",
                            md: "0.9rem",
                          },
                        }}
                      >
                        Dirección
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <CustomTextField
                        label="Calle"
                        value={institution.address?.street || ""}
                        variant="filled"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        label="Número"
                        value={institution.address?.number || ""}
                        variant="filled"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        label="Colonia"
                        value={institution.address?.neighborhood || ""}
                        variant="filled"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        label="Municipio"
                        value={institution.address?.city || ""}
                        variant="filled"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        label="País"
                        value={institution.address?.country || ""}
                        variant="filled"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                      }}
                    >
                      Responsable
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={12}>
                        <CustomTextField
                          label="Nombre"
                          value={institution.responsible?.name || ""}
                          variant="filled"
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <CustomTextField
                          label="Cargo"
                          value={institution.responsible?.position || ""}
                          variant="filled"
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <CustomTextField
                          label="Teléfono"
                          value={institution.responsible?.telephone || ""}
                          variant="filled"
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <CustomTextField
                          label="Correo Electrónico"
                          value={institution.responsible?.email || ""}
                          variant="filled"
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
              {serverError && (
                <Snackbar
                  open={Boolean(serverError)}
                  onClose={() => setServerError("")}
                  message={serverError}
                  autoHideDuration={6000}
                />
              )}
              {successMessage && (
                <Snackbar
                  open={Boolean(successMessage)}
                  onClose={() => setSuccessMessage("")}
                  message={successMessage}
                  autoHideDuration={6000}
                />
              )}
            </Box>
          </Box>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
              {isSubscribed
                ? "Confirmar Desuscripción"
                : "Confirmar Inscripción"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {isSubscribed
                  ? "¿Estás seguro que deseas desuscribirte de esta institución?"
                  : "¿Estás seguro que deseas inscribirte a esta institución?"}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancelar
              </Button>
              <Button
                onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
                color="primary"
                autoFocus
              >
                {isSubscribed ? "Desuscribirse" : "Inscribirse"}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default InstitutionDetailPageStudent;

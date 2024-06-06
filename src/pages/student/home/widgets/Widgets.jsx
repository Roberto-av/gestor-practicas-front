import { useContext, useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import CustomCard from "../../../../components/student/widgets/CustomCard/CustomCard";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import { AuthContext } from "../../../../context/AuthContext";
import api from "../../../../utils/api";
import Loader from "../../../../components/admin/dashboard/loader";

const Widgets = ({ onDataLoaded }) => {
  const { authState } = useContext(AuthContext);
  const [studentData, setStudentData] = useState({
    username: "",
    student: {
      name: "",
      institutionName: "",
    },
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Fetch student data from the API endpoint
    if (authState.user) {
      const studentId = authState.user.userId;
      api
        .get(`/api/users/${studentId}`)
        .then((response) => {
          if (response.data.student) {
            setStudentData(response.data);
          } else {
            setStudentData({
              ...response.data,
              student: {
                name: "",
                institutionName: "",
              },
            });
          }
          setIsLoading(false);
          onDataLoaded();
        })
        .catch((error) => {
          if (error.response) {
            setError(error.response.data.message);
          } else if (error.request) {
            setError("No se recibió respuesta del servidor.");
          } 
          setIsLoading(false);
        });
    }
  }, [authState]);

  return (
    <Box width="100%">
      {isLoading ? (
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Loader />
        </Box>
      ) : (
        <>
      <h2>Plataforma para las practicas profesionales del DASC 2024</h2>
      <Grid container pacing={{ xs: 1, sm: 2, md: 2, lg: 2 }}>
        <Grid item xs={12} md={4}>
          <CustomCard
            icon={SchoolIcon}
            title="Estudiante"
            subtitle={
              studentData.student.name ? studentData.student.name : "-"
            }
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <CustomCard
            icon={BusinessOutlinedIcon}
            title="Institución Asociada"
            subtitle={
              studentData.student.institutionName
                ? studentData.student.institutionName
                : "-"
            }
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <CustomCard
            icon={AssignmentTurnedInOutlinedIcon}
            title="Tareas Entregadas"
            subtitle="0"
          />
        </Grid>
      </Grid>
      {error && <p>Error: {error}</p>}
      </>
      )}
    </Box>
  );
};

export default Widgets;

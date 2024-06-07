import { useContext, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import TaskCard from "../../../components/student/widgets/taskBoard/tasks";
import api from "../../../utils/api";
import { AuthContext } from "../../../context/AuthContext";
import Loader from "../../../components/admin/dashboard/loader";

const StudentGroup = () => {
  const { authState } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [studentGroup, setStudentGroup] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  useEffect(() => {
    setIsLoading(true); // Iniciar carga al comenzar la consulta

    // Fetch student info and tasks from the API endpoint
    if (authState.user) {
      const studentId = authState.user.userId;
      api
        .get(`/api/users/${studentId}`)
        .then((response) => {
          console.log("data", response.data);
          const studentData = response.data;
          if (studentData.student && studentData.student.group) {
            const groupId = studentData.student.group.id;
            setStudentGroup(studentData.student.group);
            // Fetch tasks for the group
            api
              .get(`/api/groups/${groupId}`)
              .then((taskResponse) => {
                const allTasks = taskResponse.data.tasks;
                setTasks(allTasks);
                console.log("Tareas", allTasks);

                if (allTasks.length === 0) {
                  setMessage("No hay tareas en este momento.");
                } else {
                  setMessage(null);
                }

                setIsLoading(false);
              })
              .catch((taskError) => {
                console.error("Error fetching tasks:", taskError);
                setError("Error fetching tasks.");
                setIsLoading(false);
              });
          } else {
            setMessage("No hay un grupo asociado");
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching student data:", error);
          setError("Error al obtener la información del estudiante");
          setIsLoading(false);
        });
    }
  }, [authState]);

  return (
    <>
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
      ) : (
        <Box width="99%">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="90%"
            margin="auto"
            borderRadius="16px"
            p={2}
            mt={2}
          >
            <Box width="90%" textAlign="left" boxShadow={2} p={4} borderRadius="16px">
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "1.25rem" },
                  fontWeight: "bold",
                }}
                mb={2}
              >
                {studentGroup ? studentGroup.name : "Grupo no asignado"}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "1.25rem" },
                }}
                mb={2}
              >
                Actividades
              </Typography>
              {error ? (
                <Typography color="error">{error}</Typography>
              ) : tasks.length === 0 ? (
                <Typography variant="body1">{message}</Typography>
              ) : (
                tasks.map((task) => (
                  <Box mb={2} key={task.id}>
                    <TaskCard
                      tittle={task.tittle}
                      description={task.description}
                      text={task.statusTask === "ENABLE" ? "Activo" : "No activo"}
                      colorText={task.statusTask === "ENABLE" ? "#12A14B" : ""}
                      color={"#DCDFE4"}
                    />
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default StudentGroup;

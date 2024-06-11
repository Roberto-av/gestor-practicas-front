// HomeStudents.jsx

import { useContext, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Widgets from "./widgets";
import TaskBoard from "./widgets/board/TasksBoard";
import Loader from "../../../components/admin/dashboard/loader";
import api from "../../../utils/api";
import { AuthContext } from "../../../context/AuthContext";

const HomeStudents = () => {
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
            console.log("studentData", studentData.student.group);
            const groupId = studentData.student.group.id;
            setStudentGroup(studentData.student.group);
            // Fetch tasks for the group
            console.log("grupo del estudiante", studentGroup);
            api
              .get(`/api/groups/${groupId}`)
              .then((taskResponse) => {
                const allTasks = taskResponse.data.tasks;
                const enabledTasks = allTasks.filter(
                  (task) => task.statusTask === "ENABLE"
                );
                setTasks(enabledTasks);
                console.log("Tareas", enabledTasks);

                if (enabledTasks.length === 0) {
                  setMessage("No hay tareas activas en este momento.");
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
        <Box width="99%" boxShadow={2} pb={2}>
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
            <Widgets />
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="88%"
            margin="auto"
            borderRadius="16px"
            p={2}
            mt={2}
            bgcolor="#DCDFE4"
            boxShadow={3}
            minHeight="400px"
            mb={10}
          >
            <Box width="100%" textAlign="left">
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "1.25rem" },
                  fontWeight: "bold",
                }}
                mb={2}
              >
                Tablero de tareas
              </Typography>
            </Box>
            <Box width="100%" display="flex" justifyContent="center" mt={2}>
              {error ? (
                <Typography color="error">{error}</Typography>
              ) : tasks.length === 0 ? (
                <Typography variant="body1">{message}</Typography>
              ) : (
                <TaskBoard tasks={tasks} />
              )}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default HomeStudents;

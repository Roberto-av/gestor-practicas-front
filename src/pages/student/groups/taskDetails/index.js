import { useState, useEffect, useContext } from "react";
import { Box, Typography, Divider, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import api from "../../../../utils/api";
import { format, parseISO, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { AuthContext } from "../../../../context/AuthContext";
import UploadModal from "../../../../components/student/groups/uploadTask";

const TaskDetails = () => {
  const { authState } = useContext(AuthContext);
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await api.get(`/api/tasks/${taskId}`);
        setTask(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching task details:", error);
        setError("Error fetching task details.");
      }
    };

    const fetchSubmission = async () => {
      try {
        const response = await api.get(`/api/tasks/${taskId}/submission`, {
          params: { userId: authState.user.userId },
        });
        if (response.data.length > 0) {
          const submissionData = response.data[0];
          // Find the latest file submission date
          let lastFileSubmissionDate = null;
          if (submissionData.files.length > 0) {
            lastFileSubmissionDate = submissionData.files.reduce(
              (maxDate, file) =>
                maxDate > file.submittedAt ? maxDate : file.submittedAt,
              submissionData.files[0].submittedAt
            );
          }
          setSubmission({
            ...submissionData,
            lastUpdateDate: lastFileSubmissionDate,
          });
        } else {
          // If there is no submission, set submission to null
          setSubmission(null);
        }
      } catch (error) {
        console.error("Error fetching submission:", error);
        setSubmission(null); // Set submission to null on error
      }
    };

    fetchTaskDetails();
    fetchSubmission();
  }, [taskId, authState.user.userId]);

  const downloadFile = async (fileId, fileName) => {
    try {
      const response = await api.get(`/api/tasks/files/${fileId}/download`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!task) {
    return <Typography>Cargando...</Typography>;
  }

  const {
    tittle,
    description,
    initialDate,
    endDate,
    group,
    statusTask,
    files,
  } = task;

  const formattedInitialDate =
    initialDate && isValid(parseISO(initialDate))
      ? format(parseISO(initialDate), "EEEE, d 'de' MMMM 'de' yyyy, HH:mm", {
          locale: es,
        })
      : "-";

  const formattedEndDate =
    endDate && isValid(parseISO(endDate))
      ? format(parseISO(endDate), "EEEE, d 'de' MMMM 'de' yyyy, HH:mm", {
          locale: es,
        })
      : "-";

  const formattedSubmittedAt = submission?.submittedAt
    ? isValid(parseISO(submission.submittedAt))
      ? format(
          parseISO(submission.submittedAt),
          "EEEE, d 'de' MMMM 'de' yyyy, HH:mm",
          {
            locale: es,
          }
        )
      : "-"
    : "-";

  const formattedLastUpdateDate = submission?.lastUpdateDate
    ? isValid(parseISO(submission.lastUpdateDate))
      ? format(
          parseISO(submission.lastUpdateDate),
          "EEEE, d 'de' MMMM 'de' yyyy, HH:mm",
          {
            locale: es,
          }
        )
      : "-"
    : "-";

  return (
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
        <Box
          width="80%"
          textAlign="left"
          boxShadow={2}
          p={4}
          borderRadius="16px"
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "0.9rem", sm: "1rem", md: "1.25rem" },
              fontWeight: "bold",
            }}
            mb={2}
          >
            {group.name} / {tittle}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "0.7rem", sm: "0.9rem", md: "1rem" },
            }}
            mb={2}
          >
            Abiertos: {formattedInitialDate}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "0.7rem", sm: "0.9rem", md: "1rem" },
            }}
            mb={2}
          >
            Pendientes: {formattedEndDate}
          </Typography>
          <Divider
            sx={{ my: 2, borderBottomWidth: 1, borderColor: "#888888" }}
          />
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "0.9rem", sm: "0.9rem", md: "1rem" },
            }}
            mb={2}
          >
            {description}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
            }}
            mb={10}
          >
            <Box component="span">Archivos Adjuntos:</Box>
            {files && files.length > 0 ? (
              files.map((file, index) => (
                <Box key={index}>
                  <Typography
                    component="a"
                    onClick={() => downloadFile(file.id, file.name)}
                    sx={{
                      fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                      textDecoration: "underline",
                      cursor: "pointer",
                      "&:hover": {
                        color: "#1976d2", // Cambia el color al pasar el cursor
                      },
                    }}
                  >
                    {file.name}
                  </Typography>
                </Box>
              ))
            ) : (
              <Box component="span"> -</Box>
            )}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
            }}
            mb={2}
          >
            <Box component="span" fontWeight="bold">
              Status de tarea:
            </Box>{" "}
            <Box
              component="span"
              sx={{ color: statusTask === "ENABLE" ? "green" : "inherit" }}
            >
              {statusTask === "ENABLE" ? "Activo" : "No activo"}
            </Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
              color: submission ? "green" : "inherit",
            }}
            mb={2}
          >
            <Box component="span" fontWeight="bold">
              Status de entrega:
            </Box>{" "}
            <Box component="span">{submission ? "Enviado" : "Sin envio"}</Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
            }}
            mb={2}
          >
            <Box component="span" fontWeight="bold">
              Fecha de envió:
            </Box>{" "}
            <Box component="span">{formattedSubmittedAt}</Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
            }}
            mb={6}
          >
            <Box component="span" fontWeight="bold">
              Fecha de ultima <br /> actualización:
            </Box>{" "}
            <Box component="span">{formattedLastUpdateDate}</Box>
          </Typography>
          <Box
            display="flex"
            justifyContent="center"
            mt={4}
            mb={4}
            width="80%"
            margin="auto"
          >
            <Button
              variant="contained"
              onClick={handleOpenModal}
              disabled={statusTask === "DISABLE"}
              sx={{
                backgroundColor: "#DCDFE4",
                color: "#000000",
                borderRadius: "16px",
                "&:hover": {
                  backgroundColor: "#c1c7cf",
                },
                fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                padding: { xs: "12px", sm: "12px", md: "14px" },
                width: { xs: "100%", sm: "50%", md: "40%" },
                marginRight: "10px",
                mb: "15px",
              }}
            >
              {task.hasSubmitted ? "Actualizar envío" : "Añadir archivos"}
            </Button>
          </Box>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
            }}
            mb={6}
          >
            <Box component="span" fontWeight="bold">
              Archivos Enviados:
            </Box>
            {submission ? (
              <Box component="span">
                {submission.files.map((file, index) => (
                  <Box key={index}>
                    <Typography
                    component="a"
                    sx={{
                      fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                      textDecoration: "underline",
                      cursor: "pointer",
                      "&:hover": {
                        color: "#1976d2",
                      },
                    }}
                  >
                    {file.name}
                  </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box component="span"> -</Box>
            )}
          </Typography>
        </Box>
      </Box>
      <UploadModal
        open={isModalOpen}
        onClose={handleCloseModal}
        taskId={taskId}
        userId={authState.user.userId}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
      />
    </Box>
  );
};

export default TaskDetails;

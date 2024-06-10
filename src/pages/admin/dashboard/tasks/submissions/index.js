import React, { useState, useEffect } from "react";
import { Box, Snackbar, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import api from "../../../../../utils/api";
import Loader from "../../../../../components/admin/dashboard/loader";
import Header from "../../../../../components/common/header";
import Table from "../../../../../components/admin/dashboard/table";
import { tokens } from "../../../../../theme";
import DateFormatter from "../../../../../components/common/dateFormat";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileDownloadModal from "../../../../../components/admin/dashboard/tasks/submissions/download";

const SubmissionsPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { taskId } = useParams();
  const title = "Entregas";
  const subtitle = `Ver entregas de la tarea ${taskId}`;
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await api.get(`/api/tasks/all-submissions/${taskId}`);
        const data = Array.isArray(response.data) ? response.data : [];

        // Transformar los datos para asegurar que se pueden mostrar correctamente en la tabla
        const formattedData = data.map(submission => ({
          id: submission.id,
          userId: submission.userId,
          taskId: submission.taskId,
          submissionDate: submission.submittedAt,
          files: submission.files && submission.files.length > 0 
            ? submission.files 
            : []
        }));

        setSubmissions(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [taskId]);

  const handleOpenModal = (files) => {
    setSelectedFiles(files);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFiles([]);
  };

  const actions = [
    {
      name: "Descargar archivo",
      icon: <FileDownloadOutlinedIcon />,
      onClick: (row) => handleOpenModal(row.files),
    },
  ];

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "userId", headerName: "Usuario", flex: 1 },
    { field: "taskId", headerName: "Tarea", flex: 1 },
    {
      field: "submissionDate",
      headerName: "Fecha de entrega",
      flex: 1,
      renderCell: (params) => <DateFormatter dateString={params.value} />,
    },
    { field: "files", headerName: "Archivos", flex: 1, renderCell: (params) => params.value.map(file => file.name).join(", ") },
  ];

  return (
    <div>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="80vh"
        >
          <Loader />
        </Box>
      ) : (
        <>
          <Header title={title} subtitle={subtitle} />
          <Box>
            {submissions && submissions.length > 0 ? (
              <Table rows={submissions} columns={columns} actions={actions} />
            ) : (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="50vh"
              >
                No hay entregas disponibles.
              </Box>
            )}
          </Box>
          {successMessage && (
            <Snackbar
              open={true}
              autoHideDuration={10000}
              onClose={() => setSuccessMessage("")}
              message={successMessage}
            />
          )}
          <FileDownloadModal
            open={modalOpen}
            onClose={handleCloseModal}
            files={selectedFiles}
          />
        </>
      )}
    </div>
  );
};

export default SubmissionsPage;

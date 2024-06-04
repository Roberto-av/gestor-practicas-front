import React, { useState, useEffect } from "react";
import { Box, Snackbar, useTheme, Grid, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../../../components/common/header";
import Loader from "../../../../../components/admin/dashboard/loader";
import Table from "../../../../../components/admin/dashboard/table";
import CustomTextField from "../../../../../components/admin/dashboard/textField";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import DateFormatter from "../../../../../components/common/dateFormat";

import api from "../../../../../utils/api";
import { tokens } from "../../../../../theme";

const TaskFiles = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { taskId } = useParams();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [file, setFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await api.get(`/api/tasks/with-files/${taskId}`);
        setTask(response.data);
        console.log("user: ", response.data);
        const mappedFiles = response.data.files.map((file) => ({
          ...file,
          userName: file.user.username,
        }));
        setFile(mappedFiles);

        console.log("usernmae: ", response.data.files[0].user.username);
        //setFile(mappedFileTask);
      
        setLoading(false);
      } catch (error) {
        console.error("Error fetching task details:", error);
        setLoading(false);
      }
    };
    fetchTaskDetails();
  }, [taskId]);

  const handleDownload = async (row) => {
    try {
      const response = await api.get(`/api/tasks/files/${row.id}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", row.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setSuccessMessage("Archivo descargado exitosamente");
    } catch (error) {
      console.error("Error downloading file:", error);
      setSuccessMessage("Error al descargar el archivo");
    }
  };

  const actions = [
    {
      name: "Descargar archivo",
      icon: <FileDownloadOutlinedIcon />,
      onClick: (row) => handleDownload(row),
    },
  ];

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Nombre del archivo", flex: 1 },
    { field: "userName", headerName: "Usuario que lo subió", flex: 1 },
    {
      field: "createdAt",
      headerName: "Fecha de envio",
      flex: 1,
      renderCell: (params) => <DateFormatter dateString={params.value} />,
    },
    {
      field: "updatedAt",
      headerName: "Fecha de acualización",
      flex: 1,
      renderCell: (params) => <DateFormatter dateString={params.value} />,
    },
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
          <Header title="Detalles de tarea" subtitle={task.tittle} />
          <Box m="20px">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label="Título"
                  name="tittle"
                  value={task?.tittle || ""}
                  disabled
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label="Descripción"
                  name="description"
                  value={task?.description || ""}
                  disabled
                  fullWidth
                  rows={4}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Archivos
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography
                  variant="h5"
                  color={colors.grey[100]}
                  sx={{ m: "10px 0 0 0" }}
                >
                  Abiertos: <DateFormatter dateString={task.initialDate} />
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography
                  variant="h5"
                  color={colors.grey[100]}
                  sx={{ m: "10px 0 0 0" }}
                >
                  Pendientes: <DateFormatter dateString={task.endDate} />
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Table rows={file} columns={columns} actions={actions} />
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
    </div>
  );
};

export default TaskFiles;

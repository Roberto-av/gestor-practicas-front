import React, { useState, useEffect } from "react";
import { Box, Snackbar, useTheme, Grid, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../../../components/common/header";
import Loader from "../../../../../components/admin/dashboard/loader";
import Table from "../../../../../components/admin/dashboard/table";
import CustomTextField from "../../../../../components/admin/dashboard/textField";
import DateFormatter from "../../../../../components/common/dateFormat";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";

import api from "../../../../../utils/api";
import { tokens } from "../../../../../theme";

const GroupDetailsPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await api.get(`/api/groups/${groupId}`);
        setGroup(response.data);
        console.log("Respuesta", response.data);
        console.log("Tareas", response.data.tasks);
        const groupColumns = [
          { field: "id", headerName: "ID" },
          { field: "tittle", headerName: "Título", flex: 1 },
          { field: "description", headerName: "Descripción", flex: 1 },
          {
            field: "initialDate",
            headerName: "Fecha de Inicio",
            flex: 1,
            renderCell: (params) => <DateFormatter dateString={params.value} />,
          },
          {
            field: "endDate",
            headerName: "Fecha de Fin",
            flex: 1,
            renderCell: (params) => <DateFormatter dateString={params.value} />,
          },
        ];
        setColumns(groupColumns);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching group details:", error);
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  const handleTaskDetails = (row) => {
    const taskId = row.id;
    navigate(`/admin/dashboard/task/${taskId}/submissions`);
  };

  const actions = [
    {
      name: "Ver archivos",
      icon: <AssignmentOutlinedIcon />,
      onClick: (row) => handleTaskDetails(row),
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
          <Header title="Detalles del Grupo" subtitle={group.name} />
          <Box m="20px">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label="Nombre del Grupo"
                  name="name"
                  value={group?.name || ""}
                  disabled
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label="Descripción"
                  name="description"
                  value={group?.description || ""}
                  disabled
                  fullWidth
                  rows={4}
                  margin="normal"
                />
              </Grid>
            </Grid>
            <Typography
              variant="h3"
              color={colors.grey[100]}
              fontWeight="bold"
              sx={{ m: "10px 0 0 0" }}
            >
              Tareas
            </Typography>
          </Box>
          <Table rows={group.tasks} columns={columns} actions={actions} />
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

export default GroupDetailsPage;

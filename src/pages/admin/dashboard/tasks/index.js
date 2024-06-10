import React, { useState, useEffect } from "react";
import { Snackbar, Box, useTheme } from "@mui/material";
import Table from "../../../../components/admin/dashboard/table";
import api from "../../../../utils/api";
import DateFormatter from "../../../../components/common/dateFormat";
import Loader from "../../../../components/admin/dashboard/loader";
import Header from "../../../../components/common/header";
import CustomButton from "../../../../components/common/buttton";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDeleteModal from "../../../../components/admin/dashboard/students/delete/ConfirmDeleteModal";
import AddTaskModal from "../../../../components/admin/dashboard/tasks/add/AddTaskModal";
import UpdateTaskModal from "../../../../components/admin/dashboard/tasks/update/UpdateTaskModal";
import { tokens } from "../../../../theme";
import { useNavigate } from "react-router-dom";

const TasksPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const title = "Tareas";
  const subtitle = "Gestionar tareas";
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isUpdateTaskModalOpen, setIsUpdateTaskModalOpen] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/api/tasks/find-all");
        const mappedTasks = response.data.map((task) => ({
          ...task,
          userName: task.user.username,
          groupName: task.group.name,
        }));
        setTasks(mappedTasks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTaskSuccess = (message, newTask) => {
    setSuccessMessage(message);
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleUpdateTaskSuccess = (message, updatedTask) => {
    setSuccessMessage(message);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const handleOpenConfirmDeleteModal = (task) => {
    setTaskToDelete(task);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleCloseConfirmDeleteModal = () => {
    setIsConfirmDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const handleOpenUpdateTaskModal = (task) => {
    setTaskToUpdate(task);
    setIsUpdateTaskModalOpen(true);
  };

  const handleCloseUpdateTaskModal = () => {
    setIsUpdateTaskModalOpen(false);
    setTaskToUpdate(null);
  };

  const handleTaskDetails = (taskId) => {
    navigate(`/admin/dashboard/task/${taskId}`);
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete || !taskToDelete.id) return;
  
    try {
      await api.delete(`/api/tasks/delete/${taskToDelete.id}`);
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== taskToDelete.id)
      );
      setSuccessMessage(`Tarea ${taskToDelete.tittle} eliminada con éxito`);
      handleCloseConfirmDeleteModal();
    } catch (error) {
      console.error("Error deleting task:", error);
      setSuccessMessage(`Error al eliminar la tarea ${taskToDelete.tittle}`);
    }
  };
  

  const actions = [
    {
      name: "Editar",
      icon: <EditIcon />,
      onClick: (row) => handleOpenUpdateTaskModal(row),
    },
    {
      name: "Ver archivos",
      icon: <AssignmentOutlinedIcon />,
      onClick: (row) => handleTaskDetails(row.id),
    },
    {
      name: "Eliminar",
      icon: <DeleteIcon />,
      onClick: (row) => handleOpenConfirmDeleteModal(row),
    },
  ];

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "tittle", headerName: "Título", flex: 1 },
    { field: "description", headerName: "Descripción", flex: 1 },
    {
      field: "initialDate",
      headerName: "Fecha de inicio",
      flex: 1,
      renderCell: (params) => <DateFormatter dateString={params.value} />,
    },
    {
      field: "endDate",
      headerName: "Fecha de finalización",
      flex: 1,
      renderCell: (params) => <DateFormatter dateString={params.value} />,
    },
    { field: "userName", headerName: "Creador", flex: 1 },
    { field: "groupName", headerName: "Grupo asociado", flex: 1 },
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
              onClick={() => setIsAddTaskModalOpen(true)}
              customColor={colors.greenAccent[600]}
              hoverColor={colors.greenAccent[700]}
            />
            <AddTaskModal
              open={isAddTaskModalOpen}
              onClose={() => setIsAddTaskModalOpen(false)}
              onSuccess={handleAddTaskSuccess}
            />
          </Box>
          <Table rows={tasks} columns={columns} actions={actions} />
          <ConfirmDeleteModal
            open={isConfirmDeleteModalOpen}
            onClose={handleCloseConfirmDeleteModal}
            onConfirm={handleDeleteTask}
            customText="la tarea"
            name={taskToDelete?.tittle}
          />
          <UpdateTaskModal
            open={isUpdateTaskModalOpen}
            onClose={handleCloseUpdateTaskModal}
            onSuccess={handleUpdateTaskSuccess}
            task={taskToUpdate}
          />
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

export default TasksPage;

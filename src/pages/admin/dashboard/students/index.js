import React, { useState, useEffect } from "react";
import Table from "../../../../components/admin/dashboard/table";
import api from "../../../../utils/api";
import DateFormatter from "../../../../components/common/dateFormat";
import Loader from "../../../../components/admin/dashboard/loader";
import Header from "../../../../components/common/header";
import CustomButton from "../../../../components/common/buttton";
import AddIcon from "@mui/icons-material/Add";
import AddStudentModal from "../../../../components/admin/dashboard/students/AddStudentModal";
import UpdateStudentModal from "../../../../components/admin/dashboard/students/update";
import ConfirmDeleteModal from "../../../../components/admin/dashboard/students/delete/ConfirmDeleteModal";
import { Snackbar, Box, useTheme, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";
import { tokens } from "../../../../theme";

const Students = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const title = "Estudiantes";
  const subtitle = "Gestionar a los estudiantes";
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get("/api/students/get-all");
        const studentsWithGroupName = response.data.map(student => ({
          ...student,
          groupName: student.group ? student.group.name : ''
        }));
        setStudents(studentsWithGroupName);
        setFilteredStudents(studentsWithGroupName);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.controlNumber.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenUpdateModal = async (studentId) => {
    try {
      const response = await api.get(`/api/students/${studentId}`);
      setCurrentStudent(response.data);
      setIsUpdateModalOpen(true);
    } catch (error) {
      console.error("Error al actualizar al estudiante:", error);
      if (error.response && error.response.data) {
        const serverErrors = error.response.data || "Error desconocido";
        setServerError(serverErrors);
        setSuccessMessage(
          `Error: ${serverErrors}`
        );
      } else {
        setServerError(
          "Error al tratar de obtener al estudiante."
        );
        setSuccessMessage(
          `${serverError}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setCurrentStudent(null);
  };

  const handleOpenConfirmDeleteModal = (student) => {
    setStudentToDelete(student);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleCloseConfirmDeleteModal = () => {
    setIsConfirmDeleteModalOpen(false);
    setStudentToDelete(null);
  };

  const handleSuccessMessage = (message, newStudent) => {
    setSuccessMessage(message);
    setStudents((prevStudents) => [...prevStudents, newStudent]);
    setTimeout(() => {
      setSuccessMessage("");
    }, 10000);
  };

  const handleUpdateSuccessMessage = (message, updatedStudent) => {
    setSuccessMessage(message);
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
    setTimeout(() => {
      setSuccessMessage("");
    }, 10000);
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;

    try {
      await api.delete(`/api/students/${studentToDelete.id}`);
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== studentToDelete.id)
      );
      setSuccessMessage(
        `Estudiante ${studentToDelete.name} eliminado con éxito`
      );
      handleCloseConfirmDeleteModal();
    } catch (error) {
      console.error("Error deleting student:", error);
      setSuccessMessage(
        `Error al eliminar el estudiante ${studentToDelete.name}`
      );
    }
  };

  const handleUpdateStudent = (studentId) => {
    handleOpenUpdateModal(studentId);
  };

  const actions = [
    {
      name: "Eliminar",
      icon: <DeleteIcon />,
      onClick: (row) => handleOpenConfirmDeleteModal(row),
    },
    {
      name: "Actualizar",
      icon: <UpdateIcon />,
      onClick: (row) => handleUpdateStudent(row.id),
    },
  ];

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "controlNumber", headerName: "Número de control", flex: 1 },
    { field: "name", headerName: "Nombre", flex: 1, minWidth: 250 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 250 },
    { field: "program", headerName: "Carrera", flex: 1 },
    { field: "semester", headerName: "Semestre" },
    { field: "shift", headerName: "Turno" },
    { field: "groupName", headerName: "Grupo" },
    {
      field: "createdAt",
      headerName: "Fecha de creación",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => <DateFormatter dateString={params.value} />,
    },
    {
      field: "updatedAt",
      headerName: "Fecha de última actualización",
      flex: 1,
      minWidth: 150,
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
          <Header title={title} subtitle={subtitle} />
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="end"
            alignItems="center"
            p={2}
          >
            <CustomButton
              text="Agregar"
              icon={<AddIcon />}
              onClick={handleOpenModal}
              customColor={colors.greenAccent[600]}
              hoverColor={colors.greenAccent[700]}
            />
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="end"
            alignItems="center"
            p={2}
          >
          <TextField
              label="Buscar"
              variant="filled"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: 300 }}
            />
          </Box>
          <Table rows={filteredStudents} columns={columns} actions={actions} />
          <AddStudentModal
            open={isModalOpen}
            onClose={handleCloseModal}
            onSuccess={handleSuccessMessage}
          />
          <UpdateStudentModal
            open={isUpdateModalOpen}
            onClose={handleCloseUpdateModal}
            onSuccess={handleUpdateSuccessMessage}
            student={currentStudent}
          />
          <ConfirmDeleteModal
            open={isConfirmDeleteModalOpen}
            onClose={handleCloseConfirmDeleteModal}
            onConfirm={handleDeleteStudent}
            customText="al estudiante"
            name={studentToDelete?.name}
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

export default Students;

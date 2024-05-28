import React, { useState, useEffect } from "react";
import Table from "../../../../components/admin/dashboard/table";
import api from "../../../../utils/api";
import DateFormatter from "../../../../components/common/dateFormat";
import Loader from "../../../../components/admin/dashboard/loader";
import Header from "../../../../components/common/header";
import CustomButton from "../../../../components/common/buttton";
import AddIcon from "@mui/icons-material/Add";
import AddStudentModal from "../../../../components/admin/dashboard/students/AddStudentModal";
import { Snackbar } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";

const Students = () => {
  const title = "Estudiantes";
  const subtitle = "Gestionar a los estudiantes";
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get("/api/students/get-all");
        setStudents(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccessMessage = (message, newStudent) => {
    setSuccessMessage(message);
    setStudents((prevStudents) => [...prevStudents, newStudent]);
    setTimeout(() => {
      setSuccessMessage("");
    }, 10000);
  };

  const handleDeleteGroup = (groupId) => {
    console.log(`Eliminar grupo con ID: ${groupId}`);
  };

  const handleUpdateGroup = (groupId) => {
    console.log(`Actualizar grupo con ID: ${groupId}`);
  };

  const actions = [
    {
      name: "Eliminar",
      icon: <DeleteIcon />,
      onClick: (row) => handleDeleteGroup(row.id),
    },
    {
      name: "Actualizar",
      icon: <UpdateIcon />,
      onClick: (row) => handleUpdateGroup(row.id),
    },
  ];


  const columns = [
    { field: "id", headerName: "ID" },
    { field: "controlNumber", headerName: "Numero de control", flex: 1 },
    { field: "name", headerName: "Nombre", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "program", headerName: "Carrera", flex: 1 },
    { field: "semester", headerName: "Semestre" },
    { field: "shift", headerName: "Turno" },
    { field: "groupId", headerName: "Grupo" },
    {
      field: "createdAt",
      headerName: "Fecha de creación",
      flex: 1,
      renderCell: (params) => <DateFormatter dateString={params.value} />,
    },
    {
      field: "updatedAt",
      headerName: "Fecha de ultima act",
      flex: 1,
      renderCell: (params) => <DateFormatter dateString={params.value} />,
    },
  ];

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Header title={title} subtitle={subtitle} />
          <CustomButton
            text="Agregar"
            icon={<AddIcon />}
            onClick={handleOpenModal}
          />
          <Table rows={students} columns={columns} actions={actions} />
          <AddStudentModal
            open={isModalOpen}
            onClose={handleCloseModal}
            onSuccess={handleSuccessMessage}
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

import React, { useState, useEffect } from "react";
import Table from "../../../../components/admin/dashboard/table";
import api from "../../../../utils/api";
import Loader from "../../../../components/admin/dashboard/loader";
import Header from "../../../../components/common/header";
import CustomButton from "../../../../components/common/buttton";
import AddIcon from "@mui/icons-material/Add";
import InviteIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";
import AddGroupModal from "../../../../components/admin/dashboard/groups/AddGroupModal";
import InviteStudentModal from "../../../../components/admin/dashboard/groups/inviteStudents/InviteStudentModal";
import { Snackbar } from "@mui/material";

const Groups = () => {
  const title = "Grupos";
  const subtitle = "Gestionar los grupos";
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [isInviteStudentModalOpen, setIsInviteStudentModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/api/groups/find-all");
        setGroups(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  const handleOpenAddGroupModal = () => {
    setIsAddGroupModalOpen(true);
  };

  const handleCloseAddGroupModal = () => {
    setIsAddGroupModalOpen(false);
  };

  const handleOpenInviteStudentModal = (groupId) => {
    setSelectedGroupId(groupId);
    setIsInviteStudentModalOpen(true);
  };

  const handleCloseInviteStudentModal = () => {
    setIsInviteStudentModalOpen(false);
    setSelectedGroupId(null);
  };

  const handleSuccessMessage = (message) => {
    setSuccessMessage(message);
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

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Nombre del Grupo", flex: 1 },
    { field: "description", headerName: "Descripción", flex: 1 },
  ];

  const actions = [
    {
      name: "Invitar Alumnos",
      icon: <InviteIcon />,
      onClick: (row) => handleOpenInviteStudentModal(row.id),
    },
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

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Header title={title} subtitle={subtitle} />
          <CustomButton text="Agregar" icon={<AddIcon />} onClick={handleOpenAddGroupModal} />
          <Table rows={groups} columns={columns} actions={actions} />
          <AddGroupModal open={isAddGroupModalOpen} onClose={handleCloseAddGroupModal} onSuccess={handleSuccessMessage} />
          <InviteStudentModal
            open={isInviteStudentModalOpen}
            onClose={handleCloseInviteStudentModal}
            groupId={selectedGroupId}
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

export default Groups;

import React, { useState, useEffect } from "react";
import { Snackbar, Box, useTheme } from "@mui/material";
import Table from "../../../../components/admin/dashboard/table";
import api from "../../../../utils/api";
import Loader from "../../../../components/admin/dashboard/loader";
import Header from "../../../../components/common/header";
import CustomButton from "../../../../components/common/buttton";
import AddIcon from "@mui/icons-material/Add";
import InviteIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CommonModal from "../../../../components/admin/dashboard/groups/CommonModal";
import InviteStudentModal from "../../../../components/admin/dashboard/groups/inviteStudents/InviteStudentModal";
import ConfirmDeleteModal from "../../../../components/admin/dashboard/students/delete/ConfirmDeleteModal";
import { tokens } from "../../../../theme";
import { useNavigate } from "react-router-dom";

const Groups = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const title = "Grupos";
  const subtitle = "Gestionar los grupos";
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [isInviteStudentModalOpen, setIsInviteStudentModalOpen] =
    useState(false);
  const [isUpdateGroupModalOpen, setIsUpdateGroupModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/api/groups/find-all");
        setGroups(response.data);
        console.log("datos", response.data.tasks);
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

  const handleSuccessMessage = (message, newGroup) => {
    setSuccessMessage(message);
    if (newGroup) {
      setGroups((prevGroups) => [...prevGroups, newGroup]);
    }
    setTimeout(() => {
      setSuccessMessage("");
    }, 10000);
  };

  const handleUpdateGroupSuccess = (message, updatedGroup) => {
    setSuccessMessage(message);
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === updatedGroup.id ? updatedGroup : group
      )
    );
    setTimeout(() => {
      setSuccessMessage("");
    }, 10000);
  };

  const handleDeleteGroup = (groupId) => {
    setSelectedGroup(groupId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/api/groups/delete/${selectedGroup}`);
      setGroups(groups.filter((group) => group.id !== selectedGroup));
      handleSuccessMessage("Grupo eliminado con éxito");
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const handleUpdateGroup = (group) => {
    setSelectedGroup(group);
    setIsUpdateGroupModalOpen(true);
  };

  const handleCloseUpdateGroupModal = () => {
    setIsUpdateGroupModalOpen(false);
    setSelectedGroup(null);
  };

  const handleGroupDetails = (groupId) => {
    navigate(`/admin/dashboard/group/${groupId}`);
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
      name: "Ver tareas",
      icon: <AssignmentOutlinedIcon />,
      onClick: (row) => handleGroupDetails(row.id),
    },
    {
      name: "Actualizar",
      icon: <UpdateIcon />,
      onClick: (row) => handleUpdateGroup(row),
    },
    {
      name: "Eliminar",
      icon: <DeleteIcon />,
      onClick: (row) => handleDeleteGroup(row.id),
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
              onClick={handleOpenAddGroupModal}
              customColor={colors.greenAccent[600]}
              hoverColor={colors.greenAccent[700]}
            />
          </Box>
          <Table rows={groups} columns={columns} actions={actions} />
          <CommonModal
            open={isAddGroupModalOpen}
            onClose={handleCloseAddGroupModal}
            onSuccess={(message, newGroup) =>
              handleSuccessMessage(message, newGroup)
            }
          />
          <InviteStudentModal
            open={isInviteStudentModalOpen}
            onClose={handleCloseInviteStudentModal}
            groupId={selectedGroupId}
            onSuccess={handleSuccessMessage}
          />
          <ConfirmDeleteModal
            open={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            name={selectedGroup ? selectedGroup.name : ""}
            customText="el grupo"
          />
          {selectedGroup && (
            <CommonModal
              open={isUpdateGroupModalOpen}
              onClose={handleCloseUpdateGroupModal}
              onSuccess={(message, updatedGroup) =>
                handleUpdateGroupSuccess(message, updatedGroup)
              }
              group={selectedGroup}
            />
          )}
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

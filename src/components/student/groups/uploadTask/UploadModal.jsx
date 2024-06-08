import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../../../utils/api";

const UploadModal = ({
  open,
  onClose,
  taskId,
  userId,
  isSubmitting,
  setIsSubmitting,
}) => {
  const [filePreviews, setFilePreviews] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteFileId, setDeleteFileId] = useState(null);
  const [deleteFileIndex, setDeleteFileIndex] = useState(null);
  const [existingFileNames, setExistingFileNames] = useState([]);
  const [hasNewFiles, setHasNewFiles] = useState(false);

  useEffect(() => {
    const checkSubmission = async () => {
      try {
        const response = await api.get(`/api/tasks/${taskId}/submission`, {
          params: { userId },
        });
        if (response.data.length > 0) {
          setHasSubmitted(true);
          setSubmissionId(response.data[0].id);
          const existingFiles = response.data[0].files.map((file) => ({
            id: file.id,
            name: file.name,
            preview: file.url,
            saved: true, // Indica que el archivo está guardado en la base de datos
          }));
          setFilePreviews(existingFiles);
          setFileNames(existingFiles.map((file) => file.name));
          setExistingFileNames(existingFiles.map((file) => file.name));
        } else {
          setHasSubmitted(false);
        }
      } catch (error) {
        console.error("Error fetching submission:", error);
      }
    };

    if (open) {
      checkSubmission();
    } else {
      setFilePreviews([]);
      setFileNames([]);
      setErrorMessage("");
    }
  }, [open, taskId, userId]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (filePreviews.length + acceptedFiles.length > 2) {
        setErrorMessage("Solo se permiten un máximo de dos archivos.");
      } else if (rejectedFiles.length > 0) {
        setErrorMessage("Solo se permiten archivos .pdf, .doc, .docx, y .xlsx");
      } else {
        const previews = acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
            saved: false, // Indica que el archivo no está guardado en la base de datos
          })
        );
        setFilePreviews((prev) => [...prev, ...previews]);
        setFileNames((prev) => [
          ...prev,
          ...acceptedFiles.map((file) => file.name),
        ]);
        setErrorMessage("");
        checkForNewFiles([...fileNames, ...acceptedFiles.map((file) => file.name)]);
      }
    },
  });

  const handleRemoveFile = (index) => {
    const newFilePreviews = [...filePreviews];
    newFilePreviews.splice(index, 1);
    setFilePreviews(newFilePreviews);
    const newFileNames = [...fileNames];
    newFileNames.splice(index, 1);
    setFileNames(newFileNames);
    checkForNewFiles(newFileNames);
  };

  const handleDeleteFile = async () => {
    try {
      if (submissionId && deleteFileId !== null) {
        await api.delete(
          `/api/tasks/delete/submission/${submissionId}/files/${deleteFileId}`
        );
      }
      handleRemoveFile(deleteFileIndex);
    } catch (error) {
      console.error("Error deleting file:", error);
    } finally {
      setConfirmOpen(false);
      setDeleteFileId(null);
      setDeleteFileIndex(null);
    }
  };

  const handleOpenConfirm = (fileId, index) => {
    if (filePreviews[index].saved) {
      setDeleteFileId(fileId);
    } else {
      setDeleteFileId(null);
    }
    setDeleteFileIndex(index);
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setDeleteFileId(null);
    setDeleteFileIndex(null);
  };

  const checkForNewFiles = (currentFileNames) => {
    const newFiles = currentFileNames.some(
      (name) => !existingFileNames.includes(name)
    );
    setHasNewFiles(newFiles);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("taskId", taskId);
    formData.append("userId", userId);
    filePreviews.forEach((file) => {
      if (!file.saved) {
        formData.append("files", file);
      }
    });

    try {
      if (hasSubmitted && submissionId) {
        await api.put(
          `/api/tasks/${taskId}/submission/${submissionId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        window.location.reload(true);
      } else {
        await api.post(`/api/tasks/${taskId}/submit`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      onClose();
      window.location.reload(true);
    } catch (error) {
      console.error("Error uploading files:", error);
      if (error.response.status === 401) {
        setErrorMessage("User is not authorized");
      } else {
        setErrorMessage("Error uploading files");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        bgcolor="white"
        p={4}
        borderRadius={2}
        boxShadow={3}
        margin="auto"
        mt={20}
        sx={{ width: { xs: "60%", sm: "60%", md: "40%" } }}
      >
        <Box textAlign="left" width="100%">
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" },
              fontWeight: "bold",
            }}
            mb={2}
          >
            {hasSubmitted ? "Actualizar envío" : "Añadir Archivos"}
          </Typography>
        </Box>
        <Box
          {...getRootProps()}
          border="2px dashed #cccccc"
          borderRadius={2}
          p={4}
          textAlign="center"
          width="80%"
          mb={2}
        >
          <input {...getInputProps()} />
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
            }}
          >
            Arrastra y suelta archivos aquí, o haz clic para seleccionar
          </Typography>
        </Box>

        {errorMessage && (
          <Typography
            color="error"
            variant="body2"
            sx={{
              fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
              mt: 2,
            }}
          >
            {errorMessage}
          </Typography>
        )}
        {filePreviews.length > 0 && (
          <Box textAlign="left" mb={2} width="100%">
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                overflowWrap: "break-word",
                wordBreak: "break-word",
              }}
              mb={1}
            >
              <Box component="span" fontWeight="bold">
                Archivos seleccionados:
              </Box>
            </Typography>
            {filePreviews.map((file, index) => (
              <Box key={index} textAlign="center" mb={2} width="100%">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                    }}
                  >
                    {fileNames[index]}
                  </Typography>
                  <IconButton
                    onClick={() => handleOpenConfirm(file.id, index)}
                    sx={{
                      color: "red",
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        )}
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="right"
          width="100%"
          marginTop="10px"
        >
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              backgroundColor: "#ff3333",
              color: "#ffffff",
              borderRadius: "16px",
              "&:hover": {
                backgroundColor: "#e51010",
              },
              fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
              padding: { xs: "12px", sm: "12px", md: "14px" },
              width: "100%",
              maxWidth: "200px",
              mr: "10px",
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting || !hasNewFiles}
            sx={{
              backgroundColor: "#12A14B",
              color: "#ffffff",
              borderRadius: "16px",
              "&:hover": {
                backgroundColor: "#12833f",
              },
              fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
              padding: { xs: "12px", sm: "12px", md: "14px" },
              width: "100%",
              maxWidth: "200px",
            }}
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </Box>

        <Dialog open={confirmOpen} onClose={handleCloseConfirm}>
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de que quieres eliminar este archivo?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirm} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleDeleteFile} color="primary">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Modal>
  );
};

export default UploadModal;

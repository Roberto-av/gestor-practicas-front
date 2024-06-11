import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  Typography,
  FormControl,
  FormHelperText,
  TextField,
} from "@mui/material";
import { tokens } from "../../../../../theme";
import api from "../../../../../utils/api";
import Loader from "../../loader";
import Autocomplete from "@mui/material/Autocomplete";

const InviteStudentModal = ({ open, onClose, groupId, onSuccess }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectError, setSelectError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get("/api/students/get-all");
        console.log("Respuesta de estudiantes:", response.data);
        if (Array.isArray(response.data)) {
          setStudents(response.data);
        } else {
          console.error(
            "La respuesta de la solicitud GET no es un array:",
            response.data
          );
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleInvite = async () => {
    if (selectedStudents.length === 0) {
      setSelectError(true);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/api/mail/send-invitations", {
        emails: selectedStudents.map((student) => student.email),
        groupId: groupId,
      });
      console.log("Invite response:", response);
      onSuccess(`Estudiantes invitados con éxito al grupo ${groupId}`);
      onClose();
    } catch (error) {
      console.error("Error al invitar a los estudiantes:", error);
      alert(
        "Error al invitar a los estudiantes. Por favor, inténtalo de nuevo más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event, value) => {
    setSelectedStudents(value);
    setSelectError(false);
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle style={{ backgroundColor: colors.primary[400], color: colors.grey[100] }}>
        <Typography variant="h3" color={colors.grey[100]}>
          Invitar Alumnos
        </Typography>
      </DialogTitle>
      <DialogContent style={{ backgroundColor: colors.primary[400], color: colors.grey[100]}}>
        {loading ? (
          <Loader />
        ) : (
            <>
            <FormControl fullWidth error={selectError} style={{ marginTop: "10px" }}>
              <Autocomplete 
                multiple
                id="students-search"
                options={filteredStudents}
                getOptionLabel={(student) => student.name}
                value={selectedStudents}
                onChange={handleChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Buscar Alumnos"
                    variant="outlined"
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                )}
              />
              {selectError && <FormHelperText>Por favor, seleccione al menos un alumno.</FormHelperText>}
            </FormControl>
          </>
        )}
      </DialogContent>
      <DialogActions style={{ backgroundColor: colors.primary[400], padding: "10px" }}>
        <Button
          onClick={onClose}
          sx={{ color: colors.grey[100], "&:hover": { backgroundColor: colors.redAccent[700] } }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleInvite}
          sx={{
            backgroundColor: colors.greenAccent[600],
            color: colors.grey[100],
            "&:hover": { backgroundColor: colors.greenAccent[700] },
          }}
          variant="contained"
        >
          Enviar Invitaciones
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InviteStudentModal;

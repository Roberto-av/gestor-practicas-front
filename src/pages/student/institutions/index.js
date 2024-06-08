import { useContext, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import InstitutionCard from "../../../components/student/intitutions/card/InstitutionCard";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../utils/api";
import Loader from "../../../components/admin/dashboard/loader";
import { useNavigate } from "react-router-dom";

const InstitutionsStudents = () => {
  const { authState } = useContext(AuthContext);
  const [institutions, setInstitutions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.user) {
      setIsLoading(true);
      api
        .get(`/api/institutions/find-all`)
        .then((response) => {
          setInstitutions(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching institutions:", error);
          setIsLoading(false);
        });
    }
  }, [authState]);

  return (
    <>
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="70vh"
          margin="auto"
          borderRadius="16px"
          p={2}
          mt={2}
        >
          <Loader />
        </Box>
      ) : (
        <Box width="100%" boxShadow={2} margin="auo">
          <Box
            width="90%"
            margin="auto"
            textAlign="center"
            borderRadius="16px"
            p={2}
            mt={2}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                fontWeight: "bold",
              }}
              mb={2}
            >
              Lista de Instituciones
            </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="center"
            flexWrap="nowrap"
            overflow="auto"
            width="90%"
            minHeight="350px"
            margin="auto"
            borderRadius="16px"
            p={2}
            mt={2}
          >
            {institutions.map((institution) => (
              <Box
                key={institution.id}
                my={1}
                sx={{ width: { xs: "90%", sm: "90%", md: "80%" } }}
              >
                <InstitutionCard
                  institution={institution}
                  onClick={() => navigate(`/institution/${institution.id}`)}
                />
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default InstitutionsStudents;

import Header from "../../../../components/common/header";
import { Box } from "@mui/material";

const Users = () => {
  const title = "Usuarios";
  const subtitle = "Gestionar a los estudiantes con usuario";

  return (
    <Box>
      <Header title={title} subtitle={subtitle} />
    </Box>
  );
};

export default Users;

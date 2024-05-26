import React from "react";
import { Box, useTheme, Menu, MenuItem, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../../common/header";
import { tokens } from "../../../../theme";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";

const Table = ({ title, subtitle, rows, columns }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box m="20px">
      <Header title={title} subtitle={subtitle} />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={[
            ...columns,
            {
              field: "acciones",
              headerName: "acciones",
              flex: 0.5,
              renderCell: ({ row }) => (
                <IconButton
                  aria-label="actions"
                  aria-controls="actions-menu"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                >
                  <MoreVertIcon />
                </IconButton>
              ),
            },
          ]}
          components={{
            Toolbar: () => null,
          }}
        />
      </Box>
      {/* Menú de acciones */}
      <Menu
        id="actions-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem>
          <DeleteIcon sx={{ marginRight: 1 }}/> Eliminar
        </MenuItem>
        <MenuItem>
          <UpdateIcon sx={{ marginRight: 1 }}/> Actualizar
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Table;

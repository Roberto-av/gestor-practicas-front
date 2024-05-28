import React from "react";
import { Box, useTheme, Menu, MenuItem, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../../theme";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Table = ({ rows, columns, actions }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentRow, setCurrentRow] = React.useState(null);

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const handleActionClick = (action) => {
    action.onClick(currentRow);
    handleMenuClose();
  };

  return (
    <Box m="20px">
      <Box
        height="65vh"
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
              headerName: "Acciones",
              flex: 0.5,
              renderCell: ({ row }) => (
                <IconButton
                  aria-label="actions"
                  aria-controls="actions-menu"
                  aria-haspopup="true"
                  onClick={(event) => handleMenuOpen(event, row)}
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
        {actions.map((action, index) => (
          <MenuItem key={index} onClick={() => handleActionClick(action)}>
            {React.cloneElement(action.icon, { sx: { marginRight: 1 } })}
            {action.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default Table;

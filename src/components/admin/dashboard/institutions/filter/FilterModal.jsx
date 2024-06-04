import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
} from "@mui/material";
import CustomSelect from "../../Select/CustomSelect";
import { statusOptions } from "../../../../../utils/variables/options";
import { tokens } from "../../../../../theme";
import CustomButton from "../../../../common/buttton";

const FilterModal = ({ open, onClose, onSave, filters }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setLocalFilters({ ...localFilters, [name]: value });
  };

  const handleSave = () => {
    onSave(localFilters);
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle
        style={{
          backgroundColor: colors.primary[400],
          color: colors.grey[100],
        }}
      >
        Filtrar Instituciones
      </DialogTitle>
      <DialogContent
        style={{
          backgroundColor: colors.primary[400],
          color: colors.grey[100],
        }}
      >
        <CustomSelect
          label="Status"
          name="status"
          value={localFilters.status}
          options={statusOptions}
          onChange={handleFilterChange}
        />
      </DialogContent>
      <DialogActions
        style={{ backgroundColor: colors.primary[400], padding: "10px" }}
      >
        <CustomButton
          text="Cancelar"
          onClick={onClose}
          hoverColor={colors.redAccent[700]}
        />
        <CustomButton
          text="Aplicar"
          onClick={handleSave}
          customColor={colors.greenAccent[600]}
          hoverColor={colors.greenAccent[700]}
        />
      </DialogActions>
    </Dialog>
  );
};

export default FilterModal;

import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";

const CustomSelect = ({ label, formHelperText, options, error, ...props }) => {
  return (
    <FormControl variant="filled" fullWidth error={error}>
      <InputLabel>{label}</InputLabel>
      <Select {...props}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{formHelperText}</FormHelperText>}
    </FormControl>
  );
};

export default CustomSelect;

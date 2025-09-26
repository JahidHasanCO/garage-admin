import React from "react";
import {
  TextField,
  FormControl,
  FormLabel,
  FormHelperText,
  Box,
} from "@mui/material";

const FormField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  type = "text",
  multiline = false,
  rows = 4,
  placeholder,
  required = false,
  disabled = false,
  fullWidth = true,
  ...props
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <FormControl fullWidth={fullWidth} error={!!error}>
        <TextField
          label={label}
          name={name}
          value={value || ""}
          onChange={onChange}
          onBlur={onBlur}
          type={type}
          multiline={multiline}
          rows={multiline ? rows : undefined}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          error={!!error}
          helperText={error || helperText}
          variant="outlined"
          fullWidth={fullWidth}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "#3b82f6",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#3b82f6",
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#3b82f6",
            },
          }}
          {...props}
        />
      </FormControl>
    </Box>
  );
};

export default FormField;
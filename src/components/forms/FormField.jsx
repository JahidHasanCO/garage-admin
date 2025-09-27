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
  sx,
  ...props
}) => {
  return (
    <Box sx={{ mb: 2, width: fullWidth ? "100%" : "auto", ...sx }}>
      <FormControl fullWidth={fullWidth} error={!!error} sx={{ width: "100%" }}>
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
            width: "100%",
            "& .MuiOutlinedInput-root": {
              width: "100%",
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
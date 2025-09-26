import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search parts...",
  disabled = false,
  delay = 500, // Debounce delay in milliseconds
}) => {
  const [localValue, setLocalValue] = useState(value || "");

  // Debounce the search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onChange) {
        onChange(localValue);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [localValue, onChange, delay]);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  const handleClear = () => {
    setLocalValue("");
  };

  return (
    <Box sx={{ minWidth: 300, maxWidth: 400 }}>
      <TextField
        fullWidth
        size="small"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: localValue && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClear}
                disabled={disabled}
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
              borderColor: "#3b82f6",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#3b82f6",
            },
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;
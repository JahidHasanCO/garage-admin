import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardMedia,
  IconButton,
  FormControl,
  FormHelperText,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from "@mui/icons-material";

const FileUpload = ({
  label = "Upload Image",
  value,
  onChange,
  error,
  helperText,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB default
  required = false,
}) => {
  const [preview, setPreview] = useState(value || null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file) {
      // Validate file size
      if (file.size > maxSize) {
        onChange(null, `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        onChange(null, 'Please select a valid image file');
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      
      // Call onChange with file and preview URL
      onChange(file, null, previewUrl);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    handleFileSelect(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <FormControl fullWidth error={!!error} sx={{ mb: 2, width: '100%' }}>
      <Typography
        variant="subtitle1"
        sx={{ mb: 1, fontWeight: 500, color: error ? "error.main" : "text.primary" }}
      >
        {label} {required && "*"}
      </Typography>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Upload Area or Preview */}
      {preview ? (
        <Card sx={{ position: "relative", width: '100%', maxWidth: '100%' }}>
          <CardMedia
            component="img"
            height="200"
            image={preview}
            alt="Preview"
            sx={{ objectFit: "cover", width: '100%' }}
          />
          <IconButton
            onClick={handleRemove}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.7)",
              },
            }}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Card>
      ) : (
        <Box
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          sx={{
            border: `2px dashed ${error ? "#f44336" : dragActive ? "#3b82f6" : "#d1d5db"}`,
            borderRadius: 2,
            p: 4,
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: dragActive ? "#eff6ff" : "#fafafa",
            transition: "all 0.2s ease",
            width: '100%',
            minHeight: 200,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            "&:hover": {
              backgroundColor: "#f3f4f6",
              borderColor: "#3b82f6",
            },
          }}
        >
          <ImageIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
          <Typography variant="h6" sx={{ mb: 1, color: "text.secondary" }}>
            Drag & drop an image here
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            or
          </Typography>
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            sx={{
              borderColor: "#3b82f6",
              color: "#3b82f6",
              "&:hover": {
                borderColor: "#2563eb",
                backgroundColor: "#eff6ff",
              },
            }}
          >
            Browse Files
          </Button>
          <Typography variant="caption" display="block" sx={{ mt: 1, color: "text.secondary" }}>
            Supported formats: JPG, PNG, GIF (Max {Math.round(maxSize / 1024 / 1024)}MB)
          </Typography>
        </Box>
      )}

      {(error || helperText) && (
        <FormHelperText sx={{ mt: 1 }}>
          {error || helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default FileUpload;
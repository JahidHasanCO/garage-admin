import React from "react";
import { Box, Typography, Button } from "@mui/material";

const PageHeader = ({ 
  title, 
  subtitle, 
  actionButton 
}) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
      <Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="textSecondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {actionButton && actionButton}
    </Box>
  );
};

export default PageHeader;
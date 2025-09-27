import React from "react";
import { Box, Typography, Breadcrumbs, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PageHeader = ({ 
  title, 
  subtitle, 
  breadcrumbs = [] 
}) => {
  const navigate = useNavigate();

  const handleBreadcrumbClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Box>
          <Typography variant="h5" component="h5" sx={{ fontWeight: "bold", color: "black" }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="textSecondary" sx={{ mt: 0.5, color: "black" }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {breadcrumbs.length > 0 && (
          <Breadcrumbs>
            {breadcrumbs.map((crumb, index) => (
              <Link
                key={index}
                color={index === breadcrumbs.length - 1 ? "text.primary" : "inherit"}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (index !== breadcrumbs.length - 1) {
                    handleBreadcrumbClick(crumb.path);
                  }
                }}
                sx={{ 
                  textDecoration: "none",
                  color: "black",
                  cursor: index === breadcrumbs.length - 1 ? "default" : "pointer",
                  "&:hover": {
                    textDecoration: index === breadcrumbs.length - 1 ? "none" : "underline"
                  }
                }}
              >
                {crumb.label}
              </Link>
            ))}
          </Breadcrumbs>
        )}
      </Box>
    </Box>
  );
};

export default PageHeader;
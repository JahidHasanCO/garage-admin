import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BuildIcon from "@mui/icons-material/Build";

const drawerWidth = 240;

const menuItems = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
  },
  {
    text: "Parts",
    icon: <BuildIcon />,
    path: "/dashboard/parts",
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#1f2937",
          color: "white",
        },
      }}
    >
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img 
            src="/images/logo.png" 
            alt="Logo" 
            width={40} 
            height={40}
            style={{ marginRight: "12px" }}
          />
          <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
            Garage Admin
          </Typography>
        </Box>
      </Toolbar>
      
      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            sx={{
              mx: 1,
              mb: 0.5,
              borderRadius: 1,
              backgroundColor: location.pathname === item.path ? "#374151" : "transparent",
              "&:hover": {
                backgroundColor: "#374151",
              },
            }}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{ 
                "& .MuiTypography-root": { 
                  color: "white",
                  fontWeight: location.pathname === item.path ? "bold" : "normal",
                } 
              }} 
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
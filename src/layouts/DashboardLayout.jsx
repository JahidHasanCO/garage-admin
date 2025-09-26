import React from "react";
import { Outlet } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  InputBase,
  Avatar,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "../components/Sidebar";

const drawerWidth = 240;

export default function DashboardLayout() {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        {/* Top AppBar */}
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
            backgroundColor: "#fff",
            color: "black",
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            {/* Search bar */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f3f4f6",
                px: 2,
                py: 0.5,
                borderRadius: 2,
                width: "50%",
                maxWidth: 400,
              }}
            >
              <SearchIcon color="action" />
              <InputBase
                placeholder="Search…"
                sx={{ ml: 1, flex: 1 }}
                inputProps={{ "aria-label": "search" }}
              />
            </Box>

            {/* User Avatar */}
            <IconButton>
              <Avatar 
                alt="Admin User" 
                src="/images/avatar.png"
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Push content below AppBar */}
        <Toolbar />

        {/* Route Content */}
        <Outlet />
      </Box>
    </Box>
  );
}
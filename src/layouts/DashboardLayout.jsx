import React, { useCallback } from "react";
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
import { useSidebar } from "../contexts/useSidebarContext";
import { useSearch } from "../contexts/useSearchContext";

const drawerWidth = 240;
const collapsedWidth = 64;

export default function DashboardLayout() {
  const { collapsed } = useSidebar();
  const { searchQuery, handleGlobalSearch } = useSearch();
  const currentWidth = collapsed ? collapsedWidth : drawerWidth;

  const handleSearchChange = useCallback((e) => {
    handleGlobalSearch(e.target.value);
  }, [handleGlobalSearch]);

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
          transition: "margin 0.3s ease",
        }}
      >
        {/* Top AppBar */}
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${currentWidth}px)`,
            ml: `${currentWidth}px`,
            backgroundColor: "#fff",
            color: "black",
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
            borderBottom: "1px solid #e5e7eb",
            transition: "width 0.3s ease, margin-left 0.3s ease",
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
                value={searchQuery}
                onChange={handleSearchChange}
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
        <Box sx={{  p: 1, flexGrow: 1, width: "100%", minHeight: "calc(100vh - 64px)"  }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
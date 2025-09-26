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
    IconButton,
    Tooltip,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BuildIcon from "@mui/icons-material/Build";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useSidebar } from "../contexts/useSidebarContext";
import { AppColors } from "../theme/colors";

const drawerWidth = 240;
const collapsedWidth = 64;

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
    const { collapsed, setCollapsed } = useSidebar();

    const handleNavigation = (path) => {
        navigate(path);
    };

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const currentWidth = collapsed ? collapsedWidth : drawerWidth;

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: currentWidth,
                flexShrink: 0,
                transition: "width 0.3s ease",
                [`& .MuiDrawer-paper`]: {
                    width: currentWidth,
                    boxSizing: "border-box",
                    backgroundColor: "white",
                    color: AppColors.primary,
                    borderRight: `1px ${AppColors.grayBorderColor}`,
                    transition: "width 0.3s ease",
                    overflow: "hidden",
                    // Add top padding here
                },
            }}
        >
            <Toolbar sx={{ justifyContent: collapsed ? "center" : "space-between" }}>
                {!collapsed && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img
                            src="/images/logo.png"
                            alt="Logo"
                            width={100}
                        />
                    </Box>
                )}
                <IconButton
                    onClick={toggleSidebar}
                    sx={{
                        color: AppColors.primary,
                        "&:hover": { backgroundColor: AppColors.grayLightColor },
                        "&:focus": { outline: "none" }, // Remove focus outline
                    }}
                >
                    {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </Toolbar>

            <List sx={{ mt: 2, px: 1 }}>
                {menuItems.map((item) => {
                    const isSelected = location.pathname === item.path;
                    return (
                        <Tooltip
                            key={item.text}
                            title={collapsed ? item.text : ""}
                            placement="right"
                            arrow
                        >
                            <ListItem
                                button
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    mb: 0.5,
                                    borderRadius: 2,
                                    minHeight: 48,
                                    backgroundColor: isSelected ? AppColors.primary : "transparent",
                                    color: isSelected ? "white" : "#000000",
                                    justifyContent: collapsed ? "center" : "flex-start",
                                    px: collapsed ? 1 : 2,
                                    "&:hover": {
                                        backgroundColor: isSelected ? AppColors.primaryDeep : AppColors.grayLightColor,
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: "black",
                                        minWidth: collapsed ? "auto" : 40,
                                        justifyContent: "center",
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                {!collapsed && (
                                    <ListItemText
                                        primary={item.text}
                                        sx={{
                                            "& .MuiTypography-root": {
                                                color: "black",
                                                fontWeight: isSelected ? "bold" : "normal",
                                                fontSize: "0.95rem",
                                            }
                                        }}
                                    />
                                )}
                            </ListItem>
                        </Tooltip>
                    );
                })}
            </List>
        </Drawer>
    );
}
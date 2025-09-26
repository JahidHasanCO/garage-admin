import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";

export default function DashboardHome() {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Welcome back! Here's an overview of your garage management system.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: "#3b82f6", color: "white" }}>
            <CardContent>
              <Typography color="inherit" gutterBottom sx={{ opacity: 0.9 }}>
                Total Parts
              </Typography>
              <Typography variant="h4" component="div">
                156
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: "#10b981", color: "white" }}>
            <CardContent>
              <Typography color="inherit" gutterBottom sx={{ opacity: 0.9 }}>
                Active Orders
              </Typography>
              <Typography variant="h4" component="div">
                23
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: "#f59e0b", color: "white" }}>
            <CardContent>
              <Typography color="inherit" gutterBottom sx={{ opacity: 0.9 }}>
                Low Stock
              </Typography>
              <Typography variant="h4" component="div">
                8
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: "#8b5cf6", color: "white" }}>
            <CardContent>
              <Typography color="inherit" gutterBottom sx={{ opacity: 0.9 }}>
                Total Revenue
              </Typography>
              <Typography variant="h4" component="div">
                $12.4k
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Welcome Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                Recent Activity
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Your recent activity will appear here. This could include recent orders,
                part updates, inventory changes, and more.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                Quick Actions
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Access your most commonly used features and tools from here.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
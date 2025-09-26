import React from "react";
import { Grid, Card, CardContent, Typography, CircularProgress } from "@mui/material";

const StatCard = ({ title, value, loading, color }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Card sx={{ backgroundColor: color || "transparent" }}>
      <CardContent>
        <Typography 
          color={color ? "inherit" : "textSecondary"} 
          gutterBottom
          sx={{ opacity: color ? 0.9 : 1 }}
        >
          {title}
        </Typography>
        <Typography 
          variant="h4" 
          component="div"
          color={color ? "inherit" : "textPrimary"}
        >
          {loading ? <CircularProgress size={30} /> : value}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
);

const StatsGrid = ({ stats, loading }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          loading={loading}
          color={stat.color}
        />
      ))}
    </Grid>
  );
};

export default StatsGrid;
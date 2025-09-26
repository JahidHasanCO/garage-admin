import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";

// Sample parts data
const partsData = [
  { id: 1, name: "Brake Pads", category: "Braking", stock: 25, price: "$45.99" },
  { id: 2, name: "Oil Filter", category: "Engine", stock: 50, price: "$12.50" },
  { id: 3, name: "Air Filter", category: "Engine", stock: 30, price: "$18.75" },
  { id: 4, name: "Spark Plugs", category: "Engine", stock: 100, price: "$8.99" },
  { id: 5, name: "Tire", category: "Wheels", stock: 16, price: "$89.99" },
];

export default function PartsPage() {
  const navigate = useNavigate();

  const handleAddPart = () => {
    navigate("/dashboard/parts/add");
  };

  const handleEditPart = (partId) => {
    navigate(`/dashboard/parts/edit/${partId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          Parts Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddPart}
          sx={{
            backgroundColor: "#3b82f6",
            "&:hover": {
              backgroundColor: "#2563eb",
            },
          }}
        >
          Add New Part
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Parts
              </Typography>
              <Typography variant="h4" component="div">
                {partsData.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Low Stock Items
              </Typography>
              <Typography variant="h4" component="div" sx={{ color: "#ef4444" }}>
                {partsData.filter(part => part.stock < 20).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Categories
              </Typography>
              <Typography variant="h4" component="div">
                {new Set(partsData.map(part => part.category)).size}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Value
              </Typography>
              <Typography variant="h4" component="div" sx={{ color: "#10b981" }}>
                $2,456
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Parts Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Parts Inventory
          </Typography>
          <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Part Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Stock</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {partsData.map((part) => (
                  <TableRow key={part.id} hover>
                    <TableCell>{part.id}</TableCell>
                    <TableCell sx={{ fontWeight: "medium" }}>{part.name}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "inline-block",
                          px: 2,
                          py: 0.5,
                          borderRadius: 4,
                          backgroundColor: "#e0f2fe",
                          color: "#0277bd",
                          fontSize: "0.75rem",
                          fontWeight: "medium",
                        }}
                      >
                        {part.category}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          color: part.stock < 20 ? "#ef4444" : "#10b981",
                          fontWeight: "medium",
                        }}
                      >
                        {part.stock}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "medium" }}>{part.price}</TableCell>
                    <TableCell>
                      <Button 
                        size="small" 
                        sx={{ mr: 1 }}
                        startIcon={<EditIcon />}
                        onClick={() => handleEditPart(part.id)}
                      >
                        Edit
                      </Button>
                      <Button size="small" color="error">
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
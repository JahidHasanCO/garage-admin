import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Chip,
  Avatar,
} from "@mui/material";
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Image as ImageIcon,
} from "@mui/icons-material";

const PartsTable = ({
  parts,
  loading,
  searchQuery,
  deleteLoading,
  onEdit,
  onDelete,
  onAddPart,
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" component="h2">
            Parts Inventory
          </Typography>
          {searchQuery && (
            <Typography variant="body2" color="text.secondary">
              Search results for: "{searchQuery}"
            </Typography>
          )}
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Part Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>SKU</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Created</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={40} />
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Loading parts...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : parts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      {searchQuery ? "No parts found matching your search" : "No parts available"}
                    </Typography>
                    {!searchQuery && (
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={onAddPart}
                        sx={{ mt: 2 }}
                      >
                        Add Your First Part
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                parts.map((part) => (
                  <TableRow key={part._id} hover>
                    <TableCell>
                      {part.image ? (
                        <Avatar
                          src={part.image}
                          alt={part.name}
                          sx={{ width: 50, height: 50 }}
                          variant="rounded"
                        />
                      ) : (
                        <Avatar sx={{ width: 50, height: 50 }} variant="rounded">
                          <ImageIcon />
                        </Avatar>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: "medium", mb: 0.5 }}>
                        {part.name}
                      </Typography>
                      {part.description && (
                        <Typography variant="body2" color="text.secondary">
                          {part.description.length > 50
                            ? `${part.description.substring(0, 50)}...`
                            : part.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {part.sku ? (
                        <Chip
                          label={part.sku}
                          size="small"
                          sx={{
                            backgroundColor: "#e0f2fe",
                            color: "#0277bd",
                            fontWeight: "medium",
                          }}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No SKU
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: "medium", color: "#10b981" }}>
                        {formatPrice(part.price)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(part.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => onEdit(part._id)}
                          sx={{ minWidth: "auto" }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={
                            deleteLoading === part._id ? (
                              <CircularProgress size={16} />
                            ) : (
                              <DeleteIcon />
                            )
                          }
                          onClick={() => onDelete(part)}
                          disabled={deleteLoading === part._id}
                          sx={{ minWidth: "auto" }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default PartsTable;
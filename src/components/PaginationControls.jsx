import React from "react";
import {
  Box,
  Pagination,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const PaginationControls = ({
  page,
  pages,
  total,
  limit,
  onPageChange,
  onLimitChange,
  disabled = false,
}) => {
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mt: 3,
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      {/* Results info */}
      <Typography variant="body2" color="text.secondary">
        Showing {startItem} to {endItem} of {total} results
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Items per page */}
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Per page</InputLabel>
          <Select
            value={limit}
            label="Per page"
            onChange={(e) => onLimitChange?.(e.target.value)}
            disabled={disabled}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>

        {/* Pagination */}
        {pages > 1 && (
          <Pagination
            count={pages}
            page={page}
            onChange={(e, value) => onPageChange?.(value)}
            color="primary"
            disabled={disabled}
            showFirstButton
            showLastButton
          />
        )}
      </Box>
    </Box>
  );
};

export default PaginationControls;
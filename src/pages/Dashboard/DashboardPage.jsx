import { Box, Card, CardContent, Typography } from "@mui/material";

export default function DashboardPage() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F3F4F6",
        flexDirection: "column"
      }}
    >
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <img src="/images/logo.png" alt="Logo" width={150} height={150} />
      </Box>
    </Box>
  );
}

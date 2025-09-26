import { Box, Card, CardContent, Typography } from "@mui/material";
import LoginForm from "./LoginForm";

export default function LoginPage() {
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

      <Card sx={{ width: 400, p: 3, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
            Login to your account
          </Typography>
          <LoginForm />
        </CardContent>
      </Card>
    </Box>
  );
}

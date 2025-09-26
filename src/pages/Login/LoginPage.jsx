import { Box, Card, CardContent, Typography } from "@mui/material";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FAFAFA",
        flexDirection: "column",
        px: 2,
      }}
    >
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <img src="/images/logo.png" alt="Logo" width={150} />
      </Box>

      <Card
        sx={{
          width: "100%",      // full width up to maxWidth
          maxWidth: 400,      // card won't exceed 400px
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="bold"
            align="center"
            gutterBottom
          >
            Login to your account
          </Typography>
          <LoginForm />
        </CardContent>
      </Card>
    </Box>
  );
}

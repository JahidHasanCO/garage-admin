import { Alert } from "@mui/material";

export default function AlertMessage({ type="error", message }) {
  if (!message) return null;
  return <Alert severity={type} sx={{ mt: 1 }}>{message}</Alert>;
}

import { Button as MuiButton } from "@mui/material";

export default function Button({ text, onClick, loading=false }) {
  return (
    <MuiButton
      variant="contained"
      color="primary"
      fullWidth
      onClick={onClick}
      disabled={loading}
    >
      {loading ? "Loading..." : text}
    </MuiButton>
  );
}

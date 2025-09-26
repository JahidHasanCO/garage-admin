import { Button as MuiButton } from "@mui/material";
import { AppColors } from "../theme/colors";

export default function Button({ text, onClick, loading = false }) {
  return (
    <MuiButton
      variant="contained"
      fullWidth
      onClick={onClick}
      disabled={loading}
      sx={{
        backgroundColor: AppColors.primary,   // primary yellow
        color: AppColors.blackColor,             // black text
        borderRadius: "12px",         // rounded corners
        padding: "10px 16px",
        fontWeight: 600,
        boxShadow: "none",            // remove shadow
        "&:hover": {
          backgroundColor: AppColors.primaryDeep, // slightly darker on hover
          boxShadow: "none",          // ensure no shadow on hover
        },
        "&:disabled": {
          backgroundColor: AppColors.grayLightColor, // disabled style
          color: AppColors.blackColor,
        },
      }}
    >
      {loading ? "Loading..." : text}
    </MuiButton>
  );
}

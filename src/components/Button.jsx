import { Button as MuiButton } from "@mui/material";
import { AppColors } from "../theme/colors";

export default function Button({
  text,
  onClick,
  loading = false,
  variant = "contained", // default
  fullWidth = true,
  ...props
}) {
  const commonStyles = {
    borderRadius: "12px",
    padding: "10px 16px",
    fontWeight: 600,
    boxShadow: "none",
    "&:hover": { boxShadow: "none" },
    "&:focus": {
      outline: "none",
    },
    "&:focus-visible": {
      outline: "none",
    },
  };

  const variantStyles = {
    contained: {
      backgroundColor: AppColors.primaryDeep,
      color: AppColors.blackColor,
      "&:hover": {
        backgroundColor: AppColors.primary,
      },
      "&:disabled": {
        backgroundColor: AppColors.grayColor,
        color: AppColors.blackColor,
      },
    },
    outlined: {
      borderColor: AppColors.primaryDeep,
      color: AppColors.primaryDeep,
      backgroundColor: "transparent",
      "&:hover": {
        borderColor: AppColors.primary,
        backgroundColor: "rgba(0,0,0,0.04)",
      },
      "&:disabled": {
        borderColor: AppColors.grayColor,
        color: AppColors.grayColor,
      },
    },
    text: {
      color: AppColors.primaryDeep,
      "&:hover": {
        backgroundColor: "rgba(0,0,0,0.04)",
      },
      "&:disabled": {
        color: AppColors.grayColor,
      },
    },
  };

  return (
    <MuiButton
      variant={variant}
      fullWidth={fullWidth}
      onClick={onClick}
      disabled={loading}
      sx={{
        ...commonStyles,
        ...variantStyles[variant],
      }}
      {...props}
    >
      {loading ? "Loading..." : text}
    </MuiButton>
  );
}

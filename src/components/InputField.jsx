import { TextField } from "@mui/material";

export default function InputField({ label, type="text", value, onChange }) {
  return (
    <TextField
      fullWidth
      label={label}
      type={type}
      margin="normal"
      value={value}
      onChange={onChange}
    />
  );
}

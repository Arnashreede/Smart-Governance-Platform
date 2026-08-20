import {
  Paper,
  Avatar,
  Typography,
} from "@mui/material";

function OfficerQuickAction({
  title,
  subtitle,
  icon,
  color,
  onClick,
}) {
  return (
    <Paper
      elevation={2}
      onClick={onClick}
      sx={{
        p: 3,
        borderRadius: 4,
        cursor: "pointer",
        transition: ".3s",

        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: 6,
        },
      }}
    >
      <Avatar
        sx={{
          bgcolor: color,
          width: 56,
          height: 56,
          mb: 2,
        }}
      >
        {icon}
      </Avatar>

      <Typography
        fontWeight="bold"
      >
        {title}
      </Typography>

      <Typography
        color="text.secondary"
        mt={1}
      >
        {subtitle}
      </Typography>

    </Paper>
  );
}

export default OfficerQuickAction;
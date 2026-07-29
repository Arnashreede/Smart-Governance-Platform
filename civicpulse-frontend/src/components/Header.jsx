import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  IconButton,
  Badge,
  Chip,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";

function Header() {
  const fullName = localStorage.getItem("fullName") || "User";
  const email = localStorage.getItem("email") || "";
  const role = localStorage.getItem("role") || "";
  const userId = localStorage.getItem("userId") || "";

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "#fff",
        color: "#222",
        borderRadius: 3,
        mb: 3,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          py: 1,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            👋 Welcome, {fullName}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {email}
          </Typography>

          <Box
            sx={{
              mt: 1,
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={`ID : ${userId}`}
              color="primary"
              size="small"
            />

            <Chip
              label={role}
              color="success"
              size="small"
            />

            <Chip
              label={today}
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <IconButton>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton>
            <SettingsIcon />
          </IconButton>

          <Avatar
            sx={{
              bgcolor: "#1565C0",
              width: 50,
              height: 50,
            }}
          >
            {fullName.charAt(0).toUpperCase()}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
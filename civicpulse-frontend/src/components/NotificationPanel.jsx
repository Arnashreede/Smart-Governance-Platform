import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Box,
} from "@mui/material";

function NotificationPanel({ notifications = [] }) {
  const visibleNotifications = Array.isArray(notifications)
    ? notifications.slice(0, 5)
    : [];

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 8px 20px rgba(0,0,0,.08)",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={2}
        >
          Notifications
        </Typography>

        {visibleNotifications.length === 0 ? (
          <Typography color="text.secondary">
            No notifications available.
          </Typography>
        ) : (
          <List disablePadding>
            {visibleNotifications.map((item, index) => (
              <Box
                key={item?.id ?? `notification-${index}`}
              >
                <ListItem
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    px: 0,
                  }}
                >
                  <ListItemText
                    primary={item?.title || "Notification"}
                    secondary={item?.message || ""}
                    primaryTypographyProps={{
                      fontWeight: 600,
                    }}
                  />

                  {item?.type && (
                    <Chip
                      label={item.type}
                      color="primary"
                      size="small"
                    />
                  )}
                </ListItem>

                {index < visibleNotifications.length - 1 && (
                  <Divider />
                )}
              </Box>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}

export default NotificationPanel;
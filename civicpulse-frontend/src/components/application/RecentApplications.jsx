import {
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";

function RecentApplications({ applications }) {
  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6">
          📋 Recent Applications
        </Typography>

        <Divider sx={{ my: 2 }} />

        {applications.length === 0 ? (
          <Typography color="text.secondary">
            No applications found.
          </Typography>
        ) : (
          <List>
            {applications.map((app) => (
              <ListItem
                key={app.id}
                divider
                secondaryAction={
                  <Chip
                    label={app.status}
                    color={
                      app.status === "APPROVED"
                        ? "success"
                        : app.status === "REJECTED"
                        ? "error"
                        : "warning"
                    }
                  />
                }
              >
                <ListItemText
                  primary={app.applicationType}
                  secondary={`Application ID: ${app.id}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentApplications;
import {
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

function ServiceInformation({ info }) {
  if (!info) return null;

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6">
          ℹ Service Information
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography>
          <b>Department:</b> {info.department}
        </Typography>

        <Typography sx={{ mt: 1 }}>
          <b>Processing Time:</b> {info.processingTime}
        </Typography>

        <Typography sx={{ mt: 2, mb: 1 }}>
          <b>Required Documents</b>
        </Typography>

        <List dense>
          {info.documents.map((doc) => (
            <ListItem key={doc}>
              <ListItemText primary={`✔ ${doc}`} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export default ServiceInformation;
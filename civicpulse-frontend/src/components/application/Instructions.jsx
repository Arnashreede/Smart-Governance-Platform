import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

function Instructions() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">
          📌 Instructions
        </Typography>

        <List dense>
          <ListItem>
            <ListItemText primary="Upload PDF, JPG or PNG documents." />
          </ListItem>

          <ListItem>
            <ListItemText primary="Maximum file size: 5 MB." />
          </ListItem>

          <ListItem>
            <ListItemText primary="Upload clear scanned copies." />
          </ListItem>

          <ListItem>
            <ListItemText primary="Only one active application is allowed per service." />
          </ListItem>

          <ListItem>
            <ListItemText primary="Ensure all required documents are uploaded before submitting." />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}

export default Instructions;
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

function RecentActivity({ grievances = [] }) {
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
          Recent Complaints
        </Typography>

        <List>
          {grievances.length === 0 ? (
            <Typography color="text.secondary">
              No complaints available.
            </Typography>
          ) : (
            grievances.slice(0, 5).map((g) => (
              <div key={g.id}>
                <ListItem>
                  <ListItemText
                    primary={g.title}
                    secondary={`${g.department} • ${g.status}`}
                  />
                </ListItem>

                <Divider />
              </div>
            ))
          )}
        </List>

      </CardContent>
    </Card>
  );
}

export default RecentActivity;
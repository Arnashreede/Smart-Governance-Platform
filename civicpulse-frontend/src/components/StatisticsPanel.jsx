import {
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
} from "@mui/material";

function StatisticsPanel({ stats }) {
  const items = [
    { name: "Citizens", value: stats.citizens },
    { name: "Officers", value: stats.officers },
    { name: "Departments", value: stats.departments },
    { name: "Complaints", value: stats.complaints },
    { name: "Certificates", value: stats.certificates },
    { name: "Schemes", value: stats.schemes },
    { name: "Applications", value: stats.applications },
  ];

  return (
    <Card sx={{ mt: 4, borderRadius: 4 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          System Overview
        </Typography>

        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid key={item.name} size={{ xs: 12, md: 6 }}>
              <Typography>{item.name}</Typography>

              <Typography fontWeight="bold">
                {item.value}
              </Typography>

              <LinearProgress
                variant="determinate"
                value={Math.min(item.value, 100)}
                sx={{
                  mt: 1,
                  height: 8,
                  borderRadius: 5,
                }}
              />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default StatisticsPanel;
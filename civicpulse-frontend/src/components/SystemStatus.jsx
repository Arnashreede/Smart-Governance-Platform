import {
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";

function SystemStatus({ stats }) {
  return (
    <Card
      sx={{
        mt: 4,
        borderRadius: 4,
        boxShadow: "0 8px 20px rgba(0,0,0,.08)",
      }}
    >
      <CardContent>

        <Typography
          variant="h6"
          fontWeight="bold"
          mb={3}
        >
          System Summary
        </Typography>

        <Grid container spacing={3}>

          <Grid size={{ xs: 12, md: 3 }}>
            <Typography color="text.secondary">
              Registered Citizens
            </Typography>

            <Typography variant="h4" fontWeight="bold">
              {stats.citizens}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Typography color="text.secondary">
              Active Officers
            </Typography>

            <Typography variant="h4" fontWeight="bold">
              {stats.officers}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Typography color="text.secondary">
              Welfare Schemes
            </Typography>

            <Typography variant="h4" fontWeight="bold">
              {stats.schemes}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Typography color="text.secondary">
              Applications
            </Typography>

            <Typography variant="h4" fontWeight="bold">
              {stats.applications}
            </Typography>
          </Grid>

        </Grid>

      </CardContent>
    </Card>
  );
}

export default SystemStatus;
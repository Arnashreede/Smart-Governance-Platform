import { Card, CardContent, Typography, Box } from "@mui/material";

function DashboardCard({ title, value, icon }) {
  return (
    <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
      <CardContent sx={{ textAlign: "center" }}>
        <Box sx={{ color: "#1565C0", fontSize: 45 }}>
          {icon}
        </Box>

        <Typography variant="h4" fontWeight="bold">
          {value}
        </Typography>

        <Typography color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default DashboardCard;
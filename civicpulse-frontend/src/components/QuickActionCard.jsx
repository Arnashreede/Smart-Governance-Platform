import { Card, CardContent, Typography } from "@mui/material";

function QuickActionCard({ title, icon, onClick }) {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: "pointer",
        borderRadius: 4,
        textAlign: "center",
        transition: "0.3s",
        boxShadow: "0 8px 20px rgba(0,0,0,.08)",

        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 15px 30px rgba(0,0,0,.15)",
        },
      }}
    >
      <CardContent>
        <Typography sx={{ fontSize: 45 }}>
          {icon}
        </Typography>

        <Typography
          variant="h6"
          fontWeight="bold"
          mt={2}
        >
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default QuickActionCard;
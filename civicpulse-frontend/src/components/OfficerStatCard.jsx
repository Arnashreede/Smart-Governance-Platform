import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
} from "@mui/material";

function OfficerStatCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 5,
        transition: ".3s",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 8,
        },
      }}
    >
      <CardContent>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >

          <div>

            <Typography color="text.secondary">
              {title}
            </Typography>

            <Typography
              variant="h4"
              fontWeight="bold"
              mt={1}
            >
              {value}
            </Typography>

          </div>

          <Avatar
            sx={{
              bgcolor: color,
              width: 60,
              height: 60,
            }}
          >
            {icon}
          </Avatar>

        </Stack>

      </CardContent>
    </Card>
  );
}

export default OfficerStatCard;
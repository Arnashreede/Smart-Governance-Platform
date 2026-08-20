import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";

function ActionCard({ title, onClick }) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 8px 20px rgba(0,0,0,.08)",
        transition: "all .3s",
        height: "100%",

        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 15px 30px rgba(0,0,0,.15)",
        },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          height: 180,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight="bold"
            textAlign="center"
          >
            {title}
          </Typography>

          <Typography
            color="text.secondary"
            textAlign="center"
            mt={2}
          >
            Manage and view {title.toLowerCase()}.
          </Typography>
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={onClick}
          sx={{
            borderRadius: 3,
          }}
        >
          Open
        </Button>
      </CardContent>
    </Card>
  );
}

export default ActionCard;
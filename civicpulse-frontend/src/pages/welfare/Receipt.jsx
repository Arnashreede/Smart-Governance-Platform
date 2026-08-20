import {
  Container,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
  Box,
} from "@mui/material";
import { useLocation } from "react-router-dom";

function Receipt() {

  const { state } = useLocation();

  const application = state;

  if (!application) {
    return <Typography>No receipt found.</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>

      <Card>

        <CardContent>

          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
          >
            CivicPulse Welfare Receipt
          </Typography>

          <Typography
            align="center"
            color="text.secondary"
          >
            Government of India
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography><strong>Receipt No:</strong> WEL-{application.id}</Typography>

          <Typography><strong>Application ID:</strong> {application.id}</Typography>

          <Typography><strong>Citizen ID:</strong> {application.citizenId}</Typography>

          <Typography><strong>Citizen Name:</strong> {application.fullName}</Typography>

          <Typography><strong>Scheme:</strong> {application.schemeName}</Typography>

          <Typography><strong>Status:</strong> {application.status}</Typography>

          <Typography>
            <strong>Benefit Amount:</strong> ₹
            {Number(application.benefitAmount || 0).toLocaleString()}
          </Typography>

          <Typography>
            <strong>Payment Status:</strong>{" "}
            {application.benefitIssued ? "PAID" : "PENDING"}
          </Typography>

          <Typography>
            <strong>Applied On:</strong>{" "}
            {new Date(application.appliedAt).toLocaleDateString()}
          </Typography>

          {application.benefitIssuedAt && (
            <Typography>
              <strong>Payment Date:</strong>{" "}
              {new Date(application.benefitIssuedAt).toLocaleDateString()}
            </Typography>
          )}

          <Divider sx={{ my: 3 }} />

          <Box textAlign="center">

            <Button
              variant="contained"
              onClick={() => window.print()}
            >
              Print Receipt
            </Button>

          </Box>

        </CardContent>

      </Card>

    </Container>
  );
}

export default Receipt;
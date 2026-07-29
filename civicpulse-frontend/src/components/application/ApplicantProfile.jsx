import {
  Card,
  CardContent,
  Typography,
  Divider,
  Chip,
} from "@mui/material";

function ApplicantProfile() {
  const citizenId = localStorage.getItem("userId");
  const applicantName = localStorage.getItem("fullName");
  const email = localStorage.getItem("email");

  const today = new Date().toLocaleDateString();

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6">
          👤 Applicant Profile
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography>
          <b>Name:</b> {applicantName}
        </Typography>

        <Typography>
          <b>Citizen ID:</b> {citizenId}
        </Typography>

        <Typography>
          <b>Email:</b> {email}
        </Typography>

        <Typography>
          <b>Date:</b> {today}
        </Typography>

        <Chip
          sx={{ mt: 2 }}
          color="primary"
          label="Ready to Apply"
        />
      </CardContent>
    </Card>
  );
}

export default ApplicantProfile;
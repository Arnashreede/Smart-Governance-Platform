import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

import {
  ArrowBack,
  CheckCircle,
  Cancel,
  Description,
} from "@mui/icons-material";

import { useNavigate, useParams } from "react-router-dom";

import {
  getApplicationById,
  approveApplication,
  rejectApplication,
} from "../../api/welfareApi";

function ViewApplication() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [application, setApplication] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {

    loadApplication();

  }, []);

  const loadApplication = async () => {

    try {

      const response = await getApplicationById(id);

      setApplication(response.data);

    } catch (err) {

      console.error(err);

      setError("Failed to load application.");

    } finally {

      setLoading(false);

    }

  };

  const handleApprove = async () => {

    try {

      await approveApplication(application.id);

      alert("Application approved successfully.");

      navigate("/admin/welfare/applications");

    } catch (err) {

      console.error(err);

      alert("Failed to approve application.");

    }

  };

  const handleReject = async () => {

    try {

      await rejectApplication(
        application.id,
        "Rejected by Officer"
      );

      alert("Application rejected.");

      navigate("/admin/welfare/applications");

    } catch (err) {

      console.error(err);

      alert("Failed to reject application.");

    }

  };

  if (loading) {

    return (

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 10,
        }}
      >

        <CircularProgress />

      </Box>

    );

  }

  if (error) {

    return (

      <Alert severity="error">

        {error}

      </Alert>

    );

  }
    return (
    <Box sx={{ p: 3 }}>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
        }}
      >

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >

          <Box>

            <Typography
              variant="h4"
              fontWeight="bold"
            >
              Welfare Application Details
            </Typography>

            <Typography color="text.secondary">
              Review welfare application submitted by the citizen
            </Typography>

          </Box>

          <Chip
            label={application.status}
            color={
              application.status === "APPROVED"
                ? "success"
                : application.status === "REJECTED"
                ? "error"
                : application.status === "UNDER_REVIEW"
                ? "info"
                : "warning"
            }
            sx={{
              px: 2,
              fontWeight: "bold",
            }}
          />

        </Box>

        <Grid container spacing={3}>

          <Grid item xs={12} md={6}>

            <Card sx={{ height: "100%" }}>

              <CardContent>

                <Typography
                  variant="h6"
                  gutterBottom
                >
                  Citizen Information
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Typography>
                  <b>Citizen ID :</b> {application.citizenId}
                </Typography>

                <Typography>
                  <b>Full Name :</b> {application.fullName}
                </Typography>

                <Typography>
                  <b>Age :</b> {application.age}
                </Typography>

                <Typography>
                  <b>District :</b> {application.district}
                </Typography>

                <Typography>
                  <b>Occupation :</b> {application.occupation}
                </Typography>

                <Typography>
                  <b>Annual Income :</b> ₹
                  {Number(application.annualIncome).toLocaleString()}
                </Typography>

              </CardContent>

            </Card>

          </Grid>

          <Grid item xs={12} md={6}>

            <Card sx={{ height: "100%" }}>

              <CardContent>

                <Typography
                  variant="h6"
                  gutterBottom
                >
                  Scheme Information
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Typography>
                  <b>Scheme ID :</b> {application.schemeId}
                </Typography>

                <Typography>
                  <b>Scheme Name :</b> {application.schemeName}
                </Typography>

                <Typography>
                  <b>Eligibility :</b> {application.eligibilityStatus}
                </Typography>

              </CardContent>

            </Card>

          </Grid>
                  </Grid>

        <Card sx={{ mt: 3 }}>

          <CardContent>

            <Typography
              variant="h6"
              gutterBottom
            >
              Application Information
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={3}>

              <Grid item xs={12} md={4}>

                <Typography fontWeight="bold">
                  Application Status
                </Typography>

                <Chip
                  sx={{ mt: 1 }}
                  label={application.status}
                  color={
                    application.status === "APPROVED"
                      ? "success"
                      : application.status === "REJECTED"
                      ? "error"
                      : "warning"
                  }
                />

              </Grid>

              <Grid item xs={12} md={4}>

                <Typography fontWeight="bold">
                  Eligibility Status
                </Typography>

                <Typography sx={{ mt: 1 }}>
                  {application.eligibilityStatus}
                </Typography>

              </Grid>

              <Grid item xs={12} md={4}>

                <Typography fontWeight="bold">
                  Applied On
                </Typography>

                <Typography sx={{ mt: 1 }}>
                  {application.appliedAt}
                </Typography>

              </Grid>

            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="subtitle1"
              fontWeight="bold"
            >
              Remarks
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              {application.remarks || "No remarks available."}
            </Typography>

          </CardContent>

        </Card>

        <Card sx={{ mt: 3 }}>

          <CardContent>

            <Typography
              variant="h6"
              gutterBottom
            >
              Uploaded Documents
            </Typography>

            <Divider sx={{ mb: 2 }} />

            {application.documents &&
            application.documents.length > 0 ? (

              application.documents.map((doc) => (

                <Box
                  key={doc.id}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    py: 1,
                    borderBottom: "1px solid #eee",
                  }}
                >

                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >

                    <Description color="primary" />

                    <Typography>

                      {doc.documentName}

                    </Typography>

                  </Box>

                  <Button
    variant="outlined"
    size="small"
    onClick={() =>
        window.open(
            `http://localhost:8088/documents/${doc.id}`,
            "_blank"
        )
    }
>
    View
</Button>

                </Box>

              ))

            ) : (

              <Typography color="text.secondary">

                No uploaded documents.

              </Typography>

            )}
                      </CardContent>

        </Card>

        <Box
          display="flex"
          justifyContent="flex-end"
          gap={2}
          mt={4}
        >

          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>

          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
            disabled={application.status === "APPROVED"}
            onClick={handleApprove}
          >
            Approve
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<Cancel />}
            disabled={application.status === "REJECTED"}
            onClick={handleReject}
          >
            Reject
          </Button>

        </Box>

      </Paper>

    </Box>

  );

}

export default ViewApplication;
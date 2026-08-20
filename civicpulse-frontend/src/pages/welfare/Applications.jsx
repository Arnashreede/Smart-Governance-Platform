import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Button,
  Box,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Visibility,
  Assignment,
} from "@mui/icons-material";
import { getCitizenApplications } from "../../api/welfareApi";

function Applications() {
  const navigate = useNavigate();

  // IMPORTANT:
  // Welfare applications are linked using USER ID.
  const userId = Number(localStorage.getItem("userId"));

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    if (!userId) {
      setError(
        "User information was not found. Please login again."
      );
      setLoading(false);
      return;
    }

    try {
      console.log(
        "========== LOADING WELFARE APPLICATIONS =========="
      );
      console.log("USER ID:", userId);

      const response =
        await getCitizenApplications(userId);

      console.log(
        "APPLICATION API RESPONSE:",
        response
      );

      console.log(
        "APPLICATION DATA:",
        response.data
      );

      setApplications(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (err) {
      console.error(
        "Failed to load applications:",
        err
      );

      setError(
        "Failed to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const schemeName =
        app.schemeName ||
        app.scheme?.schemeName ||
        "";

      const matchesSearch =
        schemeName
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        !status ||
        app.status === status;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [applications, search, status]);

  const getStatusColor = (applicationStatus) => {
    switch (applicationStatus) {
      case "APPROVED":
        return "success";

      case "REJECTED":
        return "error";

      case "UNDER_REVIEW":
        return "info";

      case "SUBMITTED":
        return "warning";

      default:
        return "default";
    }
  };

  const formatStatus = (value) => {
    if (!value) {
      return "Unknown";
    }

    return value
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container
        maxWidth="xl"
        sx={{ py: 4 }}
      >
        <Alert severity="error">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 4,
        px: {
          xs: 2,
          md: 4,
        },
      }}
    >
      {/* ================= HEADER ================= */}

      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 1,
          }}
        >
          <Assignment
            sx={{
              fontSize: 38,
            }}
          />

          <Typography
            variant="h4"
            fontWeight={700}
          >
            My Applications
          </Typography>
        </Box>

        <Typography
          color="text.secondary"
        >
          Track all welfare schemes you have
          applied for.
        </Typography>
      </Box>

      {/* ================= FILTERS ================= */}

      <Card
        elevation={2}
        sx={{
          borderRadius: 3,
          mb: 4,
        }}
      >
        <CardContent>
          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              xs={12}
              md={8}
            >
              <TextField
                fullWidth
                label="Search Scheme"
                placeholder="Search by scheme name"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={4}
            >
              <TextField
                select
                fullWidth
                label="Application Status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >
                <MenuItem value="">
                  All Applications
                </MenuItem>

                <MenuItem value="SUBMITTED">
                  Submitted
                </MenuItem>

                <MenuItem value="UNDER_REVIEW">
                  Under Review
                </MenuItem>

                <MenuItem value="APPROVED">
                  Approved
                </MenuItem>

                <MenuItem value="REJECTED">
                  Rejected
                </MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ================= APPLICATION COUNT ================= */}

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body1"
          color="text.secondary"
        >
          Showing{" "}
          <strong>
            {filteredApplications.length}
          </strong>{" "}
          application
          {filteredApplications.length !== 1
            ? "s"
            : ""}
        </Typography>
      </Box>

      {/* ================= APPLICATION CARDS ================= */}

      {filteredApplications.length > 0 ? (
        <Grid
          container
          spacing={3}
        >
          {filteredApplications.map(
            (app) => {
              const schemeName =
                app.schemeName ||
                app.scheme?.schemeName ||
                "Welfare Scheme";

              const schemeType =
                app.schemeType ||
                app.scheme?.schemeType ||
                "Welfare";

              return (
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={4}
                  key={app.id}
                >
                  <Card
                    elevation={3}
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      display: "flex",
                      flexDirection: "column",
                      transition:
                        "0.2s ease",
                      "&:hover": {
                        transform:
                          "translateY(-4px)",
                        boxShadow: 7,
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection:
                          "column",
                        flexGrow: 1,
                        p: 3,
                      }}
                    >
                      {/* SCHEME NAME */}

                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          mb: 1,
                          lineHeight: 1.3,
                        }}
                      >
                        {schemeName}
                      </Typography>

                      <Chip
                        size="small"
                        label={schemeType}
                        sx={{
                          alignSelf:
                            "flex-start",
                          mb: 2,
                        }}
                      />

                      <Divider
                        sx={{ mb: 2 }}
                      />

                      {/* APPLICATION DETAILS */}

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection:
                            "column",
                          gap: 1,
                        }}
                      >
                        <Typography>
                          <strong>
                            Applicant:
                          </strong>{" "}
                          {app.fullName ||
                            "-"}
                        </Typography>

                        <Typography>
                          <strong>
                            District:
                          </strong>{" "}
                          {app.district ||
                            "-"}
                        </Typography>

                        <Typography>
                          <strong>
                            Annual Income:
                          </strong>{" "}
                          {app.annualIncome !=
                          null
                            ? `₹${Number(
                                app.annualIncome
                              ).toLocaleString(
                                "en-IN"
                              )}`
                            : "-"}
                        </Typography>

                        <Typography>
                          <strong>
                            Applied On:
                          </strong>{" "}
                          {app.appliedAt
                            ? new Date(
                                app.appliedAt
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "-"}
                        </Typography>
                      </Box>

                      {/* STATUS */}

                      <Box
                        sx={{
                          display: "flex",
                          flexWrap:
                            "wrap",
                          gap: 1,
                          mt: 2,
                        }}
                      >
                        <Chip
                          label={formatStatus(
                            app.status
                          )}
                          color={getStatusColor(
                            app.status
                          )}
                          size="small"
                        />

                        <Chip
                          label={
                            app.eligibilityStatus
                              ? formatStatus(
                                  app.eligibilityStatus
                                )
                              : "Eligibility Pending"
                          }
                          color={
                            app.eligibilityStatus ===
                            "ELIGIBLE"
                              ? "success"
                              : app.eligibilityStatus ===
                                "NOT_ELIGIBLE"
                              ? "error"
                              : "default"
                          }
                          size="small"
                        />
                      </Box>

                      {/* REMARKS */}

                      <Box
                        sx={{
                          mt: 2,
                          minHeight: 45,
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {app.remarks ||
                            "No remarks available."}
                        </Typography>
                      </Box>

                      {/* BUTTON */}

                      <Box
                        sx={{
                          mt: "auto",
                          pt: 3,
                        }}
                      >
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={
                            <Visibility />
                          }
                          onClick={() =>
                            navigate(
                              `/welfare/application/${app.id}`
                            )
                          }
                          sx={{
                            borderRadius: 2,
                            py: 1.2,
                            fontWeight: 600,
                          }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            }
          )}
        </Grid>
      ) : (
        /* ================= EMPTY STATE ================= */

        <Card
          elevation={1}
          sx={{
            borderRadius: 3,
          }}
        >
          <CardContent
            sx={{
              py: 7,
              textAlign: "center",
            }}
          >
            <Assignment
              sx={{
                fontSize: 60,
                mb: 2,
                opacity: 0.35,
              }}
            />

            <Typography
              variant="h6"
              fontWeight={600}
              gutterBottom
            >
              No applications found
            </Typography>

            <Typography
              color="text.secondary"
            >
              You have not submitted any
              welfare applications yet.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default Applications;
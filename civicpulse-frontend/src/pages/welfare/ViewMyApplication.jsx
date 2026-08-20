import { useEffect, useState } from "react";

import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";

import {
  ArrowBack,
  Description,
  Print,
  ReceiptLong,
} from "@mui/icons-material";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getApplicationById,
} from "../../api/welfareApi";


function ViewMyApplication() {

  const navigate = useNavigate();
  const { id } = useParams();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    loadApplication();
  }, [id]);


  const loadApplication = async () => {

    try {

      const response = await getApplicationById(id);

      setApplication(response.data);

    } catch (err) {

      console.error("Failed to load application:", err);

      setError("Failed to load application.");

    } finally {

      setLoading(false);

    }

  };


  /* =========================================================
     HELPERS
  ========================================================= */

  const formatDate = (value) => {

    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  };


  const formatMoney = (value) => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "-";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return value;
    }

    return `₹${number.toLocaleString("en-IN")}`;

  };


  const statusColor = (status) => {

    switch (status) {

      case "APPROVED":
        return "success";

      case "REJECTED":
        return "error";

      case "UNDER_REVIEW":
        return "info";

      default:
        return "warning";

    }

  };


  /* =========================================================
     REUSABLE INFORMATION ROW
  ========================================================= */

  const InfoRow = ({ label, value }) => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return null;
    }

    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "180px 1fr",
          },
          gap: {
            xs: 0.5,
            sm: 2,
          },
          py: 1.1,
          borderBottom: "1px solid #edf0f5",
          alignItems: "center",
        }}
      >

        <Typography
          sx={{
            fontWeight: 700,
            color: "#344054",
            fontSize: "0.95rem",
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            color: "#475467",
            fontSize: "0.95rem",
            wordBreak: "break-word",
          }}
        >
          {value}
        </Typography>

      </Box>
    );

  };


  /* =========================================================
     CARD STYLE
  ========================================================= */

  const cardSx = {
    height: "100%",
    borderRadius: 3,
    border: "1px solid #e4e7ec",
    boxShadow: "0 4px 16px rgba(16, 24, 40, 0.06)",
    overflow: "hidden",
  };


  const cardContentSx = {
    p: {
      xs: 2.5,
      sm: 3,
    },
    "&:last-child": {
      pb: {
        xs: 2.5,
        sm: 3,
      },
    },
  };


  /* =========================================================
     LOADING
  ========================================================= */

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


  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {

    return (
      <Container
        maxWidth="lg"
        sx={{ py: 5 }}
      >
        <Alert severity="error">
          {error}
        </Alert>
      </Container>
    );

  }


  if (!application) {

    return (
      <Container
        maxWidth="lg"
        sx={{ py: 5 }}
      >
        <Alert severity="info">
          Application not found.
        </Alert>
      </Container>
    );

  }


  /* =========================================================
     MAIN PAGE
  ========================================================= */

  return (

    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f6f8fc",
        py: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >

      <Container
        maxWidth="xl"
        sx={{
          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },
        }}
      >


        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 2,
            mb: 3,
          }}
        >

          <Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#102a43",
                fontSize: {
                  xs: "1.7rem",
                  sm: "2rem",
                  md: "2.25rem",
                },
              }}
            >
              Application Details
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                color: "#667085",
                fontSize: "1rem",
              }}
            >
              View your submitted welfare application.
            </Typography>

          </Box>


          <Chip
            label={application.status || "SUBMITTED"}
            color={statusColor(application.status)}
            sx={{
              fontWeight: 700,
              px: 1.5,
              py: 2.5,
              fontSize: "0.9rem",
              borderRadius: 2,
            }}
          />

        </Box>


        {/* =====================================================
            TOP INFORMATION
        ===================================================== */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },

            gap: 3,

            alignItems: "stretch",

            mb: 3,
          }}
        >


          {/* ===================================================
              CITIZEN INFORMATION
          =================================================== */}

          <Card sx={cardSx}>

            <CardContent sx={cardContentSx}>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: "#102a43",
                  mb: 1,
                }}
              >
                Citizen Information
              </Typography>

              <Divider sx={{ mb: 1 }} />

              <InfoRow
                label="Citizen ID"
                value={application.citizenId}
              />

              <InfoRow
                label="Full Name"
                value={application.fullName}
              />

              <InfoRow
                label="Age"
                value={application.age}
              />

              <InfoRow
                label="District"
                value={application.district}
              />

              <InfoRow
                label="Annual Income"
                value={formatMoney(application.annualIncome)}
              />

              {application.occupation && (
                <InfoRow
                  label="Occupation"
                  value={application.occupation}
                />
              )}

              {application.accountHolderName && (
                <InfoRow
                  label="Account Holder"
                  value={application.accountHolderName}
                />
              )}

              {application.bankName && (
                <InfoRow
                  label="Bank Name"
                  value={application.bankName}
                />
              )}

              {application.bankAccount && (
                <InfoRow
                  label="Bank Account"
                  value={application.bankAccount}
                />
              )}

              {application.ifscCode && (
                <InfoRow
                  label="IFSC"
                  value={application.ifscCode}
                />
              )}

            </CardContent>

          </Card>


          {/* ===================================================
              SCHEME INFORMATION
          =================================================== */}

          <Card sx={cardSx}>

            <CardContent sx={cardContentSx}>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: "#102a43",
                  mb: 1,
                }}
              >
                Scheme Information
              </Typography>

              <Divider sx={{ mb: 1 }} />

              <InfoRow
                label="Scheme ID"
                value={application.schemeId}
              />

              <InfoRow
                label="Scheme Name"
                value={application.schemeName}
              />


              {/* Eligibility */}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "180px 1fr",
                  },
                  gap: {
                    xs: 0.5,
                    sm: 2,
                  },
                  py: 1.1,
                  borderBottom: "1px solid #edf0f5",
                  alignItems: "center",
                }}
              >

                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#344054",
                    fontSize: "0.95rem",
                  }}
                >
                  Eligibility Status
                </Typography>

                <Box>

                  <Chip
                    size="small"
                    label={
                      application.eligibilityStatus ||
                      "NOT AVAILABLE"
                    }
                    color={
                      application.eligibilityStatus ===
                      "ELIGIBLE"
                        ? "success"
                        : "error"
                    }
                    sx={{
                      fontWeight: 700,
                    }}
                  />

                </Box>

              </Box>


              <InfoRow
                label="Applied On"
                value={formatDate(application.appliedAt)}
              />


              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#f8f9fc",
                  border: "1px solid #eaecf0",
                }}
              >

                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#344054",
                    mb: 0.5,
                  }}
                >
                  Application Status
                </Typography>

                <Chip
                  size="small"
                  label={application.status}
                  color={statusColor(application.status)}
                  sx={{
                    fontWeight: 700,
                  }}
                />

              </Box>

            </CardContent>

          </Card>

        </Box>


        {/* =====================================================
            APPLICATION REMARKS
        ===================================================== */}

        <Card
          sx={{
            ...cardSx,
            mb: 3,
          }}
        >

          <CardContent sx={cardContentSx}>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "#102a43",
                mb: 1,
              }}
            >
              Application Remarks
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Box
              sx={{
                backgroundColor: "#f8fafc",
                border: "1px solid #eaecf0",
                borderRadius: 2,
                p: 2,
                minHeight: 70,
              }}
            >

              <Typography
                color="text.secondary"
                sx={{
                  lineHeight: 1.7,
                }}
              >
                {application.remarks ||
                  "No remarks available."}
              </Typography>

            </Box>

          </CardContent>

        </Card>


        {/* =====================================================
            SCHEME SPECIFIC INFORMATION
        ===================================================== */}

        <Card
          sx={{
            ...cardSx,
            mb: 3,
          }}
        >

          <CardContent sx={cardContentSx}>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "#102a43",
                mb: 1,
              }}
            >
              Scheme Specific Information
            </Typography>

            <Divider sx={{ mb: 1 }} />


            {/* ================= STUDENT ================= */}

            {application.collegeName && (

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                  },
                  columnGap: 4,
                }}
              >

                <InfoRow
                  label="College"
                  value={application.collegeName}
                />

                <InfoRow
                  label="Course"
                  value={application.course}
                />

                <InfoRow
                  label="Year"
                  value={application.year}
                />

                <InfoRow
                  label="Roll Number"
                  value={application.rollNumber}
                />

              </Box>

            )}


            {/* ================= HOUSING ================= */}

            {application.houseType && (

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                  },
                  columnGap: 4,
                }}
              >

                <InfoRow
                  label="House Type"
                  value={application.houseType}
                />

                <InfoRow
                  label="Family Members"
                  value={application.familyMembers}
                />

                <InfoRow
                  label="Land Ownership"
                  value={
                    application.landOwnership
                      ? "Yes"
                      : "No"
                  }
                />

              </Box>

            )}


            {/* ================= FARMER ================= */}

            {application.landArea && (

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                  },
                  columnGap: 4,
                }}
              >

                <InfoRow
                  label="Land Area"
                  value={`${application.landArea} Acres`}
                />

                <InfoRow
                  label="Crop Type"
                  value={application.cropType}
                />

                <InfoRow
                  label="Bank Account"
                  value={application.bankAccount}
                />

                <InfoRow
                  label="IFSC Code"
                  value={application.ifscCode}
                />

              </Box>

            )}


            {/* ================= PENSION ================= */}

            {application.maritalStatus && (

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                  },
                  columnGap: 4,
                }}
              >

                <InfoRow
                  label="Marital Status"
                  value={application.maritalStatus}
                />

                <InfoRow
                  label="Pension Category"
                  value={application.pensionCategory}
                />

                <InfoRow
                  label="Bank Account"
                  value={application.bankAccount}
                />

                <InfoRow
                  label="IFSC Code"
                  value={application.ifscCode}
                />

                {application.disabilityPercentage && (
                  <InfoRow
                    label="Disability Percentage"
                    value={`${application.disabilityPercentage}%`}
                  />
                )}

              </Box>

            )}


            {/* NOTHING AVAILABLE */}

            {!application.collegeName &&
              !application.houseType &&
              !application.landArea &&
              !application.maritalStatus && (

                <Alert severity="info">
                  No additional scheme-specific information
                  is available.
                </Alert>

              )}

          </CardContent>

        </Card>


        {/* =====================================================
            UPLOADED DOCUMENTS
        ===================================================== */}

        <Card
          sx={{
            ...cardSx,
            mb: 3,
          }}
        >

          <CardContent sx={cardContentSx}>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: "#102a43",
                }}
              >
                Uploaded Documents
              </Typography>

              {application.documents?.length > 0 && (
                <Chip
                  size="small"
                  label={`${application.documents.length} document${
                    application.documents.length > 1
                      ? "s"
                      : ""
                  }`}
                  color="primary"
                  variant="outlined"
                />
              )}

            </Box>

            <Divider sx={{ mb: 2 }} />


            {application.documents?.length > 0 ? (

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "1fr 1fr 1fr",
                  },
                  gap: 2,
                }}
              >

                {application.documents.map((doc) => (

                  <Box
                    key={doc.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                      p: 2,
                      border: "1px solid #e4e7ec",
                      borderRadius: 2,
                      backgroundColor: "#fafbfc",
                      minWidth: 0,
                    }}
                  >

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        minWidth: 0,
                      }}
                    >

                      <Description
                        color="primary"
                        sx={{
                          flexShrink: 0,
                        }}
                      />

                      <Box
                        sx={{
                          minWidth: 0,
                        }}
                      >

                        <Typography
                          fontWeight={700}
                          sx={{
                            fontSize: "0.9rem",
                            wordBreak: "break-word",
                          }}
                        >
                          {doc.documentName}
                        </Typography>

                        {doc.fileName && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              wordBreak: "break-word",
                            }}
                          >
                            {doc.fileName}
                          </Typography>
                        )}

                      </Box>

                    </Box>


                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        flexShrink: 0,
                      }}
                      onClick={() =>
                        window.open(
                          `http://localhost:8080/documents/${doc.id}`,
                          "_blank"
                        )
                      }
                    >
                      View
                    </Button>

                  </Box>

                ))}

              </Box>

            ) : (

              <Alert severity="info">
                No uploaded documents.
              </Alert>

            )}

          </CardContent>

        </Card>


        {/* =====================================================
            PAYMENT STATUS
        ===================================================== */}

        <Card
          sx={{
            ...cardSx,
            mb: 3,
          }}
        >

          <CardContent sx={cardContentSx}>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "#102a43",
                mb: 1,
              }}
            >
              Payment Status
            </Typography>

            <Divider sx={{ mb: 2 }} />


            <Box
              sx={{
                display: "flex",
                alignItems: {
                  xs: "flex-start",
                  sm: "center",
                },
                justifyContent: "space-between",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                gap: 2,
              }}
            >

              <Box>

                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#344054",
                  }}
                >
                  Benefit Payment
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Current payment status of your welfare benefit.
                </Typography>

              </Box>


              {application.benefitIssued ? (

                <Chip
                  label="PAID"
                  color="success"
                  sx={{
                    fontWeight: 700,
                    px: 1,
                  }}
                />

              ) : (

                <Chip
                  label="PENDING"
                  color="warning"
                  sx={{
                    fontWeight: 700,
                    px: 1,
                  }}
                />

              )}

            </Box>


            {application.benefitIssued && (

              <Box sx={{ mt: 2 }}>

                <InfoRow
                  label="Payment Date"
                  value={formatDate(
                    application.benefitIssuedAt
                  )}
                />

              </Box>

            )}


            {application.status === "APPROVED" && (

              <Button
                variant="contained"
                startIcon={<ReceiptLong />}
                sx={{
                  mt: 3,
                  px: 3,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                }}
                onClick={() =>
                  navigate("/receipt", {
                    state: application,
                  })
                }
              >
                Download Receipt
              </Button>

            )}

          </CardContent>

        </Card>


        {/* =====================================================
            BOTTOM ACTIONS
        ===================================================== */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "stretch",
              sm: "center",
            },
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 2,
            mt: 3,
            pb: 3,
          }}
        >

          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Back
          </Button>


          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: {
                xs: "column",
                sm: "row",
              },
            }}
          >

            <Button
              variant="outlined"
              startIcon={<Print />}
              onClick={() => window.print()}
              sx={{
                borderRadius: 2,
                px: 3,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Print Application
            </Button>


            {application.status === "APPROVED" && (

              <Button
                variant="contained"
                color="success"
                startIcon={<ReceiptLong />}
                onClick={() =>
                  navigate("/receipt", {
                    state: application,
                  })
                }
                sx={{
                  borderRadius: 2,
                  px: 3,
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Download Approval
              </Button>

            )}

          </Box>

        </Box>

      </Container>

    </Box>

  );

}


export default ViewMyApplication;
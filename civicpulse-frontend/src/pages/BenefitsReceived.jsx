import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Divider,
  Stack,
  Avatar,
  Button,
} from "@mui/material";

import {
  VolunteerActivism,
  CheckCircle,
  AccountBalanceWallet,
  CalendarMonth,
  ReceiptLong,
} from "@mui/icons-material";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import api from "../api/axios";

function BenefitsReceived() {
  // Your project uses User Service ID as the common identity.
  const citizenId = localStorage.getItem("userId");

  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const citizenName =
    localStorage.getItem("fullName") ||
    localStorage.getItem("username") ||
    "Citizen";

  useEffect(() => {
    const loadBenefits = async () => {
      if (!citizenId) {
        setError(
          "Citizen information was not found. Please login again."
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/beneficiaries/citizen/${citizenId}`
        );

        const data = Array.isArray(response.data)
          ? response.data
          : [];

        // Show only benefits that are actually issued.
        const issuedBenefits = data.filter(
          (benefit) => benefit.benefitIssued === true
        );

        setBenefits(issuedBenefits);
      } catch (err) {
        console.error("Failed to load benefits:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load your received benefits."
        );

        setBenefits([]);
      } finally {
        setLoading(false);
      }
    };

    loadBenefits();
  }, [citizenId]);

  const totalReceived = benefits.reduce(
    (sum, benefit) =>
      sum + Number(benefit.benefitAmount || 0),
    0
  );

  // =========================================================
  // VIEW / PRINT RECEIPT
  // =========================================================

  const printReceipt = (benefit) => {
    const receiptWindow = window.open(
      "",
      "_blank",
      "width=850,height=950"
    );

    if (!receiptWindow) {
      alert("Please allow pop-ups to view the receipt.");
      return;
    }

    const formatDate = (date) => {
      if (!date) return "N/A";

      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    };

    const amount = Number(
      benefit.benefitAmount || 0
    ).toLocaleString("en-IN");

    const currentUserId =
      localStorage.getItem("userId") || "N/A";

    const receiptHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>Benefit Issue Receipt</title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 35px;
            background: #f4f6f8;
            font-family: Arial, Helvetica, sans-serif;
            color: #222;
          }

          .receipt {
            width: 100%;
            max-width: 760px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #dddddd;
            box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
          }

          .header {
            padding: 35px 30px;
            text-align: center;
            color: white;
            background: linear-gradient(
              135deg,
              #6a1b9a,
              #8e24aa,
              #ab47bc
            );
          }

          .header h1 {
            margin: 0;
            font-size: 30px;
            letter-spacing: 0.5px;
          }

          .header h2 {
            margin: 10px 0 0;
            font-size: 21px;
            font-weight: 500;
          }

          .status {
            display: inline-block;
            margin-top: 20px;
            padding: 8px 20px;
            border-radius: 30px;
            background: #2e7d32;
            color: white;
            font-size: 14px;
            font-weight: bold;
            letter-spacing: 0.5px;
          }

          .content {
            padding: 32px;
          }

          .section-title {
            margin: 0 0 16px;
            color: #6a1b9a;
            font-size: 19px;
            font-weight: 700;
          }

          .details {
            margin-bottom: 28px;
          }

          .row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
            padding: 14px 0;
            border-bottom: 1px solid #eeeeee;
          }

          .label {
            color: #666666;
            font-size: 15px;
          }

          .value {
            color: #222222;
            font-size: 15px;
            font-weight: 600;
            text-align: right;
          }

          .amount-box {
            margin: 30px 0;
            padding: 25px;
            border-radius: 14px;
            text-align: center;
            background: #f3e5f5;
            border: 1px solid #e1bee7;
          }

          .amount-label {
            margin-bottom: 8px;
            color: #666666;
            font-size: 14px;
          }

          .amount {
            color: #6a1b9a;
            font-size: 34px;
            font-weight: 800;
          }

          .confirmation {
            padding: 18px;
            margin-top: 20px;
            border-radius: 10px;
            background: #f1f8e9;
            color: #33691e;
            text-align: center;
            line-height: 1.6;
          }

          .footer {
            padding: 25px 30px;
            background: #fafafa;
            text-align: center;
            color: #666666;
            font-size: 13px;
            line-height: 1.7;
          }

          .print-button {
            display: block;
            margin: 28px auto 0;
            padding: 12px 26px;
            border: none;
            border-radius: 8px;
            background: #6a1b9a;
            color: white;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
          }

          .print-button:hover {
            background: #4a148c;
          }

          @media (max-width: 600px) {
            body {
              padding: 10px;
            }

            .content {
              padding: 20px;
            }

            .row {
              flex-direction: column;
              align-items: flex-start;
            }

            .value {
              text-align: left;
            }

            .header h1 {
              font-size: 24px;
            }

            .header h2 {
              font-size: 18px;
            }
          }

          @media print {
            body {
              padding: 0;
              background: white;
            }

            .receipt {
              max-width: none;
              border: none;
              box-shadow: none;
            }

            .print-button {
              display: none;
            }
          }
        </style>
      </head>

      <body>
        <div class="receipt">

          <div class="header">
            <h1>SMART GOVERNANCE</h1>
            <h2>Welfare Benefit Issue Receipt</h2>

            <div class="status">
              BENEFIT ISSUED
            </div>
          </div>

          <div class="content">

            <div class="section-title">
              Beneficiary Information
            </div>

            <div class="details">

              <div class="row">
                <span class="label">
                  Beneficiary Name
                </span>

                <span class="value">
                  ${benefit.fullName || citizenName}
                </span>
              </div>

              <div class="row">
                <span class="label">
                  User ID
                </span>

                <span class="value">
                  ${currentUserId}
                </span>
              </div>

              <div class="row">
                <span class="label">
                  Benefit ID
                </span>

                <span class="value">
                  ${benefit.id}
                </span>
              </div>

            </div>

            <div class="section-title">
              Welfare Benefit Details
            </div>

            <div class="details">

              <div class="row">
                <span class="label">
                  Scheme
                </span>

                <span class="value">
                  ${benefit.schemeName || "Welfare Benefit"}
                </span>
              </div>

              <div class="row">
                <span class="label">
                  Status
                </span>

                <span class="value">
                  ISSUED
                </span>
              </div>

              <div class="row">
                <span class="label">
                  Approved On
                </span>

                <span class="value">
                  ${formatDate(benefit.approvedAt)}
                </span>
              </div>

              <div class="row">
                <span class="label">
                  Benefit Issued On
                </span>

                <span class="value">
                  ${formatDate(benefit.benefitIssuedAt)}
                </span>
              </div>

            </div>

            <div class="amount-box">
              <div class="amount-label">
                Benefit Amount
              </div>

              <div class="amount">
                &#8377;${amount}
              </div>
            </div>

            <div class="confirmation">
              <strong>Benefit Successfully Issued</strong>
              <br />
              This receipt confirms that the above welfare
              benefit has been officially issued to the
              beneficiary.
            </div>

            <button
              class="print-button"
              onclick="window.print()"
            >
              Print Receipt
            </button>

          </div>

          <div class="footer">
            Smart Governance Platform
            <br />
            Welfare Benefit Management System
            <br />
            This is a system-generated receipt.
          </div>

        </div>
      </body>
      </html>
    `;

    receiptWindow.document.open();
    receiptWindow.document.write(receiptHtml);
    receiptWindow.document.close();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #F4F7FB 0%, #EEF4FF 100%)",
      }}
    >
      <Sidebar />

      {/* MAIN CONTENT */}
      <Box
        sx={{
          marginLeft: "270px",
          minHeight: "100vh",
          width: "calc(100% - 270px)",
        }}
      >
        <Header title="Benefits Received" />

        <Box
          sx={{
            p: {
              xs: 2,
              sm: 3,
              md: 4,
            },
            maxWidth: "1500px",
            mx: "auto",
          }}
        >

          {/* =====================================================
              HERO
          ====================================================== */}

          <Paper
            elevation={0}
            sx={{
              mb: 3,
              p: {
                xs: 3,
                md: 4,
              },
              borderRadius: 4,
              overflow: "hidden",
              position: "relative",
              color: "white",
              background:
                "linear-gradient(135deg, #6A1B9A 0%, #8E24AA 50%, #AB47BC 100%)",
            }}
          >
            {/* Decorative circles */}
            <Box
              sx={{
                position: "absolute",
                width: 180,
                height: 180,
                borderRadius: "50%",
                background:
                  "rgba(255,255,255,0.08)",
                right: -50,
                top: -70,
              }}
            />

            <Box
              sx={{
                position: "absolute",
                width: 120,
                height: 120,
                borderRadius: "50%",
                background:
                  "rgba(255,255,255,0.06)",
                right: 120,
                bottom: -60,
              }}
            />

            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              justifyContent="space-between"
              alignItems={{
                xs: "flex-start",
                md: "center",
              }}
              spacing={3}
              sx={{
                position: "relative",
                zIndex: 1,
              }}
            >
              <Box>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 1.5 }}
                >
                  <Avatar
                    sx={{
                      width: 58,
                      height: 58,
                      background:
                        "rgba(255,255,255,0.18)",
                      color: "white",
                    }}
                  >
                    <VolunteerActivism fontSize="large" />
                  </Avatar>

                  <Box>
                    <Typography
                      variant="h4"
                      fontWeight={800}
                    >
                      Benefits Received
                    </Typography>

                    <Typography
                      sx={{
                        opacity: 0.9,
                        mt: 0.5,
                      }}
                    >
                      Your officially issued welfare benefits
                    </Typography>
                  </Box>
                </Stack>

                <Typography
                  sx={{
                    maxWidth: 700,
                    opacity: 0.88,
                    fontSize: "0.98rem",
                  }}
                >
                  Welcome, {citizenName}. This page contains
                  only welfare benefits that have been officially
                  issued to your account.
                </Typography>
              </Box>

              <Box
                sx={{
                  minWidth: {
                    xs: "100%",
                    md: 210,
                  },
                  px: 3,
                  py: 2,
                  borderRadius: 3,
                  background:
                    "rgba(255,255,255,0.14)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ opacity: 0.85 }}
                >
                  Total Benefits
                </Typography>

                <Typography
                  variant="h3"
                  fontWeight={800}
                >
                  {benefits.length}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ opacity: 0.85 }}
                >
                  Issued to you
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* =====================================================
              SUMMARY CARDS
          ====================================================== */}

          <Grid
            container
            spacing={3}
            sx={{ mb: 3 }}
          >

            {/* TOTAL BENEFITS */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  height: "100%",
                  background: "#FFFFFF",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                >
                  <Avatar
                    sx={{
                      width: 52,
                      height: 52,
                      bgcolor: "#7B1FA2",
                    }}
                  >
                    <VolunteerActivism />
                  </Avatar>

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Benefits Received
                    </Typography>

                    <Typography
                      variant="h4"
                      fontWeight={800}
                    >
                      {benefits.length}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            {/* TOTAL VALUE */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  height: "100%",
                  background: "#FFFFFF",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                >
                  <Avatar
                    sx={{
                      width: 52,
                      height: 52,
                      bgcolor: "#00897B",
                    }}
                  >
                    <AccountBalanceWallet />
                  </Avatar>

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Total Benefit Value
                    </Typography>

                    <Typography
                      variant="h4"
                      fontWeight={800}
                    >
                      ₹{totalReceived.toLocaleString("en-IN")}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            {/* STATUS */}
            <Grid item xs={12} sm={12} md={4}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  height: "100%",
                  background: "#FFFFFF",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                >
                  <Avatar
                    sx={{
                      width: 52,
                      height: 52,
                      bgcolor: "#1976D2",
                    }}
                  >
                    <CheckCircle />
                  </Avatar>

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Status
                    </Typography>

                    <Typography
                      variant="h6"
                      fontWeight={800}
                      sx={{
                        color: "#2E7D32",
                      }}
                    >
                      All Issued
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          {/* =====================================================
              SECTION HEADER
          ====================================================== */}

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              mb: 3,
              background: "#FFFFFF",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={800}
            >
              Your Issued Benefits
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              View the welfare benefits that have been
              successfully issued to you.
            </Typography>
          </Paper>

          {/* =====================================================
              LOADING
          ====================================================== */}

          {loading && (
            <Paper
              sx={{
                p: 8,
                borderRadius: 4,
                textAlign: "center",
              }}
            >
              <CircularProgress
                size={46}
                thickness={4}
              />

              <Typography
                sx={{
                  mt: 2,
                  color: "text.secondary",
                }}
              >
                Loading your benefits...
              </Typography>
            </Paper>
          )}

          {/* =====================================================
              ERROR
          ====================================================== */}

          {!loading && error && (
            <Alert
              severity="error"
              sx={{
                borderRadius: 3,
                py: 2,
              }}
            >
              {error}
            </Alert>
          )}

          {/* =====================================================
              EMPTY
          ====================================================== */}

          {!loading &&
            !error &&
            benefits.length === 0 && (
              <Paper
                elevation={2}
                sx={{
                  p: {
                    xs: 4,
                    md: 7,
                  },
                  borderRadius: 4,
                  textAlign: "center",
                  background:
                    "linear-gradient(145deg, #FFFFFF, #F8F5FB)",
                }}
              >
                <Avatar
                  sx={{
                    width: 90,
                    height: 90,
                    mx: "auto",
                    mb: 3,
                    bgcolor: "#F3E5F5",
                    color: "#9C27B0",
                  }}
                >
                  <VolunteerActivism
                    sx={{ fontSize: 48 }}
                  />
                </Avatar>

                <Typography
                  variant="h5"
                  fontWeight={800}
                  gutterBottom
                >
                  No Benefits Received Yet
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    maxWidth: 580,
                    mx: "auto",
                    lineHeight: 1.8,
                  }}
                >
                  You don't have any welfare benefits that
                  have been officially issued yet. Once a
                  benefit is approved and issued, it will
                  appear here automatically.
                </Typography>
              </Paper>
            )}

          {/* =====================================================
              BENEFIT CARDS
          ====================================================== */}

          {!loading &&
            !error &&
            benefits.length > 0 && (
              <Grid container spacing={3}>
                {benefits.map((benefit) => (
                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    key={benefit.id}
                  >
                    <Card
                      elevation={2}
                      sx={{
                        height: "100%",
                        borderRadius: 4,
                        overflow: "hidden",
                        transition:
                          "transform .2s ease, box-shadow .2s ease",
                        "&:hover": {
                          transform:
                            "translateY(-5px)",
                          boxShadow: 6,
                        },
                      }}
                    >

                      {/* CARD TOP */}
                      <Box
                        sx={{
                          px: 3,
                          py: 2.5,
                          background:
                            "linear-gradient(135deg, #7B1FA2, #AB47BC)",
                          color: "white",
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <VolunteerActivism
                            sx={{ fontSize: 36 }}
                          />

                          <Chip
                            icon={
                              <CheckCircle
                                sx={{
                                  color:
                                    "#C8E6C9 !important",
                                }}
                              />
                            }
                            label="Issued"
                            sx={{
                              color: "white",
                              background:
                                "rgba(255,255,255,0.16)",
                              fontWeight: 700,
                            }}
                          />
                        </Stack>
                      </Box>

                      {/* CARD CONTENT */}
                      <CardContent sx={{ p: 3 }}>

                        {/* SCHEME */}
                        <Typography
                          variant="h6"
                          fontWeight={800}
                          sx={{ mb: 1 }}
                        >
                          {benefit.schemeName ||
                            "Welfare Benefit"}
                        </Typography>

                        {/* BENEFICIARY */}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          Issued to{" "}
                          <strong>
                            {benefit.fullName ||
                              "Citizen"}
                          </strong>
                        </Typography>

                        <Divider sx={{ mb: 2.5 }} />

                        {/* AMOUNT */}
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                          sx={{ mb: 2 }}
                        >
                          <Avatar
                            sx={{
                              width: 38,
                              height: 38,
                              bgcolor: "#E0F2F1",
                              color: "#00897B",
                            }}
                          >
                            <AccountBalanceWallet
                              fontSize="small"
                            />
                          </Avatar>

                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Benefit Amount
                            </Typography>

                            <Typography
                              variant="h6"
                              fontWeight={800}
                            >
                              ₹
                              {Number(
                                benefit.benefitAmount ||
                                  0
                              ).toLocaleString("en-IN")}
                            </Typography>
                          </Box>
                        </Stack>

                        {/* APPROVED DATE */}
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                          sx={{ mb: 2 }}
                        >
                          <Avatar
                            sx={{
                              width: 38,
                              height: 38,
                              bgcolor: "#E3F2FD",
                              color: "#1976D2",
                            }}
                          >
                            <CalendarMonth
                              fontSize="small"
                            />
                          </Avatar>

                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Approved Date
                            </Typography>

                            <Typography
                              fontWeight={700}
                            >
                              {benefit.approvedAt
                                ? new Date(
                                    benefit.approvedAt
                                  ).toLocaleDateString(
                                    "en-IN"
                                  )
                                : "N/A"}
                            </Typography>
                          </Box>
                        </Stack>

                        {/* ISSUED DATE */}
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <Avatar
                            sx={{
                              width: 38,
                              height: 38,
                              bgcolor: "#E8F5E9",
                              color: "#2E7D32",
                            }}
                          >
                            <CheckCircle
                              fontSize="small"
                            />
                          </Avatar>

                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Benefit Issued On
                            </Typography>

                            <Typography
                              fontWeight={700}
                            >
                              {benefit.benefitIssuedAt
                                ? new Date(
                                    benefit.benefitIssuedAt
                                  ).toLocaleDateString(
                                    "en-IN"
                                  )
                                : "N/A"}
                            </Typography>
                          </Box>
                        </Stack>

                        {/* RECEIPT BUTTON */}
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<ReceiptLong />}
                          sx={{
                            mt: 3,
                            py: 1.3,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 700,
                            background:
                              "linear-gradient(135deg, #6A1B9A, #AB47BC)",
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #4A148C, #8E24AA)",
                            },
                          }}
                          onClick={() =>
                            printReceipt(benefit)
                          }
                        >
                          View / Print Receipt
                        </Button>

                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

        </Box>
      </Box>
    </Box>
  );
}

export default BenefitsReceived;
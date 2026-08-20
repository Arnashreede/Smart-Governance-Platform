import { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import api from "../api/axios";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * IMPORTANT:
       * The logged-in USER ID and CITIZEN ID are different.
       *
       * Example:
       * User ID    = 29
       * Citizen ID = 2
       *
       * Therefore we identify the citizen using the
       * logged-in email instead of assuming userId === citizenId.
       */

      const email = localStorage.getItem("email");

      if (!email) {
        throw new Error(
          "Your email is not available. Please log in again."
        );
      }

      /*
       * Get citizen records from Citizen Service.
       *
       * We do NOT hardcode a citizen ID.
       */
      const response = await api.get("/citizens");

      const citizens = Array.isArray(response.data)
        ? response.data
        : [];

      /*
       * Find the currently logged-in citizen by registered email.
       */
      const citizen = citizens.find(
        (item) =>
          item?.email?.toLowerCase() === email.toLowerCase()
      );

      if (!citizen) {
        throw new Error(
          "Your citizen profile could not be found."
        );
      }

      setProfile({
        id: citizen.id ?? "",

        fullName:
          citizen.fullName ??
          citizen.name ??
          "",

        email:
          citizen.email ??
          email,

        phone:
          citizen.phone ??
          citizen.phoneNumber ??
          "",

        gender:
          citizen.gender ??
          "",

        dob:
          citizen.dob ??
          citizen.dateOfBirth ??
          "",

        address:
          citizen.address ??
          "",

        ward:
          citizen.ward ??
          citizen.wardNo ??
          "",

        role:
          citizen.role ??
          localStorage.getItem("role") ??
          "CITIZEN",

        status:
          citizen.status ??
          "ACTIVE",
      });
    } catch (error) {
      console.error(
        "Failed to load citizen profile:",
        error
      );

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (value) => {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString();
  };

  const readOnly = {
    input: {
      readOnly: true,
    },
  };

  if (loading) {
    return (
      <>
        <Sidebar />

        <Box
          sx={{
            ml: "270px",
            p: 4,
            background: "#F4F6F9",
            minHeight: "100vh",
          }}
        >
          <Header />

          <Box
            sx={{
              minHeight: "60vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <CircularProgress />

            <Typography color="text.secondary">
              Loading your profile...
            </Typography>
          </Box>
        </Box>
      </>
    );
  }

  if (error || !profile) {
    return (
      <>
        <Sidebar />

        <Box
          sx={{
            ml: "270px",
            p: 4,
            background: "#F4F6F9",
            minHeight: "100vh",
          }}
        >
          <Header />

          <Typography
            variant="h4"
            fontWeight="bold"
            mb={3}
          >
            👤 My Profile
          </Typography>

          <Alert severity="error">
            {error ||
              "Profile information could not be loaded."}
          </Alert>
        </Box>
      </>
    );
  }

  const initials =
    profile.fullName
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || "C";

  return (
    <>
      <Sidebar />

      <Box
        sx={{
          ml: "270px",
          p: 4,
          background: "#F4F6F9",
          minHeight: "100vh",
        }}
      >
        <Header />

        {/* PAGE TITLE */}
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={3}
        >
          👤 My Profile
        </Typography>

        <Grid container spacing={3}>
          {/* ================= PROFILE CARD ================= */}

          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                borderRadius: 3,
                height: "100%",
              }}
            >
              <CardContent
                sx={{
                  textAlign: "center",
                  p: 4,
                }}
              >
                <Avatar
                  sx={{
                    width: 110,
                    height: 110,
                    mx: "auto",
                    mb: 2,
                    fontSize: 42,
                    background:
                      "linear-gradient(135deg, #1976D2, #1565C0)",
                  }}
                >
                  {initials}
                </Avatar>

                <Typography
                  variant="h5"
                  fontWeight="bold"
                >
                  {profile.fullName || "Citizen"}
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {profile.email || "Email not available"}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="center"
                  mt={2}
                >
                  <Chip
                    color="primary"
                    label={profile.role}
                  />

                  <Chip
                    color="success"
                    label={profile.status}
                  />
                </Stack>

                

                {/* No editing yet */}
                <Typography
                  sx={{
                    mt: 2,
                    fontSize: 13,
                    color: "text.secondary",
                  }}
                >
                  Your registered information is displayed
                  here.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* ================= PERSONAL INFORMATION ================= */}

          <Grid size={{ xs: 12, md: 8 }}>
            <Card
              sx={{
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <PersonIcon color="primary" />

                  <Typography
                    variant="h6"
                    fontWeight="bold"
                  >
                    Personal Information
                  </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  {/* FULL NAME */}

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={profile.fullName}
                      slotProps={{
                        input: readOnly.input,
                      }}
                    />
                  </Grid>

                  {/* EMAIL */}

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={profile.email}
                      slotProps={{
                        input: readOnly.input,
                      }}
                    />
                  </Grid>

                  {/* PHONE */}

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={profile.phone}
                      placeholder={
                        profile.phone
                          ? ""
                          : "Not available"
                      }
                      slotProps={{
                        input: readOnly.input,
                      }}
                    />
                  </Grid>

                  {/* GENDER */}

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Gender"
                      value={profile.gender}
                      placeholder={
                        profile.gender
                          ? ""
                          : "Not available"
                      }
                      slotProps={{
                        input: readOnly.input,
                      }}
                    />
                  </Grid>

                  {/* DATE OF BIRTH */}

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      value={formatDate(profile.dob)}
                      placeholder={
                        profile.dob
                          ? ""
                          : "Not available"
                      }
                      slotProps={{
                        input: readOnly.input,
                      }}
                    />
                  </Grid>

                  {/* ROLE */}

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Role"
                      value={profile.role}
                      slotProps={{
                        input: readOnly.input,
                      }}
                    />
                  </Grid>

                  {/* WARD */}

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Ward"
                      value={profile.ward}
                      placeholder={
                        profile.ward
                          ? ""
                          : "Not available"
                      }
                      slotProps={{
                        input: readOnly.input,
                      }}
                    />
                  </Grid>

                  {/* ACCOUNT STATUS */}

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Account Status"
                      value={profile.status}
                      slotProps={{
                        input: readOnly.input,
                      }}
                    />
                  </Grid>

                  {/* ADDRESS */}

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Address"
                      value={profile.address}
                      placeholder={
                        profile.address
                          ? ""
                          : "Not available"
                      }
                      slotProps={{
                        input: readOnly.input,
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
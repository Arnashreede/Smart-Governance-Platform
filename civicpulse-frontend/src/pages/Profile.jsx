import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Profile() {
  const [profile] = useState({
    fullName: localStorage.getItem("fullName") || "Citizen",
    email: localStorage.getItem("email") || "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    role: localStorage.getItem("role") || "Citizen",
    status: "Active",
  });

  return (
    <>
      <Sidebar />
      <Box sx={{ ml: "270px", p: 4, background: "#F4F6F9", minHeight: "100vh" }}>
        <Header />

        <Typography variant="h4" fontWeight="bold" mb={3}>
          👤 My Profile
        </Typography>

        <Grid container spacing={3}>
<Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Avatar sx={{ width: 110, height: 110, mx: "auto", mb: 2 }}>
                  {profile.fullName.charAt(0)}
                </Avatar>

                <Typography variant="h5" fontWeight="bold">
                  {profile.fullName}
                </Typography>

                <Typography color="text.secondary">
                  {profile.email}
                </Typography>

                <Stack direction="row" spacing={1} justifyContent="center" mt={2}>
                  <Chip color="primary" label={profile.role} />
                  <Chip color="success" label={profile.status} />
                </Stack>

                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  fullWidth
                  sx={{ mt: 3 }}
                >
                  Edit Profile
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<LockIcon />}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Personal Information
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Full Name" value={profile.fullName} InputProps={{readOnly:true}} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Email" value={profile.email} InputProps={{readOnly:true}} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Phone Number" value={profile.phone} InputProps={{readOnly:true}} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Gender" value={profile.gender} InputProps={{readOnly:true}} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Date of Birth" value={profile.dob} InputProps={{readOnly:true}} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Role" value={profile.role} InputProps={{readOnly:true}} />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Address"
                      value={profile.address}
                      InputProps={{readOnly:true}}
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

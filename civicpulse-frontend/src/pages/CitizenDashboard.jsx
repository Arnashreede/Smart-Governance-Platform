import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
} from "@mui/material";

import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function CitizenDashboard() {
  const navigate = useNavigate();

  const fullName = localStorage.getItem("fullName") || "Citizen";
  const email = localStorage.getItem("email") || "";
  const citizenId = localStorage.getItem("citizenId") || "";

  return (
    <>
      <Sidebar />

      <Box
        sx={{
          ml: "270px",
          p: 4,
          background: "#F5F7FA",
          minHeight: "100vh",
        }}
      >
        <Header />

        {/* Welcome Card */}

        <Card
          sx={{
            mb: 4,
            borderRadius: 4,
            background:
              "linear-gradient(135deg,#1565C0,#42A5F5)",
            color: "white",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Welcome, {fullName}
              </Typography>

              <Typography>
                Citizen ID : {citizenId}
              </Typography>

              <Typography>
                {email}
              </Typography>
            </Box>

            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "white",
                color: "#1565C0",
                fontSize: 35,
                fontWeight: "bold",
              }}
            >
              {fullName.charAt(0)}
            </Avatar>
          </CardContent>
        </Card>

        {/* Statistics */}

        <Grid container spacing={3}>

          <Grid item xs={12} md={3}>
            <StatCard
              icon={<AssignmentIcon />}
              title="Applications"
              value="12"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <StatCard
              icon={<DescriptionIcon />}
              title="Certificates"
              value="6"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <StatCard
              icon={<ReportProblemIcon />}
              title="Complaints"
              value="4"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <StatCard
              icon={<PendingActionsIcon />}
              title="Pending"
              value="2"
            />
          </Grid>

        </Grid>

        {/* Quick Services */}

        <Typography
          variant="h5"
          fontWeight="bold"
          mt={5}
          mb={3}
        >
          Quick Services
        </Typography>

        <Grid container spacing={3}>

          <Grid item xs={12} md={3}>
            <ServiceCard
              title="Apply Certificate"
              onClick={() =>
                navigate("/citizen/application")
              }
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <ServiceCard
              title="Register Complaint"
              onClick={() =>
                navigate("/grievance/register")
              }
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <ServiceCard
              title="Track Complaint"
              onClick={() =>
                navigate("/track-complaint")
              }
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <ServiceCard
              title="My Applications"
              onClick={() =>
                navigate("/my-applications")
              }
            />
          </Grid>

        </Grid>

      </Box>
    </>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: 3,
      }}
    >
      <CardContent
        sx={{ textAlign: "center" }}
      >
        <Box
          sx={{
            fontSize: 45,
            color: "#1565C0",
          }}
        >
          {icon}
        </Box>

        <Typography
          variant="h4"
          fontWeight="bold"
        >
          {value}
        </Typography>

        <Typography color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}

function ServiceCard({ title, onClick }) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        cursor: "pointer",
        transition: ".3s",
        "&:hover": {
          transform: "translateY(-5px)",
        },
      }}
      onClick={onClick}
    >
      <CardContent
        sx={{ textAlign: "center" }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
        >
          {title}
        </Typography>

        <Button
          endIcon={<ArrowForwardIcon />}
          sx={{ mt: 2 }}
        >
          Open
        </Button>
      </CardContent>
    </Card>
  );
}

export default CitizenDashboard;
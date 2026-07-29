import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
} from "@mui/material";
import api from "../api/axios";
import PeopleIcon from "@mui/icons-material/People";
import BadgeIcon from "@mui/icons-material/Badge";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import DescriptionIcon from "@mui/icons-material/Description";
import AssessmentIcon from "@mui/icons-material/Assessment";

import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DashboardCharts from "../components/DashboardCharts";
import { useEffect, useState } from "react";


function Dashboard() {

  const navigate = useNavigate();

  const fullName = localStorage.getItem("fullName") || "Administrator";
  const email = localStorage.getItem("email") || "";
  const role = localStorage.getItem("role") || "";
const [stats, setStats] = useState({

  citizens: 0,
  officers: 0,
  departments: 0,
  complaints: 0,
  certificates: 0,
  reports: 0,
});
const [grievances, setGrievances] = useState([]);
useEffect(() => {
  Promise.all([
    api.get("/citizens"),
    api.get("/officers"),
    api.get("/departments"),
    api.get("/grievances"),
    api.get("/certificates"),
    api.get("/reports/dashboard"),
    api.get("/reports/citizens/count"),
  ])
    .then(([c, o, d, g, ce]) => {

  setGrievances(g.data);

  setStats({
    citizens: c.data.length,
    officers: o.data.length,
    departments: d.data.length,
    complaints: g.data.length,
    certificates: ce.data.length,
    reports: 0,
  });

})
.catch(console.error);
}, []);
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

        {/* Welcome Banner */}

        <Card
          sx={{
            mb: 4,
            borderRadius: 4,
            background:
              "linear-gradient(135deg,#0D47A1,#1976D2)",
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
                Government Administration Portal
              </Typography>

              <Typography mt={1}>
                Welcome, {fullName}
              </Typography>

              <Typography>
                {email}
              </Typography>

              <Typography>
                {role}
              </Typography>

            </Box>

            <Avatar
              sx={{
                width: 90,
                height: 90,
                bgcolor: "white",
                color: "#1565C0",
                fontSize: 35,
              }}
            >
              {fullName.charAt(0)}
            </Avatar>

          </CardContent>
        </Card>

        {/* Statistics */}

        <Grid container spacing={3}>

<Grid size={{ xs: 12, md: 2 }}>
              <StatCard
              title="Citizens"
              value={stats.citizens}
              icon={<PeopleIcon />}
            />
          </Grid>

<Grid size={{ xs: 12, md: 2 }}>
              <StatCard
              title="Officers"
              value={stats.officers}
              icon={<BadgeIcon />}
            />
          </Grid>

<Grid size={{ xs: 12, md: 2 }}>
              <StatCard
              title="Departments"
              value={stats.departments}
              icon={<ApartmentIcon />}
            />
          </Grid>

<Grid size={{ xs: 12, md: 2 }}>
              <StatCard
              title="Complaints"
              value={stats.complaints}
              icon={<ReportProblemIcon />}
            />
          </Grid>

<Grid size={{ xs: 12, md: 2 }}>
              <StatCard
              title="Certificates"
              value={stats.certificates}
              icon={<DescriptionIcon />}
            />
          </Grid>

<Grid size={{ xs: 12, md: 2 }}>
              <StatCard
              title="Reports"
              value={stats.reports}
              icon={<AssessmentIcon />}
            />
          </Grid>

        </Grid>

        {/* Quick Actions */}

        <Typography
          variant="h5"
          fontWeight="bold"
          mt={5}
          mb={3}
        >
          Quick Actions
        </Typography>

        <Grid container spacing={3}>

<Grid size={{ xs: 12, md: 4 }}>
              <ActionCard
              title="Manage Citizens"
              onClick={() => navigate("/citizens")}
            />
          </Grid>

<Grid size={{ xs: 12, md: 4 }}>
              <ActionCard
              title="Manage Officers"
              onClick={() => navigate("/officers")}
            />
          </Grid>

<Grid size={{ xs: 12, md: 4 }}>
              <ActionCard
              title="Departments"
              onClick={() => navigate("/departments")}
            />
          </Grid>

<Grid size={{ xs: 12, md: 4 }}>
              <ActionCard
              title="Complaints"
              onClick={() => navigate("/grievances")}
            />
          </Grid>

<Grid size={{ xs: 12, md: 4 }}>
              <ActionCard
              title="Assign Officer"
              onClick={() => navigate("/assign-officer")}
            />
          </Grid>

<Grid size={{ xs: 12, md: 4 }}>
              <ActionCard
              title="Reports"
              onClick={() => navigate("/reports")}
            />
          </Grid>

        </Grid>

        <Typography
          variant="h5"
          fontWeight="bold"
          mt={5}
          mb={3}
        >
          System Analytics
        </Typography>

        <DashboardCharts grievances={grievances} />
      </Box>
    </>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
      <CardContent sx={{ textAlign: "center" }}>
        <Box sx={{ color: "#1565C0", fontSize: 45 }}>
          {icon}
        </Box>

        <Typography variant="h4" fontWeight="bold">
          {value}
        </Typography>

        <Typography color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}

function ActionCard({ title, onClick }) {
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
    >
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>

        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={onClick}
        >
          Open
        </Button>
      </CardContent>
    </Card>
  );
}

export default Dashboard;
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
} from "@mui/material";

import AssignmentIcon from "@mui/icons-material/Assignment";
import VerifiedIcon from "@mui/icons-material/Verified";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CancelIcon from "@mui/icons-material/Cancel";
import DescriptionIcon from "@mui/icons-material/Description";

import { useNavigate } from "react-router-dom";
import DashboardCard from "../components/DashboardCard";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function OfficerDashboard() {

  const navigate = useNavigate();

  const fullName = localStorage.getItem("fullName") || "Officer";
  const email = localStorage.getItem("email") || "";
  const role = localStorage.getItem("role") || "";
  const employeeId = localStorage.getItem("employeeId") || "";

  return (
    <>
      <Sidebar />

      <Box
        sx={{
          ml: "270px",
          p: 4,
          minHeight: "100vh",
          bgcolor: "#F5F7FA",
        }}
      >
        <Header />

        {/* Profile Card */}

        <Card
          sx={{
            mb: 4,
            borderRadius: 4,
            background:
              "linear-gradient(135deg,#0D47A1,#42A5F5)",
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

              <Typography
                variant="h4"
                fontWeight="bold"
              >
                Welcome, {fullName}
              </Typography>

              <Typography sx={{ mt: 1 }}>
  Employee ID: {employeeId}
</Typography>

<Typography>
  {email}
</Typography>

<Typography>
  Role: {role}
</Typography>

<Typography sx={{ mt: 2, opacity: 0.9 }}>
  Manage grievances, applications, welfare schemes and citizen services from one dashboard.
</Typography>

            </Box>

            <Avatar
              sx={{
                width: 90,
                height: 90,
                background: "linear-gradient(135deg,#FF9800,#F57C00)",
color: "white",
fontWeight: "bold",
                fontSize: 35,
              }}
            >
              {fullName.charAt(0)}
            </Avatar>

          </CardContent>
        </Card>

        {/* Statistics */}

        <Grid container spacing={3}>

          <Grid item xs={12} md={3}>
            <DashboardCard
              title="Assigned"
              value="25"
              icon={<AssignmentIcon />}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <DashboardCard
              title="Verified"
              value="15"
              icon={<VerifiedIcon />}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <DashboardCard
              title="Pending"
              value="7"
              icon={<PendingActionsIcon />}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <DashboardCard
              title="Rejected"
              value="3"
              icon={<CancelIcon />}
            />
          </Grid>

        </Grid>

        {/* Quick Actions */}

        <Typography
  variant="h5"
  fontWeight="bold"
  sx={{ mt: 5, mb: 3 }}
>
  Officer Services
</Typography>

<Grid container spacing={3}>

  <Grid item xs={12} md={4}>
    <ActionCard
      icon="📄"
      title="Pending Applications"
      description="Review, verify and approve citizen applications."
      buttonText="View Applications"
      onClick={() => navigate("/officer/applications")}

    />
  </Grid>

  <Grid item xs={12} md={4}>
    <ActionCard
      icon="⚠️"
      title="Assigned Complaints"
      description="Resolve complaints assigned to you."
      buttonText="Open Complaints"
      onClick={() => navigate("/grievances")}
    />
  </Grid>
<Grid item xs={12} md={4}>
  <ActionCard
    icon="🎯"
    title="Welfare Applications"
    description="Verify welfare applications"
    buttonText="Open"
    onClick={() => navigate("/officer/welfare")}
/>
</Grid>
<ActionCard
    icon="💰"
    title="Issue Benefits"
    description="Release benefits to approved beneficiaries."
    buttonText="Issue Benefits"
    onClick={() => navigate("/officer/beneficiaries")}
/>
<Grid item xs={12} md={4}>
<ActionCard
    icon="👤"
    title="My Profile"
    description="View officer profile"
    buttonText="Open"
    onClick={() => navigate("/officer/profile")}
/>
  </Grid>

  <Grid item xs={12} md={4}>
  <ActionCard
    icon="💰"
    title="Budget Management"
    description="Manage budgets, fund distribution and financial reports."
    buttonText="Open"
    onClick={() => navigate("/budget-dashboard")}
  />
</Grid>

  <Grid item xs={12} md={4}>
  <ActionCard
    icon="📊"
    title="Reports"
    description="View work reports and statistics."
    buttonText="Open"
    onClick={() => navigate("/reports")}
  />
</Grid>

</Grid>

      </Box>
    </>
  );
}



function ActionCard({
  icon,
  title,
  description,
  buttonText,
  onClick,
}) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        height: "100%",
        transition: ".3s",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: 8,
        },
      }}
    >
      <CardContent sx={{ textAlign: "center", py: 5 }}>

        <Typography
          sx={{
            fontSize: 55,
            mb: 2,
          }}
        >
          {icon}
        </Typography>

        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
        >
          {title}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          {description}
        </Typography>

        <Button
          variant="contained"
          onClick={onClick}
        >
          {buttonText}
        </Button>

      </CardContent>
    </Card>
  
  );
}

export default OfficerDashboard;
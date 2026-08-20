import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Avatar,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ApartmentIcon from "@mui/icons-material/Apartment";
import BadgeIcon from "@mui/icons-material/Badge";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssessmentIcon from "@mui/icons-material/Assessment";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem("role");
  const fullName = localStorage.getItem("fullName") || "User";
  const email = localStorage.getItem("email") || "";

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const adminMenu = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Citizens", icon: <PeopleIcon />, path: "/citizens" },
  { text: "Departments", icon: <ApartmentIcon />, path: "/departments" },
  {
    text: "Service Management",
    icon: <MiscellaneousServicesIcon />,
    path: "/admin/services",
  },
  {
    text: "Application Forms",
    icon: <DescriptionIcon />,
    path: "/service-form-builder",
},
  { text: "Officers", icon: <BadgeIcon />, path: "/officers" },
  { text: "Assignments", icon: <AssignmentIcon />, path: "/assignments" },
  { text: "Complaints", icon: <ReportProblemIcon />, path: "/grievances" },
  { text: "Certificates", icon: <DescriptionIcon />, path: "/certificates" },
  { text: "Welfare Schemes", icon: <AssignmentIcon />, path: "/admin/welfare" },
  { text: "Welfare Applications", icon: <DescriptionIcon />, path: "/admin/welfare/applications" },
  { text: "Budget", icon: <AccountBalanceWalletIcon />, path: "/budget-management" },
  { text: "Reports", icon: <AssessmentIcon />, path: "/reports" },
  { text: "Notifications", icon: <NotificationsIcon />, path: "/notifications" },
];

 const officerMenu = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/officer-dashboard",
  },
  {
    text: "Assigned Complaints",
    icon: <ReportProblemIcon />,
    path: "/officer/my-complaints",
  },
  
  {
    text: "Applications",
    icon: <DescriptionIcon />,
    path: "/officer/applications",
  },
  {
    text: "Certificates",
    icon: <DescriptionIcon />,
    path: "/officer/certificates",
},
  {
    text: "Welfare Applications",
    icon: <AssignmentIcon />,
    path: "/officer/welfare",
  },
  {
    text: "Issue Benefits",
    icon: <AccountBalanceWalletIcon />,
    path: "/officer/beneficiaries",
},
  {
    text: "Budget",
    icon: <AccountBalanceWalletIcon />,
    path: "/budget-dashboard",
  },
  {
    text: "Reports",
    icon: <AssessmentIcon />,
    path: "/reports",
  },
  {
    text: "My Profile",
    icon: <BadgeIcon />,
    path: "/officer/profile",
  },
];

  const citizenMenu = [
    { text: "Dashboard", icon: <HomeIcon />, path: "/citizen-dashboard" },
    { text: "Register Complaint", icon: <ReportProblemIcon />, path: "/grievance/register" },
    { text: "Track Complaint", icon: <TrackChangesIcon />, path: "/track-complaint" },
    { text: "Apply Certificate", icon: <AssignmentIcon />, path: "/citizen/application" },
    { text: "My Applications", icon: <DescriptionIcon />, path: "/my-applications" },
    {
  text: "Benefits Received",
  icon: <VolunteerActivismIcon />,
  path: "/benefits-received",
},
    { text: "Notifications", icon: <NotificationsIcon />, path: "/notifications" },
  ];

  const menu =
    role === "ADMIN"
      ? adminMenu
      : role === "OFFICER"
      ? officerMenu
      : citizenMenu;

  return (
    <Box
  sx={{
    width: 270,
    height: "100vh",
    position: "fixed",
    left: 0,
    top: 0,
    bgcolor: "#0F172A",
    color: "white",
    display: "flex",
    flexDirection: "column",
    boxShadow: 5,
    overflow: "hidden",
  }}
>
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold">
          🏛 Smart Goverance
        </Typography>

        <Avatar
          sx={{
            background: "linear-gradient(135deg,#42A5F5,#1565C0)",

            color: "#1565C0",
            width: 70,
            height: 70,
            margin: "20px auto 10px",
            fontSize: 30,
            fontWeight: "bold",
          }}
        >
          {fullName.charAt(0).toUpperCase()}
        </Avatar>

        <Typography fontWeight="bold">{fullName}</Typography>

        <Typography variant="body2">{role}</Typography>

        <Typography
          variant="caption"
          sx={{
            opacity: 0.8,
            display: "block",
            mt: 0.5,
          }}
        >
          {email}
        </Typography>
      </Box>

      <Divider sx={{ bgcolor: "#ffffff44" }} />

      <List
  sx={{
    flex: 1,
    mt: 1,
    overflowY: "auto",
    overflowX: "hidden",
    minHeight: 0,
  }}
>
        {menu.map((item) => (
          <ListItemButton
            key={item.path}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
  mx: 1,
  borderRadius: 2,
  mb: 0.5,
  color: "white",
  transition: "all .25s",

  "&.Mui-selected": {
    bgcolor: "#1976D2",
    transform: "translateX(4px)",
  },

  "&:hover": {
    bgcolor: "#1E293B",
    transform: "translateX(4px)",
  },
}}
          >
            <ListItemIcon sx={{ color: "white" }}>
              {item.icon}
            </ListItemIcon>

            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>

    
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={logout}
          sx={{
            borderRadius: 2,
            textTransform: "none",
          }}
        >
          Logout
        </Button>

        <Typography
          variant="caption"
          display="block"
          align="center"
          mt={2}
          sx={{ opacity: 0.7 }}
        >
          © 2026 Smart Goverance
        </Typography>
      </Box>
    </Box>
  );
}

export default Sidebar;
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Chip,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import {
  People as PeopleIcon,
  Badge as BadgeIcon,
  Apartment as ApartmentIcon,
  ReportProblem as ReportProblemIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  AccountBalance as AccountBalanceIcon,
  VolunteerActivism as WelfareIcon,
  Analytics as AnalyticsIcon,
  Psychology as PsychologyIcon,
  ArrowForward as ArrowForwardIcon,
  WarningAmber as WarningAmberIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import notificationApi from "../api/notificationAxios";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DashboardCard from "../components/DashboardCard";
import SystemStatus from "../components/SystemStatus";
import ActionCard from "../components/ActionCard";
import RecentActivity from "../components/RecentActivity";
import NotificationPanel from "../components/NotificationPanel";
import StatisticsPanel from "../components/StatisticsPanel";

const safeArray = (response) =>
  Array.isArray(response?.data) ? response.data : [];

const getNumber = (...values) => {
  for (const value of values) {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return 0;
};

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const getField = (item, keys, fallback = "") => {
  if (!item) return fallback;

  for (const key of keys) {
    if (
      item[key] !== undefined &&
      item[key] !== null &&
      String(item[key]).trim() !== ""
    ) {
      return item[key];
    }
  }

  return fallback;
};

const titleCase = (value) =>
  String(value || "Unknown")
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const countBy = (items, keys) => {
  const result = {};

  items.forEach((item) => {
    const value = titleCase(getField(item, keys, "Unknown"));
    result[value] = (result[value] || 0) + 1;
  });

  return Object.entries(result)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
};

function MiniBarChart({ title, subtitle, data, total, icon }) {
  const max = Math.max(...data.map(([, value]) => value), 1);

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        border: "1px solid #E5EAF0",
        boxShadow: "0 6px 22px rgba(0,0,0,0.05)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 0.5,
          }}
        >
          <Avatar
            sx={{
              width: 42,
              height: 42,
              background: "#EAF3FF",
              color: "#1565C0",
            }}
          >
            {icon}
          </Avatar>

          <Box>
            <Typography fontWeight={800}>{title}</Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.2 }}
            >
              {subtitle}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 3 }}>
          {data.length === 0 ? (
            <Typography color="text.secondary">
              No data available.
            </Typography>
          ) : (
            data.map(([label, value], index) => {
              const percentage =
                total > 0 ? Math.round((value / total) * 100) : 0;

              return (
                <Box key={`${label}-${index}`} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.6,
                    }}
                  >
                    <Typography
                      fontSize="0.88rem"
                      fontWeight={650}
                      color="#344054"
                    >
                      {label}
                    </Typography>

                    <Typography
                      fontSize="0.85rem"
                      fontWeight={750}
                      color="#667085"
                    >
                      {value}
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, (value / max) * 100)}
                    sx={{
                      height: 9,
                      borderRadius: 10,
                      backgroundColor: "#E9EEF5",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 10,
                        backgroundColor:
                          index === 0
                            ? "#1976D2"
                            : index === 1
                            ? "#42A5F5"
                            : index === 2
                            ? "#66BB6A"
                            : index === 3
                            ? "#FFA726"
                            : "#90CAF9",
                      },
                    }}
                  />

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 0.3 }}
                  >
                    {percentage}% of total
                  </Typography>
                </Box>
              );
            })
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

function MiniDonut({ title, centerValue, label, segments }) {
  const total = segments.reduce((sum, item) => sum + item.value, 0);

  let current = 0;

  const gradient =
    total > 0
      ? segments
          .map((segment) => {
            const start = (current / total) * 360;
            current += segment.value;
            const end = (current / total) * 360;
            return `${segment.color} ${start}deg ${end}deg`;
          })
          .join(", ")
      : "#E5EAF0 0deg 360deg";

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        border: "1px solid #E5EAF0",
        boxShadow: "0 6px 22px rgba(0,0,0,0.05)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography fontWeight={800}>{title}</Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            mt: 2.5,
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              width: 145,
              height: 145,
              borderRadius: "50%",
              background: `conic-gradient(${gradient})`,
              position: "relative",
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 24,
                borderRadius: "50%",
                background: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h4"
                fontWeight={850}
                color="#123B6D"
              >
                {centerValue}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                {label}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flex: 1, minWidth: 170 }}>
            {segments.map((segment) => (
              <Box
                key={segment.name}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1.2,
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: segment.color,
                    }}
                  />
                  <Typography fontSize="0.86rem">
                    {segment.name}
                  </Typography>
                </Box>

                <Typography fontWeight={750}>
                  {segment.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const navigate = useNavigate();

  const fullName =
    localStorage.getItem("fullName") || "Administrator";
  const email = localStorage.getItem("email") || "";
  const role = localStorage.getItem("role") || "ADMIN";

  const [loading, setLoading] = useState(true);

  const [aiAnalysis, setAiAnalysis] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const [citizens, setCitizens] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [applications, setApplications] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [welfare, setWelfare] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [stats, setStats] = useState({
    totalCitizens: 0,
    totalGrievances: 0,
    openGrievances: 0,
    highPriorityGrievances: 0,
    totalCertificates: 0,
    totalOfficers: 0,
    totalDepartments: 0,
    totalApplications: 0,
    totalBudget: 0,
    allocatedAmount: 0,
    spentAmount: 0,
    remainingAmount: 0,
    escalatedGrievances: 0,
  });

  const generateAdministrativeAnalysis = async () => {
    try {
      setAiLoading(true);
      setAiError("");

      const response = await api.post("/ai/analyze/administration");

      const result =
        typeof response.data === "string"
          ? response.data
          : response.data?.analysis ||
            response.data?.result ||
            response.data?.message ||
            JSON.stringify(response.data, null, 2);

      setAiAnalysis(result);
    } catch (error) {
      console.error("Administrative AI analysis failed:", error);
      setAiError(
        error?.response?.data?.message ||
          "Unable to generate administrative analysis. Please make sure the AI Analysis Service is running."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const loadDashboard = async () => {
    setLoading(true);

    const requests = [
      api.get("/users"),
      api.get("/officers"),
      api.get("/departments"),
      api.get("/grievances"),
      api.get("/applications"),
      api.get("/certificates"),
      api.get("/welfare"),
      api.get("/reports/dashboard"),
      notificationApi.get("/notifications"),
    ];

    const results = await Promise.allSettled(requests);

    const value = (index) =>
      results[index]?.status === "fulfilled"
        ? results[index].value
        : null;

    const citizenData = safeArray(value(0));
    const officerData = safeArray(value(1));
    const departmentData = safeArray(value(2));
    const grievanceData = safeArray(value(3));
    const applicationData = safeArray(value(4));
    const certificateData = safeArray(value(5));
    const welfareData = safeArray(value(6));
    const dashboardData = value(7)?.data || {};
    const notificationData = safeArray(value(8));

    setCitizens(citizenData);
    setOfficers(officerData);
    setDepartments(departmentData);
    setGrievances(grievanceData);
    setApplications(applicationData);
    setCertificates(certificateData);
    setWelfare(welfareData);
    setNotifications(notificationData);

    setStats({
      ...dashboardData,
      totalCitizens: getNumber(
  dashboardData.totalCitizens,
  citizenData.filter(
    (user) =>
      String(user?.role || "").toUpperCase() === "CITIZEN"
  ).length
),
      totalOfficers: getNumber(
        dashboardData.totalOfficers,
        officerData.length
      ),
      totalDepartments: getNumber(
        dashboardData.totalDepartments,
        departmentData.length
      ),
      totalGrievances: getNumber(
        dashboardData.totalGrievances,
        grievanceData.length
      ),
      totalApplications: getNumber(
        dashboardData.totalApplications,
        applicationData.length
      ),
      totalCertificates: getNumber(
        dashboardData.totalCertificates,
        certificateData.length
      ),
      totalBudget: getNumber(dashboardData.totalBudget),
      allocatedAmount: getNumber(dashboardData.allocatedAmount),
      spentAmount: getNumber(dashboardData.spentAmount),
      remainingAmount: getNumber(dashboardData.remainingAmount),
      openGrievances: getNumber(
        dashboardData.openGrievances,
        grievanceData.filter((g) =>
          ["open", "pending", "submitted", "in_progress", "assigned"].includes(
            normalize(g.status)
          )
        ).length
      ),
      highPriorityGrievances: getNumber(
        dashboardData.highPriorityGrievances,
        grievanceData.filter((g) =>
          ["high", "critical"].includes(normalize(g.priority))
        ).length
      ),
      escalatedGrievances: getNumber(
        dashboardData.escalatedGrievances,
        grievanceData.filter(
          (g) =>
            g.escalated === true ||
            normalize(g.escalated) === "true" ||
            normalize(g.escalated) === "yes"
        ).length
      ),
    });

    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const grievanceStatus = useMemo(
    () => countBy(grievances, ["status"]),
    [grievances]
  );

  const applicationStatus = useMemo(
    () => countBy(applications, ["status", "applicationStatus"]),
    [applications]
  );

  const grievanceDepartments = useMemo(
    () =>
      countBy(grievances, [
        "department",
        "departmentName",
        "department_name",
      ]),
    [grievances]
  );

  const welfareTypes = useMemo(
    () =>
      countBy(welfare, [
        "category",
        "type",
        "schemeType",
      ]),
    [welfare]
  );

  const budgetUtilization = useMemo(() => {
    const allocated = getNumber(stats.allocatedAmount);
    const spent = getNumber(stats.spentAmount);
    const remaining =
      stats.remainingAmount !== undefined
        ? getNumber(stats.remainingAmount)
        : Math.max(allocated - spent, 0);

    return {
      allocated,
      spent,
      remaining,
      percentage:
        allocated > 0
          ? Math.round((spent / allocated) * 100)
          : 0,
    };
  }, [stats]);

  const unreadNotifications = notifications.filter(
    (n) =>
      n.read === false ||
      normalize(n.status) === "unread" ||
      normalize(n.isRead) === "false"
  ).length;

  const overviewCards = [
    {
      title: "Citizens",
      value: stats.totalCitizens,
      icon: <PeopleIcon />,
    },
    {
      title: "Officers",
      value: stats.totalOfficers,
      icon: <BadgeIcon />,
    },
    {
      title: "Departments",
      value: stats.totalDepartments,
      icon: <ApartmentIcon />,
    },
    {
      title: "Grievances",
      value: stats.totalGrievances,
      icon: <ReportProblemIcon />,
    },
    {
      title: "Applications",
      value: stats.totalApplications,
      icon: <AssignmentIcon />,
    },
    {
      title: "Certificates",
      value: stats.totalCertificates,
      icon: <DescriptionIcon />,
    },
    {
      title: "Welfare Schemes",
      value: welfare.length,
      icon: <WelfareIcon />,
    },
    {
      title: "Total Budget",
      value: `₹${Number(
        stats.totalBudget || 0
      ).toLocaleString("en-IN")}`,
      icon: <AccountBalanceIcon />,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#F4F7FB 0%,#EEF3F8 100%)",
      }}
    >
      <Sidebar />

      <Box
        component="main"
        sx={{
          ml: { xs: 0, md: "270px" },
          px: { xs: 2, sm: 3, md: 4, lg: 5 },
          py: { xs: 2, md: 3 },
          width: {
            xs: "100%",
            md: "calc(100% - 270px)",
          },
          boxSizing: "border-box",
        }}
      >
        <Header />

        {/* WELCOME */}
        <Card
          sx={{
            mt: 3,
            mb: 4,
            borderRadius: 5,
            background:
              "linear-gradient(135deg,#0D47A1 0%,#1976D2 55%,#42A5F5 100%)",
            color: "white",
            boxShadow:
              "0 12px 35px rgba(25,118,210,0.20)",
          }}
        >
          <CardContent
            sx={{
              p: { xs: 3, md: 4 },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight={800}>
                Government Control Center
              </Typography>

              <Typography sx={{ mt: 1, opacity: 0.85 }}>
                {new Date().toDateString()}
              </Typography>

              <Typography
                sx={{
                  mt: 2,
                  fontSize: "1.15rem",
                  fontWeight: 700,
                }}
              >
                Welcome, {fullName}
              </Typography>

              {email && (
                <Typography
                  sx={{ mt: 0.5, opacity: 0.85 }}
                >
                  {email}
                </Typography>
              )}

              <Chip
                label={role}
                size="small"
                sx={{
                  mt: 1.5,
                  color: "white",
                  background:
                    "rgba(255,255,255,0.16)",
                  fontWeight: 700,
                }}
              />

              <Typography
                sx={{
                  mt: 2,
                  maxWidth: 780,
                  lineHeight: 1.7,
                  opacity: 0.9,
                }}
              >
                A quick view of citizens, services,
                grievances, applications, welfare,
                certificates, departments, officers
                and financial activity.
              </Typography>
            </Box>

            <Avatar
              sx={{
                width: 90,
                height: 90,
                background:
                  "rgba(255,255,255,0.18)",
                border:
                  "3px solid rgba(255,255,255,0.3)",
                fontSize: 36,
                fontWeight: 800,
              }}
            >
              {fullName.charAt(0).toUpperCase()}
            </Avatar>
          </CardContent>
        </Card>

        {/* QUICK OVERVIEW */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2.5,
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              fontWeight={800}
              color="#172033"
            >
              System Overview
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Key administrative numbers at a glance.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<AnalyticsIcon />}
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate("/reports")}
            sx={{
              borderRadius: 3,
              fontWeight: 750,
              px: 2,
            }}
          >
            Open Analytics
          </Button>
        </Box>

        <Grid container spacing={2.5}>
          {overviewCards.map((card) => (
            <Grid
              key={card.title}
              size={{ xs: 12, sm: 6, md: 3 }}
            >
              <DashboardCard
                title={card.title}
                value={
                  loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    card.value
                  )
                }
                icon={card.icon}
              />
            </Grid>
          ))}
        </Grid>

        {/* QUICK ANALYTICS */}
        <Box sx={{ mt: 6, mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <AnalyticsIcon
              sx={{ color: "#1976D2", fontSize: 32 }}
            />

            <Typography variant="h5" fontWeight={800}>
              Quick Analytics
            </Typography>
          </Box>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.6 }}
          >
            A brief visual summary of the major
            governance services.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <MiniDonut
              title="Grievance Status"
              centerValue={stats.totalGrievances}
              label="grievances"
              segments={[
                {
                  name: "Open / Active",
                  value: stats.openGrievances,
                  color: "#EF6C00",
                },
                {
                  name: "High Priority",
                  value: stats.highPriorityGrievances,
                  color: "#D32F2F",
                },
                {
                  name: "Escalated",
                  value: stats.escalatedGrievances,
                  color: "#7B1FA2",
                },
              ]}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <MiniDonut
              title="Budget Utilization"
              centerValue={`${budgetUtilization.percentage}%`}
              label="spent"
              segments={[
                {
                  name: "Spent",
                  value: budgetUtilization.spent,
                  color: "#2E7D32",
                },
                {
                  name: "Remaining",
                  value: budgetUtilization.remaining,
                  color: "#90CAF9",
                },
              ]}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <MiniBarChart
              title="Grievance Departments"
              subtitle="Where complaints are concentrated"
              data={grievanceDepartments}
              total={stats.totalGrievances}
              icon={<ApartmentIcon />}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <MiniBarChart
              title="Application Status"
              subtitle="Current service application activity"
              data={applicationStatus}
              total={stats.totalApplications}
              icon={<AssignmentIcon />}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <MiniBarChart
              title="Grievance Status Breakdown"
              subtitle="Current complaint workflow"
              data={grievanceStatus}
              total={stats.totalGrievances}
              icon={<ReportProblemIcon />}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <MiniBarChart
              title="Welfare Schemes"
              subtitle="Scheme categories available"
              data={welfareTypes}
              total={welfare.length}
              icon={<WelfareIcon />}
            />
          </Grid>
        </Grid>

        {/* ADMIN ATTENTION */}
        <Box sx={{ mt: 6, mb: 3 }}>
          <Typography variant="h5" fontWeight={800}>
            Admin Attention
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Items that may require a quick review.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card
              sx={{
                borderRadius: 4,
                border: "1px solid #FFCDD2",
                background: "#FFF8F8",
              }}
            >
              <CardContent>
                <Avatar
                  sx={{
                    background: "#FFEBEE",
                    color: "#D32F2F",
                    mb: 1.5,
                  }}
                >
                  <WarningAmberIcon />
                </Avatar>

                <Typography
                  color="text.secondary"
                  fontSize="0.85rem"
                >
                  High Priority Grievances
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={850}
                  color="#D32F2F"
                >
                  {stats.highPriorityGrievances}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mt: 0.5 }}
                >
                  Need closer administrative attention.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card
              sx={{
                borderRadius: 4,
                border: "1px solid #FFE0B2",
                background: "#FFF9F2",
              }}
            >
              <CardContent>
                <Avatar
                  sx={{
                    background: "#FFF3E0",
                    color: "#EF6C00",
                    mb: 1.5,
                  }}
                >
                  <ScheduleIcon />
                </Avatar>

                <Typography
                  color="text.secondary"
                  fontSize="0.85rem"
                >
                  Open Grievances
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={850}
                  color="#EF6C00"
                >
                  {stats.openGrievances}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mt: 0.5 }}
                >
                  Currently active or awaiting resolution.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card
              sx={{
                borderRadius: 4,
                border: "1px solid #C8E6C9",
                background: "#F7FFF7",
              }}
            >
              <CardContent>
                <Avatar
                  sx={{
                    background: "#E8F5E9",
                    color: "#2E7D32",
                    mb: 1.5,
                  }}
                >
                  <CheckCircleIcon />
                </Avatar>

                <Typography
                  color="text.secondary"
                  fontSize="0.85rem"
                >
                  Certificates Issued
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={850}
                  color="#2E7D32"
                >
                  {stats.totalCertificates}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mt: 0.5 }}
                >
                  Certificate service activity.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card
              sx={{
                borderRadius: 4,
                border: "1px solid #BBDEFB",
                background: "#F6FBFF",
              }}
            >
              <CardContent>
                <Avatar
                  sx={{
                    background: "#E3F2FD",
                    color: "#1976D2",
                    mb: 1.5,
                  }}
                >
                  <NotificationsIcon />
                </Avatar>

                <Typography
                  color="text.secondary"
                  fontSize="0.85rem"
                >
                  Unread Notifications
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={850}
                  color="#1976D2"
                >
                  {unreadNotifications}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mt: 0.5 }}
                >
                  Notifications requiring review.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* AI GOVERNANCE ANALYSIS */}
        <Card
          sx={{
            mt: 6,
            borderRadius: 5,
            overflow: "hidden",
            boxShadow: "0 10px 35px rgba(25,118,210,0.12)",
          }}
        >
          <Box
            sx={{
              p: { xs: 3, md: 4 },
              background: "linear-gradient(135deg,#0D47A1,#1976D2)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  background: "rgba(255,255,255,0.16)",
                  width: 55,
                  height: 55,
                }}
              >
                <PsychologyIcon />
              </Avatar>

              <Box>
                <Typography variant="h6" fontWeight={850}>
                  AI Governance Analysis
                </Typography>
                <Typography sx={{ mt: 0.4, opacity: 0.88 }}>
                  Analyze the complete administrative system directly from the dashboard.
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              onClick={generateAdministrativeAnalysis}
              disabled={aiLoading}
              startIcon={
                aiLoading ? (
                  <CircularProgress size={20} sx={{ color: "#1565C0" }} />
                ) : (
                  <PsychologyIcon />
                )
              }
              sx={{
                background: "white",
                color: "#1565C0",
                fontWeight: 800,
                borderRadius: 3,
                px: 2.5,
                py: 1.3,
                "&:hover": { background: "#F1F7FF" },
              }}
            >
              {aiLoading ? "Generating Analysis..." : aiAnalysis ? "Regenerate Analysis" : "Generate Administrative Analysis"}
            </Button>
          </Box>

          {aiLoading && (
            <Box sx={{ p: { xs: 3, md: 4 } }}>
              <Typography fontWeight={700} color="#344054" sx={{ mb: 1.5 }}>
                AI is analyzing the live administrative data...
              </Typography>
              <LinearProgress sx={{ height: 8, borderRadius: 5 }} />
            </Box>
          )}

          {aiError && !aiLoading && (
            <Box sx={{ p: { xs: 3, md: 4 } }}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  background: "#FFF5F5",
                  border: "1px solid #FFCDD2",
                  color: "#C62828",
                }}
              >
                <Typography fontWeight={750}>AI Analysis Unavailable</Typography>
                <Typography sx={{ mt: 0.5 }}>{aiError}</Typography>
              </Box>
            </Box>
          )}
        </Card>

        {aiAnalysis && !aiLoading && (
          <Card
            sx={{
              mt: 3,
              borderRadius: 5,
              border: "1px solid #D9E7F7",
              boxShadow: "0 8px 30px rgba(25,118,210,0.10)",
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                  mb: 3,
                  pb: 2,
                  borderBottom: "1px solid #E5EAF0",
                }}
              >
                <Box>
                  <Typography variant="h5" fontWeight={850} color="#123B6D">
                    Administrative AI Analysis
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    Generated from current live administrative data.
                  </Typography>
                </Box>
                <Chip
                  label="AI Analysis Complete"
                  color="success"
                  icon={<CheckCircleIcon />}
                  sx={{ fontWeight: 750 }}
                />
              </Box>

              <Box
                sx={{
                  p: { xs: 2.5, md: 4 },
                  borderRadius: 4,
                  background: "#F8FAFC",
                  border: "1px solid #E5EAF0",
                  maxHeight: 700,
                  overflowY: "auto",
                }}
              >
                {aiAnalysis.split("\n").map((line, index) => {
                  const text = line.trim();
                  if (!text) return <Box key={index} sx={{ height: 10 }} />;

                  const heading =
                    text.startsWith("#") ||
                    /^[A-Z][A-Z\s&-]{5,}$/.test(text);

                  return (
                    <Typography
                      key={index}
                      sx={{
                        mb: 1,
                        lineHeight: 1.8,
                        fontWeight: heading ? 800 : 400,
                        fontSize: heading ? "1.05rem" : "0.96rem",
                        color: heading ? "#123B6D" : "#344054",
                      }}
                    >
                      {text.replace(/^#+\s*/, "").replace(/\*\*/g, "")}
                    </Typography>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* QUICK ACTIONS */}
        <Box sx={{ mt: 6, mb: 3 }}>
          <Typography variant="h5" fontWeight={800}>
            Quick Actions
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.7 }}
          >
            Access frequently used administration modules.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <ActionCard
              title="Manage Citizens"
              description="Manage and view registered citizens."
              onClick={() => navigate("/citizens")}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <ActionCard
              title="Manage Officers"
              description="Manage and view government officers."
              onClick={() => navigate("/officers")}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <ActionCard
              title="Departments"
              description="Manage departments and their officers."
              onClick={() => navigate("/departments")}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <ActionCard
              title="Complaints"
              description="Manage and monitor citizen grievances."
              onClick={() => navigate("/grievances")}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <ActionCard
              title="Assign Officer"
              description="Assign complaints to responsible officers."
              onClick={() => navigate("/assign-officer")}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <ActionCard
              title="Analytics & Reports"
              description="Open detailed analytics, reports and AI insights."
              onClick={() => navigate("/reports")}
            />
          </Grid>
        </Grid>

        {/* RECENT ACTIVITY + SYSTEM STATUS */}
        <Grid
          container
          spacing={3}
          sx={{ mt: 4 }}
        >
          <Grid size={{ xs: 12, lg: 7 }}>
            <RecentActivity grievances={grievances} />
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <SystemStatus stats={stats} />
          </Grid>
        </Grid>

        {/* NOTIFICATIONS */}
        <Box sx={{ mt: 4 }}>
          <NotificationPanel
            notifications={notifications}
          />
        </Box>

        {/* EXISTING STATISTICS */}
        <Box sx={{ mt: 4, mb: 5 }}>
          <StatisticsPanel stats={stats} />
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
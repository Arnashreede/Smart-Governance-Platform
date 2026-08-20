import React, { useEffect, useMemo, useState } from "react";

import {
  Box,
  Paper,
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  LinearProgress,
} from "@mui/material";

import {
  Person,
  Description,
  ReportProblem,
  VolunteerActivism,
  Notifications,
  AccountBalance,
  PendingActions,
  CheckCircle,
  ArrowForward,
  TrendingUp,
  Campaign,
  Download,
  Refresh,
  Add,
} from "@mui/icons-material";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import {
  getCitizenGrievances,
} from "../services/grievanceService";

import {
  getNotifications,
} from "../services/notificationService";

import api from "../api/axios";


/* =========================================================
   CITIZEN DASHBOARD
========================================================= */

export default function CitizenDashboard() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [applications, setApplications] = useState([]);

  const [grievances, setGrievances] = useState([]);

  const [certificates, setCertificates] = useState([]);

  const [notifications, setNotifications] = useState([]);

  const [welfareSchemes, setWelfareSchemes] = useState([]);

  const [citizen, setCitizen] = useState(null);


  /* =========================================================
     LOGGED-IN USER
  ========================================================= */

  const username =
    localStorage.getItem("username") ||
    localStorage.getItem("name") ||
    "Citizen";

  const citizenId =
    localStorage.getItem("userId");


  /* =========================================================
     LOAD DASHBOARD
  ========================================================= */

  useEffect(() => {

    if (!citizenId) {

      setError(
        "Citizen information was not found. Please login again."
      );

      setLoading(false);

      return;
    }

    loadDashboard();

  }, [citizenId]);


  const loadDashboard = async () => {

    setLoading(true);

    setError("");

    try {

      /*
       * We intentionally load each module separately.
       * If one service is unavailable, the rest of the
       * citizen dashboard can still work.
       */

      const results = await Promise.allSettled([

        /* Applications */

        api.get(`/applications/citizen/${citizenId}`),

        /* Grievances */

        getCitizenGrievances(citizenId),

        /* Notifications */

        getNotifications(citizenId),

        /* Certificates */

        api.get("/certificates"),

        /* Welfare schemes */

        api.get("/welfare"),

        /* Citizen profile */

        api.get(`/citizens/${citizenId}`),

      ]);


      /* =====================================================
         APPLICATIONS
      ===================================================== */

      let citizenApplications = [];

      if (results[0].status === "fulfilled") {

        citizenApplications = extractArray(
          results[0].value
        );

        setApplications(citizenApplications);

      } else {

        console.warn(
          "Applications could not be loaded:",
          results[0].reason
        );

        setApplications([]);

      }

      /* =====================================================
         GRIEVANCES
      ===================================================== */

      if (results[1].status === "fulfilled") {

        const data = extractArray(
          results[1].value
        );

        setGrievances(data);

      } else {

        console.warn(
          "Grievances could not be loaded:",
          results[1].reason
        );

        setGrievances([]);

      }


      /* =====================================================
         NOTIFICATIONS
      ===================================================== */

      if (results[2].status === "fulfilled") {

        const data = extractArray(
          results[2].value
        );

        setNotifications(data);

      } else {

        console.warn(
          "Notifications could not be loaded:",
          results[2].reason
        );

        setNotifications([]);

      }


      /* =====================================================
         CERTIFICATES
      ===================================================== */

     /* =====================================================
   CERTIFICATES
   Use actual Citizen Service ID
===================================================== */

if (results[3].status === "fulfilled") {

  const allCertificates = extractArray(
    results[3].value
  );

  let actualCitizenId = null;

  try {
    const email = localStorage.getItem("email");

    if (email) {
      const citizenResponse =
        await api.get("/citizens");

      const citizens =
        extractArray(citizenResponse);

      const currentCitizen =
        citizens.find(
          citizen =>
            citizen?.email?.toLowerCase() ===
            email.toLowerCase()
        );

      if (currentCitizen?.id) {
        actualCitizenId = currentCitizen.id;

        // Keep the actual Citizen Service ID available
        localStorage.setItem(
          "citizenId",
          String(currentCitizen.id)
        );
      }
    }
  } catch (citizenError) {
    console.error(
      "Failed to resolve Citizen Service ID:",
      citizenError
    );
  }

  console.log(
    "DASHBOARD - User ID:",
    localStorage.getItem("userId")
  );

  console.log(
    "DASHBOARD - Actual Citizen ID:",
    actualCitizenId
  );

  const citizenCertificates =
    actualCitizenId
      ? allCertificates.filter(
          certificate =>
            certificate?.citizenId !==
              undefined &&
            certificate?.citizenId !== null &&
            String(
              certificate.citizenId
            ) ===
              String(actualCitizenId)
        )
      : [];

  console.log(
    "DASHBOARD - Citizen Certificates:",
    citizenCertificates
  );

  setCertificates(
    citizenCertificates
  );

} else {

  console.warn(
    "Certificates could not be loaded:",
    results[3].reason
  );

  setCertificates([]);
}

      /* =====================================================
         WELFARE SCHEMES
      ===================================================== */

      if (results[4].status === "fulfilled") {

        const data = extractArray(
          results[4].value
        );

        setWelfareSchemes(data);

      } else {

        console.warn(
          "Welfare schemes could not be loaded:",
          results[4].reason
        );

        setWelfareSchemes([]);

      }


      /* =====================================================
         CITIZEN PROFILE
      ===================================================== */

      if (results[5].status === "fulfilled") {

        const data =
          results[5].value?.data ??
          results[5].value;

        setCitizen(data);

      } else {

        console.warn(
          "Citizen profile could not be loaded:",
          results[5].reason
        );

        setCitizen(null);

      }

    } catch (err) {

      console.error(
        "Citizen dashboard loading failed:",
        err
      );

      setError(
        "Some dashboard information could not be loaded."
      );

    } finally {

      setLoading(false);

    }

  };


  /* =========================================================
     DASHBOARD STATISTICS
  ========================================================= */

  const dashboard = useMemo(() => {

    const applicationCount =
      applications.length;

    const certificateCount =
      certificates.length;

    const grievanceCount =
      grievances.length;

    const pendingApplications =
      applications.filter(
        isPendingApplication
      ).length;

    const schemeCount =
      welfareSchemes.length;

    const unreadNotifications =
      notifications.filter(
        notification => !notification.read
      ).length;

    const resolvedGrievances =
      grievances.filter(
        grievance =>
          normalizeStatus(grievance.status) === "RESOLVED" ||
          normalizeStatus(grievance.status) === "CLOSED"
      ).length;

    return {

      applicationCount,

      certificateCount,

      grievanceCount,

      pendingApplications,

      schemeCount,

      unreadNotifications,

      resolvedGrievances,

    };

  }, [
    applications,
    certificates,
    grievances,
    welfareSchemes,
    notifications,
  ]);


  /* =========================================================
     APPLICATION CHART
  ========================================================= */

  const monthlyApplications =
    useMemo(() => {

      const months = createLastSixMonths();

      return months.map(month => {

        const value =
          applications.filter(
            application => {

              const date =
                getRecordDate(application);

              if (!date) {
                return false;
              }

              return (
                date.getFullYear() === month.year &&
                date.getMonth() === month.month
              );

            }
          ).length;

        return {

          month: month.label,

          value,

        };

      });

    }, [applications]);


  /* =========================================================
     GRIEVANCE CHART
  ========================================================= */

  const grievanceChart =
    useMemo(() => {

      const counts = {

        resolved: 0,

        pending: 0,

        rejected: 0,

      };


      grievances.forEach(grievance => {

        const status =
          normalizeStatus(
            grievance.status
          );


        if (
          status === "RESOLVED" ||
          status === "CLOSED"
        ) {

          counts.resolved++;

        } else if (
          status === "REJECTED" ||
          status === "CANCELLED"
        ) {

          counts.rejected++;

        } else {

          counts.pending++;

        }

      });


      return [

        {
          name: "Resolved",
          value: counts.resolved,
        },

        {
          name: "Pending",
          value: counts.pending,
        },

        {
          name: "Rejected",
          value: counts.rejected,
        },

      ];

    }, [grievances]);


  /* =========================================================
     RECENT ACTIVITY
  ========================================================= */

  const recentActivity =
    useMemo(() => {

      const activity = [];


      /* Applications */

      applications.forEach(application => {

        const date =
          getRecordDate(application);

        activity.push({

          id:
            `application-${application.id ?? Math.random()}`,

          type: "Application",

          title:
            application.applicationType ||
            application.serviceName ||
            application.type ||
            "Application",

          message:
            application.status
              ? `Status: ${formatStatus(application.status)}`
              : "Application submitted",

          date,

          color: "#1976D2",

          icon: <Description />,

        });

      });


      /* Grievances */

      grievances.forEach(grievance => {

        const date =
          getRecordDate(grievance);

        activity.push({

          id:
            `grievance-${grievance.id ?? Math.random()}`,

          type: "Grievance",

          title:
            grievance.title ||
            grievance.subject ||
            grievance.category ||
            "Grievance",

          message:
            grievance.status
              ? `Status: ${formatStatus(grievance.status)}`
              : "Grievance submitted",

          date,

          color: "#E53935",

          icon: <ReportProblem />,

        });

      });


      /* Certificates */

      certificates.forEach(certificate => {

        const date =
          getRecordDate(certificate);

        activity.push({

          id:
            `certificate-${certificate.id ?? Math.random()}`,

          type: "Certificate",

          title:
            certificate.certificateType ||
            certificate.type ||
            certificate.certificateNumber ||
            "Certificate",

          message:
            "Certificate record available",

          date,

          color: "#00897B",

          icon: <AccountBalance />,

        });

      });


      return activity

        .filter(
          item => item.date
        )

        .sort(
          (a, b) =>
            b.date.getTime() -
            a.date.getTime()
        )

        .slice(0, 5);

    }, [
      applications,
      grievances,
      certificates,
    ]);


  /* =========================================================
     RECENT APPLICATIONS
  ========================================================= */

  const recentApplications =
    useMemo(() => {

      return [...applications]

        .sort(
          (a, b) =>
            getRecordTimestamp(b) -
            getRecordTimestamp(a)
        )

        .slice(0, 4);

    }, [applications]);


  /* =========================================================
     RECENT NOTIFICATIONS
  ========================================================= */

  const recentNotifications =
    useMemo(() => {

      return [...notifications]

        .sort(
          (a, b) =>
            getRecordTimestamp(b) -
            getRecordTimestamp(a)
        )

        .slice(0, 4);

    }, [notifications]);


  /* =========================================================
     RECENT WELFARE SCHEMES
  ========================================================= */

  const recentSchemes =
    useMemo(() => {

      return welfareSchemes.slice(0, 4);

    }, [welfareSchemes]);


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {

    return (

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          background: "#F4F7FB",
        }}
      >

        <Sidebar />

        <Box
          sx={{
            flex: 1,
            ml: "280px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >

          <Stack
            spacing={2}
            alignItems="center"
          >

            <CircularProgress />

            <Typography color="text.secondary">

              Loading your citizen dashboard...

            </Typography>

          </Stack>

        </Box>

      </Box>

    );

  }


  /* =========================================================
     MAIN UI
  ========================================================= */

  return (

    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#F4F7FB 0%,#EEF3F9 100%)",
      }}
    >

      <Sidebar />


      <Box
        sx={{
          flex: 1,
          ml: "280px",
          minWidth: 0,
        }}
      >

        <Header title="Citizen Dashboard" />


        <Box
          sx={{
            p: {
              xs: 2,
              md: 3,
              lg: 4,
            },
          }}
        >


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <Alert
              severity="warning"
              sx={{
                mb: 3,
                borderRadius: 3,
              }}
              action={

                <Button
                  color="inherit"
                  size="small"
                  startIcon={<Refresh />}
                  onClick={loadDashboard}
                >
                  Retry
                </Button>

              }
            >

              {error}

            </Alert>

          )}


          {/* =================================================
              HERO
          ================================================= */}

          <Paper
            elevation={0}
            sx={{
              borderRadius: 5,
              p: {
                xs: 3,
                md: 4,
              },
              mb: 3,
              color: "white",
              position: "relative",
              overflow: "hidden",
              background:
                "linear-gradient(135deg,#0D47A1,#1976D2,#42A5F5)",
            }}
          >

            <Box
              sx={{
                position: "absolute",
                width: 260,
                height: 260,
                borderRadius: "50%",
                background:
                  "rgba(255,255,255,.08)",
                right: -80,
                top: -100,
              }}
            />

            <Box
              sx={{
                position: "absolute",
                width: 160,
                height: 160,
                borderRadius: "50%",
                background:
                  "rgba(255,255,255,.06)",
                right: 160,
                bottom: -100,
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
              position="relative"
              zIndex={1}
            >

              <Box>

                <Chip
                  label="Citizen Portal"
                  sx={{
                    color: "white",
                    background:
                      "rgba(255,255,255,.18)",
                    fontWeight: 700,
                  }}
                />

                <Typography
                  variant="h3"
                  fontWeight={800}
                  mt={2}
                >

                  Welcome back,
                  <br />

                  {citizen?.name ||
                    citizen?.fullName ||
                    username}

                </Typography>

                <Typography
                  mt={1.5}
                  sx={{
                    opacity: 0.9,
                    maxWidth: 650,
                  }}
                >

                  Manage your applications,
                  complaints, certificates and
                  welfare services from one place.

                </Typography>


                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  spacing={2}
                  mt={3}
                >

                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() =>
  navigate("/grievance/register")
}
                    sx={{
                      background: "white",
                      color: "#1565C0",
                      fontWeight: 700,
                      borderRadius: 3,
                      "&:hover": {
                        background: "#F5F9FF",
                      },
                    }}
                  >

                    File a Complaint

                  </Button>


                  <Button
                    variant="outlined"
                    endIcon={<ArrowForward />}
                    onClick={() =>
                      navigate(
                        "/welfare/schemes"
                      )
                    }
                    sx={{
                      color: "white",
                      borderColor:
                        "rgba(255,255,255,.8)",
                      fontWeight: 700,
                      borderRadius: 3,
                    }}
                  >

                    Explore Services

                  </Button>

                </Stack>

              </Box>


              <Avatar
                sx={{
                  width: 110,
                  height: 110,
                  background: "white",
                  color: "#1565C0",
                  boxShadow:
                    "0 15px 35px rgba(0,0,0,.2)",
                }}
              >

                <Person
                  sx={{
                    fontSize: 65,
                  }}
                />

              </Avatar>

            </Stack>

          </Paper>


          {/* =================================================
              STATISTICS
          ================================================= */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2,1fr)",
                lg: "repeat(4,1fr)",
              },
              gap: 2,
              mb: 3,
            }}
          >

            <StatCard
              title="My Benefits"
              value={dashboard.applicationCount}
              icon={<VolunteerActivism />}
              color="#7B1FA2"
              onClick={() =>
                navigate(
                  "/welfare/applications"
                )
              }
            />


            <StatCard
              title="My Complaints"
              value={dashboard.grievanceCount}
              icon={<ReportProblem />}
              color="#D32F2F"
              onClick={() =>
                navigate("/grievances")
              }
            />


  <StatCard
  title="My Certificates"
  value={dashboard.certificateCount}
  icon={<AccountBalance />}
  color="#00897B"
  onClick={() =>
    navigate("/my-certificates")
  }
/>


            <StatCard
              title="Unread Notifications"
              value={dashboard.unreadNotifications}
              icon={<Notifications />}
              color="#EF6C00"
              onClick={() =>
                navigate("/notifications")
              }
            />

          </Box>


          {/* =================================================
              QUICK SERVICES
          ================================================= */}

          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 4,
              mb: 3,
            }}
          >

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >

              <Box>

                <Typography
                  variant="h5"
                  fontWeight={800}
                >
                  Quick Services
                </Typography>

                <Typography
                  color="text.secondary"
                  mt={0.5}
                >
                  Access your most-used citizen
                  services quickly.
                </Typography>

              </Box>

              <Chip
                label="Citizen Services"
                color="primary"
              />

            </Stack>


            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2,1fr)",
                  md: "repeat(3,1fr)",
                  lg: "repeat(6,1fr)",
                },
                gap: 2,
              }}
            >

              <ServiceCard
                title="Applications"
                subtitle="Track requests"
                icon={<Description />}
                color="#1976D2"
                onClick={() =>
                  navigate(
                    "/welfare/applications"
                  )
                }
              />


              <ServiceCard
                title="Complaints"
                subtitle="Raise or track"
                icon={<ReportProblem />}
                color="#E53935"
                onClick={() =>
                  navigate("/grievances")
                }
              />


              <ServiceCard
                title="Certificates"
                subtitle="View documents"
                icon={<AccountBalance />}
                color="#00897B"
                onClick={() =>
                  navigate(
                    "/certificates"
                  )
                }
              />


              <ServiceCard
                title="Welfare"
                subtitle="Explore schemes"
                icon={<VolunteerActivism />}
                color="#8E24AA"
                onClick={() =>
                  navigate(
                    "/welfare/schemes"
                  )
                }
              />


              <ServiceCard
                title="Notifications"
                subtitle="View updates"
                icon={<Notifications />}
                color="#3949AB"
                onClick={() =>
                  navigate("/notifications")
                }
              />


              <ServiceCard
                title="Profile"
                subtitle="Manage account"
                icon={<Person />}
                color="#546E7A"
                onClick={() =>
                  navigate("/profile")
                }
              />

            </Box>

          </Paper>


          {/* =================================================
              CHARTS
          ================================================= */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "1.6fr 1fr",
              },
              gap: 3,
              mb: 3,
            }}
          >

            {/* APPLICATION CHART */}

            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 4,
                minHeight: 380,
              }}
            >

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >

                <Box>

                  <Typography
                    variant="h5"
                    fontWeight={800}
                  >
                    Application Activity
                  </Typography>

                  <Typography
                    color="text.secondary"
                  >
                    Your applications over the
                    recent months.
                  </Typography>

                </Box>

                <TrendingUp
                  color="primary"
                />

              </Stack>


              {applications.length === 0 ? (

                <EmptyState
                  icon={<Description />}
                  message="No applications available yet."
                  buttonText="Apply for a Service"
                  onClick={() =>
                    navigate(
                      "/welfare/schemes"
                    )
                  }
                />

              ) : (

                <ResponsiveContainer
                  width="100%"
                  height={290}
                >

                  <AreaChart
                    data={monthlyApplications}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="month"
                    />

                    <YAxis
                      allowDecimals={false}
                    />

                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="value"
                      name="Applications"
                      stroke="#1976D2"
                      fill="#90CAF9"
                      strokeWidth={3}
                    />

                  </AreaChart>

                </ResponsiveContainer>

              )}

            </Paper>


            {/* GRIEVANCE CHART */}

            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 4,
                minHeight: 380,
              }}
            >

              <Typography
                variant="h5"
                fontWeight={800}
              >
                Complaint Status
              </Typography>

              <Typography
                color="text.secondary"
              >
                Current status of your complaints.
              </Typography>


              {grievances.length === 0 ? (

                <EmptyState
                  icon={<ReportProblem />}
                  message="No complaints found."
                  buttonText="File a Complaint"
                  onClick={() =>
                    navigate("/grievances")
                  }
                />

              ) : (

                <ResponsiveContainer
                  width="100%"
                  height={290}
                >

                  <PieChart>

                    <Pie
                      data={grievanceChart}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={95}
                      innerRadius={45}
                      paddingAngle={3}
                      label
                    >

                      <Cell fill="#43A047" />

                      <Cell fill="#FB8C00" />

                      <Cell fill="#E53935" />

                    </Pie>

                    <Tooltip />

                    <Legend />

                  </PieChart>

                </ResponsiveContainer>

              )}

            </Paper>

          </Box>


          {/* =================================================
              RECENT ACTIVITY + NOTIFICATIONS
          ================================================= */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "1.5fr 1fr",
              },
              gap: 3,
              mb: 3,
            }}
          >

            {/* RECENT ACTIVITY */}

            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 4,
              }}
            >

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >

                <Box>

                  <Typography
                    variant="h5"
                    fontWeight={800}
                  >
                    Recent Activity
                  </Typography>

                  <Typography
                    color="text.secondary"
                  >
                    Latest activity from your account.
                  </Typography>

                </Box>

                <Chip
                  label="Live Data"
                  color="primary"
                />

              </Stack>


              {recentActivity.length === 0 ? (

                <EmptyState
                  icon={<TrendingUp />}
                  message="No recent activity available."
                />

              ) : (

                <Stack spacing={2}>

                  {recentActivity.map(
                    activity => (

                      <ActivityRow
                        key={activity.id}
                        activity={activity}
                      />

                    )
                  )}

                </Stack>

              )}

            </Paper>


            {/* NOTIFICATIONS */}

            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 4,
              }}
            >

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >

                <Box>

                  <Typography
                    variant="h5"
                    fontWeight={800}
                  >
                    Notifications
                  </Typography>

                  <Typography
                    color="text.secondary"
                  >
                    Your latest updates.
                  </Typography>

                </Box>

                <Button
                  size="small"
                  onClick={() =>
                    navigate(
                      "/notifications"
                    )
                  }
                >
                  View All
                </Button>

              </Stack>


              {recentNotifications.length === 0 ? (

                <EmptyState
                  icon={<Notifications />}
                  message="No notifications found."
                />

              ) : (

                <Stack spacing={2}>

                  {recentNotifications.map(
                    notification => (

                      <NotificationRow
                        key={notification.id}
                        notification={
                          notification
                        }
                      />

                    )
                  )}

                </Stack>

              )}

            </Paper>

          </Box>


          {/* =================================================
              APPLICATIONS
          ================================================= */}

          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 4,
              mb: 3,
            }}
          >

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >

              <Box>

                <Typography
                  variant="h5"
                  fontWeight={800}
                >
                  My Recent Applications
                </Typography>

                <Typography
                  color="text.secondary"
                >
                  Track your latest service requests.
                </Typography>

              </Box>

              <Button
                endIcon={<ArrowForward />}
                onClick={() =>
                  navigate(
                    "/welfare/applications"
                  )
                }
              >
                View All
              </Button>

            </Stack>


            {recentApplications.length === 0 ? (

              <EmptyState
                icon={<Description />}
                message="You haven't submitted any applications yet."
                buttonText="Explore Services"
                onClick={() =>
                  navigate(
                    "/welfare/schemes"
                  )
                }
              />

            ) : (

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(2,1fr)",
                  },
                  gap: 2,
                }}
              >

                {recentApplications.map(
                  application => (

                    <ApplicationCard
                      key={application.id}
                      application={
                        application
                      }
                    />

                  )
                )}

              </Box>

            )}

          </Paper>


          {/* =================================================
              WELFARE
          ================================================= */}

          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 4,
              mb: 3,
            }}
          >

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >

              <Box>

                <Typography
                  variant="h5"
                  fontWeight={800}
                >
                  Available Welfare Schemes
                </Typography>

                <Typography
                  color="text.secondary"
                >
                  Government services and schemes
                  currently available.
                </Typography>

              </Box>

              <Button
                endIcon={<ArrowForward />}
                onClick={() =>
                  navigate(
                    "/welfare/schemes"
                  )
                }
              >
                View All
              </Button>

            </Stack>


            {recentSchemes.length === 0 ? (

              <EmptyState
                icon={<VolunteerActivism />}
                message="No welfare schemes are currently available."
              />

            ) : (

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2,1fr)",
                    lg: "repeat(4,1fr)",
                  },
                  gap: 2,
                }}
              >

                {recentSchemes.map(
                  scheme => (

                    <SchemeCard
                      key={
                        scheme.id ??
                        scheme.schemeId ??
                        scheme.name
                      }
                      scheme={scheme}
                    />

                  )
                )}

              </Box>

            )}

          </Paper>


          {/* =================================================
              FOOTER SUMMARY
          ================================================= */}

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              background:
                "linear-gradient(135deg,#E3F2FD,#F5F9FF)",
              border:
                "1px solid #D6E8FA",
            }}
          >

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
              spacing={2}
            >

              <Box>

                <Typography
                  fontWeight={800}
                  fontSize={18}
                >
                  Need help with a service?
                </Typography>

                <Typography
                  color="text.secondary"
                  mt={0.5}
                >
                  You can track applications,
                  complaints and certificates
                  from your portal.
                </Typography>

              </Box>

              <Stack
                direction="row"
                spacing={1}
              >

                <Button
                  variant="outlined"
                  onClick={() =>
                    navigate("/grievances")
                  }
                >
                  My Complaints
                </Button>

                <Button
                  variant="contained"
                  onClick={() =>
                    navigate(
                      "/welfare/applications"
                    )
                  }
                >
                  My Applications
                </Button>

              </Stack>

            </Stack>

          </Paper>


        </Box>

      </Box>

    </Box>

  );

}


/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  title,
  value,
  icon,
  color,
  onClick,
}) {

  return (

    <Card
      elevation={2}
      onClick={onClick}
      sx={{
        borderRadius: 4,
        cursor: "pointer",
        transition: "0.25s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 7,
        },
      }}
    >

      <CardContent>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >

          <Box>

            <Typography
              color="text.secondary"
              fontSize={14}
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              fontWeight={800}
              mt={1}
            >
              {value}
            </Typography>

          </Box>

          <Avatar
            sx={{
              bgcolor: color,
              width: 55,
              height: 55,
            }}
          >
            {icon}
          </Avatar>

        </Stack>

      </CardContent>

    </Card>

  );

}


/* ============================================================
   SERVICE CARD
============================================================ */

function ServiceCard({
  title,
  subtitle,
  icon,
  color,
  onClick,
}) {

  return (

    <Paper
      onClick={onClick}
      elevation={1}
      sx={{
        p: 2,
        borderRadius: 3,
        cursor: "pointer",
        transition: "0.25s",
        border:
          "1px solid rgba(0,0,0,.06)",

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 5,
        },
      }}
    >

      <Avatar
        sx={{
          bgcolor: color,
          width: 48,
          height: 48,
          mb: 1.5,
        }}
      >
        {icon}
      </Avatar>

      <Typography
        fontWeight={800}
        fontSize={15}
      >
        {title}
      </Typography>

      <Typography
        color="text.secondary"
        fontSize={12}
        mt={0.5}
      >
        {subtitle}
      </Typography>

    </Paper>

  );

}


/* ============================================================
   ACTIVITY ROW
============================================================ */

function ActivityRow({
  activity,
}) {

  return (

    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 3,
        borderLeft:
          `5px solid ${activity.color}`,
      }}
    >

      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
      >

        <Avatar
          sx={{
            bgcolor: activity.color,
            width: 42,
            height: 42,
          }}
        >
          {activity.icon}
        </Avatar>


        <Box flex={1}>

          <Typography
            fontWeight={700}
          >
            {activity.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {activity.message}
          </Typography>

        </Box>


        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            whiteSpace: "nowrap",
          }}
        >

          {formatDate(
            activity.date
          )}

        </Typography>

      </Stack>

    </Paper>

  );

}


/* ============================================================
   NOTIFICATION ROW
============================================================ */

function NotificationRow({
  notification,
}) {

  return (

    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 3,
        borderLeft:
          notification.read
            ? "4px solid #BDBDBD"
            : "4px solid #1976D2",
        background:
          notification.read
            ? "#fff"
            : "#F4F9FF",
      }}
    >

      <Stack
        direction="row"
        spacing={2}
      >

        <Avatar
          sx={{
            bgcolor:
              notification.read
                ? "#BDBDBD"
                : "#1976D2",
            width: 40,
            height: 40,
          }}
        >

          <Notifications />

        </Avatar>


        <Box flex={1}>

          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={1}
          >

            <Typography
              fontWeight={700}
            >
              {notification.title ||
                "Notification"}
            </Typography>

            {!notification.read && (

              <Chip
                size="small"
                label="New"
                color="primary"
              />

            )}

          </Stack>


          <Typography
            variant="body2"
            color="text.secondary"
            mt={0.5}
          >

            {notification.message}

          </Typography>


          {notification.createdAt && (

            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              mt={1}
            >

              {formatDate(
                notification.createdAt
              )}

            </Typography>

          )}

        </Box>

      </Stack>

    </Paper>

  );

}


/* ============================================================
   APPLICATION CARD
============================================================ */

function ApplicationCard({
  application,
}) {

  const status =
    application.status ||
    "SUBMITTED";

  const progress =
    getApplicationProgress(status);


  return (

    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 3,
      }}
    >

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={2}
      >

        <Box>

          <Typography
            fontWeight={800}
          >

            {application.applicationType ||
              application.serviceName ||
              application.type ||
              "Service Application"}

          </Typography>


          {application.department && (

            <Typography
              variant="body2"
              color="text.secondary"
              mt={0.5}
            >

              {application.department}

            </Typography>

          )}

        </Box>


        <Chip
          label={formatStatus(status)}
          color={getStatusColor(status)}
          size="small"
        />

      </Stack>


      <Box mt={2}>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
          }}
        />

      </Box>


      <Stack
        direction="row"
        justifyContent="space-between"
        mt={1}
      >

        <Typography
          variant="caption"
          color="text.secondary"
        >
          Progress
        </Typography>

        <Typography
          variant="caption"
          fontWeight={700}
        >
          {progress}%
        </Typography>

      </Stack>

    </Paper>

  );

}


/* ============================================================
   WELFARE SCHEME CARD
============================================================ */

function SchemeCard({
  scheme,
}) {

  return (

    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 3,
        height: "100%",
        transition: "0.25s",

        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: 4,
        },
      }}
    >

      <Avatar
        sx={{
          bgcolor: "#8E24AA",
          mb: 2,
        }}
      >
        <VolunteerActivism />
      </Avatar>


      <Typography
        fontWeight={800}
      >

        {scheme.name ||
          scheme.schemeName ||
          scheme.title ||
          "Welfare Scheme"}

      </Typography>


      {(scheme.description ||
        scheme.department) && (

        <Typography
          variant="body2"
          color="text.secondary"
          mt={1}
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >

          {scheme.description ||
            scheme.department}

        </Typography>

      )}


      {scheme.amount != null && (

        <Typography
          fontWeight={700}
          color="primary"
          mt={2}
        >

          Benefit: {formatAmount(
            scheme.amount
          )}

        </Typography>

      )}

    </Paper>

  );

}


/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState({
  icon,
  message,
  buttonText,
  onClick,
}) {

  return (

    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={1.5}
      sx={{
        minHeight: 180,
        textAlign: "center",
      }}
    >

      <Avatar
        sx={{
          bgcolor: "#E3F2FD",
          color: "#1976D2",
          width: 55,
          height: 55,
        }}
      >
        {icon}
      </Avatar>

      <Typography
        color="text.secondary"
      >
        {message}
      </Typography>


      {buttonText && (

        <Button
          variant="contained"
          size="small"
          onClick={onClick}
        >
          {buttonText}
        </Button>

      )}

    </Stack>

  );

}


/* ============================================================
   HELPERS
============================================================ */

function extractArray(response) {

  const data =
    response?.data ??
    response;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.content)) {
    return data.content;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  return [];

}


/* ============================================================
   STATUS
============================================================ */

function normalizeStatus(status) {

  return String(
    status || ""
  )
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

}


function formatStatus(status) {

  return String(
    status || "UNKNOWN"
  )
    .toLowerCase()
    .split("_")
    .map(
      word =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");

}


function getStatusColor(status) {

  const normalized =
    normalizeStatus(status);


  if (
    normalized === "APPROVED" ||
    normalized === "RESOLVED" ||
    normalized === "CLOSED" ||
    normalized === "COMPLETED"
  ) {

    return "success";

  }


  if (
    normalized === "REJECTED" ||
    normalized === "CANCELLED"
  ) {

    return "error";

  }


  if (
    normalized === "PENDING" ||
    normalized === "SUBMITTED" ||
    normalized === "VERIFIED" ||
    normalized === "IN_PROGRESS"
  ) {

    return "warning";

  }


  return "primary";

}


/* ============================================================
   APPLICATION STATUS
============================================================ */

function isPendingApplication(
  application
) {

  const status =
    normalizeStatus(
      application.status
    );


  return ![
    "APPROVED",
    "REJECTED",
    "COMPLETED",
    "CLOSED",
    "CANCELLED",
  ].includes(status);

}


function getApplicationProgress(
  status
) {

  const normalized =
    normalizeStatus(status);


  const progressMap = {

    SUBMITTED: 25,

    VERIFIED: 50,

    IN_PROGRESS: 65,

    PROCESSING: 65,

    APPROVED: 90,

    COMPLETED: 100,

    RESOLVED: 100,

    CLOSED: 100,

    REJECTED: 100,

    CANCELLED: 100,

  };


  return (
    progressMap[normalized] ??
    25
  );

}


/* ============================================================
   DATE
============================================================ */

function getRecordDate(record) {

  if (!record) {
    return null;
  }


  const possibleDates = [

    record.createdAt,

    record.created_at,

    record.submittedAt,

    record.submittedDate,

    record.applicationDate,

    record.updatedAt,

    record.updated_at,

    record.date,

  ];


  for (
    const value of possibleDates
  ) {

    if (!value) {
      continue;
    }


    const date =
      new Date(value);


    if (
      !Number.isNaN(
        date.getTime()
      )
    ) {

      return date;

    }

  }


  return null;

}


function getRecordTimestamp(
  record
) {

  const date =
    getRecordDate(record);

  return date
    ? date.getTime()
    : 0;

}


function formatDate(date) {

  if (!date) {
    return "";
  }


  const parsed =
    date instanceof Date
      ? date
      : new Date(date);


  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {

    return "";

  }


  return parsed.toLocaleString(
    undefined,
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

}


/* ============================================================
   LAST SIX MONTHS
============================================================ */

function createLastSixMonths() {

  const result = [];

  const now = new Date();


  for (
    let i = 5;
    i >= 0;
    i--
  ) {

    const date =
      new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );


    result.push({

      year:
        date.getFullYear(),

      month:
        date.getMonth(),

      label:
        date.toLocaleString(
          undefined,
          {
            month: "short",
          }
        ),

    });

  }


  return result;

}


/* ============================================================
   AMOUNT
============================================================ */

function formatAmount(
  amount
) {

  const numeric =
    Number(amount);


  if (
    Number.isNaN(numeric)
  ) {

    return amount;

  }


  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(numeric);

}
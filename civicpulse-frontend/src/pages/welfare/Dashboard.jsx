import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { getDashboard } from "../../api/welfareApi";

import RecentApplications from "../../components/welfare/RecentApplications";
import QuickActions from "../../components/welfare/QuickActions";

function Dashboard() {

  const [dashboard, setDashboard] = useState({
    totalSchemes: 0,
    activeSchemes: 0,
    totalApplications: 0,
    approvedApplications: 0,
    pendingApplications: 0,
    rejectedApplications: 0,
    totalBeneficiaries: 0,
    allocatedBudget: 0,
    utilizedBudget: 0,
    remainingBudget: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await getDashboard();
      setDashboard(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };
    const cards = [
    {
      title: "Total Schemes",
      value: dashboard.totalSchemes,
      color: "#1976d2",
    },
    {
      title: "Active Schemes",
      value: dashboard.activeSchemes,
      color: "#2e7d32",
    },
    {
      title: "Applications",
      value: dashboard.totalApplications,
      color: "#6a1b9a",
    },
    {
      title: "Approved",
      value: dashboard.approvedApplications,
      color: "#388e3c",
    },
    {
      title: "Pending",
      value: dashboard.pendingApplications,
      color: "#ed6c02",
    },
    {
      title: "Rejected",
      value: dashboard.rejectedApplications,
      color: "#d32f2f",
    },
    {
      title: "Beneficiaries",
      value: dashboard.totalBeneficiaries,
      color: "#00838f",
    },
    {
      title: "Allocated Budget",
      value: `₹${Number(dashboard.allocatedBudget).toLocaleString()}`,
      color: "#1565c0",
    },
    {
      title: "Utilized Budget",
      value: `₹${Number(dashboard.utilizedBudget).toLocaleString()}`,
      color: "#8e24aa",
    },
    {
      title: "Remaining Budget",
      value: `₹${Number(dashboard.remainingBudget).toLocaleString()}`,
      color: "#43a047",
    },
  ];

  const applicationData = [
    {
      name: "Pending",
      count: dashboard.pendingApplications,
    },
    {
      name: "Approved",
      count: dashboard.approvedApplications,
    },
    {
      name: "Rejected",
      count: dashboard.rejectedApplications,
    },
  ];

  const budgetData = [
    {
      name: "Utilized",
      value: dashboard.utilizedBudget,
    },
    {
      name: "Remaining",
      value: dashboard.remainingBudget,
    },
  ];

  const COLORS = ["#1976d2", "#66bb6a"];

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box
          sx={{
            height: "70vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }
    return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={2}
          >
            <DashboardIcon
              sx={{
                fontSize: 40,
                color: "primary.main",
              }}
            />

            <Box>
              <Typography
                variant="h4"
                fontWeight="bold"
              >
                Welfare Dashboard
              </Typography>

              <Typography color="text.secondary">
                Monitor welfare schemes, applications and beneficiaries.
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Manage schemes, review applications, monitor budgets and oversee beneficiaries from one place.
              </Typography>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {cards.map((card) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={card.title}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  borderLeft: `6px solid ${card.color}`,
                  height: "100%",
                }}
              >
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    {card.title}
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                      mt: 2,
                      color: card.color,
                    }}
                  >
                    {card.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card sx={{ mt: 4 }}>
          <CardContent>

            <Typography
              variant="h6"
              gutterBottom
            >
              Budget Summary
            </Typography>

            <Grid container spacing={3}>

              <Grid item xs={12} md={4}>
                <Typography color="text.secondary">
                  Allocated Budget
                </Typography>

                <Typography variant="h5" fontWeight="bold">
                  ₹{Number(dashboard.allocatedBudget).toLocaleString()}
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography color="text.secondary">
                  Utilized Budget
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="warning.main"
                >
                  ₹{Number(dashboard.utilizedBudget).toLocaleString()}
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography color="text.secondary">
                  Remaining Budget
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="success.main"
                >
                  ₹{Number(dashboard.remainingBudget).toLocaleString()}
                </Typography>
              </Grid>

            </Grid>

          </CardContent>
        </Card>
                <Grid container spacing={3} sx={{ mt: 2 }}>

          <Grid item xs={12} md={8}>

            <Card>

              <CardContent>

                <Typography
                  variant="h6"
                  gutterBottom
                >
                  Applications Overview
                </Typography>

                <ResponsiveContainer
                  width="100%"
                  height={320}
                >
                  <BarChart data={applicationData}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Bar
                      dataKey="count"
                      fill="#1976d2"
                      radius={[8, 8, 0, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </CardContent>

            </Card>

          </Grid>

          <Grid item xs={12} md={4}>

            <Card>

              <CardContent>

                <Typography
                  variant="h6"
                  gutterBottom
                >
                  Budget Utilization
                </Typography>

                <ResponsiveContainer
                  width="100%"
                  height={320}
                >

                  <PieChart>

                    <Pie
                      data={budgetData}
                      dataKey="value"
                      outerRadius={90}
                      label
                    >

                      {budgetData.map((entry, index) => (

                        <Cell
                          key={index}
                          fill={COLORS[index]}
                        />

                      ))}

                    </Pie>

                    <Tooltip />

                    <Legend />

                  </PieChart>

                </ResponsiveContainer>

              </CardContent>

            </Card>

          </Grid>

        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>

          <Grid item xs={12} lg={8}>

            <RecentApplications />

          </Grid>

          <Grid item xs={12} lg={4}>

            <QuickActions />

          </Grid>

        </Grid>

      </Box>

    </Container>

  );

}

export default Dashboard;
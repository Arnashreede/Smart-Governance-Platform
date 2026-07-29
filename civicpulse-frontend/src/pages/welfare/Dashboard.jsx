import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { getDashboard } from "../../api/welfareApi";

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
    { title: "Total Schemes", value: dashboard.totalSchemes },
    { title: "Active Schemes", value: dashboard.activeSchemes },
    { title: "Applications", value: dashboard.totalApplications },
    { title: "Approved", value: dashboard.approvedApplications },
    { title: "Pending", value: dashboard.pendingApplications },
    { title: "Rejected", value: dashboard.rejectedApplications },
    { title: "Beneficiaries", value: dashboard.totalBeneficiaries },
    { title: "Allocated Budget", value: `₹${dashboard.allocatedBudget}` },
    { title: "Utilized Budget", value: `₹${dashboard.utilizedBudget}` },
    { title: "Remaining Budget", value: `₹${dashboard.remainingBudget}` },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Welfare Dashboard
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" color="text.secondary">
                  {card.title}
                </Typography>

                <Typography variant="h4" sx={{ mt: 2 }}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Dashboard;
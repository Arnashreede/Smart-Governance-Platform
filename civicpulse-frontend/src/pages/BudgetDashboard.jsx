import { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { getDashboard } from "../services/budgetApi";

function BudgetDashboard() {

    const [dashboard, setDashboard] = useState({
        totalBudget: 0,
        allocatedAmount: 0,
        spentAmount: 0,
        remainingAmount: 0
    });

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const data = await getDashboard();
            setDashboard(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom>
                Budget Dashboard
            </Typography>

            <Grid container spacing={3}>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Total Budget</Typography>
                            <Typography variant="h5">
                                ₹ {dashboard.totalBudget}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Allocated</Typography>
                            <Typography variant="h5">
                                ₹ {dashboard.allocatedAmount}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Spent</Typography>
                            <Typography variant="h5">
                                ₹ {dashboard.spentAmount}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Remaining</Typography>
                            <Typography variant="h5">
                                ₹ {dashboard.remainingAmount}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>
        </div>
    );
}

export default BudgetDashboard;
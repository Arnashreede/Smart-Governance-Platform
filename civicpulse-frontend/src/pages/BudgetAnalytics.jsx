import { useEffect, useState } from "react";

import {
    Container,
    Typography,
    Grid,
    Paper,
    Card,
    CardContent,
    LinearProgress,
    Box,
    Divider,
    Stack,
} from "@mui/material";

import {
    TrendingUp,
    AccountBalanceWallet,
    Paid,
    Savings,
} from "@mui/icons-material";

import { getDashboard } from "../services/budgetApi";

function BudgetAnalytics() {

    const [dashboard, setDashboard] = useState({

        totalBudget:0,

        allocatedAmount:0,

        spentAmount:0,

        remainingAmount:0,

    });

    useEffect(()=>{

        loadDashboard();

    },[]);

    const loadDashboard=async()=>{

        try{

            const data=await getDashboard();

            setDashboard(data);

        }catch(err){

            console.error(err);

        }

    };

    const percentage =
        dashboard.totalBudget > 0
            ? (
                dashboard.spentAmount /
                dashboard.totalBudget
              ) * 100
            : 0;

    const format=(value)=>
        Number(value||0).toLocaleString("en-IN");

    return(

<Container
maxWidth="xl"
sx={{py:4}}
>

<Typography
variant="h4"
fontWeight="bold"
>

Budget Analytics

</Typography>

<Typography
color="text.secondary"
mb={4}
>

Financial insights and expenditure overview.

</Typography>

<Grid
container
spacing={3}
>
    {/* ================= ANALYTICS CARDS ================= */}

<Grid item xs={12} sm={6} lg={3}>

<Card
sx={{
borderRadius:4,
boxShadow:3,
height:"100%",
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
fontWeight={600}
>

Total Budget

</Typography>

<Typography
variant="h5"
fontWeight="bold"
mt={1}
>

₹ {format(dashboard.totalBudget)}

</Typography>

</Box>

<AccountBalanceWallet
sx={{
fontSize:50,
color:"#1976d2",
}}
/>

</Stack>

</CardContent>

</Card>

</Grid>

<Grid item xs={12} sm={6} lg={3}>

<Card
sx={{
borderRadius:4,
boxShadow:3,
height:"100%",
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
fontWeight={600}
>

Allocated

</Typography>

<Typography
variant="h5"
fontWeight="bold"
color="primary"
mt={1}
>

₹ {format(dashboard.allocatedAmount)}

</Typography>

</Box>

<Paid
sx={{
fontSize:50,
color:"#2e7d32",
}}
/>

</Stack>

</CardContent>

</Card>

</Grid>

<Grid item xs={12} sm={6} lg={3}>

<Card
sx={{
borderRadius:4,
boxShadow:3,
height:"100%",
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
fontWeight={600}
>

Spent Amount

</Typography>

<Typography
variant="h5"
fontWeight="bold"
color="error.main"
mt={1}
>

₹ {format(dashboard.spentAmount)}

</Typography>

</Box>

<TrendingUp
sx={{
fontSize:50,
color:"#d32f2f",
}}
/>

</Stack>

</CardContent>

</Card>

</Grid>

<Grid item xs={12} sm={6} lg={3}>

<Card
sx={{
borderRadius:4,
boxShadow:3,
height:"100%",
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
fontWeight={600}
>

Remaining Budget

</Typography>

<Typography
variant="h5"
fontWeight="bold"
color="success.main"
mt={1}
>

₹ {format(dashboard.remainingAmount)}

</Typography>

</Box>

<Savings
sx={{
fontSize:50,
color:"#43a047",
}}
/>

</Stack>

</CardContent>

</Card>

</Grid>

{/* ================= UTILIZATION OVERVIEW ================= */}

<Grid item xs={12}>

<Paper
sx={{
p:4,
borderRadius:4,
}}
>

<Typography
variant="h6"
fontWeight="bold"
mb={3}
>

Overall Budget Utilization

</Typography>

<LinearProgress
variant="determinate"
value={percentage}
sx={{
height:14,
borderRadius:7,
mb:2,
}}
/>

<Typography
variant="body1"
>

<b>{percentage.toFixed(1)}%</b> of the allocated government budget has been utilized.

</Typography>

<Divider sx={{ my:3 }}/>

<Grid container spacing={3}>

<Grid item xs={12} md={4}>

<Typography color="text.secondary">

Total Budget

</Typography>

<Typography variant="h6">

₹ {format(dashboard.totalBudget)}

</Typography>

</Grid>

<Grid item xs={12} md={4}>

<Typography color="text.secondary">

Spent Amount

</Typography>

<Typography
variant="h6"
color="error.main"
>

₹ {format(dashboard.spentAmount)}

</Typography>

</Grid>

<Grid item xs={12} md={4}>

<Typography color="text.secondary">

Remaining Budget

</Typography>

<Typography
variant="h6"
color="success.main"
>

₹ {format(dashboard.remainingAmount)}

</Typography>

</Grid>

</Grid>

</Paper>

</Grid>
{/* ================= BUDGET HEALTH ================= */}

<Grid item xs={12} md={6}>

<Paper
sx={{
p:4,
borderRadius:4,
height:"100%",
}}
>

<Typography
variant="h6"
fontWeight="bold"
mb={3}
>

Budget Health Analysis

</Typography>

<Divider sx={{ mb:3 }}/>

<Stack spacing={3}>

<Box>

<Typography color="text.secondary">

Budget Status

</Typography>

<Typography
variant="h6"
fontWeight="bold"
color={
percentage>=90
? "error.main"
: percentage>=70
? "warning.main"
: "success.main"
}
>

{
percentage>=90
? "Budget Exhausted"
: percentage>=70
? "Budget Running Low"
: "Budget Healthy"
}

</Typography>

</Box>

<Box>

<Typography color="text.secondary">

Utilization Rate

</Typography>

<Typography
variant="h5"
fontWeight="bold"
>

{percentage.toFixed(1)}%

</Typography>

</Box>

<Box>

<Typography color="text.secondary">

Available Balance

</Typography>

<Typography
variant="h5"
fontWeight="bold"
color="success.main"
>

₹ {format(dashboard.remainingAmount)}

</Typography>

</Box>

<Box>

<Typography color="text.secondary">

Spent Amount

</Typography>

<Typography
variant="h5"
fontWeight="bold"
color="error.main"
>

₹ {format(dashboard.spentAmount)}

</Typography>

</Box>

</Stack>

</Paper>

</Grid>

{/* ================= FINANCIAL INSIGHTS ================= */}

<Grid item xs={12} md={6}>

<Paper
sx={{
p:4,
borderRadius:4,
height:"100%",
}}
>

<Typography
variant="h6"
fontWeight="bold"
mb={3}
>

Financial Insights

</Typography>

<Divider sx={{ mb:3 }}/>

<Stack spacing={3}>

<Box>

<Typography fontWeight="bold">

Government Budget Overview

</Typography>

<Typography
variant="body2"
color="text.secondary"
>

Monitor departmental allocations and expenditure to ensure efficient utilization of public funds.

</Typography>

</Box>

<Box>

<Typography fontWeight="bold">

Current Observation

</Typography>

<Typography
variant="body2"
color="text.secondary"
>

{
percentage>=90
? "The current budget is almost exhausted. Additional allocation should be considered."

: percentage>=70

? "Budget utilization is high. Monitor expenditures closely."

: "Budget utilization is within acceptable limits."
}

</Typography>

</Box>

<Box>

<Typography fontWeight="bold">

Recommendation

</Typography>

<Typography
variant="body2"
color="text.secondary"
>

Continue monitoring fund distributions regularly to maintain financial transparency and accountability.

</Typography>

</Box>

</Stack>

</Paper>

</Grid>

{/* ================= ALERT PANEL ================= */}

<Grid item xs={12}>

<Paper
sx={{
p:4,
borderRadius:4,
background:
percentage>=90
? "#ffebee"
: percentage>=70
? "#fff8e1"
: "#e8f5e9",
}}
>

<Typography
variant="h6"
fontWeight="bold"
gutterBottom
>

Budget Alert

</Typography>

<Typography>

{
percentage>=90

? "Critical: The remaining budget is very low. Immediate financial review is recommended."

: percentage>=70

? "Warning: Budget utilization has crossed 70%. Please monitor future expenditures."

: "Good: Budget utilization is healthy and within the recommended range."
}

</Typography>

</Paper>

</Grid>
{/* ================= GOVERNMENT RECOMMENDATIONS ================= */}

<Grid item xs={12} md={6}>

<Paper
sx={{
p:4,
borderRadius:4,
height:"100%",
}}
>

<Typography
variant="h6"
fontWeight="bold"
mb={3}
>

Government Recommendations

</Typography>

<Divider sx={{ mb:3 }}/>

<Stack spacing={2}>

<Typography>

• Review departmental expenditure every month.

</Typography>

<Typography>

• Allocate additional funds only after approval from the competent authority.

</Typography>

<Typography>

• Maintain complete audit records for every fund distribution.

</Typography>

<Typography>

• Prioritize essential welfare schemes during low-budget periods.

</Typography>

<Typography>

• Ensure transparency in all financial transactions.

</Typography>

</Stack>

</Paper>

</Grid>

{/* ================= ANALYTICS SUMMARY ================= */}

<Grid item xs={12} md={6}>

<Paper
sx={{
p:4,
borderRadius:4,
height:"100%",
}}
>

<Typography
variant="h6"
fontWeight="bold"
mb={3}
>

Analytics Summary

</Typography>

<Divider sx={{ mb:3 }}/>

<Grid container spacing={2}>

<Grid item xs={6}>

<Typography color="text.secondary">

Allocated Budget

</Typography>

<Typography
variant="h6"
fontWeight="bold"
color="primary"
>

₹ {format(dashboard.allocatedAmount)}

</Typography>

</Grid>

<Grid item xs={6}>

<Typography color="text.secondary">

Remaining Budget

</Typography>

<Typography
variant="h6"
fontWeight="bold"
color="success.main"
>

₹ {format(dashboard.remainingAmount)}

</Typography>

</Grid>

<Grid item xs={6}>

<Typography color="text.secondary">

Spent Amount

</Typography>

<Typography
variant="h6"
fontWeight="bold"
color="error.main"
>

₹ {format(dashboard.spentAmount)}

</Typography>

</Grid>

<Grid item xs={6}>

<Typography color="text.secondary">

Utilization

</Typography>

<Typography
variant="h6"
fontWeight="bold"
>

{percentage.toFixed(1)}%

</Typography>

</Grid>

</Grid>

<Divider sx={{ my:3 }}/>

<Typography
variant="body2"
color="text.secondary"
>

This dashboard provides a consolidated financial overview of the current budget and helps monitor utilization, expenditure, and remaining funds for effective decision-making.

</Typography>

</Paper>

</Grid>

</Grid>

</Container>

    );

}

export default BudgetAnalytics;                
import { useEffect, useState } from "react";

import {
    Container,
    Grid,
    Paper,
    Typography,
    TextField,
    MenuItem,
    Button,
    Card,
    CardContent,
    Box,
    Stack,
    Divider,
} from "@mui/material";

import {
    PictureAsPdf,
    TableChart,
    Print,
    Assessment,
} from "@mui/icons-material";

import { getDashboard } from "../services/budgetApi";

function FinancialReports() {

    const [dashboard, setDashboard] = useState({

        totalBudget:0,

        allocatedAmount:0,

        spentAmount:0,

        remainingAmount:0,

    });

    const [filters, setFilters] = useState({

        financialYear:"2026-2027",

        department:"",

        reportType:"Budget Summary",

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

    const handleChange=(e)=>{

        setFilters({

            ...filters,

            [e.target.name]:e.target.value,

        });

    };

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

Financial Reports

</Typography>

<Typography
color="text.secondary"
mb={4}
>

Generate and export budget reports for financial monitoring.

</Typography>

<Grid
container
spacing={3}
>
    {/* ================= REPORT FILTERS ================= */}

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

Report Filters

</Typography>

<Grid container spacing={3}>

<Grid item xs={12} md={4}>

<TextField
select
fullWidth
label="Financial Year"
name="financialYear"
value={filters.financialYear}
onChange={handleChange}
>

<MenuItem value="2026-2027">
2026 - 2027
</MenuItem>

<MenuItem value="2027-2028">
2027 - 2028
</MenuItem>

<MenuItem value="2028-2029">
2028 - 2029
</MenuItem>

<MenuItem value="2029-2030">
2029 - 2030
</MenuItem>

</TextField>

</Grid>

<Grid item xs={12} md={4}>

<TextField
select
fullWidth
label="Department"
name="department"
value={filters.department}
onChange={handleChange}
>

<MenuItem value="">
All Departments
</MenuItem>

<MenuItem value="Agriculture">
Agriculture
</MenuItem>

<MenuItem value="Education">
Education
</MenuItem>

<MenuItem value="Health">
Health
</MenuItem>

<MenuItem value="Housing">
Housing
</MenuItem>

<MenuItem value="Social Welfare">
Social Welfare
</MenuItem>

<MenuItem value="Women & Child Development">
Women & Child Development
</MenuItem>

<MenuItem value="Rural Development">
Rural Development
</MenuItem>

</TextField>

</Grid>

<Grid item xs={12} md={4}>

<TextField
select
fullWidth
label="Report Type"
name="reportType"
value={filters.reportType}
onChange={handleChange}
>

<MenuItem value="Budget Summary">
Budget Summary
</MenuItem>

<MenuItem value="Department Report">
Department Report
</MenuItem>

<MenuItem value="Fund Distribution">
Fund Distribution
</MenuItem>

<MenuItem value="Transaction Report">
Transaction Report
</MenuItem>

<MenuItem value="Expenditure Analysis">
Expenditure Analysis
</MenuItem>

</TextField>

</Grid>

</Grid>

<Divider sx={{ my:4 }}/>

<Stack
direction={{
xs:"column",
md:"row"
}}
spacing={2}
justifyContent="flex-end"
>

<Button
variant="contained"
startIcon={<PictureAsPdf />}
color="error"
>

Export PDF

</Button>

<Button
variant="contained"
startIcon={<TableChart />}
color="success"
>

Export Excel

</Button>

<Button
variant="outlined"
startIcon={<Print />}
onClick={() => window.print()}
>

Print Report

</Button>

</Stack>

</Paper>

</Grid>

{/* ================= SUMMARY CARDS ================= */}

<Grid item xs={12} md={3}>

<Card
sx={{
borderRadius:4,
boxShadow:3,
}}
>

<CardContent>

<Typography
color="text.secondary"
>

Total Budget

</Typography>

<Typography
variant="h5"
fontWeight="bold"
>

₹ {format(dashboard.totalBudget)}

</Typography>

</CardContent>

</Card>

</Grid>

<Grid item xs={12} md={3}>

<Card
sx={{
borderRadius:4,
boxShadow:3,
}}
>

<CardContent>

<Typography
color="text.secondary"
>

Allocated

</Typography>

<Typography
variant="h5"
fontWeight="bold"
color="primary"
>

₹ {format(dashboard.allocatedAmount)}

</Typography>

</CardContent>

</Card>

</Grid>

<Grid item xs={12} md={3}>

<Card
sx={{
borderRadius:4,
boxShadow:3,
}}
>

<CardContent>

<Typography
color="text.secondary"
>

Spent

</Typography>

<Typography
variant="h5"
fontWeight="bold"
color="error.main"
>

₹ {format(dashboard.spentAmount)}

</Typography>

</CardContent>

</Card>

</Grid>

<Grid item xs={12} md={3}>

<Card
sx={{
borderRadius:4,
boxShadow:3,
}}
>

<CardContent>

<Typography
color="text.secondary"
>

Remaining

</Typography>

<Typography
variant="h5"
fontWeight="bold"
color="success.main"
>

₹ {format(dashboard.remainingAmount)}

</Typography>

</CardContent>

</Card>

</Grid>
{/* ================= REPORT PREVIEW ================= */}

<Grid item xs={12} md={8}>

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

Report Preview

</Typography>

<Divider sx={{ mb:3 }}/>

<Grid container spacing={3}>

<Grid item xs={12} md={6}>

<Typography color="text.secondary">

Financial Year

</Typography>

<Typography fontWeight="bold">

{filters.financialYear}

</Typography>

</Grid>

<Grid item xs={12} md={6}>

<Typography color="text.secondary">

Department

</Typography>

<Typography fontWeight="bold">

{filters.department || "All Departments"}

</Typography>

</Grid>

<Grid item xs={12} md={6}>

<Typography color="text.secondary">

Report Type

</Typography>

<Typography fontWeight="bold">

{filters.reportType}

</Typography>

</Grid>

<Grid item xs={12} md={6}>

<Typography color="text.secondary">

Generated On

</Typography>

<Typography fontWeight="bold">

{new Date().toLocaleString()}

</Typography>

</Grid>

</Grid>

<Divider sx={{ my:3 }}/>

<Grid container spacing={3}>

<Grid item xs={12} md={3}>

<Typography color="text.secondary">

Total Budget

</Typography>

<Typography
variant="h6"
fontWeight="bold"
>

₹ {format(dashboard.totalBudget)}

</Typography>

</Grid>

<Grid item xs={12} md={3}>

<Typography color="text.secondary">

Allocated

</Typography>

<Typography
variant="h6"
fontWeight="bold"
color="primary"
>

₹ {format(dashboard.allocatedAmount)}

</Typography>

</Grid>

<Grid item xs={12} md={3}>

<Typography color="text.secondary">

Spent

</Typography>

<Typography
variant="h6"
fontWeight="bold"
color="error.main"
>

₹ {format(dashboard.spentAmount)}

</Typography>

</Grid>

<Grid item xs={12} md={3}>

<Typography color="text.secondary">

Remaining

</Typography>

<Typography
variant="h6"
fontWeight="bold"
color="success.main"
>

₹ {format(dashboard.remainingAmount)}

</Typography>

</Grid>

</Grid>

</Paper>

</Grid>

{/* ================= REPORT NOTES ================= */}

<Grid item xs={12} md={4}>

<Paper
sx={{
p:4,
borderRadius:4,
height:"100%",
background:"#f8fafc",
}}
>

<Typography
variant="h6"
fontWeight="bold"
mb={3}
>

Report Notes

</Typography>

<Divider sx={{ mb:3 }}/>

<Typography paragraph>

• Report generated from the current financial database.

</Typography>

<Typography paragraph>

• All monetary values are displayed in Indian Rupees (₹).

</Typography>

<Typography paragraph>

• Budget utilization is calculated from allocated and spent amounts.

</Typography>

<Typography paragraph>

• Exported reports should be verified before official submission.

</Typography>

<Typography paragraph>

• This report is intended for administrative use only.

</Typography>

</Paper>

</Grid>

{/* ================= EXECUTIVE SUMMARY ================= */}

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

Executive Summary

</Typography>

<Divider sx={{ mb:3 }}/>

<Typography>

This report provides an overview of the selected budget data for the chosen financial year and department. It summarizes the allocated funds, expenditure, remaining balance, and overall financial position to assist officers in monitoring government budget utilization and planning future allocations.

</Typography>

</Paper>

</Grid>
{/* ================= OFFICIAL DECLARATION ================= */}

<Grid item xs={12}>

<Paper
sx={{
p:4,
borderRadius:4,
background:"#eef5ff",
}}
>

<Typography
variant="h6"
fontWeight="bold"
mb={2}
>

Official Declaration

</Typography>

<Divider sx={{ mb:3 }}/>

<Typography
paragraph
>

This report has been generated from the Smart Goverance Platform Budget Management System
using the selected report filters. The information presented is based on the
latest financial records available in the system.

</Typography>

<Typography
paragraph
>

All figures are indicative of the selected financial year and department.
Before publishing or submitting this report, officers should verify the
financial records with the concerned department.

</Typography>

<Typography
paragraph
>

This is a computer-generated report and does not require a physical signature.
Any modification or unauthorized distribution of this report is prohibited.

</Typography>

<Divider sx={{ my:3 }}/>

<Stack
direction={{
xs:"column",
md:"row"
}}
justifyContent="space-between"
spacing={2}
>

<Box>

<Typography
variant="subtitle2"
color="text.secondary"
>

Generated By

</Typography>

<Typography fontWeight="bold">

Smart Goverance Platform 

</Typography>

</Box>

<Box>

<Typography
variant="subtitle2"
color="text.secondary"
>

Generated On

</Typography>

<Typography fontWeight="bold">

{new Date().toLocaleString()}

</Typography>

</Box>

<Box>

<Typography
variant="subtitle2"
color="text.secondary"
>

Report Type

</Typography>

<Typography fontWeight="bold">

{filters.reportType}

</Typography>

</Box>

</Stack>

</Paper>

</Grid>

</Grid>

</Container>

    );

}

export default FinancialReports;
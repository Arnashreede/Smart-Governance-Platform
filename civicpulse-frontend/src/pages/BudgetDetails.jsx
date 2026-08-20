import { useEffect, useState } from "react";

import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Stack,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Paid,
    AccountBalanceWallet,
    ReceiptLong,
    Assessment,
} from "@mui/icons-material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getBudgetById,
    getDistributions,
} from "../services/budgetApi";

function BudgetDetails() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [budget, setBudget] = useState(null);
const [distributions, setDistributions] = useState([]);
    useEffect(() => {

        loadBudget();

    }, []);

    const loadBudget = async () => {

    try {

        const data = await getBudgetById(id);
        setBudget(data);

        const distributionData =
            await getDistributions(id);

        setDistributions(
            Array.isArray(distributionData)
                ? distributionData
                : []
        );

    } catch (err) {

        console.error(err);

    }

};

    if (!budget) {

        return (

            <Typography
                align="center"
                mt={5}
            >

                Loading Budget...

            </Typography>

        );

    }

    const percentage =
        budget.totalBudget > 0
            ? (
                (budget.spentAmount /
                    budget.totalBudget) *
                100
            ).toFixed(1)
            : 0;

    const formatCurrency = (amount) =>

        Number(amount || 0).toLocaleString("en-IN");

    return (

<Container
maxWidth="xl"
sx={{ py:4 }}
>

<Box
display="flex"
justifyContent="space-between"
alignItems="center"
mb={4}
>

<Box>

<Typography
variant="h4"
fontWeight="bold"
>

Budget Details

</Typography>

<Typography
color="text.secondary"
>

Complete financial overview of the selected budget.

</Typography>

</Box>

<Stack
direction="row"
spacing={2}
>

<Button
variant="outlined"
startIcon={<ArrowBack />}
onClick={() => navigate("/budgets")}
>

Back

</Button>

<Button
variant="contained"
startIcon={<Edit />}
onClick={() =>
navigate(`/budgets/edit/${budget.id}`)
}
>

Edit

</Button>

</Stack>

</Box>

<Grid
container
spacing={3}
>
    {/* ================= SUMMARY CARDS ================= */}

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

₹ {formatCurrency(budget.totalBudget)}

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

₹ {formatCurrency(budget.allocatedAmount)}

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

₹ {formatCurrency(budget.spentAmount)}

</Typography>

</Box>

<Paid
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

₹ {formatCurrency(budget.remainingAmount)}

</Typography>

</Box>

<AccountBalanceWallet
sx={{
fontSize:50,
color:"#43a047",
}}
/>

</Stack>

</CardContent>

</Card>

</Grid>

{/* ================= UTILIZATION ================= */}

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

Budget Utilization

</Typography>

<LinearProgress
variant="determinate"
value={Number(percentage)}
sx={{
height:12,
borderRadius:5,
mb:2,
}}
/>

<Typography
variant="body1"
>

<b>{percentage}%</b> of the total budget has been utilized.

</Typography>

</Paper>

</Grid>
{/* ================= BUDGET INFORMATION ================= */}

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

Budget Information

</Typography>

<Divider sx={{ mb:3 }}/>

<Stack spacing={2}>

<Box>

<Typography color="text.secondary">

Department

</Typography>

<Typography fontWeight="bold">

{budget.department}

</Typography>

</Box>

<Box>

<Typography color="text.secondary">

Financial Year

</Typography>

<Typography fontWeight="bold">

{budget.financialYear}

</Typography>

</Box>

<Box>

<Typography color="text.secondary">

Budget ID

</Typography>

<Typography fontWeight="bold">

#{budget.id}

</Typography>

</Box>

<Box>

<Typography color="text.secondary">

Current Status

</Typography>

<Chip
label={
Number(percentage)>=90
? "Budget Exhausted"
: Number(percentage)>=70
? "Low Budget"
: "Healthy"
}
color={
Number(percentage)>=90
? "error"
: Number(percentage)>=70
? "warning"
: "success"
}
sx={{ mt:1 }}
/>

</Box>

</Stack>

</Paper>

</Grid>

{/* ================= FINANCIAL SUMMARY ================= */}

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

Financial Summary

</Typography>

<Divider sx={{ mb:3 }}/>

<Stack spacing={2}>

<Box>

<Typography color="text.secondary">

Allocated Amount

</Typography>

<Typography
variant="h6"
color="primary"
>

₹ {formatCurrency(budget.allocatedAmount)}

</Typography>

</Box>

<Box>

<Typography color="text.secondary">

Spent Amount

</Typography>

<Typography
variant="h6"
color="error.main"
>

₹ {formatCurrency(budget.spentAmount)}

</Typography>

</Box>

<Box>

<Typography color="text.secondary">

Remaining Amount

</Typography>

<Typography
variant="h6"
color="success.main"
>

₹ {formatCurrency(budget.remainingAmount)}

</Typography>

</Box>

</Stack>

</Paper>

</Grid>
{/* ================= FUND DISTRIBUTION HISTORY ================= */}

<Grid item xs={12}>

    <Paper
        sx={{
            p: 4,
            borderRadius: 4,
        }}
    >

        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
        >

            <Box>

                <Typography
                    variant="h6"
                    fontWeight="bold"
                >
                    Fund Distribution History
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={0.5}
                >
                    Actual fund distributions recorded
                    against this budget.
                </Typography>

            </Box>

            <Chip
                label={`${distributions.length} ${
                    distributions.length === 1
                        ? "Distribution"
                        : "Distributions"
                }`}
                color="primary"
                variant="outlined"
            />

        </Box>

        <Divider sx={{ mb: 3 }} />

        {distributions.length === 0 ? (

            <Box
                textAlign="center"
                py={4}
            >

                <Typography
                    color="text.secondary"
                >
                    No fund distributions have been
                    recorded for this budget.
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={1}
                >
                    Distributions will appear here once
                    funds are assigned to beneficiaries.
                </Typography>

            </Box>

        ) : (

            <TableContainer>

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                <strong>ID</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Scheme</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Citizen ID</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Beneficiary</strong>
                            </TableCell>

                            <TableCell align="right">
                                <strong>Amount</strong>
                            </TableCell>
                            <TableCell>
    <strong>Payment Mode</strong>
</TableCell>

<TableCell>
    <strong>Remarks</strong>
</TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {distributions.map(
                            (distribution) => (

                               <TableRow
    hover
    key={distribution.id}
>

    <TableCell>
        #{distribution.id}
    </TableCell>

    <TableCell>
        {distribution.schemeName || "—"}
    </TableCell>

    <TableCell>
        {distribution.citizenId || "—"}
    </TableCell>

    <TableCell>
        {distribution.beneficiaryName || "—"}
    </TableCell>

    <TableCell align="right">
        <Typography
            fontWeight="bold"
            color="success.main"
        >
            ₹{" "}
            {formatCurrency(
                distribution.amount
            )}
        </Typography>
    </TableCell>

    <TableCell>
        {distribution.paymentMode || "—"}
    </TableCell>

    <TableCell>
        {distribution.remarks || "—"}
    </TableCell>

</TableRow>

                            )
                        )}

                    </TableBody>

                </Table>

            </TableContainer>

        )}

        {distributions.length > 0 && (

            <Box
                display="flex"
                justifyContent="flex-end"
                mt={3}
            >

                <Box
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "action.hover",
                        minWidth: 220,
                    }}
                >

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Total Distributed
                    </Typography>

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        ₹{" "}
                        {formatCurrency(
                            distributions.reduce(
                                (total, distribution) =>
                                    total +
                                    Number(
                                        distribution.amount || 0
                                    ),
                                0
                            )
                        )}
                    </Typography>

                </Box>

            </Box>

        )}

    </Paper>

</Grid>
{/* ================= QUICK ACTIONS ================= */}

<Stack
    direction="row"
    spacing={2}
    flexWrap="wrap"
    useFlexGap
>

    {/* Allocate Funds */}
    <Button
        variant="contained"
        startIcon={<Paid />}
        onClick={() =>
            navigate(`/fund-distribution/${budget.id}`)
        }
    >
        Allocate Funds
    </Button>


    {/* Edit Budget */}
    <Button
        variant="outlined"
        startIcon={<Edit />}
        onClick={() =>
            navigate(`/budgets/edit/${budget.id}`)
        }
    >
        Edit Budget
    </Button>


    {/* Transaction History */}
    <Button
        variant="outlined"
        startIcon={<ReceiptLong />}
        onClick={() =>
            navigate(`/budgets/${budget.id}/transactions`)
        }
    >
        Transaction History
    </Button>


    {/* Generate Report */}
    <Button
        variant="outlined"
        startIcon={<Assessment />}
        onClick={() =>
            navigate(`/budgets/${budget.id}/report`)
        }
    >
        Generate Report
    </Button>

</Stack>
{/* ================= BUDGET INSIGHTS ================= */}

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

Budget Insights

</Typography>

<Divider sx={{ mb:3 }}/>

<Stack spacing={2}>

<Box>

<Typography color="text.secondary">

Utilization Rate

</Typography>

<Typography
variant="h5"
color="primary"
fontWeight="bold"
>

{percentage}%

</Typography>

</Box>

<Box>

<Typography color="text.secondary">

Available Balance

</Typography>

<Typography
variant="h5"
color="success.main"
fontWeight="bold"
>

₹ {formatCurrency(budget.remainingAmount)}

</Typography>

</Box>

<Box>

<Typography color="text.secondary">

Financial Year

</Typography>

<Typography
fontWeight="bold"
>

{budget.financialYear}

</Typography>

</Box>

<Box>

<Typography color="text.secondary">

Recommendation

</Typography>

<Typography>

{
Number(percentage) >= 90
? "Budget exhausted. Additional allocation is recommended."
: Number(percentage) >= 70
? "Budget is running low. Monitor expenditures carefully."
: "Budget is healthy and operating within safe limits."
}

</Typography>

</Box>

</Stack>

</Paper>

</Grid>

{/* ================= GOVERNMENT NOTICE ================= */}

<Grid item xs={12} md={6}>

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

Government Notice

</Typography>

<Divider sx={{ mb:3 }}/>

<Typography
paragraph
>

• Budget allocations should follow approved financial guidelines.

</Typography>

<Typography
paragraph
>

• All expenditures must be supported by valid fund distribution records.

</Typography>

<Typography
paragraph
>

• Transactions are subject to administrative audit.

</Typography>

<Typography
paragraph
>

• Any additional allocation requires authorization from the concerned department.

</Typography>

</Paper>

</Grid>

</Grid>

</Container>

    );

}

export default BudgetDetails;
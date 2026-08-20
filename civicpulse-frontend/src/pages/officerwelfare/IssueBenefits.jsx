import { useEffect, useState } from "react";

import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  InputAdornment,
} from "@mui/material";

import {
  Search,
  Payments,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

function IssueBenefits() {

  const navigate = useNavigate();

  const [beneficiaries, setBeneficiaries] = useState([]);

  const [search, setSearch] = useState("");

  useEffect(() => {

    loadBeneficiaries();

  }, []);

  const loadBeneficiaries = async () => {

    // TODO:
    // Replace with backend API
    // getApprovedBeneficiaries()

    setBeneficiaries([
      {
        id: 1,
        applicationId: "APP-1001",
        fullName: "Rahul Das",
        schemeName: "PM Kisan",
        amount: 6000,
        status: "APPROVED",
      },
      {
        id: 2,
        applicationId: "APP-1002",
        fullName: "Priya Roy",
        schemeName: "Widow Pension",
        amount: 1500,
        status: "APPROVED",
      },
    ]);

  };

  const filtered = beneficiaries.filter((b) =>
    b.fullName.toLowerCase().includes(search.toLowerCase()) ||
    b.schemeName.toLowerCase().includes(search.toLowerCase()) ||
    b.applicationId.toLowerCase().includes(search.toLowerCase())
  );

  return (

<Container maxWidth="xl" sx={{ py: 4 }}>

<Typography
variant="h4"
fontWeight="bold"
mb={1}
>

Issue Benefits

</Typography>

<Typography
color="text.secondary"
mb={4}
>

Issue benefits to approved welfare beneficiaries.

</Typography>

<Paper
sx={{
p:3,
borderRadius:4,
mb:3,
}}
>

<Grid container spacing={3} alignItems="center">

<Grid item xs={12} md={8}>

<TextField
fullWidth
placeholder="Search by Application ID, Name or Scheme..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
InputProps={{
startAdornment:(
<InputAdornment position="start">
<Search/>
</InputAdornment>
),
}}
/>

</Grid>

<Grid item xs={12} md={4}>

<Button
fullWidth
variant="contained"
startIcon={<Payments />}
>

Refresh

</Button>

</Grid>

</Grid>

</Paper>

<TableContainer component={Paper}>
<Table>

<TableHead>

<TableRow>

<TableCell>Application</TableCell>

<TableCell>Beneficiary</TableCell>

<TableCell>Scheme</TableCell>

<TableCell>Benefit Amount</TableCell>

<TableCell>Status</TableCell>

<TableCell align="center">

Action

</TableCell>

</TableRow>

</TableHead>

<TableBody>
    {filtered.map((beneficiary) => (

<TableRow
hover
key={beneficiary.id}
>

<TableCell>

<Typography fontWeight="bold">

{beneficiary.applicationId}

</Typography>

</TableCell>

<TableCell>

<Typography fontWeight="bold">

{beneficiary.fullName}

</Typography>

</TableCell>

<TableCell>

{beneficiary.schemeName}

</TableCell>

<TableCell>

<Typography
fontWeight="bold"
color="primary"
>

₹ {Number(beneficiary.amount).toLocaleString("en-IN")}

</Typography>

</TableCell>

<TableCell>

<Chip
label={beneficiary.status}
color="success"
/>

</TableCell>

<TableCell align="center">

<Button
variant="contained"
color="success"
startIcon={<Payments />}
onClick={() =>
navigate(
`/officer/issue-benefits/${beneficiary.id}`
)
}
>

Issue Benefit

</Button>

</TableCell>

</TableRow>

))}

{filtered.length === 0 && (

<TableRow>

<TableCell
colSpan={6}
align="center"
>

<Typography
color="text.secondary"
py={3}
>

No approved beneficiaries found.

</Typography>

</TableCell>

</TableRow>

)}
</TableBody>

</Table>

</TableContainer>

{/* ================= SUMMARY ================= */}

<Grid
container
spacing={3}
sx={{ mt: 3 }}
>

<Grid item xs={12} md={4}>

<Paper
sx={{
p:3,
borderRadius:4,
textAlign:"center",
}}
>

<Typography color="text.secondary">

Approved Beneficiaries

</Typography>

<Typography
variant="h4"
fontWeight="bold"
color="primary"
>

{filtered.length}

</Typography>

</Paper>

</Grid>

<Grid item xs={12} md={4}>

<Paper
sx={{
p:3,
borderRadius:4,
textAlign:"center",
}}
>

<Typography color="text.secondary">

Total Benefit Amount

</Typography>

<Typography
variant="h5"
fontWeight="bold"
color="success.main"
>

₹ {filtered
.reduce((sum, item) => sum + Number(item.amount || 0), 0)
.toLocaleString("en-IN")}

</Typography>

</Paper>

</Grid>

<Grid item xs={12} md={4}>

<Paper
sx={{
p:3,
borderRadius:4,
textAlign:"center",
}}
>

<Typography color="text.secondary">

Ready For Payment

</Typography>

<Typography
variant="h4"
fontWeight="bold"
color="warning.main"
>

{
filtered.filter(
item => item.status === "APPROVED"
).length
}

</Typography>

</Paper>

</Grid>

</Grid>
{/* ================= OFFICER GUIDELINES ================= */}

<Grid item xs={12} sx={{ mt: 4 }}>

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

Benefit Issuance Guidelines

</Typography>

<Typography paragraph>

• Verify that the beneficiary's application has been approved before issuing benefits.

</Typography>

<Typography paragraph>

• Confirm the beneficiary's Aadhaar number and bank details before payment.

</Typography>

<Typography paragraph>

• Ensure sufficient department budget is available before proceeding.

</Typography>

<Typography paragraph>

• Each approved application can receive the benefit only once.

</Typography>

<Typography paragraph>

• Every successful payment will automatically generate a transaction record and receipt.

</Typography>

</Paper>

</Grid>

{/* ================= PAYMENT PROCESS ================= */}

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

Benefit Issuance Process

</Typography>

<Box sx={{ mb:2 }}>

<Typography>

1. Select an approved beneficiary.

</Typography>

</Box>

<Box sx={{ mb:2 }}>

<Typography>

2. Verify beneficiary information.

</Typography>

</Box>

<Box sx={{ mb:2 }}>

<Typography>

3. Confirm payment amount.

</Typography>

</Box>

<Box sx={{ mb:2 }}>

<Typography>

4. Issue benefit.

</Typography>

</Box>

<Box>

<Typography>

5. Receipt and transaction are generated automatically.

</Typography>

</Box>

</Paper>

</Grid>

{/* ================= IMPORTANT NOTE ================= */}

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

Important Notes

</Typography>

<Typography paragraph>

The system will automatically deduct the benefit amount from the appropriate department budget.

</Typography>

<Typography paragraph>

If sufficient budget is unavailable, the payment request will be rejected automatically.

</Typography>

<Typography paragraph>

Once a benefit is issued, the application status will be updated to <b>Benefit Issued</b>.

</Typography>

<Typography paragraph>

A payment receipt will be available for download after successful processing.

</Typography>

</Paper>

</Grid>
</Container>

    );

}

export default IssueBenefits;
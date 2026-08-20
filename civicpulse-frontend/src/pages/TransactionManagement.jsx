import { useEffect, useState } from "react";

import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Chip,
  Button,
  InputAdornment,
} from "@mui/material";

import {
  Search,
  ReceiptLong,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

function TransactionManagement() {

  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);

  const [search, setSearch] = useState("");

  useEffect(() => {

    loadTransactions();

  }, []);

  const loadTransactions = async () => {

    // TODO:
    // Replace with backend API

    setTransactions([

      {
        id:1,
        transactionId:"TXN-20260001",
        beneficiaryName:"Rahul Das",
        schemeName:"PM Kisan",
        amount:6000,
        status:"SUCCESS",
        officer:"Anirban Roy",
      },

      {
        id:2,
        transactionId:"TXN-20260002",
        beneficiaryName:"Priya Roy",
        schemeName:"Widow Pension",
        amount:1500,
        status:"SUCCESS",
        officer:"Sourav Das",
      },

    ]);

  };

  const filtered = transactions.filter((item)=>

      item.transactionId.toLowerCase().includes(search.toLowerCase()) ||

      item.beneficiaryName.toLowerCase().includes(search.toLowerCase()) ||

      item.schemeName.toLowerCase().includes(search.toLowerCase())

  );

  return (

<Container
maxWidth="xl"
sx={{ py:4 }}
>

<Typography
variant="h4"
fontWeight="bold"
mb={1}
>

Transaction Management

</Typography>

<Typography
color="text.secondary"
mb={4}
>

Monitor all welfare benefit transactions.

</Typography>

<Paper
sx={{
p:3,
borderRadius:4,
mb:3,
}}
>

<Grid container spacing={3}>

<Grid item xs={12} md={8}>

<TextField
fullWidth
placeholder="Search Transaction..."
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
startIcon={<ReceiptLong />}
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

<TableCell>Transaction ID</TableCell>

<TableCell>Beneficiary</TableCell>

<TableCell>Scheme</TableCell>

<TableCell>Amount</TableCell>

<TableCell>Officer</TableCell>

<TableCell>Status</TableCell>

<TableCell align="center">

Action

</TableCell>

</TableRow>

</TableHead>

<TableBody>
    {filtered.map((transaction) => (

<TableRow
hover
key={transaction.id}
>

<TableCell>

<Typography fontWeight="bold">

{transaction.transactionId}

</Typography>

</TableCell>

<TableCell>

<Typography fontWeight="bold">

{transaction.beneficiaryName}

</Typography>

</TableCell>

<TableCell>

{transaction.schemeName}

</TableCell>

<TableCell>

<Typography
fontWeight="bold"
color="primary"
>

₹ {Number(transaction.amount).toLocaleString("en-IN")}

</Typography>

</TableCell>

<TableCell>

{transaction.officer}

</TableCell>

<TableCell>

<Chip
label={transaction.status}
color={
transaction.status === "SUCCESS"
? "success"
: transaction.status === "FAILED"
? "error"
: "warning"
}
/>

</TableCell>

<TableCell align="center">

<Button
variant="outlined"
size="small"
onClick={() =>
navigate(
`/transactions/${transaction.id}`
)
}
>

View Details

</Button>

</TableCell>

</TableRow>

))}

{filtered.length === 0 && (

<TableRow>

<TableCell
colSpan={7}
align="center"
>

<Typography
color="text.secondary"
py={3}
>

No transactions found.

</Typography>

</TableCell>

</TableRow>

)}
</TableBody>

</Table>

</TableContainer>

{/* ================= TRANSACTION SUMMARY ================= */}

<Grid
container
spacing={3}
sx={{ mt:3 }}
>

<Grid item xs={12} md={3}>

<Paper
sx={{
p:3,
borderRadius:4,
textAlign:"center",
}}
>

<Typography color="text.secondary">

Total Transactions

</Typography>

<Typography
variant="h4"
fontWeight="bold"
color="primary"
>

{transactions.length}

</Typography>

</Paper>

</Grid>

<Grid item xs={12} md={3}>

<Paper
sx={{
p:3,
borderRadius:4,
textAlign:"center",
}}
>

<Typography color="text.secondary">

Successful

</Typography>

<Typography
variant="h4"
fontWeight="bold"
color="success.main"
>

{
transactions.filter(
t => t.status === "SUCCESS"
).length
}

</Typography>

</Paper>

</Grid>

<Grid item xs={12} md={3}>

<Paper
sx={{
p:3,
borderRadius:4,
textAlign:"center",
}}
>

<Typography color="text.secondary">

Failed

</Typography>

<Typography
variant="h4"
fontWeight="bold"
color="error.main"
>

{
transactions.filter(
t => t.status === "FAILED"
).length
}

</Typography>

</Paper>

</Grid>

<Grid item xs={12} md={3}>

<Paper
sx={{
p:3,
borderRadius:4,
textAlign:"center",
}}
>

<Typography color="text.secondary">

Total Amount Distributed

</Typography>

<Typography
variant="h5"
fontWeight="bold"
color="success.main"
>

₹ {transactions
.reduce(
(sum, t) => sum + Number(t.amount || 0),
0
)
.toLocaleString("en-IN")}

</Typography>

</Paper>

</Grid>

</Grid>
{/* ================= ADMIN GUIDELINES ================= */}

<Grid item xs={12} sx={{ mt:4 }}>

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

Transaction Guidelines

</Typography>

<Typography paragraph>

• Every welfare payment is recorded automatically after successful benefit issuance.

</Typography>

<Typography paragraph>

• Administrators can monitor all transactions but cannot modify completed payment records.

</Typography>

<Typography paragraph>

• Failed transactions should be reviewed and reprocessed only after verifying beneficiary details and budget availability.

</Typography>

<Typography paragraph>

• Every transaction is linked with the corresponding beneficiary, welfare scheme and processing officer.

</Typography>

<Typography paragraph>

• The transaction history is maintained for audit, transparency and financial reporting.

</Typography>

</Paper>

</Grid>

{/* ================= AUDIT INFORMATION ================= */}

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

Audit Information

</Typography>

<Typography paragraph>

✔ Transaction IDs are unique.

</Typography>

<Typography paragraph>

✔ Payment timestamps are permanently stored.

</Typography>

<Typography paragraph>

✔ Officer details are recorded for accountability.

</Typography>

<Typography paragraph>

✔ Budget deductions are logged automatically.

</Typography>

</Paper>

</Grid>

{/* ================= SECURITY ================= */}

<Grid item xs={12} md={6}>

<Paper
sx={{
p:4,
borderRadius:4,
height:"100%",
background:"#F8FAFC",
}}
>

<Typography
variant="h6"
fontWeight="bold"
mb={3}
>

Security & Compliance

</Typography>

<Typography paragraph>

Payments are processed through the Government Direct Benefit Transfer (DBT) mechanism.

</Typography>

<Typography paragraph>

Only authorized officers can issue benefits.

</Typography>

<Typography paragraph>

All payment records are protected and available for audit.

</Typography>

<Typography paragraph>

No completed transaction can be edited from the administration portal.

</Typography>

</Paper>

</Grid>
</Container>

    );

}

export default TransactionManagement;
import { useEffect, useState } from "react";

import {
  Container,
  Grid,
  Paper,
  Typography,
  Divider,
  Button,
  Chip,
  Box,
} from "@mui/material";

import {
  ArrowBack,
  Print,
  Download,
} from "@mui/icons-material";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

function TransactionDetails() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [transaction, setTransaction] = useState(null);

  useEffect(() => {

    loadTransaction();

  }, []);

  const loadTransaction = async () => {

    // TODO:
    // Replace with backend API

    setTransaction({

      transactionId: "TXN-20260001",

      applicationId: "APP-1001",

      beneficiaryName: "Rahul Das",

      aadhaar: "XXXX XXXX 5678",

      mobile: "9876543210",

      schemeName: "PM Kisan",

      amount: 6000,

      paymentMode: "DBT",

      status: "SUCCESS",

      officer: "Anirban Roy",

      department: "Agriculture",

      transactionDate: "07 Aug 2026",

      budgetHead: "Agriculture Welfare",

    });

  };

  if (!transaction) {

    return (

      <Typography
        mt={5}
        align="center"
      >

        Loading...

      </Typography>

    );

  }

  return (

<Container
maxWidth="lg"
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

Transaction Details

</Typography>

<Typography color="text.secondary">

View complete transaction information.

</Typography>

</Box>

<Button
variant="outlined"
startIcon={<ArrowBack />}
onClick={() => navigate("/transactions")}
>

Back

</Button>

</Box>

<Grid
container
spacing={3}
>
    {/* ================= BENEFICIARY DETAILS ================= */}

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

Beneficiary Details

</Typography>

<Divider sx={{ mb:3 }}/>

<Box mb={2}>

<Typography color="text.secondary">

Application ID

</Typography>

<Typography fontWeight="bold">

{transaction.applicationId}

</Typography>

</Box>

<Box mb={2}>

<Typography color="text.secondary">

Beneficiary Name

</Typography>

<Typography fontWeight="bold">

{transaction.beneficiaryName}

</Typography>

</Box>

<Box mb={2}>

<Typography color="text.secondary">

Aadhaar Number

</Typography>

<Typography fontWeight="bold">

{transaction.aadhaar}

</Typography>

</Box>

<Box>

<Typography color="text.secondary">

Mobile Number

</Typography>

<Typography fontWeight="bold">

{transaction.mobile}

</Typography>

</Box>

</Paper>

</Grid>

{/* ================= PAYMENT DETAILS ================= */}

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

Payment Details

</Typography>

<Divider sx={{ mb:3 }}/>

<Box mb={2}>

<Typography color="text.secondary">

Transaction ID

</Typography>

<Typography fontWeight="bold">

{transaction.transactionId}

</Typography>

</Box>

<Box mb={2}>

<Typography color="text.secondary">

Scheme Name

</Typography>

<Typography fontWeight="bold">

{transaction.schemeName}

</Typography>

</Box>

<Box mb={2}>

<Typography color="text.secondary">

Benefit Amount

</Typography>

<Typography
variant="h5"
fontWeight="bold"
color="success.main"
>

₹ {Number(transaction.amount).toLocaleString("en-IN")}

</Typography>

</Box>

<Box mb={2}>

<Typography color="text.secondary">

Payment Mode

</Typography>

<Typography fontWeight="bold">

{transaction.paymentMode}

</Typography>

</Box>

<Box>

<Typography color="text.secondary">

Payment Status

</Typography>

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

</Box>

</Paper>

</Grid>
{/* ================= OFFICER DETAILS ================= */}

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

Processing Officer

</Typography>

<Divider sx={{ mb:3 }}/>

<Box mb={2}>

<Typography color="text.secondary">

Officer Name

</Typography>

<Typography fontWeight="bold">

{transaction.officer}

</Typography>

</Box>

<Box mb={2}>

<Typography color="text.secondary">

Department

</Typography>

<Typography fontWeight="bold">

{transaction.department}

</Typography>

</Box>

<Box>

<Typography color="text.secondary">

Transaction Date

</Typography>

<Typography fontWeight="bold">

{transaction.transactionDate}

</Typography>

</Box>

</Paper>

</Grid>

{/* ================= BUDGET DETAILS ================= */}

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

Budget Information

</Typography>

<Divider sx={{ mb:3 }}/>

<Box mb={2}>

<Typography color="text.secondary">

Budget Head

</Typography>

<Typography fontWeight="bold">

{transaction.budgetHead}

</Typography>

</Box>

<Box mb={2}>

<Typography color="text.secondary">

Amount Deducted

</Typography>

<Typography
variant="h5"
fontWeight="bold"
color="error.main"
>

₹ {Number(transaction.amount).toLocaleString("en-IN")}

</Typography>

</Box>

<Box>

<Typography color="text.secondary">

Transaction Status

</Typography>

<Chip
label="Budget Updated"
color="success"
/>

</Box>

</Paper>

</Grid>

{/* ================= AUDIT INFORMATION ================= */}

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

Audit Trail

</Typography>

<Divider sx={{ mb:3 }}/>

<Typography paragraph>

✔ Benefit request approved by the assigned officer.

</Typography>

<Typography paragraph>

✔ Budget verification completed successfully.

</Typography>

<Typography paragraph>

✔ Benefit amount deducted from the department budget.

</Typography>

<Typography paragraph>

✔ Payment processed through Direct Benefit Transfer (DBT).

</Typography>

<Typography paragraph>

✔ Transaction recorded for audit and financial reporting.

</Typography>

</Paper>

</Grid>
{/* ================= RECEIPT VERIFICATION ================= */}

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

Receipt Verification

</Typography>

<Divider sx={{ mb:3 }}/>

<Box
sx={{
width:150,
height:150,
border:"2px dashed #BDBDBD",
borderRadius:2,
display:"flex",
alignItems:"center",
justifyContent:"center",
mx:"auto",
mb:3,
}}
>

<Typography
variant="body2"
color="text.secondary"
align="center"
>

QR Code

</Typography>

</Box>

<Typography
align="center"
color="text.secondary"
>

Scan this QR code to verify the authenticity of the transaction.

</Typography>

</Paper>

</Grid>

{/* ================= GOVERNMENT DECLARATION ================= */}

<Grid item xs={12} md={6}>

<Paper
sx={{
p:4,
borderRadius:4,
height:"100%",
background:"#EEF7FF",
}}
>

<Typography
variant="h6"
fontWeight="bold"
mb={3}
>

Government Declaration

</Typography>

<Divider sx={{ mb:3 }}/>

<Typography paragraph>

This payment has been processed successfully under the Government Welfare Benefit Scheme.

</Typography>

<Typography paragraph>

The benefit amount has been transferred through the Direct Benefit Transfer (DBT) system.

</Typography>

<Typography paragraph>

This transaction is digitally recorded and available for future verification and audit.

</Typography>

</Paper>

</Grid>

{/* ================= ACTION BUTTONS ================= */}

<Grid item xs={12}>

<Divider sx={{ my:4 }}/>

<Box
display="flex"
justifyContent="center"
gap={2}
flexWrap="wrap"
>

<Button
variant="contained"
startIcon={<Print />}
onClick={() => window.print()}
>

Print Transaction

</Button>

<Button
variant="outlined"
startIcon={<Download />}
>

Download Receipt

</Button>

<Button
variant="contained"
color="primary"
onClick={() => navigate("/transactions")}
>

Back to Transactions

</Button>

</Box>

</Grid>
{/* ================= OFFICIAL FOOTER ================= */}

<Grid item xs={12}>

<Paper
sx={{
mt:4,
p:4,
borderRadius:4,
textAlign:"center",
background:"#F5F5F5",
}}
>

<Typography
variant="h6"
fontWeight="bold"
gutterBottom
>

Smart Goverance 

</Typography>

<Typography
variant="body2"
color="text.secondary"
paragraph
>

This is a computer-generated transaction record generated by the CivicPulse
Nexus Welfare & Budget Management System.

</Typography>

<Typography
variant="body2"
color="text.secondary"
paragraph
>

The payment, budget deduction, beneficiary information and officer details
have been securely recorded for transparency and audit purposes.

</Typography>

<Typography
variant="body2"
color="text.secondary"
paragraph
>

Any modification to this record is prohibited. Verification can be performed
using the Transaction ID or QR Code.

</Typography>

<Divider sx={{ my:3 }} />

<Typography
variant="caption"
display="block"
>

© 2026 Smart Goverance

</Typography>

<Typography
variant="caption"
display="block"
>

Government Welfare Transaction Record

</Typography>

</Paper>

</Grid>

</Grid>

</Container>

);

}

export default TransactionDetails;
import {
  Container,
  Paper,
  Typography,
  Divider,
  Grid,
  Button,
  Box,
} from "@mui/material";

import {
  Print,
  Download,
  CheckCircle,
} from "@mui/icons-material";

import { useLocation } from "react-router-dom";

function BenefitReceipt() {

  const { state } = useLocation();

  const receipt = state || {

    transactionId: "TXN-20260001",

    applicationId: "APP-1001",

    beneficiaryName: "Rahul Das",

    schemeName: "PM Kisan",

    amount: 6000,

    paymentMode: "DBT",

    paymentDate: new Date().toLocaleDateString(),

    officerName: "Officer",

    status: "SUCCESS",

  };

  return (

<Container
maxWidth="md"
sx={{ py:4 }}
>

<Paper
sx={{
p:5,
borderRadius:4,
}}
>

<Box
textAlign="center"
mb={4}
>

<CheckCircle
sx={{
fontSize:80,
color:"success.main",
}}
/>

<Typography
variant="h4"
fontWeight="bold"
mt={2}
>

Benefit Payment Receipt

</Typography>

<Typography color="text.secondary">

Government of India

Direct Benefit Transfer

</Typography>

</Box>

<Divider sx={{ mb:4 }}/>

<Grid
container
spacing={3}
>
    <Grid item xs={12} md={6}>

<Typography color="text.secondary">

Transaction ID

</Typography>

<Typography
fontWeight="bold"
mb={2}
>

{receipt.transactionId}

</Typography>

<Typography color="text.secondary">

Application ID

</Typography>

<Typography
fontWeight="bold"
mb={2}
>

{receipt.applicationId}

</Typography>

<Typography color="text.secondary">

Beneficiary Name

</Typography>

<Typography
fontWeight="bold"
mb={2}
>

{receipt.beneficiaryName}

</Typography>

<Typography color="text.secondary">

Scheme

</Typography>

<Typography
fontWeight="bold"
>

{receipt.schemeName}

</Typography>

</Grid>

<Grid item xs={12} md={6}>

<Typography color="text.secondary">

Benefit Amount

</Typography>

<Typography
variant="h5"
fontWeight="bold"
color="success.main"
mb={2}
>

₹ {Number(
receipt.amount
).toLocaleString("en-IN")}

</Typography>

<Typography color="text.secondary">

Payment Mode

</Typography>

<Typography
fontWeight="bold"
mb={2}
>

{receipt.paymentMode}

</Typography>

<Typography color="text.secondary">

Payment Status

</Typography>

<Typography
fontWeight="bold"
color="success.main"
mb={2}
>

{receipt.status}

</Typography>

<Typography color="text.secondary">

Payment Date

</Typography>

<Typography
fontWeight="bold"
mb={2}
>

{receipt.paymentDate}

</Typography>

<Typography color="text.secondary">

Processed By

</Typography>

<Typography
fontWeight="bold"
>

{receipt.officerName}

</Typography>

</Grid>

<Grid item xs={12}>

<Divider sx={{ my:3 }}/>

</Grid>
{/* ================= PAYMENT SUMMARY ================= */}

<Grid item xs={12}>

<Paper
sx={{
p:4,
borderRadius:3,
background:"#F8FAFC",
}}
>

<Typography
variant="h6"
fontWeight="bold"
mb={3}
>

Payment Summary

</Typography>

<Divider sx={{ mb:3 }}/>

<Grid container spacing={3}>

<Grid item xs={12} md={4}>

<Typography color="text.secondary">

Benefit Amount

</Typography>

<Typography
variant="h5"
fontWeight="bold"
color="success.main"
>

₹ {Number(receipt.amount).toLocaleString("en-IN")}

</Typography>

</Grid>

<Grid item xs={12} md={4}>

<Typography color="text.secondary">

Payment Mode

</Typography>

<Typography
variant="h6"
fontWeight="bold"
>

{receipt.paymentMode}

</Typography>

</Grid>

<Grid item xs={12} md={4}>

<Typography color="text.secondary">

Status

</Typography>

<Typography
variant="h6"
fontWeight="bold"
color="success.main"
>

{receipt.status}

</Typography>

</Grid>

</Grid>

</Paper>

</Grid>

{/* ================= GOVERNMENT DECLARATION ================= */}

<Grid item xs={12}>

<Paper
sx={{
p:4,
borderRadius:3,
background:"#EEF7FF",
}}
>

<Typography
variant="h6"
fontWeight="bold"
mb={2}
>

Government Declaration

</Typography>

<Divider sx={{ mb:3 }}/>

<Typography paragraph>

This benefit has been transferred through the Government Direct Benefit Transfer (DBT) system into the beneficiary's registered bank account.

</Typography>

<Typography paragraph>

This receipt serves as an official acknowledgement that the payment has been processed successfully through the Smart Goverance Welfare Management System.

</Typography>

<Typography paragraph>

The corresponding financial transaction has been recorded automatically for audit, transparency, and future verification.

</Typography>

</Paper>

</Grid>
{/* ================= VERIFICATION ================= */}

<Grid item xs={12} md={6}>

<Paper
sx={{
p:4,
borderRadius:3,
height:"100%",
}}
>

<Typography
variant="h6"
fontWeight="bold"
mb={3}
>

Verification

</Typography>

<Divider sx={{ mb:3 }}/>

<Box
sx={{
width:140,
height:140,
border:"2px dashed #9E9E9E",
display:"flex",
alignItems:"center",
justifyContent:"center",
mx:"auto",
mb:3,
}}
>

<Typography
variant="body2"
align="center"
color="text.secondary"
>

QR Code

</Typography>

</Box>

<Typography
align="center"
color="text.secondary"
>

Scan to verify this payment receipt.

</Typography>

</Paper>

</Grid>

{/* ================= OFFICER CERTIFICATION ================= */}

<Grid item xs={12} md={6}>

<Paper
sx={{
p:4,
borderRadius:3,
height:"100%",
}}
>

<Typography
variant="h6"
fontWeight="bold"
mb={3}
>

Officer Certification

</Typography>

<Divider sx={{ mb:3 }}/>

<Typography>

Processed By

</Typography>

<Typography
fontWeight="bold"
mb={3}
>

{receipt.officerName}

</Typography>

<Typography>

Designation

</Typography>

<Typography
fontWeight="bold"
mb={3}
>

Welfare Officer

</Typography>

<Typography>

Digital Signature

</Typography>

<Box
sx={{
mt:2,
height:60,
borderBottom:"2px solid #BDBDBD",
}}
/>

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

Print Receipt

</Button>

<Button
variant="outlined"
startIcon={<Download />}
>

Download PDF

</Button>

</Box>

</Grid>
{/* ================= FOOTER ================= */}

<Grid item xs={12}>

<Paper
sx={{
mt:4,
p:4,
borderRadius:3,
background:"#F5F5F5",
textAlign:"center",
}}
>

<Typography
variant="h6"
fontWeight="bold"
gutterBottom
>

Smart Goverance Welfare Management System

</Typography>

<Typography
variant="body2"
color="text.secondary"
paragraph
>

This is a computer-generated payment receipt issued through the CivicPulse
Nexus Welfare Management System. No physical signature is required.

</Typography>

<Typography
variant="body2"
color="text.secondary"
paragraph
>

Every payment is digitally recorded and can be verified using the
Transaction ID and QR Code.

</Typography>

<Divider sx={{ my:3 }}/>

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

Government Welfare Benefit Payment Receipt

</Typography>

</Paper>

</Grid>

</Grid>

</Paper>

</Container>

    );

}

export default BenefitReceipt;
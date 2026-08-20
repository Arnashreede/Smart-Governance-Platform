import { useEffect, useState } from "react";

import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Divider,
  Chip,
  Box,
} from "@mui/material";

import {
  Payments,
  ArrowBack,
} from "@mui/icons-material";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

function IssueBenefitDetails() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [beneficiary, setBeneficiary] = useState(null);

  useEffect(() => {

    loadBeneficiary();

  }, []);

  const loadBeneficiary = async () => {

    // Replace with backend API

    setBeneficiary({

      id,

      applicationId: "APP-1001",

      fullName: "Rahul Das",

      aadhaarNumber: "XXXX XXXX 5678",

      mobileNumber: "9876543210",

      email: "rahul@gmail.com",

      schemeName: "PM Kisan",

      benefitAmount: 6000,

      bankName: "State Bank of India",

      accountHolderName: "Rahul Das",

      accountNumber: "XXXXXX4521",

      ifscCode: "SBIN0001234",

      status: "APPROVED",

    });

  };

  if (!beneficiary) {

    return (
      <Typography mt={5} align="center">
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

Issue Benefit

</Typography>

<Typography color="text.secondary">

Verify beneficiary details before releasing the benefit.

</Typography>

</Box>

<Button
variant="outlined"
startIcon={<ArrowBack />}
onClick={() => navigate("/officer/beneficiaries")}
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

{beneficiary.applicationId}

</Typography>

</Box>

<Box mb={2}>

<Typography color="text.secondary">

Full Name

</Typography>

<Typography fontWeight="bold">

{beneficiary.fullName}

</Typography>

</Box>

<Box mb={2}>

<Typography color="text.secondary">

Aadhaar Number

</Typography>

<Typography fontWeight="bold">

{beneficiary.aadhaarNumber}

</Typography>

</Box>

<Box mb={2}>

<Typography color="text.secondary">

Mobile Number

</Typography>

<Typography fontWeight="bold">

{beneficiary.mobileNumber}

</Typography>

</Box>

<Box>

<Typography color="text.secondary">

Email Address

</Typography>

<Typography fontWeight="bold">

{beneficiary.email}

</Typography>

</Box>

</Paper>

</Grid>

{/* ================= SCHEME DETAILS ================= */}

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

Scheme Details

</Typography>

<Divider sx={{ mb:3 }}/>

<Box mb={2}>

<Typography color="text.secondary">

Scheme Name

</Typography>

<Typography fontWeight="bold">

{beneficiary.schemeName}

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

₹ {Number(
beneficiary.benefitAmount
).toLocaleString("en-IN")}

</Typography>

</Box>

<Box mb={2}>

<Typography color="text.secondary">

Application Status

</Typography>

<Chip
label={beneficiary.status}
color="success"
/>

</Box>

<Box>

<Typography color="text.secondary">

Eligibility

</Typography>

<Chip
label="Eligible"
color="primary"
variant="outlined"
/>

</Box>

</Paper>

</Grid>
{/* ================= BANK DETAILS ================= */}

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

Bank Details

</Typography>

<Divider sx={{ mb:3 }}/>

<Box mb={2}>

<Typography color="text.secondary">

Account Holder

</Typography>

<Typography fontWeight="bold">

{beneficiary.accountHolderName}

</Typography>

</Box>

<Box mb={2}>

<Typography color="text.secondary">

Bank Name

</Typography>

<Typography fontWeight="bold">

{beneficiary.bankName}

</Typography>

</Box>

<Box mb={2}>

<Typography color="text.secondary">

Account Number

</Typography>

<Typography fontWeight="bold">

{beneficiary.accountNumber}

</Typography>

</Box>

<Box>

<Typography color="text.secondary">

IFSC Code

</Typography>

<Typography fontWeight="bold">

{beneficiary.ifscCode}

</Typography>

</Box>

</Paper>

</Grid>

{/* ================= PAYMENT SUMMARY ================= */}

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

Payment Summary

</Typography>

<Divider sx={{ mb:3 }}/>

<Box mb={2}>

<Typography color="text.secondary">

Beneficiary

</Typography>

<Typography fontWeight="bold">

{beneficiary.fullName}

</Typography>

</Box>

<Box mb={2}>

<Typography color="text.secondary">

Scheme

</Typography>

<Typography fontWeight="bold">

{beneficiary.schemeName}

</Typography>

</Box>

<Box mb={2}>

<Typography color="text.secondary">

Payment Amount

</Typography>

<Typography
variant="h4"
fontWeight="bold"
color="success.main"
>

₹ {Number(
beneficiary.benefitAmount
).toLocaleString("en-IN")}

</Typography>

</Box>

<Box>

<Typography color="text.secondary">

Payment Status

</Typography>

<Chip
label="Ready for Payment"
color="warning"
/>

</Box>

</Paper>

</Grid>

{/* ================= CONFIRMATION ================= */}

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
mb={2}
>

Confirmation

</Typography>

<Divider sx={{ mb:3 }}/>

<Typography>

Please verify all beneficiary and bank details before issuing the benefit.
Once processed, the payment cannot be reversed through this portal.

</Typography>

</Paper>

</Grid>
{/* ================= ACTION BUTTONS ================= */}

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
mb={2}
>

Issue Benefit

</Typography>

<Divider sx={{ mb:3 }}/>

<Typography
color="text.secondary"
mb={4}
>

By clicking <b>Issue Benefit</b>, the system will automatically:

</Typography>

<Box sx={{ ml:2, mb:4 }}>

<Typography gutterBottom>

✔ Verify beneficiary eligibility

</Typography>

<Typography gutterBottom>

✔ Validate available department budget

</Typography>

<Typography gutterBottom>

✔ Deduct the benefit amount

</Typography>

<Typography gutterBottom>

✔ Create a transaction record

</Typography>

<Typography gutterBottom>

✔ Update application status to <b>Benefit Issued</b>

</Typography>

<Typography gutterBottom>

✔ Generate payment receipt

</Typography>

</Box>

<Box
display="flex"
justifyContent="flex-end"
gap={2}
>

<Button
variant="outlined"
startIcon={<ArrowBack />}
onClick={() => navigate("/officer/beneficiaries")}
>

Cancel

</Button>

<Button
variant="contained"
color="success"
startIcon={<Payments />}
onClick={() => {

alert("Benefit issued successfully.");

navigate("/officer/beneficiaries");

}}
>

Issue Benefit

</Button>

</Box>

</Paper>

</Grid>
{/* ================= GOVERNMENT NOTICE ================= */}

<Grid item xs={12}>

<Paper
sx={{
p:4,
borderRadius:4,
background:"#eef7ff",
}}
>

<Typography
variant="h6"
fontWeight="bold"
mb={2}
>

Government Notice

</Typography>

<Divider sx={{ mb:3 }}/>

<Typography paragraph>

This benefit will be transferred directly to the beneficiary's registered bank account through the Government Direct Benefit Transfer (DBT) system.

</Typography>

<Typography paragraph>

Before processing, verify the beneficiary's identity, application approval status, and bank account details. Incorrect information may result in payment failure.

</Typography>

<Typography paragraph>

Every successful payment is automatically recorded in the transaction history for audit and financial transparency.

</Typography>

<Typography paragraph>

This action cannot be reversed from the officer portal. Any correction must be handled by the concerned department administrator.

</Typography>

</Paper>

</Grid>

</Grid>

</Container>

    );

}

export default IssueBenefitDetails;
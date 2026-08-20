import { useEffect, useState } from "react";

import {
    Container,
    Typography,
    Paper,
    Grid,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    TextField,
    Button,
    InputAdornment,
    Chip,
} from "@mui/material";

import {
    Search,
    Refresh,
} from "@mui/icons-material";

function AuditLog() {

    const [logs, setLogs] = useState([]);

    const [search, setSearch] = useState("");

    useEffect(() => {

        loadLogs();

    }, []);

    const loadLogs = async () => {

        // TODO
        // Backend API

        setLogs([
            {
                id:1,
                user:"Admin",
                action:"Created Budget",
                module:"Budget",
                date:"07 Aug 2026",
                status:"SUCCESS",
            },
            {
                id:2,
                user:"Officer",
                action:"Issued Benefit",
                module:"Welfare",
                date:"07 Aug 2026",
                status:"SUCCESS",
            },
            {
                id:3,
                user:"Citizen",
                action:"Submitted Application",
                module:"Welfare",
                date:"07 Aug 2026",
                status:"SUCCESS",
            },
        ]);

    };

    const filtered = logs.filter((log)=>

        log.user.toLowerCase().includes(search.toLowerCase()) ||

        log.action.toLowerCase().includes(search.toLowerCase()) ||

        log.module.toLowerCase().includes(search.toLowerCase())

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

Audit Log

</Typography>

<Typography
color="text.secondary"
mb={4}
>

View every important action performed inside Smart Goverance Platform.

</Typography>

<Paper
sx={{
p:3,
mb:3,
borderRadius:4,
}}
>

<Grid container spacing={3}>

<Grid item xs={12} md={8}>

<TextField
fullWidth
placeholder="Search Audit Logs..."
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
startIcon={<Refresh/>}
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

<TableCell>User</TableCell>

<TableCell>Action</TableCell>

<TableCell>Module</TableCell>

<TableCell>Date</TableCell>

<TableCell>Status</TableCell>

</TableRow>

</TableHead>

<TableBody>
    {filtered.map((log) => (

<TableRow
hover
key={log.id}
>

<TableCell>

<Typography fontWeight="bold">

{log.user}

</Typography>

</TableCell>

<TableCell>

{log.action}

</TableCell>

<TableCell>

<Chip
label={log.module}
color="primary"
variant="outlined"
/>

</TableCell>

<TableCell>

{log.date}

</TableCell>

<TableCell>

<Chip
label={log.status}
color={
log.status === "SUCCESS"
? "success"
: log.status === "FAILED"
? "error"
: "warning"
}
/>

</TableCell>

</TableRow>

))}

{filtered.length === 0 && (

<TableRow>

<TableCell
colSpan={5}
align="center"
>

<Typography
color="text.secondary"
py={3}
>

No audit records found.

</Typography>

</TableCell>

</TableRow>

)}
</TableBody>

</Table>

</TableContainer>

{/* ================= AUDIT SUMMARY ================= */}

<Grid
container
spacing={3}
sx={{ mt: 3 }}
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

Total Records

</Typography>

<Typography
variant="h4"
fontWeight="bold"
color="primary"
>

{logs.length}

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

Successful Actions

</Typography>

<Typography
variant="h4"
fontWeight="bold"
color="success.main"
>

{
logs.filter(
log => log.status === "SUCCESS"
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

Failed Actions

</Typography>

<Typography
variant="h4"
fontWeight="bold"
color="error.main"
>

{
logs.filter(
log => log.status === "FAILED"
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

Modules Used

</Typography>

<Typography
variant="h4"
fontWeight="bold"
color="secondary"
>

{new Set(logs.map(log => log.module)).size}

</Typography>

</Paper>

</Grid>

</Grid>

{/* ================= RECENT SYSTEM ACTIVITY ================= */}

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

Recent System Activity

</Typography>

<Divider sx={{ mb:3 }} />

<Typography paragraph>

• New welfare applications submitted by citizens.

</Typography>

<Typography paragraph>

• Officers approved and processed beneficiary payments.

</Typography>

<Typography paragraph>

• Budget allocations and deductions were recorded automatically.

</Typography>

<Typography paragraph>

• Certificates and grievance updates were logged successfully.

</Typography>

</Paper>

</Grid>
{/* ================= AUDIT GUIDELINES ================= */}

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

Audit Guidelines

</Typography>

<Divider sx={{ mb:3 }}/>

<Typography paragraph>

• Every important action performed in Smart Goverance Platform is automatically recorded.

</Typography>

<Typography paragraph>

• Audit records cannot be edited or deleted by officers.

</Typography>

<Typography paragraph>

• User identity, action, timestamp and module are permanently stored for accountability.

</Typography>

<Typography paragraph>

• Failed operations are logged separately for investigation.

</Typography>

<Typography paragraph>

• Audit history is available only to authorized administrators.

</Typography>

</Paper>

</Grid>

{/* ================= SECURITY & COMPLIANCE ================= */}

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

Security & Compliance

</Typography>

<Divider sx={{ mb:3 }}/>

<Typography paragraph>

✔ Every login and logout is recorded.

</Typography>

<Typography paragraph>

✔ Budget modifications are tracked.

</Typography>

<Typography paragraph>

✔ Welfare approvals are logged.

</Typography>

<Typography paragraph>

✔ Benefit transactions are permanently recorded.

</Typography>

<Typography paragraph>

✔ Complaint status changes are stored.

</Typography>

</Paper>

</Grid>

{/* ================= ADMIN NOTES ================= */}

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

Administrator Notes

</Typography>

<Divider sx={{ mb:3 }}/>

<Typography paragraph>

The audit log helps administrators monitor all activities across Citizen, Officer and Admin portals.

</Typography>

<Typography paragraph>

Audit records improve transparency and support financial as well as operational investigations.

</Typography>

<Typography paragraph>

These records should be reviewed regularly to detect unauthorized access or unusual activity.

</Typography>

<Typography paragraph>

Logs can be exported for compliance, reporting and government audits.

</Typography>

</Paper>

</Grid>
{/* ================= OFFICIAL AUDIT DECLARATION ================= */}

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

 Smart Goverance Platform Audit System

</Typography>

<Typography
variant="body2"
color="text.secondary"
paragraph
>

This audit log is automatically generated by the Smart Goverance Platform platform.
All important system activities performed by Citizens, Officers and
Administrators are securely recorded.

</Typography>

<Typography
variant="body2"
color="text.secondary"
paragraph
>

Audit records are immutable and maintained for transparency,
security monitoring, operational accountability and government compliance.

</Typography>

<Typography
variant="body2"
color="text.secondary"
paragraph
>

Unauthorized modification or deletion of audit records is prohibited.
These logs may be used for investigations, financial audits,
system monitoring and administrative reporting.

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

Government Digital Audit Management System

</Typography>

</Paper>

</Grid>

</Grid>

</Container>

);

}

export default AuditLog;
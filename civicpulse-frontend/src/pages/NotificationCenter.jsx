import { useEffect, useState } from "react";

import {
    Container,
    Typography,
    Paper,
    Grid,
    TextField,
    InputAdornment,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Chip,
    Button,
} from "@mui/material";

import {
    Search,
    Notifications,
} from "@mui/icons-material";

function NotificationCenter() {

    const [notifications, setNotifications] = useState([]);

    const [search, setSearch] = useState("");

    useEffect(() => {

        loadNotifications();

    }, []);

    const loadNotifications = async () => {

        // TODO
        // Backend API

        setNotifications([

            {
                id:1,
                title:"Benefit Issued",
                message:"PM Kisan benefit has been issued successfully.",
                recipient:"Citizen",
                priority:"HIGH",
                date:"07 Aug 2026",
            },

            {
                id:2,
                title:"New Welfare Application",
                message:"A new welfare application requires verification.",
                recipient:"Officer",
                priority:"MEDIUM",
                date:"07 Aug 2026",
            },

            {
                id:3,
                title:"Budget Updated",
                message:"Department budget has been allocated.",
                recipient:"Admin",
                priority:"LOW",
                date:"07 Aug 2026",
            },

        ]);

    };

    const filtered = notifications.filter((n)=>

        n.title.toLowerCase().includes(search.toLowerCase()) ||

        n.message.toLowerCase().includes(search.toLowerCase()) ||

        n.recipient.toLowerCase().includes(search.toLowerCase())

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

Notification Center

</Typography>

<Typography
color="text.secondary"
mb={4}
>

Manage and monitor all system notifications.

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
placeholder="Search Notifications..."
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
startIcon={<Notifications />}
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

<TableCell>Title</TableCell>

<TableCell>Message</TableCell>

<TableCell>Recipient</TableCell>

<TableCell>Priority</TableCell>

<TableCell>Date</TableCell>

</TableRow>

</TableHead>

<TableBody>
    {filtered.map((notification) => (

<TableRow
hover
key={notification.id}
>

<TableCell>

<Typography fontWeight="bold">

{notification.title}

</Typography>

</TableCell>

<TableCell>

{notification.message}

</TableCell>

<TableCell>

<Chip
label={notification.recipient}
color={
notification.recipient === "Admin"
? "error"
: notification.recipient === "Officer"
? "warning"
: "primary"
}
/>

</TableCell>

<TableCell>

<Chip
label={notification.priority}
color={
notification.priority === "HIGH"
? "error"
: notification.priority === "MEDIUM"
? "warning"
: "success"
}
/>

</TableCell>

<TableCell>

{notification.date}

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

No notifications found.

</Typography>

</TableCell>

</TableRow>

)}
</TableBody>

</Table>

</TableContainer>

{/* ================= NOTIFICATION SUMMARY ================= */}

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

Total Notifications

</Typography>

<Typography
variant="h4"
fontWeight="bold"
color="primary"
>

{notifications.length}

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

High Priority

</Typography>

<Typography
variant="h4"
fontWeight="bold"
color="error.main"
>

{
notifications.filter(
n => n.priority === "HIGH"
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

Medium Priority

</Typography>

<Typography
variant="h4"
fontWeight="bold"
color="warning.main"
>

{
notifications.filter(
n => n.priority === "MEDIUM"
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

Low Priority

</Typography>

<Typography
variant="h4"
fontWeight="bold"
color="success.main"
>

{
notifications.filter(
n => n.priority === "LOW"
).length
}

</Typography>

</Paper>

</Grid>

</Grid>

{/* ================= RECENT NOTIFICATION ACTIVITY ================= */}

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

Recent Notification Activity

</Typography>

<Divider sx={{ mb:3 }} />

<Typography paragraph>

• Citizens received benefit payment confirmations.

</Typography>

<Typography paragraph>

• Officers were notified about newly assigned welfare applications.

</Typography>

<Typography paragraph>

• Administrators received budget allocation alerts.

</Typography>

<Typography paragraph>

• Certificate approval and grievance status updates were delivered successfully.

</Typography>

</Paper>

</Grid>
{/* ================= NOTIFICATION GUIDELINES ================= */}

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

Notification Guidelines

</Typography>

<Divider sx={{ mb:3 }}/>

<Typography paragraph>

• Notifications are generated automatically whenever important actions occur within the system.

</Typography>

<Typography paragraph>

• Citizens receive updates about applications, certificates, grievances and welfare benefits.

</Typography>

<Typography paragraph>

• Officers receive notifications for newly assigned work, pending verifications and benefit processing.

</Typography>

<Typography paragraph>

• Administrators receive budget alerts, audit notifications, system events and operational updates.

</Typography>

<Typography paragraph>

• Notification history is maintained to improve transparency and communication across the platform.

</Typography>

</Paper>

</Grid>

{/* ================= SYSTEM ANNOUNCEMENTS ================= */}

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

System Announcements

</Typography>

<Divider sx={{ mb:3 }}/>

<Typography paragraph>

📢 Scheduled maintenance notifications.

</Typography>

<Typography paragraph>

📢 New welfare scheme announcements.

</Typography>

<Typography paragraph>

📢 Budget allocation updates.

</Typography>

<Typography paragraph>

📢 Department circulars and government notices.

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

Security & Privacy

</Typography>

<Divider sx={{ mb:3 }}/>

<Typography paragraph>

✔ Notifications are delivered only to authorized users.

</Typography>

<Typography paragraph>

✔ Sensitive personal information is never included in notification previews.

</Typography>

<Typography paragraph>

✔ All notification events are recorded for audit purposes.

</Typography>

<Typography paragraph>

✔ Delivery history can be reviewed by administrators when required.

</Typography>

</Paper>

</Grid>
{/* ================= OFFICIAL NOTIFICATION DECLARATION ================= */}

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

Smart Goverance Platform Notification System

</Typography>

<Typography
variant="body2"
color="text.secondary"
paragraph
>

The Smart Goverance Platform for Administrative Operations with Citizen Assistance Group2 Notification Center automatically delivers important
updates to Citizens, Officers and Administrators regarding applications,
grievances, certificates, welfare schemes, benefit payments and system events.

</Typography>

<Typography
variant="body2"
color="text.secondary"
paragraph
>

Notifications are securely delivered according to user roles and are
maintained to improve transparency, communication and service delivery.

</Typography>

<Typography
variant="body2"
color="text.secondary"
paragraph
>

All notification activities are securely logged and may be reviewed by
authorized administrators for audit and operational purposes.

</Typography>

<Divider sx={{ my:3 }} />

<Typography
variant="caption"
display="block"
>

© 2026 Smart Goverance Platform 

</Typography>

<Typography
variant="caption"
display="block"
>

Government Digital Notification Management System

</Typography>

</Paper>

</Grid>

</Grid>

</Container>

);

}

export default NotificationCenter;
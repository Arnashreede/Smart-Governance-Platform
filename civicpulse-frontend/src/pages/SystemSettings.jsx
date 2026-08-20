import { useState } from "react";

import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";

import {
  Save,
  Settings,
} from "@mui/icons-material";

function SystemSettings() {

  const [settings, setSettings] = useState({

    applicationName: "Smart Goverance Platform",

    supportEmail: "support@civicpulse.gov.in",

    supportPhone: "+91 1800 123 456",

    maintenanceMode: false,

    emailNotifications: true,

    smsNotifications: true,

    autoApproveCertificates: false,

    autoCloseResolvedGrievances: true,

  });

  const handleChange = (field, value) => {

    setSettings({

      ...settings,

      [field]: value,

    });

  };

  const handleSave = () => {

    // TODO:
    // Save settings using backend API

    alert("Settings saved successfully.");

  };

  return (

<Container
maxWidth="lg"
sx={{ py:4 }}
>

<Typography
variant="h4"
fontWeight="bold"
mb={1}
>

System Settings

</Typography>

<Typography
color="text.secondary"
mb={4}
>

Configure global settings for the Smart Goverance platform.

</Typography>

<Grid
container
spacing={3}
{/* ================= GENERAL SETTINGS ================= */}

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

General Settings

</Typography>

<Divider sx={{ mb:3 }}/>

<TextField
fullWidth
label="Application Name"
value={settings.applicationName}
onChange={(e)=>
handleChange(
"applicationName",
e.target.value
)
}
sx={{ mb:3 }}
/>

<TextField
fullWidth
label="Support Email"
value={settings.supportEmail}
onChange={(e)=>
handleChange(
"supportEmail",
e.target.value
)
}
sx={{ mb:3 }}
/>

<TextField
fullWidth
label="Support Phone"
value={settings.supportPhone}
onChange={(e)=>
handleChange(
"supportPhone",
e.target.value
)
}
/>

</Paper>

</Grid>

{/* ================= SYSTEM OPTIONS ================= */}

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

System Options

</Typography>

<Divider sx={{ mb:3 }}/>

<FormControlLabel
control={
<Switch
checked={settings.maintenanceMode}
onChange={(e)=>
handleChange(
"maintenanceMode",
e.target.checked
)
}
/>
}
label="Maintenance Mode"
/>

<FormControlLabel
control={
<Switch
checked={settings.emailNotifications}
onChange={(e)=>
handleChange(
"emailNotifications",
e.target.checked
)
}
/>
}
label="Enable Email Notifications"
/>

<FormControlLabel
control={
<Switch
checked={settings.smsNotifications}
onChange={(e)=>
handleChange(
"smsNotifications",
e.target.checked
)
}
/>
}
label="Enable SMS Notifications"
/>

<FormControlLabel
control={
<Switch
checked={settings.autoApproveCertificates}
onChange={(e)=>
handleChange(
"autoApproveCertificates",
e.target.checked
)
}
/>
}
label="Auto Approve Certificates"
/>

<FormControlLabel
control={
<Switch
checked={settings.autoCloseResolvedGrievances}
onChange={(e)=>
handleChange(
"autoCloseResolvedGrievances",
e.target.checked
)
}
/>
}
label="Auto Close Resolved Grievances"
/>

</Paper>

</Grid>
{/* ================= PLATFORM STATISTICS ================= */}

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

Platform Statistics

</Typography>

<Divider sx={{ mb:3 }}/>

<Grid container spacing={3}>

<Grid item xs={6}>

<Typography color="text.secondary">

Registered Citizens

</Typography>

<Typography
variant="h5"
fontWeight="bold"
color="primary"
>

12,458

</Typography>

</Grid>

<Grid item xs={6}>

<Typography color="text.secondary">

Officers

</Typography>

<Typography
variant="h5"
fontWeight="bold"
color="secondary"
>

86

</Typography>

</Grid>

<Grid item xs={6}>

<Typography color="text.secondary">

Departments

</Typography>

<Typography
variant="h5"
fontWeight="bold"
color="success.main"
>

15

</Typography>

</Grid>

<Grid item xs={6}>

<Typography color="text.secondary">

Active Welfare Schemes

</Typography>

<Typography
variant="h5"
fontWeight="bold"
color="warning.main"
>

24

</Typography>

</Grid>

</Grid>

</Paper>

</Grid>

{/* ================= SYSTEM HEALTH ================= */}

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

System Health

</Typography>

<Divider sx={{ mb:3 }}/>

<Box mb={2}>

<Typography color="text.secondary">

API Gateway

</Typography>

<Typography
fontWeight="bold"
color="success.main"
>

● Online

</Typography>

</Box>

<Box mb={2}>

<Typography color="text.secondary">

Database

</Typography>

<Typography
fontWeight="bold"
color="success.main"
>

● Connected

</Typography>

</Box>

<Box mb={2}>

<Typography color="text.secondary">

Kafka Broker

</Typography>

<Typography
fontWeight="bold"
color="success.main"
>

● Running

</Typography>

</Box>

<Box mb={2}>

<Typography color="text.secondary">

Redis Cache

</Typography>

<Typography
fontWeight="bold"
color="success.main"
>

● Active

</Typography>

</Box>

<Box>

<Typography color="text.secondary">

Last Backup

</Typography>

<Typography fontWeight="bold">

Today, 02:00 AM

</Typography>

</Box>

</Paper>

</Grid>

{/* ================= SECURITY SETTINGS ================= */}

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

Security Settings

</Typography>

<Divider sx={{ mb:3 }}/>

<Typography paragraph>

✔ JWT authentication is enabled.

</Typography>

<Typography paragraph>

✔ Role-based access control is active.

</Typography>

<Typography paragraph>

✔ Passwords are securely encrypted.

</Typography>

<Typography paragraph>

✔ Audit logging is enabled for all sensitive operations.

</Typography>

<Typography paragraph>

✔ All API requests are routed through the API Gateway.

</Typography>

</Paper>

</Grid>
{/* ================= SAVE SETTINGS ================= */}

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

Save Configuration

</Typography>

<Divider sx={{ mb:3 }}/>

<Typography paragraph>

Changes made here affect the entire Smart Goverance platform. Review all settings carefully before saving.

</Typography>

{settings.maintenanceMode && (

<Paper
sx={{
p:2,
mb:3,
background:"#FFF3E0",
borderLeft:"5px solid #FB8C00",
}}
>

<Typography
fontWeight="bold"
color="warning.main"
>

⚠ Maintenance Mode Enabled

</Typography>

<Typography variant="body2">

Citizens and Officers will have limited access while maintenance mode is active.

</Typography>

</Paper>

)}

<Box
display="flex"
justifyContent="flex-end"
>

<Button
variant="contained"
size="large"
startIcon={<Save />}
onClick={handleSave}
>

Save Settings

</Button>

</Box>

</Paper>

</Grid>

{/* ================= ADMINISTRATOR NOTES ================= */}

<Grid item xs={12}>

<Paper
sx={{
p:4,
borderRadius:4,
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

• Only authorized administrators can modify system-wide settings.

</Typography>

<Typography paragraph>

• Configuration changes are recorded automatically in the Audit Log.

</Typography>

<Typography paragraph>

• Changes to notification preferences affect future notifications only.

</Typography>

<Typography paragraph>

• Maintenance mode should be enabled only during planned upgrades or system maintenance.

</Typography>

<Typography paragraph>

• Always verify configuration changes before deploying them to production.

</Typography>

</Paper>

</Grid>
{/* ================= OFFICIAL SYSTEM DECLARATION ================= */}

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

Smart Goverance System Administration

</Typography>

<Typography
variant="body2"
color="text.secondary"
paragraph
>

System settings define the operational configuration of the Smart Goverance Platform
platform. Changes made through this panel affect all users, departments and
government services.

</Typography>

<Typography
variant="body2"
color="text.secondary"
paragraph
>

Every configuration update is securely recorded in the Audit Log with the
administrator's identity, timestamp and affected settings to ensure
transparency and accountability.

</Typography>

<Typography
variant="body2"
color="text.secondary"
paragraph
>

Only authorized system administrators are permitted to modify platform-wide
configuration. Unauthorized access attempts are monitored and logged.

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

Government Digital Administration & Configuration System

</Typography>

</Paper>

</Grid>

</Grid>

</Container>

);

}

export default SystemSettings;
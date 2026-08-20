import {
    Avatar,
    Box,
    Card,
    CardContent,
    Divider,
    Grid,
    Typography,
    Chip,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

function OfficerProfile() {

    const fullName = localStorage.getItem("fullName") || "Officer";
    const email = localStorage.getItem("email") || "Not Available";
    const role = localStorage.getItem("role") || "OFFICER";
    const userId = localStorage.getItem("userId") || "N/A";

    return (
        <>
            <Sidebar />

            <Box
                sx={{
                    ml: "270px",
                    p: 4,
                    bgcolor: "#F5F7FA",
                    minHeight: "100vh",
                }}
            >
                <Header />

                <Typography
                    variant="h4"
                    fontWeight="bold"
                    mb={3}
                >
                    Officer Profile
                </Typography>

                <Grid container spacing={3}>

                    <Grid item xs={12} md={4}>

                        <Card
                            sx={{
                                borderRadius: 3,
                                textAlign: "center",
                                p: 3,
                            }}
                        >

                            <Avatar
                                sx={{
                                    width: 100,
                                    height: 100,
                                    mx: "auto",
                                    mb: 2,
                                    bgcolor: "#EF6C00",
                                    fontSize: 40,
                                }}
                            >
                                {fullName.charAt(0).toUpperCase()}
                            </Avatar>

                            <Typography
                                variant="h5"
                                fontWeight="bold"
                            >
                                {fullName}
                            </Typography>

                            <Chip
                                label={role}
                                color="primary"
                                sx={{ mt: 2 }}
                            />

                        </Card>

                    </Grid>

                    <Grid item xs={12} md={8}>

                        <Card
                            sx={{
                                borderRadius: 3,
                            }}
                        >

                            <CardContent>

                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                >
                                    Account Information
                                </Typography>

                                <Divider sx={{ my: 2 }} />
                                                                <Grid container spacing={3}>

                                    <Grid item xs={12} md={6}>

                                        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>

                                            <PersonIcon
                                                color="primary"
                                                sx={{ mr: 2 }}
                                            />

                                            <Box>

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    Full Name
                                                </Typography>

                                                <Typography variant="body1">
                                                    {fullName}
                                                </Typography>

                                            </Box>

                                        </Box>

                                    </Grid>

                                    <Grid item xs={12} md={6}>

                                        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>

                                            <EmailIcon
                                                color="primary"
                                                sx={{ mr: 2 }}
                                            />

                                            <Box>

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    Email
                                                </Typography>

                                                <Typography variant="body1">
                                                    {email}
                                                </Typography>

                                            </Box>

                                        </Box>

                                    </Grid>

                                    <Grid item xs={12} md={6}>

                                        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>

                                            <BadgeIcon
                                                color="primary"
                                                sx={{ mr: 2 }}
                                            />

                                            <Box>

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    User ID
                                                </Typography>

                                                <Typography variant="body1">
                                                    {userId}
                                                </Typography>

                                            </Box>

                                        </Box>

                                    </Grid>

                                    <Grid item xs={12} md={6}>

                                        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>

                                            <AdminPanelSettingsIcon
                                                color="primary"
                                                sx={{ mr: 2 }}
                                            />

                                            <Box>

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    Role
                                                </Typography>

                                                <Typography variant="body1">
                                                    {role}
                                                </Typography>

                                            </Box>

                                        </Box>

                                    </Grid>

                                </Grid>

                            </CardContent>

                        </Card>

                    </Grid>

                </Grid>

            </Box>

        </>

    );

}

export default OfficerProfile;
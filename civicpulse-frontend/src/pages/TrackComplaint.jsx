import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
} from "@mui/material";

import AssignmentIcon from "@mui/icons-material/Assignment";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ApartmentIcon from "@mui/icons-material/Apartment";
import CategoryIcon from "@mui/icons-material/Category";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import CommentIcon from "@mui/icons-material/Comment";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import { getCitizenGrievances } from "../services/grievanceService";

function TrackComplaint() {

    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        loadComplaints();
    }, []);

    const loadComplaints = async () => {
        try {

           const citizenId = localStorage.getItem("userId");

const data = await getCitizenGrievances(citizenId);

            setComplaints(data);

        } catch (err) {
            console.error(err);
        }
    };

    const total = complaints.length;

    const open = complaints.filter(
        c => c.status === "OPEN"
    ).length;

    const progress = complaints.filter(
        c => c.status === "IN_PROGRESS"
    ).length;

    const resolved = complaints.filter(
        c => c.status === "RESOLVED"
    ).length;

    return (
        <>
            <Sidebar />

            <Box
                sx={{
                    ml: "270px",
                    p: 4,
                    background: "#F4F6F9",
                    minHeight: "100vh",
                }}
            >

                <Header />

                <Typography
                    variant="h4"
                    fontWeight="bold"
                    mb={4}
                >
                    📋 My Complaints
                </Typography>

                <Grid container spacing={3} mb={4}>

                    <Grid item xs={12} md={3}>
                        <Card sx={{ borderRadius: 3 }}>
                            <CardContent>
                                <AssignmentIcon
                                    color="primary"
                                    sx={{ fontSize: 40 }}
                                />

                                <Typography mt={1}>
                                    Total Complaints
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                >
                                    {total}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Card sx={{ borderRadius: 3 }}>
                            <CardContent>
                                <PendingActionsIcon
                                    color="warning"
                                    sx={{ fontSize: 40 }}
                                />

                                <Typography mt={1}>
                                    Open
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                >
                                    {open}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Card sx={{ borderRadius: 3 }}>
                            <CardContent>
                                <AutorenewIcon
                                    color="info"
                                    sx={{ fontSize: 40 }}
                                />

                                <Typography mt={1}>
                                    In Progress
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                >
                                    {progress}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Card sx={{ borderRadius: 3 }}>
                            <CardContent>
                                <CheckCircleIcon
                                    color="success"
                                    sx={{ fontSize: 40 }}
                                />

                                <Typography mt={1}>
                                    Resolved
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                >
                                    {resolved}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>

                <Grid container spacing={3}>

                    {complaints.length === 0 ? (

                        <Grid item xs={12}>
                            <Card sx={{ borderRadius: 3 }}>
                                <CardContent>

                                    <Typography
                                        align="center"
                                        variant="h6"
                                    >
                                        No complaints found.
                                    </Typography>

                                </CardContent>
                            </Card>
                        </Grid>

                    ) : (

                        complaints.map((complaint) => (

                            <Grid
                                item
                                xs={12}
                                md={6}
                                key={complaint.id}
                            >

                                <Card
                                    elevation={5}
                                    sx={{
                                        borderRadius: 4,
                                        transition: ".3s",
                                        "&:hover": {
                                            transform: "translateY(-5px)"
                                        }
                                    }}
                                >

                                    <CardContent>

                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                        >
                                            {complaint.title}
                                        </Typography>

                                        <Divider sx={{ my: 2 }} />

                                        <Typography sx={{ mb: 1 }}>
                                            <ApartmentIcon
                                                sx={{
                                                    mr: 1,
                                                    verticalAlign: "middle"
                                                }}
                                            />

                                            <b>Department :</b> {complaint.department}
                                        </Typography>

                                        <Typography sx={{ mb: 1 }}>
                                            <CategoryIcon
                                                sx={{
                                                    mr: 1,
                                                    verticalAlign: "middle"
                                                }}
                                            />

                                            <b>Complaint Type :</b> {complaint.category}
                                        </Typography>

                                        <Typography sx={{ mb: 2 }}>
                                            <DescriptionIcon
                                                sx={{
                                                    mr: 1,
                                                    verticalAlign: "top"
                                                }}
                                            />

                                            <b>Description :</b><br />
                                            {complaint.description}
                                        </Typography>

                                        <Grid container spacing={2}>

                                            <Grid item>

                                                <Chip
                                                    label={complaint.status}
                                                    color={
                                                        complaint.status === "RESOLVED"
                                                            ? "success"
                                                            : complaint.status === "IN_PROGRESS"
                                                            ? "info"
                                                            : "warning"
                                                    }
                                                />

                                            </Grid>

                                            <Grid item>

                                                <Chip
                                                    label={complaint.priority}
                                                    color={
                                                        complaint.priority === "HIGH"
                                                            ? "error"
                                                            : complaint.priority === "MEDIUM"
                                                            ? "warning"
                                                            : "success"
                                                    }
                                                />

                                            </Grid>

                                        </Grid>

                                        <Divider sx={{ my: 2 }} />

                                        <Typography sx={{ mb: 1 }}>
                                            <PersonIcon
                                                sx={{
                                                    mr: 1,
                                                    verticalAlign: "middle"
                                                }}
                                            />

                                            <b>Assigned Officer :</b>{" "}
                                            {complaint.assignedOfficer || "Not Assigned"}
                                        </Typography>

                                        <Typography>
                                            <CommentIcon
                                                sx={{
                                                    mr: 1,
                                                    verticalAlign: "middle"
                                                }}
                                            />

                                            <b>Remarks :</b>{" "}
                                            {complaint.remarks || "No remarks yet"}
                                        </Typography>

                                    </CardContent>

                                </Card>

                            </Grid>

                        ))

                    )}

                </Grid>

            </Box>

        </>
    );
}

export default TrackComplaint;
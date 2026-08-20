import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Alert,
} from "@mui/material";
import api from "../../api/axios";

function Reports() {

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {

        try {

            const response = await api.get("/reports");
            setReports(response.data);

        } catch (err) {

            console.error(err);
            setError("Failed to load reports.");

        } finally {

            setLoading(false);

        }

    };

    if (loading)
        return (
            <div style={{ textAlign: "center", marginTop: 50 }}>
                <CircularProgress />
            </div>
        );

    if (error)
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );

    return (

        <Container maxWidth="xl" sx={{ mt: 4 }}>

            <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
            >
                Welfare Reports
            </Typography>

            <Grid container spacing={3}>

                {reports.map((report) => (

                    <Grid item xs={12} md={6} lg={4} key={report.schemeId}>

                        <Card elevation={4}>

                            <CardContent>

                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                >
                                    {report.schemeName}
                                </Typography>

                                <Typography sx={{ mt: 2 }}>
                                    Applications :
                                    {" "}
                                    {report.totalApplications}
                                </Typography>

                                <Typography>
                                    Approved :
                                    {" "}
                                    {report.approvedApplications}
                                </Typography>

                                <Typography>
                                    Pending :
                                    {" "}
                                    {report.pendingApplications}
                                </Typography>

                                <Typography>
                                    Rejected :
                                    {" "}
                                    {report.rejectedApplications}
                                </Typography>

                                <Typography>
                                    Beneficiaries :
                                    {" "}
                                    {report.totalBeneficiaries}
                                </Typography>

                                <Typography sx={{ mt: 2 }}>
                                    Allocated Budget :
                                    ₹{report.allocatedBudget}
                                </Typography>

                                <Typography>
                                    Utilized Budget :
                                    ₹{report.utilizedBudget}
                                </Typography>

                                <Typography>
                                    Remaining Budget :
                                    ₹{report.remainingBudget}
                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>

                ))}

            </Grid>

        </Container>

    );

}

export default Reports;
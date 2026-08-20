import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Alert,
} from "@mui/material";
import api from "../../api/axios";

function Beneficiaries() {

    const [beneficiaries, setBeneficiaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadBeneficiaries();
    }, []);

    const loadBeneficiaries = async () => {

        try {

            const response =
                await api.get("/beneficiaries");

            setBeneficiaries(response.data);

        } catch (err) {

            console.error(err);
            setError("Failed to load beneficiaries.");

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

        <Container maxWidth="lg" sx={{ mt: 4 }}>

            <Typography
                variant="h4"
                gutterBottom
                fontWeight="bold"
            >
                Beneficiaries
            </Typography>

            <Grid container spacing={3}>

                {beneficiaries.map((b) => (

                    <Grid item xs={12} md={6} key={b.id}>

                        <Card elevation={3}>

                            <CardContent>

                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                >
                                    {b.fullName}
                                </Typography>

                                <Typography>
                                    Scheme :
                                    {" "}
                                    {b.schemeName}
                                </Typography>

                                <Typography>
                                    District :
                                    {" "}
                                    {b.district}
                                </Typography>

                                <Typography>
                                    Occupation :
                                    {" "}
                                    {b.occupation}
                                </Typography>

                                <Typography>
                                    Annual Income :
                                    ₹{b.annualIncome}
                                </Typography>

                                <Typography>
                                    Benefit :
                                    ₹{b.benefitAmount}
                                </Typography>

                                <Chip
                                    sx={{ mt: 2 }}
                                    color={
                                        b.benefitIssued
                                            ? "success"
                                            : "warning"
                                    }
                                    label={
                                        b.benefitIssued
                                            ? "Issued"
                                            : "Pending"
                                    }
                                />

                            </CardContent>

                        </Card>

                    </Grid>

                ))}

            </Grid>

        </Container>

    );

}

export default Beneficiaries;
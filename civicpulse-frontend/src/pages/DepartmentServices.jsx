import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    CircularProgress,
    Alert,
    Divider,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SettingsIcon from "@mui/icons-material/Settings";
import BusinessIcon from "@mui/icons-material/Business";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import { getDepartments } from "../services/departmentService";
import { getAllServices } from "../services/governmentService";

function DepartmentServices() {

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const departmentId =
        searchParams.get("departmentId");

    const [department, setDepartment] =
        useState(null);

    const [services, setServices] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        loadData();

    }, [departmentId]);

    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                departmentData,
                serviceData
            ] = await Promise.all([
                getDepartments(),
                getAllServices()
            ]);

            const selectedDepartment =
                departmentData.find(
                    (d) =>
                        Number(d.id) ===
                        Number(departmentId)
                );

            if (!selectedDepartment) {

                setError(
                    "Department not found."
                );

                return;
            }

            setDepartment(
                selectedDepartment
            );

            const departmentServices =
                serviceData.filter(
                    (service) =>
                        Number(service.departmentId) ===
                        Number(departmentId)
                );

            setServices(
                departmentServices
            );

        } catch (error) {

            console.error(
                "Failed to load department services:",
                error
            );

            setError(
                "Failed to load department services."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <Box
            sx={{
                ml: "270px",
                p: 4,
                bgcolor: "#F5F7FA",
                minHeight: "100vh",
            }}
        >

            <Header />

            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() =>
                    navigate("/admin/services")
                }
                sx={{ mt: 3, mb: 2 }}
            >
                Back to Service Management
            </Button>

            {loading ? (

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 10,
                    }}
                >
                    <CircularProgress />
                </Box>

            ) : error ? (

                <Alert severity="error">
                    {error}
                </Alert>

            ) : (

                <>

                    {/* DEPARTMENT HEADER */}

                    <Card
                        sx={{
                            borderRadius: 4,
                            mb: 4,
                        }}
                    >

                        <CardContent>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >

                                <Box
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 3,
                                        bgcolor:
                                            "primary.light",
                                        display: "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                    }}
                                >

                                    <BusinessIcon
                                        color="primary"
                                        fontSize="large"
                                    />

                                </Box>

                                <Box>

                                    <Typography
                                        variant="h4"
                                        fontWeight="bold"
                                    >
                                        {department?.name}
                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                    >
                                        Government Services
                                    </Typography>

                                </Box>

                            </Box>

                            <Divider
                                sx={{ my: 3 }}
                            />

                            <Typography
                                variant="h6"
                                fontWeight="bold"
                            >
                                Available Services
                            </Typography>

                            <Typography
                                color="text.secondary"
                            >
                                {services.length} service
                                {services.length !== 1
                                    ? "s"
                                    : ""}{" "}
                                available in this
                                department
                            </Typography>

                        </CardContent>

                    </Card>


                    {/* SERVICES */}

                    {services.length === 0 ? (

                        <Card
                            sx={{
                                borderRadius: 4,
                                p: 5,
                                textAlign: "center",
                            }}
                        >

                            <Typography
                                variant="h6"
                                color="text.secondary"
                            >
                                No services have been
                                added to this department
                                yet.
                            </Typography>

                        </Card>

                    ) : (

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fill, minmax(320px, 1fr))",
                                gap: 3,
                            }}
                        >

                            {services.map(
                                (service) => (

                                    <Card
                                        key={service.id}
                                        sx={{
                                            borderRadius: 4,
                                            height: "100%",
                                            display:
                                                "flex",
                                            flexDirection:
                                                "column",
                                            transition:
                                                "0.2s",

                                            "&:hover": {
                                                transform:
                                                    "translateY(-4px)",
                                                boxShadow: 5,
                                            },
                                        }}
                                    >

                                        <CardContent
                                            sx={{
                                                p: 3,
                                                flex: 1,
                                                display:
                                                    "flex",
                                                flexDirection:
                                                    "column",
                                            }}
                                        >

                                            <Box
                                                sx={{
                                                    display:
                                                        "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems:
                                                        "flex-start",
                                                }}
                                            >

                                                <Typography
                                                    variant="h6"
                                                    fontWeight="bold"
                                                >
                                                    {service.name}
                                                </Typography>

                                                <Chip
                                                    label={
                                                        service.serviceType
                                                    }
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />

                                            </Box>

                                            <Typography
                                                color="text.secondary"
                                                sx={{
                                                    mt: 2,
                                                    flex: 1,
                                                }}
                                            >
                                                {service.description ||
                                                    "No description available."}
                                            </Typography>

                                            {service.eligibility && (

                                                <Box
                                                    sx={{
                                                        mt: 2,
                                                    }}
                                                >

                                                    <Typography
                                                        variant="subtitle2"
                                                        fontWeight="bold"
                                                    >
                                                        Eligibility
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        {
                                                            service.eligibility
                                                        }
                                                    </Typography>

                                                </Box>

                                            )}

                                            

                                        </CardContent>

                                    </Card>

                                )
                            )}

                        </Box>

                    )}

                </>

            )}

        </Box>
    );
}

export default DepartmentServices;
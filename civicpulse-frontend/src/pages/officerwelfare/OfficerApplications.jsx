import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Chip,
    Button,
    CircularProgress,
    Alert,
    Stack,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

import {
    getApplicationsByDepartment,
} from "../../api/welfareApi";

function OfficerApplications() {

    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("ALL");

    const [eligibilityFilter, setEligibilityFilter] = useState("ALL");

    useEffect(() => {

        loadApplications();

    }, []);

    const loadApplications = async () => {

    try {

        setLoading(true);
        setError("");

        const departmentName =
            localStorage.getItem("departmentName");

        if (!departmentName) {
            setError("Officer department not found.");
            return;
        }

        console.log(
            "Loading applications for department:",
            departmentName
        );

        const response =
            await getApplicationsByDepartment(departmentName);

        setApplications(response.data);

    } catch (err) {

        console.error(err);

        setError(
            err.response?.data?.message ||
            "Unable to load department applications."
        );

    } finally {

        setLoading(false);

    }

};

    const filteredApplications = useMemo(() => {

        return applications.filter((app) => {

            const keyword = search.toLowerCase();

            const matchesSearch =
                (app.fullName || "N/A")
                    .toLowerCase()
                    .includes(keyword) ||

                app.schemeName
                    ?.toLowerCase()
                    .includes(keyword) ||

                app.district
                    ?.toLowerCase()
                    .includes(keyword);

            const matchesStatus =
                statusFilter === "ALL"
                    ? true
                    : app.status === statusFilter;

            const matchesEligibility =
                eligibilityFilter === "ALL"
                    ? true
                    : app.eligibilityStatus === eligibilityFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesEligibility
            );

        });

    }, [
        applications,
        search,
        statusFilter,
        eligibilityFilter,
    ]);

    const statusColor = (status) => {

        switch (status) {

            case "APPROVED":
                return "success";

            case "REJECTED":
                return "error";

            case "SUBMITTED":
case "UNDER_REVIEW":
    return "warning";

            default:
                return "default";

        }

    };

    if (loading) {

        return (

            <>
                <Sidebar />

                <Box
                    sx={{
                        ml: "270px",
                        p: 4,
                    }}
                >

                    <Header />

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 10,
                        }}
                    >

                        <CircularProgress />

                    </Box>

                </Box>

            </>

        );

    }

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
                    Welfare Applications
                </Typography>

                {
                    error &&
                    <Alert severity="error">
                        {error}
                    </Alert>
                }

                <Paper
                    sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 3,
                    }}
                >

                    <Stack
                        direction={{
                            xs: "column",
                            md: "row",
                        }}
                        spacing={2}
                    >

                        <TextField
                            fullWidth
                            label="Search"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            InputProps={{
                                startAdornment:
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>,
                            }}
                        />

                        <FormControl sx={{ minWidth: 180 }}>

                            <InputLabel>
                                Status
                            </InputLabel>

                            <Select
                                value={statusFilter}
                                label="Status"
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                            >

                                <MenuItem value="ALL">
                                    All
                                </MenuItem>

                                <MenuItem value="SUBMITTED">
    Submitted
</MenuItem>

<MenuItem value="UNDER_REVIEW">
    Under Review
</MenuItem>

                                <MenuItem value="APPROVED">
                                    Approved
                                </MenuItem>

                                <MenuItem value="REJECTED">
                                    Rejected
                                </MenuItem>

                            </Select>

                        </FormControl>

                        <FormControl sx={{ minWidth: 200 }}>

                            <InputLabel>
                                Eligibility
                            </InputLabel>

                            <Select
                                value={eligibilityFilter}
                                label="Eligibility"
                                onChange={(e) =>
                                    setEligibilityFilter(e.target.value)
                                }
                            >

                                <MenuItem value="ALL">
                                    All
                                </MenuItem>

                                <MenuItem value="ELIGIBLE">
                                    Eligible
                                </MenuItem>

                                <MenuItem value="NOT_ELIGIBLE">
                                    Not Eligible
                                </MenuItem>

                            </Select>

                        </FormControl>

                    </Stack>

                </Paper>

                <TableContainer
                    component={Paper}
                    sx={{
                        borderRadius: 3,
                    }}
                >

                    <Table>

                        <TableHead>

                            <TableRow>

                                <TableCell>
                                    ID
                                </TableCell>

                                <TableCell>
                                    Citizen
                                </TableCell>

                                <TableCell>
                                    Scheme
                                </TableCell>

                                <TableCell>
                                    District
                                </TableCell>

                                <TableCell>
                                    Income
                                </TableCell>

                                <TableCell>
                                    Status
                                </TableCell>

                                <TableCell>
                                    Eligibility
                                </TableCell>

                                <TableCell align="center">
                                    Action
                                </TableCell>

                            </TableRow>

                        </TableHead>

                        <TableBody>
                                                        {
                                filteredApplications.length === 0 ? (

                                    <TableRow>

                                        <TableCell
                                            colSpan={8}
                                            align="center"
                                        >

                                            <Typography
                                                sx={{ py: 5 }}
                                            >
                                                No applications found.
                                            </Typography>

                                        </TableCell>

                                    </TableRow>

                                ) : (

                                    filteredApplications.map((app) => (

                                        <TableRow
                                            key={app.id}
                                            hover
                                        >

                                            <TableCell>
                                                {app.id}
                                            </TableCell>

                                            <TableCell>
                                                {app.fullName || "N/A"}
                                            </TableCell>

                                            <TableCell>
                                                {app.schemeName}
                                            </TableCell>

                                            <TableCell>
                                                {app.district}
                                            </TableCell>

                                            <TableCell>

                                                ₹
                                                {app.annualIncome?.toLocaleString()}

                                            </TableCell>

                                            <TableCell>

                                                <Chip
                                                    label={app.status}
                                                    color={statusColor(
                                                        app.status
                                                    )}
                                                />

                                            </TableCell>

                                            <TableCell>

                                                <Chip
                                                    label={
                                                        app.eligibilityStatus
                                                    }
                                                    color={
                                                        app.eligibilityStatus ===
                                                        "ELIGIBLE"
                                                            ? "success"
                                                            : "error"
                                                    }
                                                    variant="outlined"
                                                />

                                            </TableCell>

                                            <TableCell
                                                align="center"
                                            >

                                                <Button
                                                    variant="contained"
                                                    startIcon={
                                                        <VisibilityIcon />
                                                    }
                                                    onClick={() =>
                                                        navigate(
                                                            `/officer/welfare/${app.id}`
                                                        )
                                                    }
                                                >
                                                    View
                                                </Button>

                                            </TableCell>

                                        </TableRow>

                                    ))

                                )
                            }

                        </TableBody>

                    </Table>

                </TableContainer>

            </Box>

        </>

    );

}

export default OfficerApplications;
                      
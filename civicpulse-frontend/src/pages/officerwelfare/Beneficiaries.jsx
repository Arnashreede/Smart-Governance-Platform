import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    InputAdornment,
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
import PaidIcon from "@mui/icons-material/Paid";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

import {
    getBeneficiaries,
    issueBenefit,
} from "../../api/beneficiaryApi";

function Beneficiaries() {

    const [beneficiaries, setBeneficiaries] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    useEffect(() => {
        loadBeneficiaries();
    }, []);

    const loadBeneficiaries = async () => {

        try {

            setLoading(true);

            const response = await getBeneficiaries();

            setBeneficiaries(response.data);

        } catch (err) {

            console.error(err);

            setError("Unable to load beneficiaries.");

        } finally {

            setLoading(false);

        }

    };

    const handleIssueBenefit = async (id) => {

        try {

            await issueBenefit(id);

            loadBeneficiaries();

        } catch (err) {

            console.error(err);

            alert("Failed to issue benefit.");

        }

    };

    const filteredBeneficiaries = useMemo(() => {

        return beneficiaries.filter((beneficiary) => {

            const keyword = search.toLowerCase();

            return (

                (beneficiary.fullName || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                beneficiary.district
                    ?.toLowerCase()
                    .includes(keyword)

                ||

                beneficiary.occupation
                    ?.toLowerCase()
                    .includes(keyword)

            );

        });

    }, [beneficiaries, search]);

    if (loading) {

        return (

            <>
                <Sidebar />

                <Box sx={{ ml: "270px", p: 4 }}>

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
                    Welfare Beneficiaries
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

                    <Stack direction="row">

                        <TextField
                            fullWidth
                            label="Search Beneficiary"
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

                    </Stack>

                </Paper>

                <TableContainer component={Paper}>

                    <Table>

                        <TableHead>

                            <TableRow>

                                <TableCell>ID</TableCell>

                                <TableCell>Name</TableCell>

                                <TableCell>District</TableCell>

                                <TableCell>Occupation</TableCell>

                                <TableCell>Income</TableCell>

                                <TableCell>Benefit Amount</TableCell>

                                <TableCell>Status</TableCell>

                                <TableCell align="center">
                                    Action
                                </TableCell>

                            </TableRow>

                        </TableHead>

                        <TableBody>
                                                        {
                                filteredBeneficiaries.length === 0 ? (

                                    <TableRow>

                                        <TableCell
                                            colSpan={8}
                                            align="center"
                                        >

                                            <Typography sx={{ py: 5 }}>
                                                No beneficiaries found.
                                            </Typography>

                                        </TableCell>

                                    </TableRow>

                                ) : (

                                    filteredBeneficiaries.map((beneficiary) => (

                                        <TableRow
                                            key={beneficiary.id}
                                            hover
                                        >

                                            <TableCell>
                                                {beneficiary.id}
                                            </TableCell>

                                            <TableCell>
                                                {beneficiary.fullName || "N/A"}
                                            </TableCell>

                                            <TableCell>
                                                {beneficiary.district}
                                            </TableCell>

                                            <TableCell>
                                                {beneficiary.occupation || "N/A"}
                                            </TableCell>

                                            <TableCell>

                                                ₹
                                                {beneficiary.annualIncome?.toLocaleString()}

                                            </TableCell>

                                            <TableCell>

                                                ₹
                                                {beneficiary.benefitAmount?.toLocaleString()}

                                            </TableCell>

                                            <TableCell>

                                                <Chip
                                                    label={
                                                        beneficiary.benefitIssued
                                                            ? "Issued"
                                                            : "Pending"
                                                    }
                                                    color={
                                                        beneficiary.benefitIssued
                                                            ? "success"
                                                            : "warning"
                                                    }
                                                />

                                            </TableCell>

                                            <TableCell align="center">

                                                {
                                                    beneficiary.benefitIssued ? (

                                                        <Button
                                                            variant="outlined"
                                                            disabled
                                                        >
                                                            Issued
                                                        </Button>

                                                    ) : (

                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            startIcon={<PaidIcon />}
                                                            onClick={() =>
                                                                handleIssueBenefit(
                                                                    beneficiary.id
                                                                )
                                                            }
                                                        >
                                                            Issue
                                                        </Button>

                                                    )
                                                }

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

export default Beneficiaries;
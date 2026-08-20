import { useEffect, useState } from "react";

import {
    Box,
    Paper,
    Typography,
    Button,
    Stack,
    Divider,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
} from "@mui/material";

import {
    ArrowBack,
    Print,
    Assessment,
} from "@mui/icons-material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getBudgetById,
    getDistributions,
} from "../services/budgetApi";


function BudgetReport() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [budget, setBudget] = useState(null);

    const [transactions, setTransactions] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        loadReport();

    }, [id]);


    const loadReport = async () => {

        try {

            setLoading(true);

            setError("");

            const budgetData =
                await getBudgetById(id);

            const distributionData =
                await getDistributions(id);

            setBudget(budgetData);

            setTransactions(
                Array.isArray(distributionData)
                    ? distributionData
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load report:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to generate budget report."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // CALCULATIONS
    // =====================================================

    const totalBudget =
        Number(budget?.totalBudget || 0);

    const allocatedAmount =
        Number(budget?.allocatedAmount || 0);

    const spentAmount =
        Number(budget?.spentAmount || 0);

    const remainingAmount =
        Number(budget?.remainingAmount || 0);


    const utilization =
        totalBudget > 0
            ? (
                  (spentAmount /
                      totalBudget) *
                  100
              ).toFixed(1)
            : "0.0";


    const totalDistributed =
        transactions.reduce(
            (sum, transaction) =>
                sum +
                Number(
                    transaction?.amount || 0
                ),
            0
        );


    const schemeCount =
        new Set(
            transactions
                .map(
                    (transaction) =>
                        transaction?.schemeId
                )
                .filter(
                    (schemeId) =>
                        schemeId !== null &&
                        schemeId !== undefined
                )
        ).size;


    const formatCurrency = (amount) =>
        Number(amount || 0).toLocaleString(
            "en-IN"
        );


    // =====================================================
    // PRINT
    // =====================================================

    const handlePrint = () => {

        window.print();

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: "70vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >

                <Stack
                    alignItems="center"
                    spacing={2}
                >

                    <CircularProgress />

                    <Typography
                        color="text.secondary"
                    >
                        Preparing report...
                    </Typography>

                </Stack>

            </Box>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <Box
                sx={{
                    p: 4,
                }}
            >

                <Alert severity="error">
                    {error}
                </Alert>

                <Button
                    startIcon={<ArrowBack />}
                    sx={{ mt: 2 }}
                    onClick={() =>
                        navigate(
                            `/budgets/${id}`
                        )
                    }
                >
                    Back to Budget
                </Button>

            </Box>

        );

    }


    // =====================================================
    // REPORT
    // =====================================================

    return (

        <Box
            className="budget-report-page"
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f5f7fb",
                px: {
                    xs: 2,
                    md: 4,
                },
                py: {
                    xs: 2,
                    md: 4,
                },
            }}
        >

            <Paper
                elevation={0}
                sx={{
                    maxWidth: 1200,
                    mx: "auto",
                    borderRadius: 3,
                    border:
                        "1px solid #e1e5eb",
                    overflow: "hidden",
                }}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <Box
                    sx={{
                        px: {
                            xs: 2.5,
                            md: 4,
                        },
                        py: 3,
                    }}
                >

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        justifyContent="space-between"
                        alignItems={{
                            xs: "flex-start",
                            sm: "center",
                        }}
                        spacing={2}
                    >

                        <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                        >

                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    backgroundColor:
                                        "#e8f1ff",
                                }}
                            >

                                <Assessment
                                    sx={{
                                        color:
                                            "primary.main",
                                        fontSize: 28,
                                    }}
                                />

                            </Box>


                            <Box>

                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                >
                                    Budget Report
                                </Typography>

                                <Typography
                                    color="text.secondary"
                                >
                                    Government Budget
                                    Financial Report
                                </Typography>

                            </Box>

                        </Stack>


                        <Stack
                            direction="row"
                            spacing={1}
                            className="report-actions"
                        >

                            <Button
                                variant="outlined"
                                startIcon={
                                    <ArrowBack />
                                }
                                onClick={() =>
                                    navigate(
                                        `/budgets/${id}`
                                    )
                                }
                            >
                                Back
                            </Button>


                            <Button
                                variant="contained"
                                startIcon={
                                    <Print />
                                }
                                onClick={
                                    handlePrint
                                }
                            >
                                Print Report
                            </Button>

                        </Stack>

                    </Stack>

                </Box>


                <Divider />


                {/* =================================================
                    REPORT INFORMATION
                ================================================= */}

                <Box
                    sx={{
                        px: {
                            xs: 2.5,
                            md: 4,
                        },
                        py: 3,
                    }}
                >

                    <Typography
                        variant="h6"
                        fontWeight={700}
                        gutterBottom
                    >
                        Budget Information
                    </Typography>


                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(3, 1fr)",
                            },
                            gap: 2,
                        }}
                    >

                        <Paper
                            variant="outlined"
                            sx={{ p: 2 }}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Department
                            </Typography>

                            <Typography
                                fontWeight={700}
                            >
                                {budget?.department ||
                                    "-"}
                            </Typography>

                        </Paper>


                        <Paper
                            variant="outlined"
                            sx={{ p: 2 }}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Financial Year
                            </Typography>

                            <Typography
                                fontWeight={700}
                            >
                                {budget?.financialYear ||
                                    "-"}
                            </Typography>

                        </Paper>


                        <Paper
                            variant="outlined"
                            sx={{ p: 2 }}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Budget ID
                            </Typography>

                            <Typography
                                fontWeight={700}
                            >
                                #{budget?.id || id}
                            </Typography>

                        </Paper>

                    </Box>

                </Box>


                <Divider />


                {/* =================================================
                    FINANCIAL SUMMARY
                ================================================= */}

                <Box
                    sx={{
                        px: {
                            xs: 2.5,
                            md: 4,
                        },
                        py: 3,
                    }}
                >

                    <Typography
                        variant="h6"
                        fontWeight={700}
                        gutterBottom
                    >
                        Financial Summary
                    </Typography>


                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, 1fr)",
                                md: "repeat(4, 1fr)",
                            },
                            gap: 2,
                        }}
                    >

                        <Paper
                            variant="outlined"
                            sx={{ p: 2 }}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Total Budget
                            </Typography>

                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                ₹{" "}
                                {formatCurrency(
                                    totalBudget
                                )}
                            </Typography>

                        </Paper>


                        <Paper
                            variant="outlined"
                            sx={{ p: 2 }}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Allocated
                            </Typography>

                            <Typography
                                variant="h6"
                                fontWeight={700}
                                color="primary"
                            >
                                ₹{" "}
                                {formatCurrency(
                                    allocatedAmount
                                )}
                            </Typography>

                        </Paper>


                        <Paper
                            variant="outlined"
                            sx={{ p: 2 }}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Spent
                            </Typography>

                            <Typography
                                variant="h6"
                                fontWeight={700}
                                color="error.main"
                            >
                                ₹{" "}
                                {formatCurrency(
                                    spentAmount
                                )}
                            </Typography>

                        </Paper>


                        <Paper
                            variant="outlined"
                            sx={{ p: 2 }}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Remaining
                            </Typography>

                            <Typography
                                variant="h6"
                                fontWeight={700}
                                color="success.main"
                            >
                                ₹{" "}
                                {formatCurrency(
                                    remainingAmount
                                )}
                            </Typography>

                        </Paper>

                    </Box>

                </Box>


                <Divider />


                {/* =================================================
                    UTILIZATION
                ================================================= */}

                <Box
                    sx={{
                        px: {
                            xs: 2.5,
                            md: 4,
                        },
                        py: 3,
                    }}
                >

                    <Typography
                        variant="h6"
                        fontWeight={700}
                        gutterBottom
                    >
                        Budget Utilization
                    </Typography>


                    <Paper
                        variant="outlined"
                        sx={{
                            p: 3,
                            borderRadius: 2,
                        }}
                    >

                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            justifyContent="space-between"
                            spacing={2}
                        >

                            <Box>

                                <Typography
                                    color="text.secondary"
                                >
                                    Utilization Rate
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    color="primary"
                                >
                                    {utilization}%
                                </Typography>

                            </Box>


                            <Box>

                                <Typography
                                    color="text.secondary"
                                >
                                    Distributed Funds
                                </Typography>

                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                >
                                    ₹{" "}
                                    {formatCurrency(
                                        totalDistributed
                                    )}
                                </Typography>

                            </Box>


                            <Box>

                                <Typography
                                    color="text.secondary"
                                >
                                    Schemes
                                </Typography>

                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                >
                                    {schemeCount}
                                </Typography>

                            </Box>

                        </Stack>

                    </Paper>

                </Box>


                <Divider />


                {/* =================================================
                    DISTRIBUTION DETAILS
                ================================================= */}

                <Box
                    sx={{
                        px: {
                            xs: 2.5,
                            md: 4,
                        },
                        py: 3,
                    }}
                >

                    <Typography
                        variant="h6"
                        fontWeight={700}
                        gutterBottom
                    >
                        Fund Distribution Details
                    </Typography>


                    {transactions.length === 0 ? (

                        <Paper
                            variant="outlined"
                            sx={{
                                p: 4,
                                textAlign: "center",
                            }}
                        >

                            <Typography
                                color="text.secondary"
                            >
                                No fund distribution
                                records are available
                                for this budget.
                            </Typography>

                        </Paper>

                    ) : (

                        <TableContainer
                            component={Paper}
                            variant="outlined"
                        >

                            <Table>

                                <TableHead>

                                    <TableRow
                                        sx={{
                                            backgroundColor:
                                                "#f8fafc",
                                        }}
                                    >

                                        <TableCell>
                                            <strong>
                                                ID
                                            </strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>
                                                Scheme
                                            </strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>
                                                Beneficiary
                                            </strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>
                                                Amount
                                            </strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>
                                                Payment Mode
                                            </strong>
                                        </TableCell>

                                    </TableRow>

                                </TableHead>


                                <TableBody>

                                    {transactions.map(
                                        (transaction) => (

                                            <TableRow
                                                key={
                                                    transaction.id
                                                }
                                            >

                                                <TableCell>
                                                    #
                                                    {
                                                        transaction.id
                                                    }
                                                </TableCell>


                                                <TableCell>

                                                    <Typography
                                                        fontWeight={600}
                                                    >
                                                        {
                                                            transaction.schemeName ||
                                                            "-"
                                                        }
                                                    </Typography>

                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        Scheme ID:{" "}
                                                        {
                                                            transaction.schemeId ??
                                                            "-"
                                                        }
                                                    </Typography>

                                                </TableCell>


                                                <TableCell>

                                                    {transaction.beneficiaryName ||
                                                        "Not provided"}

                                                </TableCell>


                                                <TableCell>

                                                    <Typography
                                                        fontWeight={700}
                                                        color="primary"
                                                    >
                                                        ₹{" "}
                                                        {formatCurrency(
                                                            transaction.amount
                                                        )}
                                                    </Typography>

                                                </TableCell>


                                                <TableCell>

                                                    <Chip
                                                        label={
                                                            transaction.paymentMode ||
                                                            "Not specified"
                                                        }
                                                        size="small"
                                                        variant="outlined"
                                                    />

                                                </TableCell>

                                            </TableRow>

                                        )
                                    )}

                                </TableBody>

                            </Table>

                        </TableContainer>

                    )}

                </Box>


                <Divider />


                {/* =================================================
                    REPORT FOOTER
                ================================================= */}

                <Box
                    sx={{
                        px: {
                            xs: 2.5,
                            md: 4,
                        },
                        py: 2.5,
                    }}
                >

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        This report is generated from
                        the current budget and fund
                        distribution records available
                        in Smart Goverance Platform.
                    </Typography>

                </Box>

            </Paper>


            {/* =====================================================
                PRINT STYLES
            ===================================================== */}

            <style>
                {`
                    @media print {

                        body {
                            background: white !important;
                        }

                        .budget-report-page {
                            background: white !important;
                            padding: 0 !important;
                        }

                        .report-actions {
                            display: none !important;
                        }

                        .budget-report-page > div {
                            border: none !important;
                            box-shadow: none !important;
                            max-width: none !important;
                        }
                    }
                `}
            </style>

        </Box>

    );

}

export default BudgetReport;
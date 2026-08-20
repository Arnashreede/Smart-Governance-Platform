import { useEffect, useState } from "react";

import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    TextField,
    Button,
    Stack,
    CircularProgress,
    Alert,
} from "@mui/material";

import {
    ArrowBack,
    Search,
    ReceiptLong,
} from "@mui/icons-material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getDistributions,
    getBudgetById,
} from "../services/budgetApi";


function TransactionHistory() {

    const navigate = useNavigate();

    const { id } = useParams();


    // =========================================================
    // STATE
    // =========================================================

    const [budget, setBudget] = useState(null);

    const [transactions, setTransactions] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =========================================================
    // LOAD DATA
    // =========================================================

    useEffect(() => {

        loadData();

    }, [id]);


    const loadData = async () => {

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
                "Failed to load transaction history:",
                err
            );


            setError(
                err?.response?.data?.message ||
                "Failed to load transaction history."
            );


            setTransactions([]);

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // SEARCH
    // =========================================================

    const filteredTransactions =
        transactions.filter((item) => {

            const beneficiaryName =
                item?.beneficiaryName || "";

            const schemeName =
                item?.schemeName || "";


            const searchText =
                search.toLowerCase();


            return (
                beneficiaryName
                    .toLowerCase()
                    .includes(searchText) ||

                schemeName
                    .toLowerCase()
                    .includes(searchText)
            );

        });


    // =========================================================
    // SUMMARY
    // =========================================================

    const totalAmount =
        transactions.reduce(
            (sum, transaction) =>
                sum +
                Number(
                    transaction?.amount || 0
                ),
            0
        );


    const totalSchemes =
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


    const transactionsWithBeneficiary =
        transactions.filter(
            (transaction) =>
                transaction?.beneficiaryName
        ).length;


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: "70vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f5f7fb",
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
                        Loading transaction history...
                    </Typography>

                </Stack>

            </Box>

        );

    }


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f5f7fb",
                px: {
                    xs: 2,
                    sm: 3,
                    md: 4,
                },
                py: {
                    xs: 2,
                    md: 3,
                },
            }}
        >

            <Paper
                elevation={0}
                sx={{
                    maxWidth: 1250,
                    mx: "auto",
                    borderRadius: 3,
                    border:
                        "1px solid #e1e5eb",
                    overflow: "hidden",
                    backgroundColor: "#fff",
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
                        py: 2.5,
                        borderBottom:
                            "1px solid #e1e5eb",
                    }}
                >

                    <Button
                        startIcon={
                            <ArrowBack />
                        }
                        onClick={() =>
                            navigate(
                                `/budgets/${id}`
                            )
                        }
                        sx={{
                            mb: 1.5,
                            textTransform: "none",
                            fontWeight: 600,
                        }}
                    >
                        Back to Budget
                    </Button>


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
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#e8f1ff",
                            }}
                        >

                            <ReceiptLong
                                sx={{
                                    color: "primary.main",
                                    fontSize: 28,
                                }}
                            />

                        </Box>


                        <Box>

                            <Typography
                                variant="h5"
                                fontWeight={700}
                            >
                                Transaction History
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {budget?.department ||
                                    "-"}
                                {" • "}
                                {budget?.financialYear ||
                                    "-"}
                            </Typography>

                        </Box>

                    </Stack>

                </Box>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <Alert
                        severity="error"
                        sx={{
                            mx: {
                                xs: 2.5,
                                md: 4,
                            },
                            mt: 2,
                        }}
                    >
                        {error}
                    </Alert>

                )}


                {/* =================================================
                    SEARCH
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

                    <TextField
                        fullWidth
                        label="Search Transactions"
                        placeholder="Search by beneficiary or scheme"
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        InputProps={{
                            startAdornment: (
                                <Search
                                    sx={{
                                        mr: 1,
                                        color:
                                            "text.secondary",
                                    }}
                                />
                            ),
                        }}
                    />

                </Box>


                {/* =================================================
                    TRANSACTION TABLE
                ================================================= */}

                {filteredTransactions.length === 0 ? (

                    <Box
                        sx={{
                            px: 3,
                            py: 7,
                            textAlign: "center",
                        }}
                    >

                        <ReceiptLong
                            sx={{
                                fontSize: 58,
                                color: "text.disabled",
                                mb: 1,
                            }}
                        />

                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            No Transactions Found
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mt: 0.5,
                            }}
                        >
                            {transactions.length === 0
                                ? "No fund distribution records are available for this budget."
                                : "No transactions match your search."}
                        </Typography>

                    </Box>

                ) : (

                    <TableContainer>

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

                                    <TableCell>
                                        <strong>
                                            Remarks
                                        </strong>
                                    </TableCell>

                                </TableRow>

                            </TableHead>


                            <TableBody>

                                {filteredTransactions.map(
                                    (transaction) => (

                                        <TableRow
                                            hover
                                            key={
                                                transaction.id
                                            }
                                        >

                                            {/* ID */}

                                            <TableCell>

                                                <Typography
                                                    fontWeight={600}
                                                >
                                                    #
                                                    {
                                                        transaction.id
                                                    }
                                                </Typography>

                                            </TableCell>


                                            {/* SCHEME */}

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


                                            {/* BENEFICIARY */}

                                            <TableCell>

                                                {transaction.beneficiaryName ? (

                                                    <Box>

                                                        <Typography
                                                            fontWeight={600}
                                                        >
                                                            {
                                                                transaction.beneficiaryName
                                                            }
                                                        </Typography>

                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            Citizen ID:{" "}
                                                            {
                                                                transaction.citizenId ??
                                                                "-"
                                                            }
                                                        </Typography>

                                                    </Box>

                                                ) : (

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        Not provided
                                                    </Typography>

                                                )}

                                            </TableCell>


                                            {/* AMOUNT */}

                                            <TableCell>

                                                <Typography
                                                    fontWeight={700}
                                                    color="primary"
                                                >
                                                    ₹{" "}
                                                    {Number(
                                                        transaction.amount ||
                                                        0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </Typography>

                                            </TableCell>


                                            {/* PAYMENT MODE */}

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


                                            {/* REMARKS */}

                                            <TableCell>

                                                <Typography
                                                    variant="body2"
                                                    color={
                                                        transaction.remarks
                                                            ? "text.primary"
                                                            : "text.secondary"
                                                    }
                                                >
                                                    {
                                                        transaction.remarks ||
                                                        "No remarks"
                                                    }
                                                </Typography>

                                            </TableCell>

                                        </TableRow>

                                    )
                                )}

                            </TableBody>

                        </Table>

                    </TableContainer>

                )}


                {/* =================================================
                    SUMMARY
                ================================================= */}

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(3, 1fr)",
                        },
                        gap: 2,
                        p: {
                            xs: 2.5,
                            md: 3,
                        },
                        borderTop:
                            "1px solid #e1e5eb",
                    }}
                >

                    {/* TOTAL TRANSACTIONS */}

                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2,
                            borderRadius: 2,
                        }}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Total Transactions
                        </Typography>

                        <Typography
                            variant="h5"
                            fontWeight={700}
                        >
                            {transactions.length}
                        </Typography>

                    </Paper>


                    {/* TOTAL SCHEMES */}

                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2,
                            borderRadius: 2,
                        }}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Schemes Used
                        </Typography>

                        <Typography
                            variant="h5"
                            fontWeight={700}
                        >
                            {totalSchemes}
                        </Typography>

                    </Paper>


                    {/* TOTAL AMOUNT */}

                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2,
                            borderRadius: 2,
                        }}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Total Distributed
                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight={700}
                            color="primary"
                        >
                            ₹{" "}
                            {totalAmount.toLocaleString(
                                "en-IN"
                            )}
                        </Typography>

                    </Paper>

                </Box>


                {/* =================================================
                    DATA INFORMATION
                ================================================= */}

                {transactionsWithBeneficiary === 0 &&
                    transactions.length > 0 && (

                        <Box
                            sx={{
                                px: 3,
                                pb: 3,
                            }}
                        >

                            <Alert
                                severity="info"
                            >
                                Beneficiary and payment
                                details are not available
                                in the distribution records
                                returned by the backend.
                            </Alert>

                        </Box>

                    )}

            </Paper>

        </Box>

    );

}


export default TransactionHistory;
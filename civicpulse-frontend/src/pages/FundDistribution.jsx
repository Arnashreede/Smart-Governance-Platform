import { useEffect, useState } from "react";

import {
    Box,
    Paper,
    Typography,
    TextField,
    MenuItem,
    Button,
    Stack,
    Divider,
    Alert,
    CircularProgress,
} from "@mui/material";

import {
    ArrowBack,
    Paid,
    Send,
    AccountBalanceWallet,
} from "@mui/icons-material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getBudgetById,
    distributeFunds,
} from "../services/budgetApi";


function FundDistribution() {

    const navigate = useNavigate();

    const { id } = useParams();


    // =========================================================
    // STATE
    // =========================================================

    const [budget, setBudget] = useState(null);

    const [loading, setLoading] = useState(true);

    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    const [form, setForm] = useState({

        beneficiaryId: "",

        beneficiaryName: "",

        schemeName: "",

        amount: "",

        paymentMode: "DBT",

        remarks: "",

    });


    // =========================================================
    // LOAD BUDGET
    // =========================================================

    useEffect(() => {

        if (!id) {

            setError(
                "Budget ID is missing."
            );

            setLoading(false);

            return;

        }

        loadBudget();

    }, [id]);


    const loadBudget = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await getBudgetById(id);

            console.log(
                "Budget loaded:",
                response
            );

            if (!response) {

                throw new Error(
                    "Budget information was not returned."
                );

            }

            setBudget(response);

        } catch (err) {

            console.error(
                "Failed to load budget:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load budget information."
            );

            setBudget(null);

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // HANDLE FORM
    // =========================================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

    };


    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        setSuccess("");


        if (!budget) {

            setError(
                "Budget information is not available."
            );

            return;

        }


        if (!form.beneficiaryId.trim()) {

            setError(
                "Please enter the beneficiary ID."
            );

            return;

        }


        if (!form.beneficiaryName.trim()) {

            setError(
                "Please enter the beneficiary name."
            );

            return;

        }


        if (!form.schemeName.trim()) {

            setError(
                "Please enter the welfare scheme."
            );

            return;

        }


        const amount = Number(
            form.amount
        );


        if (!amount || amount <= 0) {

            setError(
                "Please enter a valid distribution amount."
            );

            return;

        }


        const remainingAmount = Number(
            budget.remainingAmount || 0
        );


        if (amount > remainingAmount) {

            setError(
                `Distribution amount cannot exceed the remaining budget of ₹${remainingAmount.toLocaleString(
                    "en-IN"
                )}.`
            );

            return;

        }


        try {

            setSubmitting(true);

            const payload = {

                beneficiaryId:
                    form.beneficiaryId,

                beneficiaryName:
                    form.beneficiaryName,

                schemeName:
                    form.schemeName,

                amount: amount,

                paymentMode:
                    form.paymentMode,

                remarks:
                    form.remarks,

            };


            console.log(
                "Distribution payload:",
                payload
            );


            await distributeFunds(
                id,
                payload
            );


            setSuccess(
                "Funds distributed successfully."
            );


            setTimeout(() => {

                navigate(
                    `/budgets/${id}`
                );

            }, 1000);


        } catch (err) {

            console.error(
                "Fund distribution failed:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to distribute funds."
            );

        } finally {

            setSubmitting(false);

        }

    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: "70vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
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
                        Loading budget information...
                    </Typography>

                </Stack>

            </Box>

        );

    }


    // =========================================================
    // ERROR WHEN BUDGET NOT FOUND
    // =========================================================

    if (!budget) {

        return (

            <Box
                sx={{
                    minHeight: "70vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 2,
                }}
            >

                <Paper
                    elevation={0}
                    sx={{
                        maxWidth: 600,
                        width: "100%",
                        p: 4,
                        borderRadius: 3,
                        border:
                            "1px solid #e1e5eb",
                        textAlign: "center",
                    }}
                >

                    <Typography
                        variant="h5"
                        fontWeight={700}
                        mb={2}
                    >
                        Budget Not Available
                    </Typography>

                    <Alert
                        severity="error"
                        sx={{
                            mb: 3,
                            textAlign: "left",
                        }}
                    >
                        {error ||
                            "Unable to load this budget."}
                    </Alert>

                    <Stack
                        direction="row"
                        justifyContent="center"
                        spacing={1.5}
                    >

                        <Button
                            variant="outlined"
                            startIcon={
                                <ArrowBack />
                            }
                            onClick={() =>
                                navigate("/budgets")
                            }
                        >
                            Back to Budgets
                        </Button>

                        <Button
                            variant="contained"
                            onClick={loadBudget}
                        >
                            Retry
                        </Button>

                    </Stack>

                </Paper>

            </Box>

        );

    }


    // =========================================================
    // SAFE BUDGET VALUES
    // =========================================================

    const totalBudget = Number(
        budget.totalBudget || 0
    );

    const allocatedAmount = Number(
        budget.allocatedAmount || 0
    );

    const spentAmount = Number(
        budget.spentAmount || 0
    );

    const remainingAmount = Number(
        budget.remainingAmount || 0
    );


    const distributionAmount =
        Number(form.amount || 0);


    const balanceAfter =
        Math.max(
            0,
            remainingAmount -
                distributionAmount
        );


    // =========================================================
    // MAIN UI
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
                    maxWidth: 1100,
                    mx: "auto",
                    borderRadius: 3,
                    border:
                        "1px solid #e1e5eb",
                    overflow: "hidden",
                    backgroundColor:
                        "#ffffff",
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

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >

                        <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                        >

                            <Box
                                sx={{
                                    width: 46,
                                    height: 46,
                                    borderRadius: 2,
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    backgroundColor:
                                        "#e8f5e9",
                                }}
                            >

                                <Paid
                                    sx={{
                                        color:
                                            "success.main",
                                        fontSize: 28,
                                    }}
                                />

                            </Box>


                            <Box>

                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                >
                                    Allocate Funds
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Distribute funds from
                                    the approved department
                                    budget.
                                </Typography>

                            </Box>

                        </Stack>


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
                            sx={{
                                borderRadius: 2,
                                textTransform:
                                    "none",
                            }}
                        >
                            Back
                        </Button>

                    </Stack>

                </Box>


                {/* =================================================
                    ALERTS
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
                            borderRadius: 2,
                        }}
                    >
                        {error}
                    </Alert>

                )}


                {success && (

                    <Alert
                        severity="success"
                        sx={{
                            mx: {
                                xs: 2.5,
                                md: 4,
                            },
                            mt: 2,
                            borderRadius: 2,
                        }}
                    >
                        {success}
                    </Alert>

                )}


                {/* =================================================
                    BUDGET INFORMATION
                ================================================= */}

                <Box
                    sx={{
                        px: {
                            xs: 2.5,
                            md: 4,
                        },
                        pt: 3,
                    }}
                >

                    <Typography
                        fontWeight={700}
                        mb={1.5}
                    >
                        Budget Information
                    </Typography>


                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(4, 1fr)",
                            },
                            border:
                                "1px solid #e1e5eb",
                            borderRadius: 2,
                            overflow: "hidden",
                        }}
                    >

                        <Box
                            sx={{
                                p: 1.8,
                                borderRight: {
                                    sm:
                                        "1px solid #e1e5eb",
                                },
                                borderBottom: {
                                    xs:
                                        "1px solid #e1e5eb",
                                    sm: "none",
                                },
                            }}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Department
                            </Typography>

                            <Typography
                                fontWeight={600}
                            >
                                {budget.department ||
                                    "-"}
                            </Typography>

                        </Box>


                        <Box
                            sx={{
                                p: 1.8,
                                borderRight: {
                                    sm:
                                        "1px solid #e1e5eb",
                                },
                                borderBottom: {
                                    xs:
                                        "1px solid #e1e5eb",
                                    sm: "none",
                                },
                            }}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Financial Year
                            </Typography>

                            <Typography
                                fontWeight={600}
                            >
                                {
                                    budget.financialYear ||
                                    "-"
                                }
                            </Typography>

                        </Box>


                        <Box
                            sx={{
                                p: 1.8,
                                borderRight: {
                                    sm:
                                        "1px solid #e1e5eb",
                                },
                                borderBottom: {
                                    xs:
                                        "1px solid #e1e5eb",
                                    sm: "none",
                                },
                            }}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Total Budget
                            </Typography>

                            <Typography
                                fontWeight={600}
                            >
                                ₹{" "}
                                {totalBudget.toLocaleString(
                                    "en-IN"
                                )}
                            </Typography>

                        </Box>


                        <Box
                            sx={{
                                p: 1.8,
                            }}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Available Balance
                            </Typography>

                            <Typography
                                fontWeight={700}
                                color={
                                    remainingAmount >
                                    0
                                        ? "success.main"
                                        : "error.main"
                                }
                            >
                                ₹{" "}
                                {remainingAmount.toLocaleString(
                                    "en-IN"
                                )}
                            </Typography>

                        </Box>

                    </Box>

                </Box>


                {/* =================================================
                    FORM
                ================================================= */}

                <Box
                    component="form"
                    onSubmit={
                        handleSubmit
                    }
                    sx={{
                        px: {
                            xs: 2.5,
                            md: 4,
                        },
                        py: 3,
                    }}
                >

                    <Typography
                        fontWeight={700}
                        mb={2}
                    >
                        Distribution Details
                    </Typography>


                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "1fr 1fr",
                            },
                            gap: 2.5,
                        }}
                    >

                        {/* BENEFICIARY ID */}

                        <TextField
                            fullWidth
                            required
                            label="Beneficiary ID"
                            name="beneficiaryId"
                            value={
                                form.beneficiaryId
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter beneficiary ID"
                        />


                        {/* BENEFICIARY NAME */}

                        <TextField
                            fullWidth
                            required
                            label="Beneficiary Name"
                            name="beneficiaryName"
                            value={
                                form.beneficiaryName
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter beneficiary name"
                        />


                        {/* SCHEME */}

                        <TextField
                            fullWidth
                            required
                            label="Welfare Scheme"
                            name="schemeName"
                            value={
                                form.schemeName
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter scheme name"
                        />


                        {/* PAYMENT MODE */}

                        <TextField
                            fullWidth
                            select
                            required
                            label="Payment Mode"
                            name="paymentMode"
                            value={
                                form.paymentMode
                            }
                            onChange={
                                handleChange
                            }
                        >

                            <MenuItem value="DBT">
                                Direct Benefit
                                Transfer (DBT)
                            </MenuItem>

                            <MenuItem value="BANK_TRANSFER">
                                Bank Transfer
                            </MenuItem>

                            <MenuItem value="CHEQUE">
                                Cheque
                            </MenuItem>

                        </TextField>


                        {/* AMOUNT */}

                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="Distribution Amount"
                            name="amount"
                            value={form.amount}
                            onChange={
                                handleChange
                            }
                            inputProps={{
                                min: 1,
                                max:
                                    remainingAmount,
                            }}
                            InputProps={{
                                startAdornment: (
                                    <Typography
                                        sx={{
                                            mr: 1,
                                            color:
                                                "text.secondary",
                                            fontWeight: 600,
                                        }}
                                    >
                                        ₹
                                    </Typography>
                                ),
                            }}
                            helperText={`Available: ₹${remainingAmount.toLocaleString(
                                "en-IN"
                            )}`}
                        />


                        {/* REMARKS */}

                        <TextField
                            fullWidth
                            label="Remarks"
                            name="remarks"
                            value={
                                form.remarks
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Optional remarks"
                        />

                    </Box>


                    {/* =================================================
                        PREVIEW
                    ================================================= */}

                    <Paper
                        elevation={0}
                        sx={{
                            mt: 3,
                            p: 2.5,
                            borderRadius: 2,
                            backgroundColor:
                                "#f8fafc",
                            border:
                                "1px solid #e1e5eb",
                        }}
                    >

                        <Typography
                            fontWeight={700}
                            mb={1.5}
                        >
                            Distribution Preview
                        </Typography>

                        <Divider
                            sx={{
                                mb: 2,
                            }}
                        />


                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm:
                                        "repeat(3, 1fr)",
                                },
                                gap: 2,
                            }}
                        >

                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Beneficiary
                                </Typography>

                                <Typography
                                    fontWeight={600}
                                >
                                    {
                                        form.beneficiaryName ||
                                        "-"
                                    }
                                </Typography>

                            </Box>


                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Scheme
                                </Typography>

                                <Typography
                                    fontWeight={600}
                                >
                                    {
                                        form.schemeName ||
                                        "-"
                                    }
                                </Typography>

                            </Box>


                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Payment Mode
                                </Typography>

                                <Typography
                                    fontWeight={600}
                                >
                                    {
                                        form.paymentMode
                                    }
                                </Typography>

                            </Box>


                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Distribution Amount
                                </Typography>

                                <Typography
                                    fontWeight={700}
                                    color="primary"
                                >
                                    ₹{" "}
                                    {distributionAmount.toLocaleString(
                                        "en-IN"
                                    )}
                                </Typography>

                            </Box>


                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Balance After Distribution
                                </Typography>

                                <Typography
                                    fontWeight={700}
                                    color="success.main"
                                >
                                    ₹{" "}
                                    {balanceAfter.toLocaleString(
                                        "en-IN"
                                    )}
                                </Typography>

                            </Box>


                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Current Expenditure
                                </Typography>

                                <Typography
                                    fontWeight={600}
                                >
                                    ₹{" "}
                                    {spentAmount.toLocaleString(
                                        "en-IN"
                                    )}
                                </Typography>

                            </Box>

                        </Box>

                    </Paper>


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={1.5}
                        sx={{
                            mt: 3,
                        }}
                    >

                        <Button
                            type="button"
                            variant="outlined"
                            onClick={() =>
                                navigate(
                                    `/budgets/${id}`
                                )
                            }
                            disabled={submitting}
                            sx={{
                                borderRadius: 2,
                                textTransform:
                                    "none",
                            }}
                        >
                            Cancel
                        </Button>


                        <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            startIcon={
                                submitting ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                ) : (
                                    <Send />
                                )
                            }
                            disabled={
                                submitting ||
                                remainingAmount <=
                                    0
                            }
                            sx={{
                                borderRadius: 2,
                                textTransform:
                                    "none",
                                fontWeight: 600,
                                minWidth: 170,
                            }}
                        >

                            {submitting
                                ? "Processing..."
                                : "Distribute Funds"}

                        </Button>

                    </Stack>

                </Box>

            </Paper>

        </Box>

    );

}


export default FundDistribution;
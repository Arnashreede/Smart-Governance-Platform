import { useEffect, useState } from "react";

import {
    Box,
    Paper,
    Typography,
    Stack,
    LinearProgress,
    Button,
    CircularProgress,
    Alert,
    Chip,
} from "@mui/material";

import {
    AccountBalanceWallet,
    Paid,
    TrendingUp,
    Savings,
    Add,
    CurrencyRupee,
    ReceiptLong,
    Assessment,
    Refresh,
    Visibility,
    Edit,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import {
    getDashboard,
    getAllBudgets,
} from "../services/budgetApi";


function BudgetDashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState({
        totalBudget: 0,
        allocatedAmount: 0,
        spentAmount: 0,
        remainingAmount: 0,
    });

    const [budgets, setBudgets] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =========================================================
    // LOAD DATA
    // =========================================================

    useEffect(() => {
        loadData();
    }, []);


    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            const [dashboardData, budgetData] =
                await Promise.all([
                    getDashboard(),
                    getAllBudgets(),
                ]);

            setDashboard({
                totalBudget: Number(
                    dashboardData?.totalBudget || 0
                ),

                allocatedAmount: Number(
                    dashboardData?.allocatedAmount || 0
                ),

                spentAmount: Number(
                    dashboardData?.spentAmount || 0
                ),

                remainingAmount: Number(
                    dashboardData?.remainingAmount || 0
                ),
            });

            setBudgets(
                Array.isArray(budgetData)
                    ? budgetData
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load budget dashboard:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load budget information."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // HELPERS
    // =========================================================

    const formatCurrency = (value) => {

        return Number(
            value || 0
        ).toLocaleString("en-IN");

    };


    const utilization =
        dashboard.totalBudget > 0
            ? (
                dashboard.spentAmount /
                dashboard.totalBudget
            ) * 100
            : 0;


    const safeUtilization = Math.min(
        Math.max(utilization, 0),
        100
    );


    const getBudgetStatus = (budget) => {

        const total =
            Number(budget.totalBudget || 0);

        const spent =
            Number(budget.spentAmount || 0);

        const percentage =
            total > 0
                ? (spent / total) * 100
                : 0;

        if (percentage >= 90) {

            return {
                label: "EXHAUSTED",
                color: "error",
            };

        }

        if (percentage >= 70) {

            return {
                label: "LOW",
                color: "warning",
            };

        }

        return {
            label: "HEALTHY",
            color: "success",
        };

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

                    <Typography color="text.secondary">
                        Loading budget information...
                    </Typography>

                </Stack>

            </Box>

        );

    }


    // =========================================================
    // MAIN
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

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    mb: 2.5,
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

                    <Box>

                        <Typography
                            variant="h4"
                            fontWeight={700}
                            sx={{
                                color: "#172033",
                                fontSize: {
                                    xs: "1.6rem",
                                    md: "2rem",
                                },
                            }}
                        >
                            Budget Management
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mt: 0.4,
                            }}
                        >
                            Monitor government fund allocation,
                            expenditure and remaining balance.
                        </Typography>

                    </Box>


                    <Stack
                        direction="row"
                        spacing={1}
                    >

                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Refresh />}
                            onClick={loadData}
                            sx={{
                                borderRadius: 2,
                                textTransform: "none",
                            }}
                        >
                            Refresh
                        </Button>


                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<Add />}
                            onClick={() =>
                                navigate("/budgets/create")
                            }
                            sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                        >
                            Create Budget
                        </Button>

                    </Stack>

                </Stack>

            </Box>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                        borderRadius: 2,
                    }}
                    action={

                        <Button
                            color="inherit"
                            size="small"
                            onClick={loadData}
                        >
                            Retry
                        </Button>

                    }
                >
                    {error}
                </Alert>

            )}


            {/* =================================================
                FINANCIAL STATISTICS
            ================================================= */}

            <Paper
                elevation={0}
                sx={{
                    border: "1px solid #e1e5eb",
                    borderRadius: 3,
                    overflow: "hidden",
                    mb: 2.5,
                    backgroundColor: "#ffffff",
                }}
            >

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "1fr 1fr",
                            md: "repeat(4, 1fr)",
                        },
                    }}
                >

                    {/* TOTAL */}

                    <Box
                        sx={{
                            p: 2.2,
                            borderRight: {
                                md: "1px solid #e1e5eb",
                            },
                            borderBottom: {
                                xs: "1px solid #e1e5eb",
                                md: "none",
                            },
                        }}
                    >

                        <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                        >

                            <AccountBalanceWallet
                                sx={{
                                    color: "#1976d2",
                                    fontSize: 28,
                                }}
                            />

                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Total Budget
                                </Typography>

                                <Typography
                                    fontWeight={700}
                                    fontSize="1.15rem"
                                >
                                    ₹{" "}
                                    {formatCurrency(
                                        dashboard.totalBudget
                                    )}
                                </Typography>

                            </Box>

                        </Stack>

                    </Box>


                    {/* ALLOCATED */}

                    <Box
                        sx={{
                            p: 2.2,
                            borderRight: {
                                md: "1px solid #e1e5eb",
                            },
                            borderBottom: {
                                xs: "1px solid #e1e5eb",
                                md: "none",
                            },
                        }}
                    >

                        <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                        >

                            <Paid
                                sx={{
                                    color: "#1565c0",
                                    fontSize: 28,
                                }}
                            />

                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Allocated
                                </Typography>

                                <Typography
                                    fontWeight={700}
                                    fontSize="1.15rem"
                                    color="primary"
                                >
                                    ₹{" "}
                                    {formatCurrency(
                                        dashboard.allocatedAmount
                                    )}
                                </Typography>

                            </Box>

                        </Stack>

                    </Box>


                    {/* SPENT */}

                    <Box
                        sx={{
                            p: 2.2,
                            borderRight: {
                                md: "1px solid #e1e5eb",
                            },
                            borderBottom: {
                                xs: "1px solid #e1e5eb",
                                md: "none",
                            },
                        }}
                    >

                        <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                        >

                            <TrendingUp
                                sx={{
                                    color: "#d32f2f",
                                    fontSize: 28,
                                }}
                            />

                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Spent
                                </Typography>

                                <Typography
                                    fontWeight={700}
                                    fontSize="1.15rem"
                                    color="error.main"
                                >
                                    ₹{" "}
                                    {formatCurrency(
                                        dashboard.spentAmount
                                    )}
                                </Typography>

                            </Box>

                        </Stack>

                    </Box>


                    {/* REMAINING */}

                    <Box
                        sx={{
                            p: 2.2,
                        }}
                    >

                        <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                        >

                            <Savings
                                sx={{
                                    color: "#2e7d32",
                                    fontSize: 28,
                                }}
                            />

                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Remaining
                                </Typography>

                                <Typography
                                    fontWeight={700}
                                    fontSize="1.15rem"
                                    color="success.main"
                                >
                                    ₹{" "}
                                    {formatCurrency(
                                        dashboard.remainingAmount
                                    )}
                                </Typography>

                            </Box>

                        </Stack>

                    </Box>

                </Box>

            </Paper>


            {/* =================================================
                UTILIZATION + ACTIONS
            ================================================= */}

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "minmax(0, 2.2fr) minmax(280px, 1fr)",
                    },
                    gap: 2.5,
                    mb: 2.5,
                }}
            >

                {/* =================================================
                    UTILIZATION
                ================================================= */}

                <Paper
                    elevation={0}
                    sx={{
                        p: 2.5,
                        border: "1px solid #e1e5eb",
                        borderRadius: 3,
                        backgroundColor: "#ffffff",
                    }}
                >

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        mb={1.5}
                    >

                        <Box>

                            <Typography
                                fontWeight={700}
                                fontSize="1.05rem"
                            >
                                Fund Utilization
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Current spending against
                                the total approved budget.
                            </Typography>

                        </Box>


                        <Chip
                            size="small"
                            label={`${utilization.toFixed(
                                1
                            )}% Used`}
                            color={
                                utilization >= 90
                                    ? "error"
                                    : utilization >= 70
                                    ? "warning"
                                    : "success"
                            }
                            variant="outlined"
                        />

                    </Stack>


                    <Stack
                        direction="row"
                        alignItems="baseline"
                        spacing={1}
                    >

                        <Typography
                            variant="h3"
                            fontWeight={700}
                            color="primary"
                        >
                            {utilization.toFixed(1)}%
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            utilized
                        </Typography>

                    </Stack>


                    <LinearProgress
                        variant="determinate"
                        value={safeUtilization}
                        sx={{
                            height: 10,
                            borderRadius: 5,
                            my: 1.8,
                        }}
                    />


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

                        <Box>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Allocated
                            </Typography>

                            <Typography
                                fontWeight={700}
                            >
                                ₹{" "}
                                {formatCurrency(
                                    dashboard.allocatedAmount
                                )}
                            </Typography>

                        </Box>


                        <Box>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Expenditure
                            </Typography>

                            <Typography
                                fontWeight={700}
                                color="error.main"
                            >
                                ₹{" "}
                                {formatCurrency(
                                    dashboard.spentAmount
                                )}
                            </Typography>

                        </Box>


                        <Box>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Available Balance
                            </Typography>

                            <Typography
                                fontWeight={700}
                                color="success.main"
                            >
                                ₹{" "}
                                {formatCurrency(
                                    dashboard.remainingAmount
                                )}
                            </Typography>

                        </Box>

                    </Box>

                </Paper>


                {/* =================================================
                    QUICK ACTIONS
                ================================================= */}

                <Paper
                    elevation={0}
                    sx={{
                        p: 2.5,
                        border: "1px solid #e1e5eb",
                        borderRadius: 3,
                        backgroundColor: "#ffffff",
                    }}
                >

                    <Typography
                        fontWeight={700}
                        fontSize="1.05rem"
                    >
                        Quick Actions
                    </Typography>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Manage government funds
                    </Typography>


                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 1,
                            mt: 1.8,
                        }}
                    >

                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<Add />}
                            onClick={() =>
                                navigate(
                                    "/budgets/create"
                                )
                            }
                            sx={{
                                textTransform: "none",
                                borderRadius: 2,
                            }}
                        >
                            Create
                        </Button>


                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={
                                <CurrencyRupee />
                            }
                            onClick={() =>
                                navigate(
                                    "/budget-management"
                                )
                            }
                            sx={{
                                textTransform: "none",
                                borderRadius: 2,
                            }}
                        >
                            Manage
                        </Button>


                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={
                                <ReceiptLong />
                            }
                            onClick={() =>
                                navigate(
                                    "/budget-management"
                                )
                            }
                            sx={{
                                textTransform: "none",
                                borderRadius: 2,
                            }}
                        >
                            Distribute
                        </Button>


                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={
                                <Assessment />
                            }
                            onClick={() =>
                                navigate(
                                    "/budget/reports"
                                )
                            }
                            sx={{
                                textTransform: "none",
                                borderRadius: 2,
                            }}
                        >
                            Reports
                        </Button>

                    </Box>

                </Paper>

            </Box>


            {/* =================================================
                BUDGET OVERVIEW
            ================================================= */}

            <Paper
                elevation={0}
                sx={{
                    border: "1px solid #e1e5eb",
                    borderRadius: 3,
                    overflow: "hidden",
                    backgroundColor: "#ffffff",
                }}
            >

                <Box
                    sx={{
                        px: 2.5,
                        py: 1.8,
                        borderBottom:
                            "1px solid #e1e5eb",
                    }}
                >

                    <Typography
                        fontWeight={700}
                        fontSize="1.05rem"
                    >
                        Budget Overview
                    </Typography>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Department-wise budget allocation
                        and utilization.
                    </Typography>

                </Box>


                {/* DESKTOP HEADER */}

                <Box
                    sx={{
                        display: {
                            xs: "none",
                            md: "grid",
                        },
                        gridTemplateColumns:
                            "1.4fr 1fr 1fr 1fr 1fr 1fr 0.9fr",
                        gap: 1,
                        px: 2.5,
                        py: 1.2,
                        backgroundColor: "#f8fafc",
                        borderBottom:
                            "1px solid #e1e5eb",
                    }}
                >

                    {[
                        "Department",
                        "Financial Year",
                        "Total Budget",
                        "Allocated",
                        "Spent",
                        "Remaining",
                        "Status",
                    ].map((heading) => (

                        <Typography
                            key={heading}
                            variant="caption"
                            fontWeight={700}
                            color="text.secondary"
                        >
                            {heading}
                        </Typography>

                    ))}

                </Box>


                {/* DATA */}

                {budgets.length === 0 ? (

                    <Box
                        sx={{
                            py: 4,
                            textAlign: "center",
                        }}
                    >

                        <Typography
                            color="text.secondary"
                        >
                            No budget records found.
                        </Typography>

                    </Box>

                ) : (

                    budgets.map((budget) => {

                        const status =
                            getBudgetStatus(
                                budget
                            );

                        return (

                            <Box
                                key={budget.id}
                                sx={{
                                    display: {
                                        xs: "block",
                                        md: "grid",
                                    },
                                    gridTemplateColumns:
                                        "1.4fr 1fr 1fr 1fr 1fr 1fr 0.9fr",
                                    gap: 1,
                                    alignItems: "center",
                                    px: 2.5,
                                    py: 1.5,
                                    borderBottom:
                                        "1px solid #edf0f4",
                                    "&:hover": {
                                        backgroundColor:
                                            "#fafcff",
                                    },
                                }}
                            >

                                {/* DEPARTMENT */}

                                <Box>

                                    <Typography
                                        fontWeight={600}
                                    >
                                        {budget.department}
                                    </Typography>

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Budget #{budget.id}
                                    </Typography>

                                </Box>


                                {/* YEAR */}

                                <Box
                                    sx={{
                                        display: {
                                            xs: "flex",
                                            md: "block",
                                        },
                                        justifyContent:
                                            "space-between",
                                    }}
                                >

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                            display: {
                                                xs: "block",
                                                md: "none",
                                            },
                                        }}
                                    >
                                        Financial Year
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                    >
                                        {budget.financialYear}
                                    </Typography>

                                </Box>


                                {/* TOTAL */}

                                <Box
                                    sx={{
                                        display: {
                                            xs: "flex",
                                            md: "block",
                                        },
                                        justifyContent:
                                            "space-between",
                                    }}
                                >

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                            display: {
                                                xs: "block",
                                                md: "none",
                                            },
                                        }}
                                    >
                                        Total Budget
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                    >
                                        ₹{" "}
                                        {formatCurrency(
                                            budget.totalBudget
                                        )}
                                    </Typography>

                                </Box>


                                {/* ALLOCATED */}

                                <Box
                                    sx={{
                                        display: {
                                            xs: "flex",
                                            md: "block",
                                        },
                                        justifyContent:
                                            "space-between",
                                    }}
                                >

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                            display: {
                                                xs: "block",
                                                md: "none",
                                            },
                                        }}
                                    >
                                        Allocated
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="primary"
                                    >
                                        ₹{" "}
                                        {formatCurrency(
                                            budget.allocatedAmount
                                        )}
                                    </Typography>

                                </Box>


                                {/* SPENT */}

                                <Box
                                    sx={{
                                        display: {
                                            xs: "flex",
                                            md: "block",
                                        },
                                        justifyContent:
                                            "space-between",
                                    }}
                                >

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                            display: {
                                                xs: "block",
                                                md: "none",
                                            },
                                        }}
                                    >
                                        Spent
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="error.main"
                                    >
                                        ₹{" "}
                                        {formatCurrency(
                                            budget.spentAmount
                                        )}
                                    </Typography>

                                </Box>


                                {/* REMAINING */}

                                <Box
                                    sx={{
                                        display: {
                                            xs: "flex",
                                            md: "block",
                                        },
                                        justifyContent:
                                            "space-between",
                                    }}
                                >

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                            display: {
                                                xs: "block",
                                                md: "none",
                                            },
                                        }}
                                    >
                                        Remaining
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        color="success.main"
                                    >
                                        ₹{" "}
                                        {formatCurrency(
                                            budget.remainingAmount
                                        )}
                                    </Typography>

                                </Box>


                                {/* STATUS */}

                                <Box
                                    sx={{
                                        mt: {
                                            xs: 1,
                                            md: 0,
                                        },
                                    }}
                                >

                                    <Chip
                                        size="small"
                                        label={status.label}
                                        color={status.color}
                                        variant="outlined"
                                    />

                                </Box>


                                {/* MOBILE ACTIONS */}

                                <Box
                                    sx={{
                                        display: {
                                            xs: "flex",
                                            md: "none",
                                        },
                                        gap: 1,
                                        mt: 1.5,
                                    }}
                                >

                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={
                                            <Visibility />
                                        }
                                        onClick={() =>
                                            navigate(
                                                `/budgets/${budget.id}`
                                            )
                                        }
                                    >
                                        View
                                    </Button>

                                    <Button
                                        size="small"
                                        variant="contained"
                                        startIcon={
                                            <Edit />
                                        }
                                        onClick={() =>
                                            navigate(
                                                `/budgets/edit/${budget.id}`
                                            )
                                        }
                                    >
                                        Edit
                                    </Button>

                                </Box>

                            </Box>

                        );

                    })

                )}

            </Paper>


            {/* =================================================
                FOOTER
            ================================================= */}

            <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                    display: "block",
                    mt: 1.5,
                }}
            >
                Smart Goverance  • Budget Management
            </Typography>

        </Box>

    );

}


export default BudgetDashboard;
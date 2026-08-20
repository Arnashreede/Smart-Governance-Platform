import { useEffect, useMemo, useState } from "react";

import {
    Container,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
    Box,
    TextField,
    MenuItem,
    Chip,
    LinearProgress,
    Stack,
    Card,
    CardContent,
    InputAdornment,
    IconButton,
    Tooltip,
} from "@mui/material";

import {
    Add,
    Search,
    Visibility,
    Edit,
    Paid,
    Refresh,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import { getAllBudgets } from "../services/budgetApi";

function BudgetManagement() {

    const navigate = useNavigate();

    const [budgets, setBudgets] = useState([]);
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");
    const [financialYear, setFinancialYear] = useState("");
    const [loading, setLoading] = useState(false);

    // =========================
    // LOAD BUDGETS
    // =========================

    useEffect(() => {
        loadBudgets();
    }, []);

    const loadBudgets = async () => {

        try {

            setLoading(true);

            const data = await getAllBudgets();

            setBudgets(Array.isArray(data) ? data : []);

        } catch (err) {

            console.error("Failed to load budgets:", err);

            setBudgets([]);

        } finally {

            setLoading(false);

        }
    };

    // =========================
    // DYNAMIC FILTER OPTIONS
    // =========================

    const departments = useMemo(() => {

        return [
            ...new Set(
                budgets
                    .map((budget) => budget.department)
                    .filter(Boolean)
            ),
        ].sort();

    }, [budgets]);

    const financialYears = useMemo(() => {

        return [
            ...new Set(
                budgets
                    .map((budget) => budget.financialYear)
                    .filter(Boolean)
            ),
        ].sort();

    }, [budgets]);

    // =========================
    // FILTER BUDGETS
    // =========================

    const filteredBudgets = useMemo(() => {

        return budgets.filter((budget) => {

            const searchText = search.trim().toLowerCase();

            const searchMatch =
                !searchText ||
                budget.department
                    ?.toLowerCase()
                    .includes(searchText);

            const departmentMatch =
                !department ||
                budget.department === department;

            const yearMatch =
                !financialYear ||
                budget.financialYear === financialYear;

            return (
                searchMatch &&
                departmentMatch &&
                yearMatch
            );

        });

    }, [
        budgets,
        search,
        department,
        financialYear,
    ]);

    // =========================
    // DYNAMIC STATISTICS
    // =========================

    const statistics = useMemo(() => {

        const totalBudget = budgets.reduce(
            (sum, budget) =>
                sum + Number(budget.totalBudget || 0),
            0
        );

        const totalAllocated = budgets.reduce(
            (sum, budget) =>
                sum + Number(budget.allocatedAmount || 0),
            0
        );

        const totalSpent = budgets.reduce(
            (sum, budget) =>
                sum + Number(budget.spentAmount || 0),
            0
        );

        const totalRemaining = budgets.reduce(
            (sum, budget) => {

                if (
                    budget.remainingAmount !== undefined &&
                    budget.remainingAmount !== null
                ) {
                    return (
                        sum +
                        Number(budget.remainingAmount || 0)
                    );
                }

                return (
                    sum +
                    Number(budget.totalBudget || 0) -
                    Number(budget.spentAmount || 0)
                );

            },
            0
        );

        const healthyBudgets = budgets.filter(
            (budget) => {

                const total =
                    Number(budget.totalBudget || 0);

                const spent =
                    Number(budget.spentAmount || 0);

                const utilization =
                    total > 0
                        ? (spent / total) * 100
                        : 0;

                return utilization < 70;

            }
        ).length;

        const departmentCount =
            new Set(
                budgets
                    .map((budget) => budget.department)
                    .filter(Boolean)
            ).size;

        const utilization =
            totalBudget > 0
                ? (totalSpent / totalBudget) * 100
                : 0;

        return {
            totalBudget,
            totalAllocated,
            totalSpent,
            totalRemaining,
            healthyBudgets,
            departmentCount,
            utilization,
        };

    }, [budgets]);

    // =========================
    // HELPERS
    // =========================

    const getProgress = (budget) => {

        const total =
            Number(budget.totalBudget || 0);

        const spent =
            Number(budget.spentAmount || 0);

        if (total <= 0) {
            return 0;
        }

        return Math.min(
            100,
            (spent / total) * 100
        );

    };

    const getStatus = (progress) => {

        if (progress >= 90) {
            return "EXHAUSTED";
        }

        if (progress >= 70) {
            return "LOW";
        }

        return "HEALTHY";

    };

    const getStatusColor = (status) => {

        if (status === "HEALTHY") {
            return "success";
        }

        if (status === "LOW") {
            return "warning";
        }

        return "error";

    };

    const formatCurrency = (value) => {

        return `₹${Number(value || 0).toLocaleString(
            "en-IN"
        )}`;

    };

    // =========================
    // STAT CARD
    // =========================

    const StatCard = ({
        title,
        value,
        subtitle,
    }) => {

        return (
            <Card
                sx={{
                    borderRadius: 4,
                    height: "100%",
                    boxShadow: 3,
                }}
            >
                <CardContent>

                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        {value}
                    </Typography>

                    {subtitle && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            {subtitle}
                        </Typography>
                    )}

                </CardContent>
            </Card>
        );

    };

    return (

        <Container
            maxWidth="xl"
            sx={{ py: 4 }}
        >

            {/* ================= HEADER ================= */}

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems={{
                    xs: "flex-start",
                    md: "center",
                }}
                flexDirection={{
                    xs: "column",
                    md: "row",
                }}
                gap={2}
                mb={4}
            >

                <Box>

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Budget Management
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Manage government budget
                        allocations and expenditures.
                    </Typography>

                </Box>

                <Stack
                    direction="row"
                    spacing={1}
                >

                    <Tooltip title="Refresh budgets">
    <span>
        <IconButton
            onClick={loadBudgets}
            disabled={loading}
        >
            <Refresh />
        </IconButton>
    </span>
</Tooltip>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() =>
                            navigate("/budgets/create")
                        }
                    >
                        Add Budget
                    </Button>

                </Stack>

            </Box>

            {/* ================= STATISTICS ================= */}

            <Grid
                container
                spacing={2}
                sx={{ mb: 4 }}
            >

                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <StatCard
                        title="Budget Records"
                        value={budgets.length}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <StatCard
                        title="Departments"
                        value={
                            statistics.departmentCount
                        }
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <StatCard
                        title="Total Budget"
                        value={formatCurrency(
                            statistics.totalBudget
                        )}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <StatCard
                        title="Allocated"
                        value={formatCurrency(
                            statistics.totalAllocated
                        )}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <StatCard
                        title="Spent"
                        value={formatCurrency(
                            statistics.totalSpent
                        )}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <StatCard
                        title="Remaining"
                        value={formatCurrency(
                            statistics.totalRemaining
                        )}
                    />
                </Grid>

            </Grid>

            {/* ================= UTILIZATION SUMMARY ================= */}

            <Paper
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 4,
                }}
            >

                <Stack
                    direction={{
                        xs: "column",
                        md: "row",
                    }}
                    spacing={3}
                    alignItems={{
                        xs: "stretch",
                        md: "center",
                    }}
                >

                    <Box sx={{ flex: 1 }}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Overall Budget Utilization
                        </Typography>

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                        >
                            {statistics.utilization.toFixed(1)}%
                        </Typography>

                    </Box>

                    <Box sx={{ flex: 3 }}>

                        <LinearProgress
                            variant="determinate"
                            value={Math.min(
                                100,
                                statistics.utilization
                            )}
                            sx={{
                                height: 12,
                                borderRadius: 6,
                            }}
                        />

                    </Box>

                    <Box>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Healthy Budgets
                        </Typography>

                        <Typography
                            fontWeight="bold"
                            color="success.main"
                        >
                            {statistics.healthyBudgets}
                        </Typography>

                    </Box>

                </Stack>

            </Paper>

            {/* ================= FILTERS ================= */}

            <Paper
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 4,
                }}
            >

                <Grid
                    container
                    spacing={2}
                >

                    {/* Search */}

                    <Grid
                        item
                        xs={12}
                        md={5}
                    >

                        <TextField
                            fullWidth
                            placeholder="Search Department..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />

                    </Grid>

                    {/* Department */}

                    <Grid
                        item
                        xs={12}
                        md={3.5}
                    >

                        <TextField
                            select
                            fullWidth
                            label="Department"
                            value={department}
                            onChange={(e) =>
                                setDepartment(
                                    e.target.value
                                )
                            }
                        >

                            <MenuItem value="">
                                All Departments
                            </MenuItem>

                            {departments.map((dep) => (
                                <MenuItem
                                    key={dep}
                                    value={dep}
                                >
                                    {dep}
                                </MenuItem>
                            ))}

                        </TextField>

                    </Grid>

                    {/* Financial Year */}

                    <Grid
                        item
                        xs={12}
                        md={3.5}
                    >

                        <TextField
                            select
                            fullWidth
                            label="Financial Year"
                            value={financialYear}
                            onChange={(e) =>
                                setFinancialYear(
                                    e.target.value
                                )
                            }
                        >

                            <MenuItem value="">
                                All Financial Years
                            </MenuItem>

                            {financialYears.map((year) => (
                                <MenuItem
                                    key={year}
                                    value={year}
                                >
                                    {year}
                                </MenuItem>
                            ))}

                        </TextField>

                    </Grid>

                </Grid>

            </Paper>

            {/* ================= TABLE ================= */}

            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                }}
            >

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                <strong>ID</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Department</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Financial Year</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Total Budget</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Allocated</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Spent</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Remaining</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Status</strong>
                            </TableCell>

                            <TableCell
                                sx={{ minWidth: 180 }}
                            >
                                <strong>Progress</strong>
                            </TableCell>

                            <TableCell align="center">
                                <strong>Actions</strong>
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {filteredBudgets.map((budget) => {

                            const progress =
                                getProgress(budget);

                            const status =
                                getStatus(progress);

                            const remaining =
                                budget.remainingAmount !==
                                    undefined &&
                                budget.remainingAmount !==
                                    null
                                    ? Number(
                                        budget.remainingAmount
                                    )
                                    : Number(
                                        budget.totalBudget || 0
                                    ) -
                                    Number(
                                        budget.spentAmount || 0
                                    );

                            return (

                                <TableRow
                                    hover
                                    key={budget.id}
                                >

                                    <TableCell>
                                        #{budget.id}
                                    </TableCell>

                                    <TableCell>
                                        {budget.department ||
                                            "—"}
                                    </TableCell>

                                    <TableCell>
                                        {budget.financialYear ||
                                            "—"}
                                    </TableCell>

                                    <TableCell>
                                        {formatCurrency(
                                            budget.totalBudget
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {formatCurrency(
                                            budget.allocatedAmount
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {formatCurrency(
                                            budget.spentAmount
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {formatCurrency(
                                            remaining
                                        )}
                                    </TableCell>

                                    <TableCell>

                                        <Chip
                                            label={status}
                                            color={getStatusColor(
                                                status
                                            )}
                                            size="small"
                                        />

                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            minWidth: 180,
                                        }}
                                    >

                                        <LinearProgress
                                            variant="determinate"
                                            value={progress}
                                            sx={{
                                                height: 10,
                                                borderRadius: 5,
                                                mb: 1,
                                            }}
                                        />

                                        <Typography
                                            variant="caption"
                                            fontWeight="bold"
                                        >
                                            {progress.toFixed(0)}%
                                            {" "}Utilized
                                        </Typography>

                                    </TableCell>

                                    <TableCell>

                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            justifyContent="center"
                                        >

                                            <Tooltip title="View">

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

                                            </Tooltip>

                                            <Tooltip title="Edit">

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

                                            </Tooltip>

                                            <Tooltip title="Allocate">

                                                <Button
                                                    size="small"
                                                    color="success"
                                                    variant="contained"
                                                    startIcon={
                                                        <Paid />
                                                    }
                                                    onClick={() =>
                                                        navigate(
                                                            `/fund-distribution/${budget.id}`
                                                        )
                                                    }
                                                >
                                                    Allocate
                                                </Button>

                                            </Tooltip>

                                        </Stack>

                                    </TableCell>

                                </TableRow>

                            );

                        })}

                    </TableBody>

                </Table>

            </TableContainer>

            {/* ================= EMPTY STATE ================= */}

            {filteredBudgets.length === 0 && (

                <Paper
                    sx={{
                        mt: 3,
                        p: 5,
                        textAlign: "center",
                        borderRadius: 4,
                    }}
                >

                    <Typography
                        variant="h6"
                        color="text.secondary"
                    >
                        No budget records found.
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        Try changing the search or
                        filter criteria.
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        sx={{ mt: 3 }}
                        onClick={() =>
                             navigate("/budgets/create")
                        }
                    >
                        Create Budget
                    </Button>

                </Paper>

            )}

        </Container>

    );
}

export default BudgetManagement;
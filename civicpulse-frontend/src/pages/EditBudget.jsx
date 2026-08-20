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
    Save,
    Edit,
    AccountBalanceWallet,
} from "@mui/icons-material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getBudgetById,
    updateBudget,
} from "../services/budgetApi";

import {
    getDepartments,
} from "../services/departmentService";


function EditBudget() {

    const navigate = useNavigate();

    const { id } = useParams();


    // =====================================================
    // STATE
    // =====================================================

    const [budget, setBudget] = useState(null);

    const [departments, setDepartments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    const [form, setForm] = useState({
        department: "",
        financialYear: "",
        totalBudget: "",
    });


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        loadData();

    }, [id]);


    const loadData = async () => {

        try {

            setLoading(true);

            setError("");

            const [
                budgetData,
                departmentData,
            ] = await Promise.all([
                getBudgetById(id),
                getDepartments(),
            ]);


            console.log(
                "Budget:",
                budgetData
            );

            console.log(
                "Departments:",
                departmentData
            );


            setBudget(budgetData);


            setDepartments(
                Array.isArray(departmentData)
                    ? departmentData
                    : []
            );


            setForm({
                department:
                    budgetData?.department || "",

                financialYear:
                    budgetData?.financialYear || "",

                totalBudget:
                    budgetData?.totalBudget ?? "",
            });


        } catch (err) {

            console.error(
                "Failed to load edit data:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load budget information."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;


        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));


        setError("");

        setSuccess("");

    };


    // =====================================================
    // UPDATE
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        setSuccess("");


        if (!form.department) {

            setError(
                "Please select a department."
            );

            return;

        }


        if (!form.financialYear) {

            setError(
                "Please select a financial year."
            );

            return;

        }


        if (
            form.totalBudget === "" ||
            Number(form.totalBudget) <= 0
        ) {

            setError(
                "Please enter a valid budget amount."
            );

            return;

        }


        try {

            setSaving(true);


            const payload = {

                department:
                    form.department,

                financialYear:
                    form.financialYear,

                totalBudget:
                    Number(form.totalBudget),

            };


            console.log(
                "Updating budget:",
                id,
                payload
            );


            await updateBudget(
                id,
                payload
            );


            setSuccess(
                "Budget updated successfully."
            );


            setTimeout(() => {

                navigate(`/budgets/${id}`);

            }, 800);


        } catch (err) {

            console.error(
                "Failed to update budget:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to update budget."
            );

        } finally {

            setSaving(false);

        }

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
                        Loading budget...
                    </Typography>

                </Stack>

            </Box>

        );

    }


    // =====================================================
    // ERROR / NOT FOUND
    // =====================================================

    if (!budget) {

        return (

            <Box
                sx={{
                    minHeight: "70vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 3,
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
                        Budget Not Found
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

                    <Button
                        variant="contained"
                        startIcon={
                            <ArrowBack />
                        }
                        onClick={() =>
                            navigate("/budgets")
                        }
                    >
                        Back to Budgets
                    </Button>

                </Paper>

            </Box>

        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <Box
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
                    maxWidth: 1000,
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

                                <Edit
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
                                    Edit Budget
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Update the budget
                                    information for this
                                    department.
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
                            Back to Budget
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
                        }}
                    >
                        {success}
                    </Alert>

                )}


                {/* =================================================
                    CURRENT BUDGET
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
                        Current Budget
                    </Typography>


                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm:
                                    "repeat(3, 1fr)",
                            },
                            border:
                                "1px solid #e1e5eb",
                            borderRadius: 2,
                            overflow: "hidden",
                        }}
                    >

                        <Box
                            sx={{
                                p: 2,
                                borderBottom: {
                                    xs:
                                        "1px solid #e1e5eb",
                                    sm: "none",
                                },
                                borderRight: {
                                    sm:
                                        "1px solid #e1e5eb",
                                },
                            }}
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
                                #{budget.id}
                            </Typography>

                        </Box>


                        <Box
                            sx={{
                                p: 2,
                                borderBottom: {
                                    xs:
                                        "1px solid #e1e5eb",
                                    sm: "none",
                                },
                                borderRight: {
                                    sm:
                                        "1px solid #e1e5eb",
                                },
                            }}
                        >

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
                                {Number(
                                    budget.allocatedAmount ||
                                    0
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </Typography>

                        </Box>


                        <Box
                            sx={{
                                p: 2,
                            }}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Spent
                            </Typography>

                            <Typography
                                fontWeight={700}
                                color="error.main"
                            >
                                ₹{" "}
                                {Number(
                                    budget.spentAmount ||
                                    0
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </Typography>

                        </Box>

                    </Box>

                </Box>


                {/* =================================================
                    EDIT FORM
                ================================================= */}

                <Box
                    component="form"
                    onSubmit={handleSubmit}
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
                        Budget Information
                    </Typography>


                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md:
                                    "1fr 1fr",
                            },
                            gap: 2.5,
                        }}
                    >

                        {/* DEPARTMENT */}

                        <TextField
                            fullWidth
                            select
                            required
                            label="Department"
                            name="department"
                            value={
                                form.department
                            }
                            onChange={
                                handleChange
                            }
                        >

                            {departments.map(
                                (dept) => (

                                    <MenuItem
                                        key={dept.id}
                                        value={dept.name}
                                    >
                                        {dept.name}
                                    </MenuItem>

                                )
                            )}

                        </TextField>


                        {/* FINANCIAL YEAR */}

                        <TextField
                            fullWidth
                            select
                            required
                            label="Financial Year"
                            name="financialYear"
                            value={
                                form.financialYear
                            }
                            onChange={
                                handleChange
                            }
                        >

                            <MenuItem value="2025-2026">
                                2025-2026
                            </MenuItem>

                            <MenuItem value="2026-2027">
                                2026-2027
                            </MenuItem>

                            <MenuItem value="2027-2028">
                                2027-2028
                            </MenuItem>

                            <MenuItem value="2028-2029">
                                2028-2029
                            </MenuItem>

                        </TextField>


                        {/* TOTAL BUDGET */}

                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="Total Budget (₹)"
                            name="totalBudget"
                            value={
                                form.totalBudget
                            }
                            onChange={
                                handleChange
                            }
                            inputProps={{
                                min: 1,
                            }}
                        />

                    </Box>


                    {/* =================================================
                        UPDATED SUMMARY
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

                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            justifyContent="space-between"
                            spacing={2}
                        >

                            <Box>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >

                                    <AccountBalanceWallet
                                        color="primary"
                                    />

                                    <Typography
                                        fontWeight={700}
                                    >
                                        Updated Budget
                                    </Typography>

                                </Stack>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    mt={0.5}
                                >
                                    Review the changes
                                    before saving.
                                </Typography>

                            </Box>


                            <Box
                                sx={{
                                    textAlign: {
                                        xs: "left",
                                        sm: "right",
                                    },
                                }}
                            >

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    New Total Budget
                                </Typography>

                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                    color="primary.main"
                                >
                                    ₹{" "}
                                    {Number(
                                        form.totalBudget ||
                                        0
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </Typography>

                            </Box>

                        </Stack>

                    </Paper>


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <Divider
                        sx={{
                            my: 3,
                        }}
                    />


                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={1.5}
                    >

                        <Button
                            type="button"
                            variant="outlined"
                            startIcon={
                                <ArrowBack />
                            }
                            onClick={() =>
                                navigate(
                                    `/budgets/${id}`
                                )
                            }
                            disabled={saving}
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
                            startIcon={
                                saving ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                ) : (
                                    <Save />
                                )
                            }
                            disabled={saving}
                            sx={{
                                borderRadius: 2,
                                textTransform:
                                    "none",
                                fontWeight: 600,
                                minWidth: 170,
                            }}
                        >

                            {saving
                                ? "Updating..."
                                : "Update Budget"}

                        </Button>

                    </Stack>

                </Box>

            </Paper>

        </Box>

    );

}


export default EditBudget;
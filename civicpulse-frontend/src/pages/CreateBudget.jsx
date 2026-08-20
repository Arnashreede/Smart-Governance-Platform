import { useEffect, useState } from "react";

import {
    Box,
    Paper,
    Typography,
    TextField,
    MenuItem,
    Button,
    Divider,
    Stack,
    CircularProgress,
    Alert,
} from "@mui/material";

import {
    Save,
    ArrowBack,
    AccountBalanceWallet,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import { createBudget } from "../services/budgetApi";
import { getDepartments } from "../services/departmentService";


function CreateBudget() {

    const navigate = useNavigate();

    const [departments, setDepartments] = useState([]);

    const [loadingDepartments, setLoadingDepartments] =
        useState(true);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [form, setForm] = useState({
        department: "",
        financialYear: "",
        totalBudget: "",
    });


    // =========================================================
    // FINANCIAL YEARS
    // Generated dynamically - no hardcoding
    // =========================================================

    const currentDate = new Date();

    const currentYear = currentDate.getFullYear();

    const currentMonth = currentDate.getMonth();

    const startingYear =
        currentMonth >= 3
            ? currentYear
            : currentYear - 1;

    const financialYears = Array.from(
        { length: 5 },
        (_, index) => {
            const start = startingYear + index;
            return `${start}-${start + 1}`;
        }
    );


    // =========================================================
    // LOAD DEPARTMENTS
    // =========================================================

    useEffect(() => {
        loadDepartments();
    }, []);


    const loadDepartments = async () => {

        try {

            setLoadingDepartments(true);
            setError("");

            const data = await getDepartments();

            setDepartments(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load departments:",
                err
            );

            setError(
                "Unable to load departments."
            );

        } finally {

            setLoadingDepartments(false);

        }

    };


    // =========================================================
    // HANDLE CHANGE
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
            !form.totalBudget ||
            Number(form.totalBudget) <= 0
        ) {

            setError(
                "Please enter a valid budget amount."
            );

            return;

        }


        try {

            setLoading(true);

            await createBudget({
                department: form.department,
                financialYear: form.financialYear,
                totalBudget: Number(
                    form.totalBudget
                ),
            });


            navigate("/budgets");

        } catch (err) {

            console.error(
                "Failed to create budget:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to create budget."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // LOADING DEPARTMENTS
    // =========================================================

    if (loadingDepartments) {

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
                        Loading departments...
                    </Typography>

                </Stack>

            </Box>

        );

    }


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
                    maxWidth: 1000,
                    mx: "auto",
                    borderRadius: 3,
                    border: "1px solid #e1e5eb",
                    backgroundColor: "#ffffff",
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
                        py: 2.5,
                        borderBottom:
                            "1px solid #e1e5eb",
                    }}
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
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor:
                                    "#e8f1ff",
                            }}
                        >

                            <AccountBalanceWallet
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
                                Create Budget
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Create a financial budget
                                for a government department.
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
                            borderRadius: 2,
                        }}
                    >
                        {error}
                    </Alert>

                )}


                {/* =================================================
                    FORM
                ================================================= */}

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >

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
                            fontWeight={700}
                            sx={{
                                mb: 2,
                            }}
                        >
                            Budget Information
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

                            {/* =================================================
                                DEPARTMENT
                            ================================================= */}

                            <TextField
                                fullWidth
                                select
                                required
                                label="Department"
                                name="department"
                                value={form.department}
                                onChange={handleChange}
                                helperText={
                                    "Select the department responsible for this budget"
                                }
                            >

                                <MenuItem
                                    value=""
                                    disabled
                                >
                                    Select Department
                                </MenuItem>


                                {departments.map(
                                    (department) => (

                                        <MenuItem
                                            key={
                                                department.id
                                            }
                                            value={
                                                department.name
                                            }
                                        >
                                            {
                                                department.name
                                            }
                                        </MenuItem>

                                    )
                                )}

                            </TextField>


                            {/* =================================================
                                FINANCIAL YEAR
                            ================================================= */}

                            <TextField
                                fullWidth
                                select
                                required
                                label="Financial Year"
                                name="financialYear"
                                value={
                                    form.financialYear
                                }
                                onChange={handleChange}
                                helperText={
                                    "Select the financial year for this budget"
                                }
                            >

                                <MenuItem
                                    value=""
                                    disabled
                                >
                                    Select Financial Year
                                </MenuItem>


                                {financialYears.map(
                                    (year) => (

                                        <MenuItem
                                            key={year}
                                            value={year}
                                        >
                                            {year}
                                        </MenuItem>

                                    )
                                )}

                            </TextField>


                            {/* =================================================
                                TOTAL BUDGET
                            ================================================= */}

                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Total Budget Amount"
                                name="totalBudget"
                                value={
                                    form.totalBudget
                                }
                                onChange={handleChange}
                                inputProps={{
                                    min: 1,
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
                                helperText={
                                    "Enter the total approved budget amount"
                                }
                            />

                        </Box>


                        {/* =================================================
                            SUMMARY
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
                                    "1px solid #e5e9ef",
                            }}
                        >

                            <Typography
                                fontWeight={700}
                                sx={{
                                    mb: 1.5,
                                }}
                            >
                                Budget Summary
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
                                        Department
                                    </Typography>

                                    <Typography
                                        fontWeight={600}
                                    >
                                        {
                                            form.department ||
                                            "Not selected"
                                        }
                                    </Typography>

                                </Box>


                                <Box>

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
                                            form.financialYear ||
                                            "Not selected"
                                        }
                                    </Typography>

                                </Box>


                                <Box>

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Total Budget
                                    </Typography>

                                    <Typography
                                        fontWeight={700}
                                        color="primary"
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

                            </Box>

                        </Paper>

                    </Box>


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <Box
                        sx={{
                            px: {
                                xs: 2.5,
                                md: 4,
                            },
                            py: 2,
                            borderTop:
                                "1px solid #e1e5eb",
                            backgroundColor:
                                "#fafbfc",
                        }}
                    >

                        <Stack
                            direction={{
                                xs: "column-reverse",
                                sm: "row",
                            }}
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
                                    navigate("/budgets")
                                }
                                disabled={loading}
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
                                    loading ? (
                                        <CircularProgress
                                            size={18}
                                            color="inherit"
                                        />
                                    ) : (
                                        <Save />
                                    )
                                }
                                disabled={loading}
                                sx={{
                                    borderRadius: 2,
                                    textTransform:
                                        "none",
                                    fontWeight: 600,
                                    minWidth: 150,
                                }}
                            >

                                {loading
                                    ? "Creating..."
                                    : "Create Budget"}

                            </Button>

                        </Stack>

                    </Box>

                </Box>

            </Paper>

        </Box>

    );

}


export default CreateBudget;
import React, { useEffect, useMemo, useState } from "react";

import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Tabs,
    Tab,
    Alert,
    LinearProgress,
} from "@mui/material";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    AreaChart,
    Area,
} from "recharts";

import AssessmentIcon from "@mui/icons-material/Assessment";
import PeopleIcon from "@mui/icons-material/People";
import BadgeIcon from "@mui/icons-material/Badge";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";
import PsychologyIcon from "@mui/icons-material/Psychology";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import api from "../api/axios";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import {
    analyzeAdministration,
    downloadGrievanceReport,
} from "../api/aiApi";


// ============================================================
// CONSTANTS
// ============================================================

const CHART_COLORS = [
    "#1976D2",
    "#42A5F5",
    "#66BB6A",
    "#FFA726",
    "#EF5350",
    "#AB47BC",
    "#26A69A",
    "#8D6E63",
];


// ============================================================
// HELPERS
// ============================================================

const safeArray = (value) => {
    return Array.isArray(value) ? value : [];
};


const numberValue = (value) => {
    const number = Number(value);

    return Number.isFinite(number) ? number : 0;
};


const textValue = (value, fallback = "Unknown") => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return fallback;
    }

    return String(value);
};


const titleCase = (value) => {
    return textValue(value)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );
};


const groupCount = (items, fieldNames) => {

    const map = {};

    items.forEach((item) => {

        let value = null;

        for (const field of fieldNames) {

            if (
                item &&
                item[field] !== null &&
                item[field] !== undefined &&
                item[field] !== ""
            ) {
                value = item[field];
                break;
            }
        }

        const label = titleCase(value);

        map[label] =
            (map[label] || 0) + 1;
    });

    return Object.entries(map)
        .map(([name, value]) => ({
            name,
            value,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
};


const groupSum = (
    items,
    labelFields,
    valueFields
) => {

    const map = {};

    items.forEach((item) => {

        let label = null;

        for (const field of labelFields) {

            if (
                item &&
                item[field] !== null &&
                item[field] !== undefined &&
                item[field] !== ""
            ) {
                label = item[field];
                break;
            }
        }

        const name = titleCase(label);

        let amount = 0;

        for (const field of valueFields) {

            if (
                item &&
                item[field] !== null &&
                item[field] !== undefined
            ) {
                amount = numberValue(item[field]);
                break;
            }
        }

        map[name] =
            (map[name] || 0) + amount;
    });

    return Object.entries(map)
        .map(([name, value]) => ({
            name,
            value,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
};


// ============================================================
// KPI CARD
// ============================================================

function MetricCard({
    title,
    value,
    icon,
    description,
}) {

    return (
        <Card
            sx={{
                height: "100%",
                borderRadius: 4,
                border: "1px solid #E1E8F0",
                boxShadow:
                    "0 6px 24px rgba(15,55,95,0.06)",
            }}
        >
            <CardContent>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 2,
                    }}
                >

                    <Box>

                        <Typography
                            color="text.secondary"
                            fontSize="0.82rem"
                            fontWeight={700}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight={800}
                            sx={{
                                mt: 0.7,
                                color: "#172033",
                            }}
                        >
                            {value}
                        </Typography>

                        {description && (
                            <Typography
                                fontSize="0.75rem"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                            >
                                {description}
                            </Typography>
                        )}

                    </Box>

                    <Box
                        sx={{
                            width: 46,
                            height: 46,
                            borderRadius: 3,
                            background: "#EAF2FB",
                            color: "#1565C0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        {icon}
                    </Box>

                </Box>

            </CardContent>
        </Card>
    );
}


// ============================================================
// CHART CARD
// ============================================================

function ChartCard({
    title,
    subtitle,
    children,
    height = 330,
}) {

    return (
        <Card
            sx={{
                height: "100%",
                borderRadius: 4,
                border: "1px solid #E1E8F0",
                boxShadow:
                    "0 6px 24px rgba(15,55,95,0.06)",
            }}
        >

            <CardContent sx={{ p: 3 }}>

                <Typography
                    variant="h6"
                    fontWeight={800}
                    color="#172033"
                >
                    {title}
                </Typography>

                {subtitle && (
                    <Typography
                        fontSize="0.82rem"
                        color="text.secondary"
                        sx={{ mt: 0.5, mb: 2 }}
                    >
                        {subtitle}
                    </Typography>
                )}

                <Box
                    sx={{
                        width: "100%",
                        height,
                        mt: subtitle ? 0 : 2,
                    }}
                >
                    {children}
                </Box>

            </CardContent>

        </Card>
    );
}


// ============================================================
// EMPTY CHART
// ============================================================

function EmptyChart({ message = "No data available" }) {

    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
            }}
        >
            <Typography>
                {message}
            </Typography>
        </Box>
    );
}


// ============================================================
// REPORTS & ANALYTICS
// ============================================================

function Reports() {

    const [adminData, setAdminData] = useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [tab, setTab] =
        useState(0);

    const [aiAnalysis, setAiAnalysis] =
        useState("");

    const [aiLoading, setAiLoading] =
        useState(false);

    const [reportLoading, setReportLoading] =
        useState(false);


    // ========================================================
    // LOAD LIVE ADMINISTRATIVE DATA
    // ========================================================

    const loadAnalytics = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/ai/admin-data");

            setAdminData(
                response.data || {}
            );

        } catch (err) {

            console.error(
                "Analytics loading failed:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Unable to load administrative analytics."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {
        loadAnalytics();
    }, []);


    // ========================================================
    // DATA EXTRACTION
    // ========================================================

    const citizens =
        safeArray(adminData?.citizens);

    const departments =
        safeArray(adminData?.departments);

    const officers =
        safeArray(adminData?.officers);

    const grievances =
        safeArray(adminData?.grievances);

    const applications =
        safeArray(adminData?.applications);

    const welfare =
        safeArray(adminData?.welfare);

    const certificates =
        safeArray(adminData?.certificates);

    const budgets =
        safeArray(adminData?.budgets);

    const audit =
        safeArray(adminData?.audit);

    const notifications =
        safeArray(adminData?.notifications);

    const reports =
        adminData?.reports &&
        typeof adminData.reports === "object"
            ? adminData.reports
            : {};


    // ========================================================
    // AUTHORITATIVE TOTALS
    // ========================================================

    const totalCitizens =
        numberValue(
            reports.totalCitizens ??
            citizens.length
        );

    const totalGrievances =
        numberValue(
            reports.totalGrievances ??
            grievances.length
        );

    const totalApplications =
        numberValue(
            reports.totalApplications ??
            applications.length
        );

    const totalCertificates =
        numberValue(
            reports.totalCertificates ??
            certificates.length
        );

    const totalOfficers =
        numberValue(
            reports.totalOfficers ??
            officers.length
        );

    const totalDepartments =
        numberValue(
            reports.totalDepartments ??
            departments.length
        );

    const totalBudget =
        numberValue(
            reports.totalBudget
        );

    const allocatedAmount =
        numberValue(
            reports.allocatedAmount
        );

    const spentAmount =
        numberValue(
            reports.spentAmount
        );

    const remainingAmount =
        numberValue(
            reports.remainingAmount
        );

    const escalatedGrievances =
        numberValue(
            reports.escalatedGrievances
        );


    // ========================================================
    // GRIEVANCE DATA
    // ========================================================

    const grievanceStatusData =
        useMemo(
            () =>
                groupCount(
                    grievances,
                    ["status"]
                ),
            [grievances]
        );


    const grievancePriorityData =
        useMemo(
            () =>
                groupCount(
                    grievances,
                    ["priority"]
                ),
            [grievances]
        );


    const grievanceDepartmentData =
        useMemo(
            () =>
                groupCount(
                    grievances,
                    [
                        "department",
                        "departmentName",
                    ]
                ),
            [grievances]
        );


    // ========================================================
    // APPLICATION DATA
    // ========================================================

    const applicationStatusData =
        useMemo(
            () =>
                groupCount(
                    applications,
                    ["status"]
                ),
            [applications]
        );


    const applicationTypeData =
        useMemo(
            () =>
                groupCount(
                    applications,
                    [
                        "applicationType",
                        "serviceName",
                        "type",
                    ]
                ),
            [applications]
        );


    // ========================================================
    // WELFARE DATA
    // ========================================================

    const welfareSchemeData =
        useMemo(
            () =>
                groupCount(
                    welfare,
                    [
                        "name",
                        "schemeName",
                        "scheme",
                        "title",
                    ]
                ),
            [welfare]
        );


    const welfareBudgetData =
        useMemo(
            () =>
                welfare
                    .map((item) => ({
                        name: titleCase(
                            item.name ||
                            item.schemeName ||
                            item.scheme ||
                            item.title
                        ),
                        allocated:
                            numberValue(
                                item.allocatedBudget ??
                                item.allocatedAmount ??
                                item.totalBudget
                            ),
                        utilized:
                            numberValue(
                                item.utilizedBudget ??
                                item.utilizedAmount ??
                                item.spentAmount
                            ),
                    }))
                    .filter(
                        (item) =>
                            item.name !== "Unknown"
                    )
                    .slice(0, 10),
            [welfare]
        );


    // ========================================================
    // CERTIFICATE DATA
    // ========================================================

    const certificateServiceData =
        useMemo(
            () =>
                groupCount(
                    certificates,
                    [
                        "serviceName",
                        "certificateType",
                        "type",
                    ]
                ),
            [certificates]
        );


    const certificateDepartmentData =
        useMemo(
            () =>
                groupCount(
                    certificates,
                    [
                        "departmentName",
                        "department",
                    ]
                ),
            [certificates]
        );


    // ========================================================
    // OFFICER DATA
    // ========================================================

    const officerDepartmentData =
        useMemo(
            () =>
                groupCount(
                    officers,
                    [
                        "departmentName",
                        "department",
                    ]
                ),
            [officers]
        );


    // ========================================================
    // BUDGET DATA
    // ========================================================

    const budgetDepartmentData =
        useMemo(
            () =>
                budgets
                    .map((budget) => ({
                        name: titleCase(
                            budget.department
                        ),
                        total:
                            numberValue(
                                budget.totalBudget
                            ),
                        allocated:
                            numberValue(
                                budget.allocatedAmount
                            ),
                        spent:
                            numberValue(
                                budget.spentAmount
                            ),
                        remaining:
                            numberValue(
                                budget.remainingAmount
                            ),
                    }))
                    .filter(
                        (item) =>
                            item.name !== "Unknown"
                    ),
            [budgets]
        );


    // ========================================================
    // AUDIT DATA
    // ========================================================

    const auditModuleData =
        useMemo(
            () =>
                groupCount(
                    audit,
                    ["module"]
                ),
            [audit]
        );


    // ========================================================
    // NOTIFICATION DATA
    // ========================================================

    const notificationTypeData =
        useMemo(
            () =>
                groupCount(
                    notifications,
                    [
                        "type",
                        "notificationType",
                    ]
                ),
            [notifications]
        );


    // ========================================================
    // ========================================================
    // AUDIT & NOTIFICATION SUMMARY
    // ========================================================

    const auditActionData = useMemo(
        () =>
            groupCount(
                audit,
                ["action", "actionType", "activity", "eventType"]
            ),
        [audit]
    );

    const notificationStatusData = useMemo(
        () =>
            groupCount(
                notifications,
                ["status", "notificationStatus"]
            ),
        [notifications]
    );

    const unreadNotifications = notifications.filter(
        (item) =>
            item?.read === false ||
            item?.isRead === false ||
            item?.status === "UNREAD"
    ).length;

    const readNotifications = notifications.filter(
        (item) =>
            item?.read === true ||
            item?.isRead === true ||
            item?.status === "READ"
    ).length;

    const auditTotal = audit.length;
    const notificationTotal = notifications.length;

    // OVERALL SERVICE DATA
    // ========================================================

    const serviceVolumeData = [
        {
            name: "Citizens",
            value: totalCitizens,
        },
        {
            name: "Officers",
            value: totalOfficers,
        },
        {
            name: "Departments",
            value: totalDepartments,
        },
        {
            name: "Grievances",
            value: totalGrievances,
        },
        {
            name: "Applications",
            value: totalApplications,
        },
        {
            name: "Certificates",
            value: totalCertificates,
        },
        {
            name: "Welfare",
            value: welfare.length,
        },
    ];


    // ========================================================
    // BUDGET UTILIZATION
    // ========================================================

    const budgetUtilization =
        totalBudget > 0
            ? Math.round(
                (spentAmount / totalBudget) *
                100
            )
            : 0;


    // ========================================================
    // AI ANALYSIS
    // ========================================================

    const handleAIAnalysis =
        async () => {

            try {

                setAiLoading(true);

                const response =
                    await analyzeAdministration();

                const data =
                    response.data;

                if (
                    typeof data === "string"
                ) {

                    setAiAnalysis(data);

                } else if (
                    data?.analysis
                ) {

                    setAiAnalysis(
                        data.analysis
                    );

                } else {

                    setAiAnalysis(
                        JSON.stringify(
                            data,
                            null,
                            2
                        )
                    );
                }

            } catch (err) {

                console.error(
                    "Administrative AI analysis failed:",
                    err
                );

                setAiAnalysis(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    err?.message ||
                    "Unable to generate AI analysis."
                );

            } finally {

                setAiLoading(false);
            }
        };


    // ========================================================
    // DOWNLOAD AI REPORT
    // ========================================================

    const handleDownloadReport =
        async () => {

            try {

                setReportLoading(true);

                const response =
                    await downloadGrievanceReport();

                const blob =
                    new Blob(
                        [response.data],
                        {
                            type:
                                "application/pdf",
                        }
                    );

                const url =
                    window.URL.createObjectURL(
                        blob
                    );

                const link =
                    document.createElement(
                        "a"
                    );

                link.href = url;

                link.download =
                    "Smart-Governance-Administrative-Analytics.pdf";

                document.body.appendChild(
                    link
                );

                link.click();

                link.remove();

                window.URL.revokeObjectURL(
                    url
                );

            } catch (err) {

                console.error(
                    "Report download failed:",
                    err
                );

                alert(
                    "Unable to download the report."
                );

            } finally {

                setReportLoading(false);
            }
        };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    background:
                        "#F4F7FB",
                }}
            >

                <Sidebar />

                <Box
                    component="main"
                    sx={{
                        ml: {
                            xs: 0,
                            md: "270px",
                        },
                        p: 4,
                    }}
                >

                    <Header />

                    <Box
                        sx={{
                            minHeight:
                                "70vh",
                            display: "flex",
                            flexDirection:
                                "column",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                        }}
                    >

                        <CircularProgress
                            size={50}
                        />

                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                                mt: 2,
                            }}
                        >
                            Loading administrative analytics...
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                mt: 0.5,
                            }}
                        >
                            Collecting live data from the governance services.
                        </Typography>

                    </Box>

                </Box>

            </Box>
        );
    }


    // ========================================================
    // MAIN PAGE
    // ========================================================

    return (

        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "linear-gradient(180deg,#F4F7FB 0%,#EEF3F8 100%)",
            }}
        >

            <Sidebar />

            <Box
                component="main"
                sx={{
                    ml: {
                        xs: 0,
                        md: "270px",
                    },

                    px: {
                        xs: 2,
                        sm: 3,
                        md: 4,
                        lg: 5,
                    },

                    py: {
                        xs: 2,
                        md: 3,
                    },

                    width: {
                        xs: "100%",
                        md:
                            "calc(100% - 270px)",
                    },

                    boxSizing: "border-box",
                }}
            >

                <Header />


                {/* ==================================================
                    PAGE HEADER
                ================================================== */}

                <Box sx={{ mt: 3, mb: 4 }}>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems:
                                "center",
                            gap: 2,
                            flexWrap: "wrap",
                        }}
                    >

                        <Box>

                            <Typography
                                variant="h4"
                                fontWeight={800}
                                color="#172033"
                            >
                                Reports & Analytics
                            </Typography>

                            <Typography
                                color="text.secondary"
                                sx={{
                                    mt: 0.7,
                                }}
                            >
                                Detailed administrative analytics across the complete governance platform.
                            </Typography>

                        </Box>

                        <Button
                            variant="outlined"
                            startIcon={
                                <RefreshIcon />
                            }
                            onClick={
                                loadAnalytics
                            }
                            disabled={
                                loading
                            }
                            sx={{
                                borderRadius: 2.5,
                                fontWeight: 700,
                            }}
                        >
                            Refresh Data
                        </Button>

                    </Box>

                </Box>


                {error && (

                    <Alert
                        severity="warning"
                        sx={{
                            mb: 3,
                            borderRadius: 3,
                        }}
                    >
                        {error}
                    </Alert>

                )}


                {/* ==================================================
                    KPI CARDS
                ================================================== */}

                <Grid
                    container
                    spacing={2.5}
                    sx={{ mb: 4 }}
                >

                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                            md: 3,
                        }}
                    >
                        <MetricCard
                            title="Citizens"
                            value={
                                totalCitizens
                            }
                            icon={
                                <PeopleIcon />
                            }
                            description="Registered citizens"
                        />
                    </Grid>


                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                            md: 3,
                        }}
                    >
                        <MetricCard
                            title="Officers"
                            value={
                                totalOfficers
                            }
                            icon={
                                <BadgeIcon />
                            }
                            description="Active officers"
                        />
                    </Grid>


                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                            md: 3,
                        }}
                    >
                        <MetricCard
                            title="Departments"
                            value={
                                totalDepartments
                            }
                            icon={
                                <ApartmentIcon />
                            }
                            description="Administrative departments"
                        />
                    </Grid>


                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                            md: 3,
                        }}
                    >
                        <MetricCard
                            title="Grievances"
                            value={
                                totalGrievances
                            }
                            icon={
                                <ReportProblemIcon />
                            }
                            description="Registered grievances"
                        />
                    </Grid>


                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                            md: 3,
                        }}
                    >
                        <MetricCard
                            title="Applications"
                            value={
                                totalApplications
                            }
                            icon={
                                <AssignmentIcon />
                            }
                            description="Service applications"
                        />
                    </Grid>


                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                            md: 3,
                        }}
                    >
                        <MetricCard
                            title="Certificates"
                            value={
                                totalCertificates
                            }
                            icon={
                                <DescriptionIcon />
                            }
                            description="Issued certificates"
                        />
                    </Grid>


                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                            md: 3,
                        }}
                    >
                        <MetricCard
                            title="Welfare Schemes"
                            value={
                                welfare.length
                            }
                            icon={
                                <VolunteerActivismIcon />
                            }
                            description="Available schemes"
                        />
                    </Grid>


                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                            md: 3,
                        }}
                    >
                        <MetricCard
                            title="Total Budget"
                            value={
                                `₹${totalBudget.toLocaleString(
                                    "en-IN"
                                )}`
                            }
                            icon={
                                <AccountBalanceIcon />
                            }
                            description={
                                `${budgetUtilization}% recorded as spent`
                            }
                        />
                    </Grid>

                </Grid>


                {/* ==================================================
                    NAVIGATION TABS
                ================================================== */}

                <Card
                    sx={{
                        mb: 3,
                        borderRadius: 4,
                        border:
                            "1px solid #E1E8F0",
                    }}
                >

                    <Tabs
                        value={tab}
                        onChange={
                            (_, value) =>
                                setTab(value)
                        }
                        variant="scrollable"
                        scrollButtons="auto"
                    >

                        <Tab label="Overview" />

                        <Tab label="Grievances" />

                        <Tab label="Applications" />

                        <Tab label="Welfare" />

                        <Tab label="Certificates" />

                        <Tab label="Budget" />

                        <Tab label="Officers & Departments" />

                        <Tab label="Audit & Notifications" />

                        <Tab label="AI Insights" />

                    </Tabs>

                </Card>


                {/* ==================================================
                    OVERVIEW
                ================================================== */}

                {tab === 0 && (

                    <>

                        <Grid
                            container
                            spacing={3}
                        >

                            <Grid
                                size={{
                                    xs: 12,
                                    lg: 7,
                                }}
                            >

                                <ChartCard
                                    title="Administrative Service Volume"
                                    subtitle="Current records across the major administrative modules."
                                >

                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >

                                        <BarChart
                                            data={
                                                serviceVolumeData
                                            }
                                            margin={{
                                                top: 10,
                                                right: 20,
                                                left: 0,
                                                bottom: 30,
                                            }}
                                        >

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                            />

                                            <XAxis
                                                dataKey="name"
                                                angle={-25}
                                                textAnchor="end"
                                                interval={0}
                                            />

                                            <YAxis />

                                            <Tooltip />

                                            <Bar
                                                dataKey="value"
                                                fill="#1976D2"
                                                radius={[
                                                    6,
                                                    6,
                                                    0,
                                                    0,
                                                ]}
                                            />

                                        </BarChart>

                                    </ResponsiveContainer>

                                </ChartCard>

                            </Grid>


                            <Grid
                                size={{
                                    xs: 12,
                                    lg: 5,
                                }}
                            >

                                <ChartCard
                                    title="Grievance Status"
                                    subtitle="Distribution of grievance records by current status."
                                >

                                    {grievanceStatusData.length === 0 ? (

                                        <EmptyChart />

                                    ) : (

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >

                                            <PieChart>

                                                <Pie
                                                    data={
                                                        grievanceStatusData
                                                    }
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="45%"
                                                    outerRadius={100}
                                                    label
                                                >

                                                    {grievanceStatusData.map(
                                                        (_, index) => (
                                                            <Cell
                                                                key={
                                                                    index
                                                                }
                                                                fill={
                                                                    CHART_COLORS[
                                                                        index %
                                                                        CHART_COLORS.length
                                                                    ]
                                                                }
                                                            />
                                                        )
                                                    )}

                                                </Pie>

                                                <Tooltip />

                                                <Legend />

                                            </PieChart>

                                        </ResponsiveContainer>

                                    )}

                                </ChartCard>

                            </Grid>


                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6,
                                }}
                            >

                                <ChartCard
                                    title="Application Status"
                                    subtitle="Current service application distribution."
                                >

                                    {applicationStatusData.length === 0 ? (

                                        <EmptyChart />

                                    ) : (

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >

                                            <BarChart
                                                data={
                                                    applicationStatusData
                                                }
                                            >

                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                />

                                                <XAxis
                                                    dataKey="name"
                                                />

                                                <YAxis />

                                                <Tooltip />

                                                <Bar
                                                    dataKey="value"
                                                    fill="#42A5F5"
                                                    radius={[
                                                        6,
                                                        6,
                                                        0,
                                                        0,
                                                    ]}
                                                />

                                            </BarChart>

                                        </ResponsiveContainer>

                                    )}

                                </ChartCard>

                            </Grid>


                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6,
                                }}
                            >

                                <ChartCard
                                    title="Grievance Priority"
                                    subtitle="Priority distribution across grievance records."
                                >

                                    {grievancePriorityData.length === 0 ? (

                                        <EmptyChart />

                                    ) : (

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >

                                            <BarChart
                                                data={
                                                    grievancePriorityData
                                                }
                                            >

                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                />

                                                <XAxis
                                                    dataKey="name"
                                                />

                                                <YAxis />

                                                <Tooltip />

                                                <Bar
                                                    dataKey="value"
                                                    fill="#EF5350"
                                                    radius={[
                                                        6,
                                                        6,
                                                        0,
                                                        0,
                                                    ]}
                                                />

                                            </BarChart>

                                        </ResponsiveContainer>

                                    )}

                                </ChartCard>

                            </Grid>


                            <Grid
                                size={{
                                    xs: 12,
                                }}
                            >

                                <ChartCard
                                    title="Budget Overview"
                                    subtitle="Total, allocated, spent and remaining amounts from the reporting data."
                                >

                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >

                                        <BarChart
                                            data={[
                                                {
                                                    name: "Budget",
                                                    total:
                                                        totalBudget,
                                                    allocated:
                                                        allocatedAmount,
                                                    spent:
                                                        spentAmount,
                                                    remaining:
                                                        remainingAmount,
                                                },
                                            ]}
                                        >

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                            />

                                            <XAxis
                                                dataKey="name"
                                            />

                                            <YAxis />

                                            <Tooltip />

                                            <Legend />

                                            <Bar
                                                dataKey="total"
                                                fill="#1976D2"
                                            />

                                            <Bar
                                                dataKey="allocated"
                                                fill="#42A5F5"
                                            />

                                            <Bar
                                                dataKey="spent"
                                                fill="#66BB6A"
                                            />

                                            <Bar
                                                dataKey="remaining"
                                                fill="#FFA726"
                                            />

                                        </BarChart>

                                    </ResponsiveContainer>

                                </ChartCard>

                            </Grid>

                        </Grid>

                    </>

                )}


                {/* ==================================================
                    GRIEVANCES
                ================================================== */}

                {tab === 1 && (

                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid
                            size={{
                                xs: 12,
                                md: 6,
                            }}
                        >

                            <ChartCard
                                title="Grievances by Status"
                            >

                                {grievanceStatusData.length ? (

                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >

                                        <PieChart>

                                            <Pie
                                                data={
                                                    grievanceStatusData
                                                }
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="45%"
                                                outerRadius={105}
                                                label
                                            >

                                                {grievanceStatusData.map(
                                                    (_, index) => (
                                                        <Cell
                                                            key={
                                                                index
                                                            }
                                                            fill={
                                                                CHART_COLORS[
                                                                    index %
                                                                    CHART_COLORS.length
                                                                ]
                                                            }
                                                        />
                                                    )
                                                )}

                                            </Pie>

                                            <Tooltip />

                                            <Legend />

                                        </PieChart>

                                    </ResponsiveContainer>

                                ) : (
                                    <EmptyChart />
                                )}

                            </ChartCard>

                        </Grid>


                        <Grid
                            size={{
                                xs: 12,
                                md: 6,
                            }}
                        >

                            <ChartCard
                                title="Grievances by Priority"
                            >

                                {grievancePriorityData.length ? (

                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >

                                        <BarChart
                                            data={
                                                grievancePriorityData
                                            }
                                        >

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                            />

                                            <XAxis
                                                dataKey="name"
                                            />

                                            <YAxis />

                                            <Tooltip />

                                            <Bar
                                                dataKey="value"
                                                fill="#EF5350"
                                            />

                                        </BarChart>

                                    </ResponsiveContainer>

                                ) : (
                                    <EmptyChart />
                                )}

                            </ChartCard>

                        </Grid>


                        <Grid
                            size={{
                                xs: 12,
                            }}
                        >

                            <ChartCard
                                title="Grievances by Department"
                                subtitle="Departments with the highest number of grievance records."
                            >

                                {grievanceDepartmentData.length ? (

                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >

                                        <BarChart
                                            data={
                                                grievanceDepartmentData
                                            }
                                            layout="vertical"
                                            margin={{
                                                left: 40,
                                            }}
                                        >

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                            />

                                            <XAxis
                                                type="number"
                                            />

                                            <YAxis
                                                type="category"
                                                dataKey="name"
                                                width={140}
                                            />

                                            <Tooltip />

                                            <Bar
                                                dataKey="value"
                                                fill="#1976D2"
                                            />

                                        </BarChart>

                                    </ResponsiveContainer>

                                ) : (
                                    <EmptyChart />
                                )}

                            </ChartCard>

                        </Grid>

                    </Grid>

                )}


                {/* ==================================================
                    APPLICATIONS
                ================================================== */}

                {tab === 2 && (

                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid
                            size={{
                                xs: 12,
                                md: 6,
                            }}
                        >

                            <ChartCard
                                title="Application Status"
                            >

                                {applicationStatusData.length ? (

                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >

                                        <PieChart>

                                            <Pie
                                                data={
                                                    applicationStatusData
                                                }
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="45%"
                                                outerRadius={105}
                                                label
                                            >

                                                {applicationStatusData.map(
                                                    (_, index) => (
                                                        <Cell
                                                            key={
                                                                index
                                                            }
                                                            fill={
                                                                CHART_COLORS[
                                                                    index %
                                                                    CHART_COLORS.length
                                                                ]
                                                            }
                                                        />
                                                    )
                                                )}

                                            </Pie>

                                            <Tooltip />

                                            <Legend />

                                        </PieChart>

                                    </ResponsiveContainer>

                                ) : (
                                    <EmptyChart />
                                )}

                            </ChartCard>

                        </Grid>


                        <Grid
                            size={{
                                xs: 12,
                                md: 6,
                            }}
                        >

                            <ChartCard
                                title="Application Types"
                            >

                                {applicationTypeData.length ? (

                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >

                                        <BarChart
                                            data={
                                                applicationTypeData
                                            }
                                        >

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                            />

                                            <XAxis
                                                dataKey="name"
                                                angle={-25}
                                                textAnchor="end"
                                            />

                                            <YAxis />

                                            <Tooltip />

                                            <Bar
                                                dataKey="value"
                                                fill="#7E57C2"
                                            />

                                        </BarChart>

                                    </ResponsiveContainer>

                                ) : (
                                    <EmptyChart />
                                )}

                            </ChartCard>

                        </Grid>

                    </Grid>

                )}


                {/* ==================================================
                    WELFARE
                ================================================== */}

                {tab === 3 && (

                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid
                            size={{
                                xs: 12,
                                md: 6,
                            }}
                        >

                            <ChartCard
                                title="Welfare Schemes"
                                subtitle="Number of available schemes by name."
                            >

                                {welfareSchemeData.length ? (

                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >

                                        <BarChart
                                            data={
                                                welfareSchemeData
                                            }
                                            layout="vertical"
                                        >

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                            />

                                            <XAxis
                                                type="number"
                                            />

                                            <YAxis
                                                type="category"
                                                dataKey="name"
                                                width={150}
                                            />

                                            <Tooltip />

                                            <Bar
                                                dataKey="value"
                                                fill="#26A69A"
                                            />

                                        </BarChart>

                                    </ResponsiveContainer>

                                ) : (
                                    <EmptyChart />
                                )}

                            </ChartCard>

                        </Grid>


                        <Grid
                            size={{
                                xs: 12,
                                md: 6,
                            }}
                        >

                            <ChartCard
                                title="Welfare Budget Utilization"
                                subtitle="Allocated and utilized amounts where the service provides them."
                            >

                                {welfareBudgetData.length ? (

                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >

                                        <BarChart
                                            data={
                                                welfareBudgetData
                                            }
                                        >

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                            />

                                            <XAxis
                                                dataKey="name"
                                                angle={-25}
                                                textAnchor="end"
                                            />

                                            <YAxis />

                                            <Tooltip />

                                            <Legend />

                                            <Bar
                                                dataKey="allocated"
                                                fill="#1976D2"
                                                name="Allocated"
                                            />

                                            <Bar
                                                dataKey="utilized"
                                                fill="#66BB6A"
                                                name="Utilized"
                                            />

                                        </BarChart>

                                    </ResponsiveContainer>

                                ) : (
                                    <EmptyChart
                                        message="Welfare budget details are not available."
                                    />
                                )}

                            </ChartCard>

                        </Grid>

                    </Grid>

                )}


                {/* ==================================================
                    CERTIFICATES
                ================================================== */}

                {tab === 4 && (

                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid
                            size={{
                                xs: 12,
                                md: 6,
                            }}
                        >

                            <ChartCard
                                title="Certificates by Service"
                            >

                                {certificateServiceData.length ? (

                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >

                                        <PieChart>

                                            <Pie
                                                data={
                                                    certificateServiceData
                                                }
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="45%"
                                                outerRadius={105}
                                                label
                                            >

                                                {certificateServiceData.map(
                                                    (_, index) => (
                                                        <Cell
                                                            key={
                                                                index
                                                            }
                                                            fill={
                                                                CHART_COLORS[
                                                                    index %
                                                                    CHART_COLORS.length
                                                                ]
                                                            }
                                                        />
                                                    )
                                                )}

                                            </Pie>

                                            <Tooltip />

                                            <Legend />

                                        </PieChart>

                                    </ResponsiveContainer>

                                ) : (
                                    <EmptyChart />
                                )}

                            </ChartCard>

                        </Grid>


                        <Grid
                            size={{
                                xs: 12,
                                md: 6,
                            }}
                        >

                            <ChartCard
                                title="Certificates by Department"
                            >

                                {certificateDepartmentData.length ? (

                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >

                                        <BarChart
                                            data={
                                                certificateDepartmentData
                                            }
                                        >

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                            />

                                            <XAxis
                                                dataKey="name"
                                            />

                                            <YAxis />

                                            <Tooltip />

                                            <Bar
                                                dataKey="value"
                                                fill="#42A5F5"
                                            />

                                        </BarChart>

                                    </ResponsiveContainer>

                                ) : (
                                    <EmptyChart />
                                )}

                            </ChartCard>

                        </Grid>

                    </Grid>

                )}


                {/* ==================================================
                    BUDGET
                ================================================== */}

                {tab === 5 && (

                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid
                            size={{
                                xs: 12,
                                md: 4,
                            }}
                        >

                            <MetricCard
                                title="Total Budget"
                                value={
                                    `₹${totalBudget.toLocaleString(
                                        "en-IN"
                                    )}`
                                }
                                icon={
                                    <AccountBalanceIcon />
                                }
                            />

                        </Grid>


                        <Grid
                            size={{
                                xs: 12,
                                md: 4,
                            }}
                        >

                            <MetricCard
                                title="Allocated"
                                value={
                                    `₹${allocatedAmount.toLocaleString(
                                        "en-IN"
                                    )}`
                                }
                                icon={
                                    <AccountBalanceIcon />
                                }
                            />

                        </Grid>


                        <Grid
                            size={{
                                xs: 12,
                                md: 4,
                            }}
                        >

                            <MetricCard
                                title="Spent"
                                value={
                                    `₹${spentAmount.toLocaleString(
                                        "en-IN"
                                    )}`
                                }
                                icon={
                                    <AccountBalanceIcon />
                                }
                                description={
                                    `${budgetUtilization}% of total budget`
                                }
                            />

                        </Grid>


                        <Grid
                            size={{
                                xs: 12,
                            }}
                        >

                            <ChartCard
                                title="Department Budget"
                                subtitle="Budget allocation and expenditure by department."
                            >

                                {budgetDepartmentData.length ? (

                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >

                                        <BarChart
                                            data={
                                                budgetDepartmentData
                                            }
                                        >

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                            />

                                            <XAxis
                                                dataKey="name"
                                            />

                                            <YAxis />

                                            <Tooltip />

                                            <Legend />

                                            <Bar
                                                dataKey="total"
                                                fill="#1976D2"
                                                name="Total"
                                            />

                                            <Bar
                                                dataKey="allocated"
                                                fill="#42A5F5"
                                                name="Allocated"
                                            />

                                            <Bar
                                                dataKey="spent"
                                                fill="#66BB6A"
                                                name="Spent"
                                            />

                                        </BarChart>

                                    </ResponsiveContainer>

                                ) : (
                                    <EmptyChart />
                                )}

                            </ChartCard>

                        </Grid>


                        <Grid
                            size={{
                                xs: 12,
                            }}
                        >

                            <Card
                                sx={{
                                    borderRadius: 4,
                                    border:
                                        "1px solid #E1E8F0",
                                }}
                            >

                                <CardContent sx={{ p: 3 }}>

                                    <Typography
                                        variant="h6"
                                        fontWeight={800}
                                    >
                                        Budget Utilization
                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                        fontSize="0.82rem"
                                        sx={{
                                            mt: 0.5,
                                            mb: 2,
                                        }}
                                    >
                                        Recorded expenditure compared with the total budget.
                                    </Typography>

                                    <LinearProgress
                                        variant="determinate"
                                        value={
                                            Math.min(
                                                budgetUtilization,
                                                100
                                            )
                                        }
                                        sx={{
                                            height: 12,
                                            borderRadius: 10,
                                        }}
                                    />

                                    <Box
                                        sx={{
                                            display:
                                                "flex",
                                            justifyContent:
                                                "space-between",
                                            mt: 1,
                                        }}
                                    >

                                        <Typography
                                            fontWeight={700}
                                        >
                                            {budgetUtilization}%
                                        </Typography>

                                        <Typography
                                            color="text.secondary"
                                        >
                                            Spent
                                        </Typography>

                                    </Box>

                                </CardContent>

                            </Card>

                        </Grid>

                    </Grid>

                )}


                {/* ==================================================
                    OFFICERS & DEPARTMENTS
                ================================================== */}

                {tab === 6 && (

                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid
                            size={{
                                xs: 12,
                                md: 6,
                            }}
                        >

                            <ChartCard
                                title="Officers by Department"
                                subtitle="Distribution of officers across departments."
                            >

                                {officerDepartmentData.length ? (

                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >

                                        <BarChart
                                            data={
                                                officerDepartmentData
                                            }
                                            layout="vertical"
                                        >

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                            />

                                            <XAxis
                                                type="number"
                                            />

                                            <YAxis
                                                type="category"
                                                dataKey="name"
                                                width={150}
                                            />

                                            <Tooltip />

                                            <Bar
                                                dataKey="value"
                                                fill="#1976D2"
                                            />

                                        </BarChart>

                                    </ResponsiveContainer>

                                ) : (
                                    <EmptyChart />
                                )}

                            </ChartCard>

                        </Grid>


                        <Grid
                            size={{
                                xs: 12,
                                md: 6,
                            }}
                        >

                            <ChartCard
                                title="Departments"
                                subtitle="Current departments available in the administrative system."
                            >

                                <Box
                                    sx={{
                                        height: "100%",
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        flexDirection:
                                            "column",
                                    }}
                                >

                                    <ApartmentIcon
                                        sx={{
                                            fontSize: 70,
                                            color:
                                                "#1976D2",
                                            mb: 2,
                                        }}
                                    />

                                    <Typography
                                        variant="h2"
                                        fontWeight={800}
                                        color="#1565C0"
                                    >
                                        {
                                            totalDepartments
                                        }
                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                    >
                                        Active departments
                                    </Typography>

                                </Box>

                            </ChartCard>

                        </Grid>

                    </Grid>

                )}


   {/* ==================================================
    AUDIT & NOTIFICATIONS
================================================== */}

    {tab === 7 && (
        <>
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <MetricCard title="Audit Activities" value={auditTotal} icon={<SecurityIcon />} description="Recorded system activities" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <MetricCard title="Notifications" value={notificationTotal} icon={<NotificationsIcon />} description="Total system notifications" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <MetricCard title="Unread Alerts" value={unreadNotifications} icon={<NotificationsIcon />} description="Notifications requiring attention" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <MetricCard title="Read Notifications" value={readNotifications} icon={<SecurityIcon />} description="Notifications already reviewed" />
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <ChartCard title="Audit Activity by Module" subtitle="Administrative activity across governance modules.">
                        {auditModuleData.length ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={auditModuleData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#8D6E63" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <EmptyChart message="No audit activity is available." />}
                    </ChartCard>
                </Grid>

                <Grid size={{ xs: 12, lg: 6 }}>
                    <ChartCard title="Audit Actions" subtitle="Types of actions performed across the platform.">
                        {auditActionData.length ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={auditActionData} dataKey="value" nameKey="name" cx="50%" cy="45%" outerRadius={105} label>
                                        {auditActionData.map((_, index) => (
                                            <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <EmptyChart message="No audit action data is available." />}
                    </ChartCard>
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <ChartCard title="Notifications by Type" subtitle="Distribution of notifications generated by the system.">
                        {notificationTypeData.length ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={notificationTypeData} dataKey="value" nameKey="name" cx="50%" cy="45%" outerRadius={105} label>
                                        {notificationTypeData.map((_, index) => (
                                            <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <EmptyChart message="No notification data is available." />}
                    </ChartCard>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <ChartCard title="Notification Status" subtitle="Read and unread notifications requiring administrator attention.">
                        {notificationStatusData.length ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={notificationStatusData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#1976D2" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <EmptyChart message="Notification status data is unavailable." />}
                    </ChartCard>
                </Grid>
            </Grid>

            <Card sx={{ borderRadius: 4, border: "1px solid #E1E8F0", boxShadow: "0 6px 24px rgba(15,55,95,0.06)", mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
                        <Box>
                            <Typography variant="h6" fontWeight={800}>Recent Audit Activity</Typography>
                            <Typography fontSize="0.82rem" color="text.secondary" sx={{ mt: 0.5 }}>Recent administrative actions recorded by the system.</Typography>
                        </Box>
                        <Chip icon={<SecurityIcon />} label={`${auditTotal} activities`} sx={{ fontWeight: 700 }} />
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    {audit.length === 0 ? (
                        <Box sx={{ py: 5, textAlign: "center" }}>
                            <SecurityIcon sx={{ fontSize: 50, color: "#90A4AE" }} />
                            <Typography sx={{ mt: 1 }} color="text.secondary">No audit records available.</Typography>
                        </Box>
                    ) : (
                        <Box sx={{ overflowX: "auto" }}>
                            <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", "& th": { background: "#F4F7FB", color: "#344054", fontWeight: 800, textAlign: "left", padding: "12px", borderBottom: "1px solid #E1E8F0", whiteSpace: "nowrap" }, "& td": { padding: "12px", borderBottom: "1px solid #EEF2F6", color: "#475467" }, "& tr:hover": { background: "#F8FAFC" } }}>
                                <thead><tr><th>Date / Time</th><th>User</th><th>Action</th><th>Module</th><th>Record</th></tr></thead>
                                <tbody>
                                    {audit.slice(0, 10).map((item, index) => (
                                        <tr key={item.id ?? item.auditId ?? index}>
                                            <td>{textValue(item.createdAt ?? item.timestamp ?? item.date, "Unknown")}</td>
                                            <td>{textValue(item.username ?? item.userName ?? item.performedBy ?? item.user ?? item.officerName)}</td>
                                            <td><Chip size="small" label={titleCase(item.action ?? item.actionType ?? item.activity ?? item.eventType)} sx={{ fontWeight: 700 }} /></td>
                                            <td>{titleCase(item.module)}</td>
                                            <td>{textValue(item.recordId ?? item.entityId ?? item.referenceId, "-")}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Box>
                        </Box>
                    )}
                </CardContent>
            </Card>

            <Card sx={{ borderRadius: 4, border: "1px solid #E1E8F0", boxShadow: "0 6px 24px rgba(15,55,95,0.06)" }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
                        <Box>
                            <Typography variant="h6" fontWeight={800}>Recent Notifications</Typography>
                            <Typography fontSize="0.82rem" color="text.secondary" sx={{ mt: 0.5 }}>Alerts and system messages requiring administrator awareness.</Typography>
                        </Box>
                        <Chip icon={<NotificationsIcon />} label={`${notificationTotal} notifications`} sx={{ fontWeight: 700 }} />
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    {notifications.length === 0 ? (
                        <Box sx={{ py: 5, textAlign: "center" }}>
                            <NotificationsIcon sx={{ fontSize: 50, color: "#90A4AE" }} />
                            <Typography sx={{ mt: 1 }} color="text.secondary">No notifications available.</Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {notifications.slice(0, 8).map((item, index) => {
                                const isUnread = item?.read === false || item?.isRead === false || item?.status === "UNREAD";
                                return (
                                    <Grid size={{ xs: 12, md: 6 }} key={item.id ?? item.notificationId ?? index}>
                                        <Card variant="outlined" sx={{ borderRadius: 3, background: isUnread ? "#F4F8FF" : "#FFFFFF", borderColor: isUnread ? "#90CAF9" : "#E1E8F0" }}>
                                            <CardContent>
                                                <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                                                    <Box sx={{ width: 42, height: 42, borderRadius: 2.5, background: "#EAF2FB", color: "#1976D2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                        <NotificationsIcon />
                                                    </Box>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
                                                            <Typography fontWeight={800}>{textValue(item.title ?? item.subject ?? item.message ?? item.notificationType, "System Notification")}</Typography>
                                                            {isUnread && <Chip size="small" label="Unread" color="primary" />}
                                                        </Box>
                                                        <Typography fontSize="0.85rem" color="text.secondary" sx={{ mt: 0.7 }}>{textValue(item.message ?? item.description, "No message details available.")}</Typography>
                                                        <Typography fontSize="0.72rem" color="text.secondary" sx={{ mt: 1 }}>{textValue(item.createdAt ?? item.timestamp ?? item.date, "")}</Typography>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </CardContent>
            </Card>
        </>
    )}

                {/* ==================================================
                    AI INSIGHTS
                ================================================== */}

                {tab === 8 && (

                    <Card
                        sx={{
                            borderRadius: 5,
                            overflow: "hidden",
                            border:
                                "1px solid #D8E3EF",
                            boxShadow:
                                "0 12px 40px rgba(15,55,95,0.08)",
                        }}
                    >

                        {/* AI HEADER */}

                        <Box
                            sx={{
                                p: 3,
                                background:
                                    "linear-gradient(135deg,#082B5C,#1976D2)",
                                color: "white",
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "space-between",
                                gap: 2,
                                flexWrap:
                                    "wrap",
                            }}
                        >

                            <Box
                                sx={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    gap: 1.5,
                                }}
                            >

                                <PsychologyIcon
                                    sx={{
                                        fontSize: 38,
                                    }}
                                />

                                <Box>

                                    <Typography
                                        variant="h5"
                                        fontWeight={800}
                                    >
                                        AI Governance Intelligence
                                    </Typography>

                                    <Typography
                                        fontSize="0.85rem"
                                        sx={{
                                            opacity:
                                                0.85,
                                        }}
                                    >
                                        Intelligent analysis across the complete administrative system
                                    </Typography>

                                </Box>

                            </Box>


                            <Button
                                variant="contained"
                                startIcon={
                                    aiLoading ? (
                                        <CircularProgress
                                            size={18}
                                            color="inherit"
                                        />
                                    ) : (
                                        <PsychologyIcon />
                                    )
                                }
                                onClick={
                                    handleAIAnalysis
                                }
                                disabled={
                                    aiLoading
                                }
                                sx={{
                                    background:
                                        "white",
                                    color:
                                        "#1565C0",
                                    fontWeight:
                                        800,
                                    borderRadius:
                                        2.5,
                                }}
                            >
                                {aiLoading
                                    ? "Analyzing..."
                                    : aiAnalysis
                                        ? "Regenerate Analysis"
                                        : "Analyze Administration"}
                            </Button>

                        </Box>


                        <CardContent
                            sx={{
                                p: {
                                    xs: 2,
                                    md: 4,
                                },
                            }}
                        >

                            {!aiAnalysis &&
                                !aiLoading && (

                                    <Box
                                        sx={{
                                            py: 7,
                                            textAlign:
                                                "center",
                                        }}
                                    >

                                        <PsychologyIcon
                                            sx={{
                                                fontSize: 70,
                                                color:
                                                    "#1976D2",
                                            }}
                                        />

                                        <Typography
                                            variant="h5"
                                            fontWeight={800}
                                            sx={{
                                                mt: 1,
                                            }}
                                        >
                                            Ready to analyze the administration
                                        </Typography>

                                        <Typography
                                            color="text.secondary"
                                            sx={{
                                                mt: 1,
                                                maxWidth:
                                                    700,
                                                mx: "auto",
                                            }}
                                        >
                                            Generate an AI report using live information from citizens, departments, officers, grievances, applications, welfare, certificates, budgets, audit and notifications.
                                        </Typography>

                                    </Box>

                                )}


                            {aiLoading && (

                                <Box
                                    sx={{
                                        py: 7,
                                        textAlign:
                                            "center",
                                    }}
                                >

                                    <CircularProgress
                                        size={50}
                                    />

                                    <Typography
                                        variant="h6"
                                        fontWeight={800}
                                        sx={{
                                            mt: 2,
                                        }}
                                    >
                                        AI is analyzing the governance system...
                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                        sx={{
                                            mt: 1,
                                        }}
                                    >
                                        Comparing live data across all administrative services.
                                    </Typography>

                                </Box>

                            )}


                            {aiAnalysis &&
                                !aiLoading && (

                                    <>

                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                justifyContent:
                                                    "space-between",
                                                alignItems:
                                                    "center",
                                                gap: 2,
                                                flexWrap:
                                                    "wrap",
                                                mb: 3,
                                            }}
                                        >

                                            <Box>

                                                <Typography
                                                    variant="h6"
                                                    fontWeight={800}
                                                >
                                                    Administrative AI Report
                                                </Typography>

                                                <Typography
                                                    fontSize="0.8rem"
                                                    color="text.secondary"
                                                >
                                                    Generated from current live administrative data
                                                </Typography>

                                            </Box>

                                            <Box
                                                sx={{
                                                    display:
                                                        "flex",
                                                    gap: 1,
                                                }}
                                            >

                                                <Chip
                                                    icon={
                                                        <PsychologyIcon />
                                                    }
                                                    label="AI Analysis Complete"
                                                    sx={{
                                                        background:
                                                            "#E8F5E9",
                                                        color:
                                                            "#2E7D32",
                                                        fontWeight:
                                                            700,
                                                    }}
                                                />

                                                <Button
                                                    variant="outlined"
                                                    startIcon={
                                                        <RefreshIcon />
                                                    }
                                                    onClick={
                                                        handleAIAnalysis
                                                    }
                                                    disabled={
                                                        aiLoading
                                                    }
                                                    size="small"
                                                >
                                                    Refresh
                                                </Button>

                                            </Box>

                                        </Box>


                                        <Divider
                                            sx={{
                                                mb: 3,
                                            }}
                                        />


                                        <Box
                                            sx={{
                                                background:
                                                    "#F8FAFC",
                                                border:
                                                    "1px solid #E1E8F0",
                                                borderRadius:
                                                    4,
                                                p: {
                                                    xs: 2,
                                                    md: 4,
                                                },
                                                maxHeight:
                                                    800,
                                                overflowY:
                                                    "auto",

                                                "& h1": {
                                                    color:
                                                        "#123B6D",
                                                    marginTop:
                                                        "28px",
                                                },

                                                "& h2": {
                                                    color:
                                                        "#1565C0",
                                                    marginTop:
                                                        "25px",
                                                },

                                                "& h3": {
                                                    color:
                                                        "#344054",
                                                },

                                                "& p": {
                                                    color:
                                                        "#344054",
                                                    lineHeight:
                                                        1.8,
                                                },

                                                "& li": {
                                                    color:
                                                        "#344054",
                                                    lineHeight:
                                                        1.7,
                                                    marginBottom:
                                                        "7px",
                                                },

                                                "& strong": {
                                                    color:
                                                        "#172033",
                                                },

                                                "& table": {
                                                    width:
                                                        "100%",
                                                    borderCollapse:
                                                        "collapse",
                                                    marginTop:
                                                        "20px",
                                                    marginBottom:
                                                        "20px",
                                                },

                                                "& th": {
                                                    background:
                                                        "#123B6D",
                                                    color:
                                                        "white",
                                                    padding:
                                                        "12px",
                                                    textAlign:
                                                        "left",
                                                },

                                                "& td": {
                                                    border:
                                                        "1px solid #D9E2EC",
                                                    padding:
                                                        "12px",
                                                },
                                            }}
                                        >

                                            <ReactMarkdown
                                                remarkPlugins={[
                                                    remarkGfm,
                                                ]}
                                            >
                                                {aiAnalysis}
                                            </ReactMarkdown>

                                        </Box>


                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                justifyContent:
                                                    "flex-end",
                                                mt: 3,
                                            }}
                                        >

                                            <Button
                                                variant="contained"
                                                color="success"
                                                startIcon={
                                                    reportLoading ? (
                                                        <CircularProgress
                                                            size={
                                                                18
                                                            }
                                                            color="inherit"
                                                        />
                                                    ) : (
                                                        <DownloadIcon />
                                                    )
                                                }
                                                onClick={
                                                    handleDownloadReport
                                                }
                                                disabled={
                                                    reportLoading
                                                }
                                                sx={{
                                                    borderRadius:
                                                        2.5,
                                                    fontWeight:
                                                        700,
                                                }}
                                            >
                                                {reportLoading
                                                    ? "Generating..."
                                                    : "Download AI Report"}
                                            </Button>

                                        </Box>

                                    </>

                                )}

                        </CardContent>

                    </Card>

                )}

            </Box>

        </Box>
    );
}

export default Reports;
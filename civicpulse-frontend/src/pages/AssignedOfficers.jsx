import { useEffect, useState } from "react";

import {
    Box,
    Typography,
    Paper,
    TextField,
    Card,
    CardContent,
    Grid,
    Chip,
    Button,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from "@mui/material";

import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import {
    getAllOfficers,
} from "../services/officerService";

import {
    getAllGrievances,
} from "../services/grievanceService";


function AssignedOfficers() {

    const [officers, setOfficers] = useState([]);
    const [grievances, setGrievances] = useState([]);

    const [search, setSearch] = useState("");

    const [selectedDepartment, setSelectedDepartment] =
        useState(null);

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        loadData();
    }, []);


    const loadData = async () => {

        try {

            setLoading(true);

            const [officerData, grievanceData] =
                await Promise.all([
                    getAllOfficers(),
                    getAllGrievances(),
                ]);

            setOfficers(officerData || []);
            setGrievances(grievanceData || []);

        } catch (error) {

            console.error(
                "Failed to load assignment data:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    /*
     * Get department name from officer.
     *
     * This supports both:
     *
     * department: {
     *     id: 1,
     *     name: "Water Supply Department"
     * }
     *
     * and
     *
     * department: "Water Supply Department"
     */
    const getDepartmentName = (officer) => {

        if (!officer?.department) {
            return "Department Not Assigned";
        }

        if (
            typeof officer.department === "object"
        ) {
            return officer.department.name ||
                "Department Not Assigned";
        }

        return officer.department;

    };


    /*
     * Build departments dynamically.
     *
     * NO department names are written here.
     */
    const departments = {};

    officers.forEach((officer) => {

        const departmentName =
            getDepartmentName(officer);

        if (!departments[departmentName]) {

            departments[departmentName] = {
                name: departmentName,
                officers: [],
                complaints: [],
            };

        }

        departments[departmentName]
            .officers
            .push(officer);

    });


    /*
     * Connect grievances with officers.
     *
     * Primary connection:
     *
     * assignedOfficerId → officer.id
     *
     * The old assignedOfficer name is kept
     * as a fallback for existing records.
     */
    grievances.forEach((grievance) => {

        if (!grievance.assignedOfficerId &&
            !grievance.assignedOfficer) {
            return;
        }

        let officer = null;


        if (grievance.assignedOfficerId) {

            officer = officers.find(
                (o) =>
                    Number(o.id) ===
                    Number(grievance.assignedOfficerId)
            );

        }


        /*
         * Fallback for old assignments
         * which only have assignedOfficer name.
         */
        if (!officer && grievance.assignedOfficer) {

            officer = officers.find(
                (o) =>
                    o.fullName?.toLowerCase() ===
                    grievance.assignedOfficer?.toLowerCase()
            );

        }


        if (!officer) {
            return;
        }


        const departmentName =
            getDepartmentName(officer);


        if (!departments[departmentName]) {

            departments[departmentName] = {
                name: departmentName,
                officers: [],
                complaints: [],
            };

        }


        departments[departmentName]
            .complaints
            .push({
                ...grievance,
                matchedOfficerId: officer.id,
            });

    });


    const departmentList =
        Object.values(departments)
            .filter((department) => {

                /*
                 * Only show departments which
                 * actually have officers.
                 */
                return department.officers.length > 0;

            })
            .filter((department) => {

                if (!search.trim()) {
                    return true;
                }

                return department.name
                    .toLowerCase()
                    .includes(search.toLowerCase());

            });


    const assignedOfficerCount =
        officers.filter((officer) => {

            return grievances.some(
                (g) => {

                    if (g.assignedOfficerId) {

                        return Number(g.assignedOfficerId) ===
                            Number(officer.id);

                    }

                    return (
                        g.assignedOfficer &&
                        g.assignedOfficer.toLowerCase() ===
                        officer.fullName?.toLowerCase()
                    );

                }
            );

        }).length;


    const assignedComplaintCount =
        grievances.filter(
            (g) =>
                g.assignedOfficerId ||
                g.assignedOfficer
        ).length;


    /*
     * Complaints for the selected department.
     */
    const getOfficerComplaints = (officer) => {

        return selectedDepartment?.complaints.filter(
            (grievance) => {

                if (grievance.assignedOfficerId) {

                    return Number(
                        grievance.assignedOfficerId
                    ) === Number(officer.id);

                }

                return (
                    grievance.assignedOfficer &&
                    grievance.assignedOfficer
                        .toLowerCase() ===
                    officer.fullName?.toLowerCase()
                );

            }
        ) || [];

    };


    return (
        <>
            <Sidebar />

            <Box
                sx={{
                    ml: "270px",
                    minHeight: "100vh",
                    background: "#F4F6F9",
                    p: 4,
                }}
            >

                <Header />


                {/* PAGE TITLE */}

                <Box sx={{ mt: 3 }}>

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="#173B68"
                    >
                        👨‍💼 Assigned Officers
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        View officer assignments by department
                    </Typography>

                </Box>


                {/* SUMMARY CARDS */}

                <Grid
                    container
                    spacing={3}
                    sx={{ mt: 1 }}
                >

                    <Grid
                        size={{ xs: 12, md: 4 }}
                    >

                        <Card
                            sx={{
                                borderRadius: 4,
                                boxShadow:
                                    "0 4px 12px rgba(0,0,0,0.12)",
                            }}
                        >

                            <CardContent>

                                <PeopleIcon
                                    sx={{
                                        fontSize: 40,
                                        color: "#1976D2",
                                    }}
                                />

                                <Typography
                                    color="text.secondary"
                                >
                                    Assigned Officers
                                </Typography>

                                <Typography
                                    variant="h3"
                                    fontWeight="bold"
                                >
                                    {assignedOfficerCount}
                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>


                    <Grid
                        size={{ xs: 12, md: 4 }}
                    >

                        <Card
                            sx={{
                                borderRadius: 4,
                                boxShadow:
                                    "0 4px 12px rgba(0,0,0,0.12)",
                            }}
                        >

                            <CardContent>

                                <AssignmentIcon
                                    sx={{
                                        fontSize: 40,
                                        color: "#2E7D32",
                                    }}
                                />

                                <Typography
                                    color="text.secondary"
                                >
                                    Assigned Complaints
                                </Typography>

                                <Typography
                                    variant="h3"
                                    fontWeight="bold"
                                >
                                    {assignedComplaintCount}
                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>


                    <Grid
                        size={{ xs: 12, md: 4 }}
                    >

                        <Card
                            sx={{
                                borderRadius: 4,
                                boxShadow:
                                    "0 4px 12px rgba(0,0,0,0.12)",
                            }}
                        >

                            <CardContent>

                                <BusinessIcon
                                    sx={{
                                        fontSize: 40,
                                        color: "#ED6C02",
                                    }}
                                />

                                <Typography
                                    color="text.secondary"
                                >
                                    Departments
                                </Typography>

                                <Typography
                                    variant="h3"
                                    fontWeight="bold"
                                >
                                    {departmentList.length}
                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>

                </Grid>


                {/* SEARCH */}

                <Paper
                    sx={{
                        mt: 4,
                        p: 2,
                        borderRadius: 4,
                    }}
                >

                    <TextField
                        fullWidth
                        placeholder="Search department..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <SearchIcon
                                        sx={{
                                            mr: 1,
                                            color:
                                                "text.secondary",
                                        }}
                                    />
                                ),
                            },
                        }}
                    />

                </Paper>


                {/* DEPARTMENT CARDS */}

                <Grid
                    container
                    spacing={3}
                    sx={{ mt: 1 }}
                >

                    {loading ? (

                        <Grid
                            size={{ xs: 12 }}
                        >

                            <Paper
                                sx={{
                                    p: 6,
                                    textAlign: "center",
                                    borderRadius: 4,
                                }}
                            >

                                <Typography>
                                    Loading assignments...
                                </Typography>

                            </Paper>

                        </Grid>

                    ) : departmentList.length === 0 ? (

                        <Grid
                            size={{ xs: 12 }}
                        >

                            <Paper
                                sx={{
                                    p: 6,
                                    textAlign: "center",
                                    borderRadius: 4,
                                }}
                            >

                                <Typography
                                    variant="h6"
                                >
                                    No departments found
                                </Typography>

                            </Paper>

                        </Grid>

                    ) : (

                        departmentList.map(
                            (department) => (

                                <Grid
                                    key={department.name}
                                    size={{
                                        xs: 12,
                                        sm: 6,
                                        lg: 4,
                                    }}
                                >

                                    <Card
                                        sx={{
                                            height: "100%",
                                            borderRadius: 4,
                                            cursor: "pointer",
                                            transition:
                                                "0.2s",

                                            boxShadow:
                                                "0 4px 12px rgba(0,0,0,0.12)",

                                            "&:hover": {
                                                transform:
                                                    "translateY(-4px)",
                                                boxShadow:
                                                    "0 8px 20px rgba(0,0,0,0.18)",
                                            },
                                        }}

                                        onClick={() =>
                                            setSelectedDepartment(
                                                department
                                            )
                                        }
                                    >

                                        <CardContent
                                            sx={{ p: 3 }}
                                        >

                                            <Box
                                                sx={{
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    gap: 2,
                                                    mb: 3,
                                                }}
                                            >

                                                <Box
                                                    sx={{
                                                        width: 55,
                                                        height: 55,
                                                        borderRadius:
                                                            "50%",
                                                        background:
                                                            "#1976D2",
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        justifyContent:
                                                            "center",
                                                    }}
                                                >

                                                    <BusinessIcon
                                                        sx={{
                                                            color:
                                                                "white",
                                                            fontSize:
                                                                30,
                                                        }}
                                                    />

                                                </Box>


                                                <Typography
                                                    variant="h6"
                                                    fontWeight="bold"
                                                    color="#173B68"
                                                >
                                                    {
                                                        department.name
                                                    }
                                                </Typography>

                                            </Box>


                                            <Divider
                                                sx={{
                                                    mb: 3,
                                                }}
                                            />


                                            <Box
                                                sx={{
                                                    display:
                                                        "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    mb: 2,
                                                }}
                                            >

                                                <Box>

                                                    <Typography
                                                        color="text.secondary"
                                                        variant="body2"
                                                    >
                                                        Officers
                                                    </Typography>

                                                    <Typography
                                                        variant="h4"
                                                        fontWeight="bold"
                                                    >
                                                        {
                                                            department
                                                                .officers
                                                                .length
                                                        }
                                                    </Typography>

                                                </Box>


                                                <Box>

                                                    <Typography
                                                        color="text.secondary"
                                                        variant="body2"
                                                    >
                                                        Assigned Complaints
                                                    </Typography>

                                                    <Typography
                                                        variant="h4"
                                                        fontWeight="bold"
                                                        color="success.main"
                                                    >
                                                        {
                                                            department
                                                                .complaints
                                                                .length
                                                        }
                                                    </Typography>

                                                </Box>

                                            </Box>


                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                endIcon={
                                                    <ArrowForwardIcon />
                                                }
                                            >
                                                View Assignments
                                            </Button>

                                        </CardContent>

                                    </Card>

                                </Grid>

                            )
                        )

                    )}

                </Grid>


                {/* DEPARTMENT DETAILS DIALOG */}

                <Dialog
                    open={
                        Boolean(
                            selectedDepartment
                        )
                    }
                    onClose={() =>
                        setSelectedDepartment(null)
                    }
                    fullWidth
                    maxWidth="lg"
                >

                    {selectedDepartment && (

                        <>

                            <DialogTitle
                                sx={{
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "space-between",
                                }}
                            >

                                <Box>

                                    <Typography
                                        variant="h5"
                                        fontWeight="bold"
                                    >
                                        {
                                            selectedDepartment
                                                .name
                                        }
                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                    >
                                        Assigned officers
                                        and their complaints
                                    </Typography>

                                </Box>


                                <IconButton
                                    onClick={() =>
                                        setSelectedDepartment(
                                            null
                                        )
                                    }
                                >
                                    <CloseIcon />
                                </IconButton>

                            </DialogTitle>


                            <DialogContent
                                dividers
                            >

                                {/* DEPARTMENT SUMMARY */}

                                <Grid
                                    container
                                    spacing={2}
                                    sx={{
                                        mb: 3,
                                    }}
                                >

                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >

                                        <Paper
                                            sx={{
                                                p: 2,
                                                borderRadius: 3,
                                                background:
                                                    "#F4F8FF",
                                            }}
                                        >

                                            <Typography
                                                color="text.secondary"
                                            >
                                                Total Officers
                                            </Typography>

                                            <Typography
                                                variant="h4"
                                                fontWeight="bold"
                                            >
                                                {
                                                    selectedDepartment
                                                        .officers
                                                        .length
                                                }
                                            </Typography>

                                        </Paper>

                                    </Grid>


                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >

                                        <Paper
                                            sx={{
                                                p: 2,
                                                borderRadius: 3,
                                                background:
                                                    "#F3FFF5",
                                            }}
                                        >

                                            <Typography
                                                color="text.secondary"
                                            >
                                                Assigned Complaints
                                            </Typography>

                                            <Typography
                                                variant="h4"
                                                fontWeight="bold"
                                                color="success.main"
                                            >
                                                {
                                                    selectedDepartment
                                                        .complaints
                                                        .length
                                                }
                                            </Typography>

                                        </Paper>

                                    </Grid>

                                </Grid>


                                {/* OFFICERS */}

                                {selectedDepartment
                                    .officers
                                    .map((officer) => {

                                        const complaints =
                                            getOfficerComplaints(
                                                officer
                                            );

                                        /*
                                         * Only display officers
                                         * who actually have
                                         * assignments.
                                         */
                                        if (
                                            complaints.length ===
                                            0
                                        ) {
                                            return null;
                                        }


                                        return (

                                            <Paper
                                                key={
                                                    officer.id
                                                }
                                                sx={{
                                                    p: 3,
                                                    mb: 2,
                                                    borderRadius: 3,
                                                    border:
                                                        "1px solid #E0E0E0",
                                                }}
                                            >

                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        alignItems:
                                                            "center",
                                                        mb: 2,
                                                    }}
                                                >

                                                    <Box>

                                                        <Typography
                                                            variant="h6"
                                                            fontWeight="bold"
                                                        >
                                                            {
                                                                officer.fullName
                                                            }
                                                        </Typography>

                                                        <Typography
                                                            color="text.secondary"
                                                        >
                                                            {
                                                                officer.designation
                                                            }
                                                        </Typography>

                                                    </Box>


                                                    <Chip
                                                        label={
                                                            `${complaints.length} Complaint${complaints.length !== 1 ? "s" : ""}`
                                                        }
                                                        color="primary"
                                                    />

                                                </Box>


                                                <Divider
                                                    sx={{
                                                        mb: 2,
                                                    }}
                                                />


                                                {complaints.map(
                                                    (
                                                        grievance
                                                    ) => (

                                                        <Box
                                                            key={
                                                                grievance.id
                                                            }
                                                            sx={{
                                                                p: 2,
                                                                mb: 1,
                                                                borderRadius:
                                                                    2,
                                                                background:
                                                                    "#F8F9FA",
                                                            }}
                                                        >

                                                            <Box
                                                                sx={{
                                                                    display:
                                                                        "flex",
                                                                    justifyContent:
                                                                        "space-between",
                                                                    gap: 2,
                                                                }}
                                                            >

                                                                <Box>

                                                                    <Typography
                                                                        fontWeight="bold"
                                                                    >
                                                                        {
                                                                            grievance.title
                                                                        }
                                                                    </Typography>

                                                                    <Typography
                                                                        variant="body2"
                                                                        color="text.secondary"
                                                                    >
                                                                        Complaint
                                                                        ID: #
                                                                        {
                                                                            grievance.id
                                                                        }
                                                                    </Typography>

                                                                </Box>


                                                                <Chip
                                                                    size="small"
                                                                    label={
                                                                        grievance.status
                                                                    }
                                                                    color={
                                                                        grievance.status ===
                                                                        "RESOLVED"
                                                                            ? "success"
                                                                            : grievance.status ===
                                                                              "IN_PROGRESS"
                                                                            ? "info"
                                                                            : "warning"
                                                                    }
                                                                />

                                                            </Box>

                                                        </Box>

                                                    )
                                                )}

                                            </Paper>

                                        );

                                    })}


                                {/* NO ASSIGNMENT */}

                                {selectedDepartment
                                    .complaints
                                    .length === 0 && (

                                    <Paper
                                        sx={{
                                            p: 5,
                                            textAlign:
                                                "center",
                                            borderRadius: 3,
                                            background:
                                                "#FAFAFA",
                                        }}
                                    >

                                        <AssignmentIcon
                                            sx={{
                                                fontSize: 50,
                                                color:
                                                    "text.secondary",
                                            }}
                                        />

                                        <Typography
                                            variant="h6"
                                            sx={{
                                                mt: 1,
                                            }}
                                        >
                                            No assigned complaints
                                        </Typography>

                                        <Typography
                                            color="text.secondary"
                                        >
                                            No officer in this
                                            department has been
                                            assigned a complaint
                                            yet.
                                        </Typography>

                                    </Paper>

                                )}

                            </DialogContent>

                        </>

                    )}

                </Dialog>

            </Box>
        </>
    );
}

export default AssignedOfficers;
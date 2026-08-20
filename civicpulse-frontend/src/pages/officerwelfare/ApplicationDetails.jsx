import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Box,
    Paper,
    Typography,
    Grid,
    Button,
    Chip,
    Divider,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Snackbar,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

import {
    getApplicationById,
    approveApplication,
    rejectApplication,
} from "../../api/welfareApi";

function ApplicationDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [application, setApplication] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [approveDialog, setApproveDialog] = useState(false);

    const [rejectDialog, setRejectDialog] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        loadApplication();
    }, [id]);

    const loadApplication = async () => {

        try {

            setLoading(true);

            const response = await getApplicationById(id);

console.log("OFFICER APPLICATION RESPONSE:", response.data);

setApplication(response.data);
        } catch (err) {

            console.error(err);

            setError("Unable to load application details.");

        } finally {

            setLoading(false);

        }

    };

    const handleApprove = async () => {

        try {

            await approveApplication(id);

            setApproveDialog(false);

            setSnackbar({
                open: true,
                message: "Application approved successfully.",
                severity: "success",
            });

            loadApplication();

        } catch (err) {

            console.error(err);

            setSnackbar({
                open: true,
                message: "Approval failed.",
                severity: "error",
            });

        }

    };

    const handleReject = async () => {

        try {

            await rejectApplication(id);

            setRejectDialog(false);

            setSnackbar({
                open: true,
                message: "Application rejected successfully.",
                severity: "success",
            });

            loadApplication();

        } catch (err) {

            console.error(err);

            setSnackbar({
                open: true,
                message: "Rejection failed.",
                severity: "error",
            });

        }

    };

    const statusColor = (status) => {

        switch (status) {

            case "APPROVED":
                return "success";

            case "REJECTED":
                return "error";

            case "SUBMITTED":
case "UNDER_REVIEW":
    return "warning";

            default:
                return "default";

        }

    };

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

    if (error) {

        return (
            <>
                <Sidebar />

                <Box sx={{ ml: "270px", p: 4 }}>

                    <Header />

                    <Alert severity="error">
                        {error}
                    </Alert>

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

                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 3 }}
                >
                    Back
                </Button>

                <Typography
                    variant="h4"
                    fontWeight="bold"
                    gutterBottom
                >
                    Welfare Application Details
                </Typography>

                <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>

                        <Paper
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                height: "100%",
                            }}
                        >

                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                gutterBottom
                            >
                                Applicant Information
                            </Typography>

                            <Divider sx={{ mb: 2 }} />

                            <Typography>
                                <strong>Application ID:</strong> {application.id}
                            </Typography>

                            <Typography sx={{ mt: 1 }}>
                                <strong>Citizen ID:</strong> {application.citizenId}
                            </Typography>

                            <Typography sx={{ mt: 1 }}>
                                <strong>Full Name:</strong>{" "}
                                {application.fullName || "N/A"}
                            </Typography>

                            <Typography sx={{ mt: 1 }}>
                                <strong>Age:</strong> {application.age}
                            </Typography>

                            <Typography sx={{ mt: 1 }}>
                                <strong>District:</strong> {application.district}
                            </Typography>

                            <Typography sx={{ mt: 1 }}>
                                <strong>Occupation:</strong>{" "}
                                {application.occupation || "N/A"}
                            </Typography>

                            <Typography sx={{ mt: 1 }}>
                                <strong>Annual Income:</strong> ₹
                                {application.annualIncome?.toLocaleString()}
                            </Typography>
                            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
    Uploaded Documents
</Typography>

{application.documents?.length > 0 ? (
    application.documents.map((doc) => (
        <Button
    key={doc.id}
    variant="outlined"
    onClick={() =>
        window.open(
            `http://localhost:8080/documents/${doc.id}`,
            "_blank"
        )
    }
    sx={{ mr: 2, mb: 2 }}
>
    {doc.documentName}
</Button>
    ))
) : (
    <Typography color="text.secondary">
        No documents uploaded.
    </Typography>
)}

                        </Paper>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Paper
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                height: "100%",
                            }}
                        >

                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                gutterBottom
                            >
                                Scheme Information
                            </Typography>

                            <Divider sx={{ mb: 2 }} />

                            <Typography>
                                <strong>Scheme ID:</strong> {application.schemeId}
                            </Typography>

                            <Typography sx={{ mt: 1 }}>
                                <strong>Scheme Name:</strong>{" "}
                                {application.schemeName}
                            </Typography>

                            <Typography sx={{ mt: 2 }}>
                                <strong>Status</strong>
                            </Typography>

                            <Chip
                                sx={{ mt: 1 }}
                                label={application.status}
                                color={statusColor(application.status)}
                            />

                            <Typography sx={{ mt: 3 }}>
                                <strong>Eligibility</strong>
                            </Typography>

                            <Chip
                                sx={{ mt: 1 }}
                                label={application.eligibilityStatus}
                                color={
                                    application.eligibilityStatus === "ELIGIBLE"
                                        ? "success"
                                        : "error"
                                }
                                variant="outlined"
                            />

                            <Typography sx={{ mt: 3 }}>
                                <strong>Applied At</strong>
                            </Typography>

                            <Typography sx={{ mt: 1 }}>
                                {application.appliedAt}
                            </Typography>

                        </Paper>

                    </Grid>
<Grid item xs={12}>

<Paper
    sx={{
        p: 3,
        borderRadius: 3,
    }}
>

<Grid item xs={12}>
    <Paper
        sx={{
            p: 3,
            borderRadius: 3,
        }}
    >
        <Typography
            variant="h6"
            fontWeight="bold"
        >
            Scheme Specific Information
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* ================= STUDENT / EDUCATION ================= */}
        {(application.collegeName ||
            application.course ||
            application.year ||
            application.rollNumber) && (
            <Grid container spacing={2}>
                {application.collegeName && (
                    <Grid item xs={12} sm={6}>
                        <Typography>
                            <strong>College Name:</strong>{" "}
                            {application.collegeName}
                        </Typography>
                    </Grid>
                )}

                {application.course && (
                    <Grid item xs={12} sm={6}>
                        <Typography>
                            <strong>Course:</strong>{" "}
                            {application.course}
                        </Typography>
                    </Grid>
                )}

                {application.year && (
                    <Grid item xs={12} sm={6}>
                        <Typography>
                            <strong>Year:</strong>{" "}
                            {application.year}
                        </Typography>
                    </Grid>
                )}

                {application.rollNumber && (
                    <Grid item xs={12} sm={6}>
                        <Typography>
                            <strong>Roll Number:</strong>{" "}
                            {application.rollNumber}
                        </Typography>
                    </Grid>
                )}
            </Grid>
        )}

        {/* ================= HOUSING ================= */}
        {(application.houseType ||
            application.familyMembers !== null &&
            application.familyMembers !== undefined ||
            application.landOwnership !== null &&
            application.landOwnership !== undefined) && (
            <Grid container spacing={2}>
                {application.houseType && (
                    <Grid item xs={12} sm={6}>
                        <Typography>
                            <strong>House Type:</strong>{" "}
                            {application.houseType}
                        </Typography>
                    </Grid>
                )}

                {application.familyMembers !== null &&
                    application.familyMembers !== undefined && (
                        <Grid item xs={12} sm={6}>
                            <Typography>
                                <strong>Family Members:</strong>{" "}
                                {application.familyMembers}
                            </Typography>
                        </Grid>
                    )}

                {application.landOwnership !== null &&
                    application.landOwnership !== undefined && (
                        <Grid item xs={12} sm={6}>
                            <Typography>
                                <strong>Land Ownership:</strong>{" "}
                                {application.landOwnership
                                    ? "Yes"
                                    : "No"}
                            </Typography>
                        </Grid>
                    )}
            </Grid>
        )}

        {/* ================= FARMER ================= */}
        {(application.landArea ||
            application.cropType ||
            application.bankAccount ||
            application.ifscCode ||
            application.bankName ||
            application.accountHolderName) && (
            <Grid container spacing={2}>
                {application.landArea !== null &&
                    application.landArea !== undefined && (
                        <Grid item xs={12} sm={6}>
                            <Typography>
                                <strong>Land Area:</strong>{" "}
                                {application.landArea} Acres
                            </Typography>
                        </Grid>
                    )}

                {application.cropType && (
                    <Grid item xs={12} sm={6}>
                        <Typography>
                            <strong>Crop Type:</strong>{" "}
                            {application.cropType}
                        </Typography>
                    </Grid>
                )}

                {application.accountHolderName && (
                    <Grid item xs={12} sm={6}>
                        <Typography>
                            <strong>Account Holder:</strong>{" "}
                            {application.accountHolderName}
                        </Typography>
                    </Grid>
                )}

                {application.bankAccount && (
                    <Grid item xs={12} sm={6}>
                        <Typography>
                            <strong>Bank Account:</strong>{" "}
                            {application.bankAccount}
                        </Typography>
                    </Grid>
                )}

                {application.bankName && (
                    <Grid item xs={12} sm={6}>
                        <Typography>
                            <strong>Bank Name:</strong>{" "}
                            {application.bankName}
                        </Typography>
                    </Grid>
                )}

                {application.ifscCode && (
                    <Grid item xs={12} sm={6}>
                        <Typography>
                            <strong>IFSC Code:</strong>{" "}
                            {application.ifscCode}
                        </Typography>
                    </Grid>
                )}
            </Grid>
        )}

        {/* ================= PENSION ================= */}
        {(application.maritalStatus ||
            application.pensionCategory ||
            application.disabilityPercentage !== null &&
            application.disabilityPercentage !== undefined) && (
            <Grid container spacing={2}>
                {application.maritalStatus && (
                    <Grid item xs={12} sm={6}>
                        <Typography>
                            <strong>Marital Status:</strong>{" "}
                            {application.maritalStatus}
                        </Typography>
                    </Grid>
                )}

                {application.pensionCategory && (
                    <Grid item xs={12} sm={6}>
                        <Typography>
                            <strong>Pension Category:</strong>{" "}
                            {application.pensionCategory}
                        </Typography>
                    </Grid>
                )}

                {application.disabilityPercentage !== null &&
                    application.disabilityPercentage !== undefined && (
                        <Grid item xs={12} sm={6}>
                            <Typography>
                                <strong>
                                    Disability Percentage:
                                </strong>{" "}
                                {application.disabilityPercentage}%
                            </Typography>
                        </Grid>
                    )}
            </Grid>
        )}

        {/* ================= NO SPECIFIC INFORMATION ================= */}
        {!application.collegeName &&
            !application.course &&
            !application.year &&
            !application.rollNumber &&
            !application.houseType &&
            application.familyMembers === null &&
            application.landOwnership === null &&
            !application.landArea &&
            !application.cropType &&
            !application.bankAccount &&
            !application.ifscCode &&
            !application.bankName &&
            !application.accountHolderName &&
            !application.maritalStatus &&
            !application.pensionCategory &&
            application.disabilityPercentage === null && (
                <Typography color="text.secondary">
                    No scheme-specific information available.
                </Typography>
            )}
    </Paper>
</Grid>
<Divider sx={{ my: 2 }} />

{/* ================= STUDENT ================= */}

{application.collegeName && (

<>

<Typography sx={{ mt: 1 }}>
<strong>College Name:</strong> {application.collegeName}
</Typography>

<Typography sx={{ mt: 1 }}>
<strong>Course:</strong> {application.course}
</Typography>

<Typography sx={{ mt: 1 }}>
<strong>Year:</strong> {application.year}
</Typography>

<Typography sx={{ mt: 1 }}>
<strong>Roll Number:</strong> {application.rollNumber}
</Typography>

</>

)}

{/* ================= HOUSING ================= */}

{application.houseType && (

<>

<Typography sx={{ mt: 1 }}>
<strong>House Type:</strong> {application.houseType}
</Typography>

<Typography sx={{ mt: 1 }}>
<strong>Family Members:</strong> {application.familyMembers}
</Typography>

<Typography sx={{ mt: 1 }}>
<strong>Land Ownership:</strong>{" "}
{application.landOwnership ? "Yes" : "No"}
</Typography>

</>

)}

{/* ================= FARMER ================= */}

{application.landArea && (

<>

<Typography sx={{ mt: 1 }}>
<strong>Land Area:</strong> {application.landArea} Acres
</Typography>

<Typography sx={{ mt: 1 }}>
<strong>Crop Type:</strong> {application.cropType}
</Typography>

<Typography sx={{ mt: 1 }}>
<strong>Bank Account:</strong> {application.bankAccount}
</Typography>

<Typography sx={{ mt: 1 }}>
<strong>IFSC Code:</strong> {application.ifscCode}
</Typography>

</>

)}

{/* ================= PENSION ================= */}

{application.maritalStatus && (

<>

<Typography sx={{ mt: 1 }}>
<strong>Marital Status:</strong> {application.maritalStatus}
</Typography>

<Typography sx={{ mt: 1 }}>
<strong>Pension Category:</strong> {application.pensionCategory}
</Typography>

<Typography sx={{ mt: 1 }}>
<strong>Bank Account:</strong> {application.bankAccount}
</Typography>

<Typography sx={{ mt: 1 }}>
<strong>IFSC Code:</strong> {application.ifscCode}
</Typography>

<Typography sx={{ mt: 1 }}>
<strong>Disability Percentage:</strong> {application.disabilityPercentage}%
</Typography>

</>

)}

</Paper>

</Grid>
                    <Grid item xs={12}>

                        <Paper
                            sx={{
                                p: 3,
                                borderRadius: 3,
                            }}
                        >

                            <Typography
                                variant="h6"
                                fontWeight="bold"
                            >
                                Remarks
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Typography>

                                {
                                    application.remarks
                                        ? application.remarks
                                        : "No remarks available."
                                }

                            </Typography>

                        </Paper>

                    </Grid>

                    {
    (
        application.status === "SUBMITTED" ||
        application.status === "UNDER_REVIEW"
    ) && (

        <Grid item xs={12}>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                }}
            >

                <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => setApproveDialog(true)}
                >
                    Approve
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => setRejectDialog(true)}
                >
                    Reject
                </Button>

            </Box>

        </Grid>

    )
}

                </Grid>

                <Dialog
                    open={approveDialog}
                    onClose={() =>
                        setApproveDialog(false)
                    }
                >

                    <DialogTitle>
                        Approve Application
                    </DialogTitle>

                    <DialogContent>

                        <DialogContentText>

                            Are you sure you want to approve this application?

                        </DialogContentText>

                    </DialogContent>

                    <DialogActions>

                        <Button
                            onClick={() =>
                                setApproveDialog(false)
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            color="success"
                            variant="contained"
                            onClick={handleApprove}
                        >
                            Approve
                        </Button>

                    </DialogActions>

                </Dialog>

                <Dialog
                    open={rejectDialog}
                    onClose={() =>
                        setRejectDialog(false)
                    }
                >

                    <DialogTitle>
                        Reject Application
                    </DialogTitle>

                    <DialogContent>

                        <DialogContentText>

                            Are you sure you want to reject this application?

                        </DialogContentText>

                    </DialogContent>

                    <DialogActions>

                        <Button
                            onClick={() =>
                                setRejectDialog(false)
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            color="error"
                            variant="contained"
                            onClick={handleReject}
                        >
                            Reject
                        </Button>

                    </DialogActions>

                </Dialog>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() =>
                        setSnackbar({
                            ...snackbar,
                            open: false,
                        })
                    }
                >

                    <Alert
                        severity={snackbar.severity}
                        sx={{ width: "100%" }}
                    >
                        {snackbar.message}
                    </Alert>

                </Snackbar>

            </Box>

        </>

    );

}

export default ApplicationDetails;
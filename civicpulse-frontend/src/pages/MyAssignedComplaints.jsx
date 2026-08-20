import { useEffect, useState } from "react";

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import {
  Assignment,
  Visibility,
  Refresh,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import {
  getOfficerGrievances,
} from "../services/grievanceService";


function MyAssignedComplaints() {

  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");


  // =========================================================
  // GET LOGGED-IN OFFICER ID
  // =========================================================

  const getOfficerId = () => {

    const id =
      localStorage.getItem("userId");

    return id ? Number(id) : null;

  };


  // =========================================================
  // LOAD ASSIGNED COMPLAINTS
  // =========================================================

  const loadComplaints = async () => {

    try {

      setLoading(true);

      setError("");

      const officerId =
        getOfficerId();

      const officerName =
        localStorage.getItem("fullName");


      console.log(
        "Logged-in Officer ID:",
        officerId
      );

      console.log(
        "Logged-in Officer Name:",
        officerName
      );


      if (!officerId) {

        setError(
          "Officer information was not found. Please login again."
        );

        setComplaints([]);

        return;

      }


      // IMPORTANT:
      // Use OFFICER ID, not officer name.

      const data =
        await getOfficerGrievances(
          officerId
        );


      console.log(
        "Assigned complaints:",
        data
      );


      setComplaints(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Failed to load assigned complaints:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to load assigned complaints."
      );

      setComplaints([]);

    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    loadComplaints();

  }, []);


  // =========================================================
  // FILTER
  // =========================================================

  const filteredComplaints =
    complaints.filter((complaint) => {

      const searchText =
        search.toLowerCase().trim();


      const complaintText =
        String(
          complaint.title ||
          complaint.description ||
          complaint.complaint ||
          ""
        ).toLowerCase();


      const categoryText =
        String(
          complaint.category || ""
        ).toLowerCase();


      const idText =
        String(
          complaint.id || ""
        ).toLowerCase();


      const matchesSearch =
        !searchText ||
        idText.includes(searchText) ||
        complaintText.includes(searchText) ||
        categoryText.includes(searchText);


      const matchesStatus =
        !status ||
        complaint.status === status;


      return (
        matchesSearch &&
        matchesStatus
      );

    });


  // =========================================================
  // STATUS COLOR
  // =========================================================

  const getStatusColor = (value) => {

    switch (value) {

      case "RESOLVED":
      case "CLOSED":
        return "success";

      case "REJECTED":
        return "error";

      case "IN_PROGRESS":
      case "UNDER_REVIEW":
        return "info";

      case "OPEN":
        return "warning";

      default:
        return "default";

    }

  };


  // =========================================================
  // PRIORITY COLOR
  // =========================================================

  const getPriorityColor = (value) => {

    switch (
      String(value || "").toUpperCase()
    ) {

      case "HIGH":
        return "error";

      case "MEDIUM":
        return "warning";

      case "LOW":
        return "success";

      default:
        return "default";

    }

  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >

        <CircularProgress />

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
        py: 4,
      }}
    >

      <Container maxWidth="xl">


        {/* =====================================================
            HEADER
        ===================================================== */}

        <Box sx={{ mb: 4 }}>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >

            <Assignment
              sx={{
                fontSize: 42,
                color: "#123b63",
              }}
            />

            <Typography
              variant="h4"
              fontWeight={800}
              color="#102a43"
            >
              My Complaints
            </Typography>

          </Box>


          <Typography
            color="text.secondary"
            sx={{
              mt: 1,
              fontSize: "1.05rem",
            }}
          >
            View complaints assigned to you,
            their current status, and details.
          </Typography>

        </Box>


        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (

          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>

        )}


        {/* =====================================================
            FILTER CARD
        ===================================================== */}

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #e4e7ec",
            mb: 3,
          }}
        >

          <CardContent>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >

              <TextField
                fullWidth
                label="Search Complaint"
                placeholder="Search by ID, complaint or category"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                sx={{
                  flex: 1,
                  minWidth: {
                    xs: "100%",
                    md: 350,
                  },
                }}
              />


              <TextField
                select
                label="Status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                sx={{
                  minWidth: {
                    xs: "100%",
                    md: 220,
                  },
                }}
              >

                <MenuItem value="">
                  All Status
                </MenuItem>

                <MenuItem value="OPEN">
                  Open
                </MenuItem>

                <MenuItem value="IN_PROGRESS">
                  In Progress
                </MenuItem>

                <MenuItem value="UNDER_REVIEW">
                  Under Review
                </MenuItem>

                <MenuItem value="RESOLVED">
                  Resolved
                </MenuItem>

                <MenuItem value="CLOSED">
                  Closed
                </MenuItem>

                <MenuItem value="REJECTED">
                  Rejected
                </MenuItem>

              </TextField>


              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadComplaints}
                sx={{
                  minHeight: 56,
                  px: 3,
                  borderRadius: 2,
                }}
              >
                Refresh
              </Button>

            </Box>

          </CardContent>

        </Card>


        {/* =====================================================
            COUNT
        ===================================================== */}

        <Box sx={{ mb: 2 }}>

          <Chip
            color="primary"
            variant="outlined"
            label={`${filteredComplaints.length} assigned complaint${
              filteredComplaints.length === 1
                ? ""
                : "s"
            }`}
          />

        </Box>


        {/* =====================================================
            TABLE
        ===================================================== */}

        {filteredComplaints.length > 0 ? (

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e4e7ec",
              overflowX: "auto",
            }}
          >

            <Table
              sx={{
                minWidth: 1150,
              }}
            >

              <TableHead>

                <TableRow
                  sx={{
                    backgroundColor: "#f8fafc",
                  }}
                >

                  <TableCell
                    sx={{ fontWeight: 800 }}
                  >
                    ID
                  </TableCell>


                  <TableCell
                    sx={{
                      fontWeight: 800,
                      minWidth: 280,
                    }}
                  >
                    Complaint
                  </TableCell>


                  <TableCell
                    sx={{ fontWeight: 800 }}
                  >
                    Category
                  </TableCell>


                  <TableCell
                    sx={{ fontWeight: 800 }}
                  >
                    Priority
                  </TableCell>


                  <TableCell
                    sx={{ fontWeight: 800 }}
                  >
                    Status
                  </TableCell>


                  <TableCell
                    sx={{ fontWeight: 800 }}
                  >
                    Department
                  </TableCell>


                  <TableCell
                    sx={{ fontWeight: 800 }}
                  >
                    Submitted
                  </TableCell>


                  <TableCell
                    sx={{ fontWeight: 800 }}
                  >
                    Action
                  </TableCell>

                </TableRow>

              </TableHead>


              <TableBody>

                {filteredComplaints.map(
                  (complaint) => (

                    <TableRow
                      key={complaint.id}
                      hover
                    >

                      <TableCell>

                        <Typography
                          fontWeight={700}
                        >
                          {complaint.id}
                        </Typography>

                      </TableCell>


                      <TableCell>

                        <Typography
                          fontWeight={600}
                          sx={{
                            maxWidth: 320,
                            overflow: "hidden",
                            textOverflow:
                              "ellipsis",
                            whiteSpace:
                              "nowrap",
                          }}
                        >

                          {
                            complaint.title ||
                            complaint.description ||
                            complaint.complaint ||
                            "No description"
                          }

                        </Typography>

                      </TableCell>


                      <TableCell>

                        <Chip
                          size="small"
                          variant="outlined"
                          label={
                            complaint.category ||
                            "General"
                          }
                        />

                      </TableCell>


                      <TableCell>

                        <Chip
                          size="small"
                          label={
                            complaint.priority ||
                            "NORMAL"
                          }
                          color={
                            getPriorityColor(
                              complaint.priority
                            )
                          }
                        />

                      </TableCell>


                      <TableCell>

                        <Chip
                          size="small"
                          label={
                            complaint.status ||
                            "UNKNOWN"
                          }
                          color={
                            getStatusColor(
                              complaint.status
                            )
                          }
                        />

                      </TableCell>


                      <TableCell>

                        {
                          complaint.departmentName ||
                          complaint.department?.name ||
                          complaint.department ||
                          "-"
                        }

                      </TableCell>


                      <TableCell>

                        {complaint.createdAt
                          ? new Date(
                              complaint.createdAt
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : complaint.submittedAt
                          ? new Date(
                              complaint.submittedAt
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "-"}

                      </TableCell>


                      <TableCell>

                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={
                            <Visibility />
                          }
                          onClick={() =>
                            navigate(
                              `/grievances/${complaint.id}`
                            )
                          }
                        >
                          View
                        </Button>

                      </TableCell>

                    </TableRow>

                  )
                )}

              </TableBody>

            </Table>

          </TableContainer>

        ) : (

          <Alert
            severity="info"
            sx={{
              borderRadius: 3,
            }}
          >

            {complaints.length === 0
              ? "You currently have no complaints assigned to you."
              : "No complaints match your search or status filter."}

          </Alert>

        )}

      </Container>

    </Box>

  );

}


export default MyAssignedComplaints;
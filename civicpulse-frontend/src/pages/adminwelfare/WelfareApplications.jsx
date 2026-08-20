import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  Button,
  Chip,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

import {
  DataGrid,
} from "@mui/x-data-grid";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import InputAdornment from "@mui/material/InputAdornment";

import { useNavigate } from "react-router-dom";

import {
  getAllApplications,
  approveApplication,
  rejectApplication,
} from "../../api/welfareApi";

function WelfareApplications()  {

  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [openReject, setOpenReject] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {

    try {

      const response = await getAllApplications();

      setApplications(response.data);
      setFiltered(response.data);

    } catch (error) {

      console.error(error);

      alert("Failed to load applications.");

    }

  };

  useEffect(() => {

    const data = applications.filter((app) => {

      const keyword = search.toLowerCase();

      const matchesSearch =

        (app.fullName || "")
          .toLowerCase()
          .includes(keyword)

        ||

        (app.schemeName || "")
          .toLowerCase()
          .includes(keyword)

        ||

        (app.applicationNumber || "")
          .toLowerCase()
          .includes(keyword);

      const matchesStatus =

        statusFilter === "ALL"

        ||

        app.status === statusFilter;

      return matchesSearch && matchesStatus;

    });

    setFiltered(data);

  }, [applications, search, statusFilter]);

  const handleApprove = async (id) => {

    try {

      await approveApplication(id);

      loadApplications();

    } catch (error) {

      console.error(error);

      alert("Approval failed.");

    }

  };

  const handleReject = (id) => {

    setSelectedId(id);

    setOpenReject(true);

  };

  const submitReject = async () => {

    try {

      await rejectApplication(selectedId, reason);

      setOpenReject(false);

      setReason("");

      loadApplications();

    } catch (error) {

      console.error(error);

      alert("Reject failed.");

    }

  };
    const columns = [
    {
      field: "applicationNumber",
      headerName: "Application No",
      flex: 1.5,
    },
    {
      field: "fullName",
      headerName: "Citizen",
      flex: 1.5,
    },
    {
      field: "schemeName",
      headerName: "Scheme",
      flex: 1.8,
    },
    {
      field: "department",
      headerName: "Department",
      flex: 1.4,
    },
    {
      field: "appliedAt",
      headerName: "Applied Date",
      flex: 1.5,
      valueFormatter: (params) =>
        params.value
          ? new Date(params.value).toLocaleDateString()
          : "-",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1.2,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "APPROVED"
              ? "success"
              : params.value === "REJECTED"
              ? "error"
              : params.value === "UNDER_REVIEW"
              ? "info"
              : "warning"
          }
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 2.8,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            mt: 0.5,
          }}
        >
          <Button
            size="small"
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={() =>
              navigate(`/admin/welfare/application/${params.row.id}`)
            }
          >
            View
          </Button>

          <Button
            size="small"
            color="success"
            variant="contained"
            startIcon={<CheckCircleIcon />}
            disabled={params.row.status === "APPROVED"}
            onClick={() => handleApprove(params.row.id)}
          >
            Approve
          </Button>

          <Button
            size="small"
            color="error"
            variant="contained"
            startIcon={<CancelIcon />}
            disabled={params.row.status === "REJECTED"}
            onClick={() => handleReject(params.row.id)}
          >
            Reject
          </Button>
        </Box>
      ),
    },
  ];

  const totalApplications = applications.length;

  const approvedApplications = applications.filter(
    (a) => a.status === "APPROVED"
  ).length;

  const pendingApplications = applications.filter(
    (a) =>
      a.status === "SUBMITTED" ||
      a.status === "PENDING"
  ).length;

  const rejectedApplications = applications.filter(
    (a) => a.status === "REJECTED"
  ).length;
    return (
    <Box sx={{ p: 3 }}>

      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
      >
        Welfare Applications
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Review, approve and manage welfare applications.
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Total Applications
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {totalApplications}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Pending
              </Typography>
              <Typography
                variant="h4"
                fontWeight="bold"
                color="warning.main"
              >
                {pendingApplications}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Approved
              </Typography>
              <Typography
                variant="h4"
                fontWeight="bold"
                color="success.main"
              >
                {approvedApplications}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Rejected
              </Typography>
              <Typography
                variant="h4"
                fontWeight="bold"
                color="error.main"
              >
                {rejectedApplications}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      <Paper sx={{ p: 2, mb: 3 }}>

        <Grid container spacing={2}>

          <Grid item xs={12} md={8}>

            <TextField
              fullWidth
              placeholder="Search by Application Number, Citizen or Scheme..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

          </Grid>

          <Grid item xs={12} md={4}>

            <TextField
              select
              fullWidth
              label="Status"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <MenuItem value="ALL">
                All
              </MenuItem>

              <MenuItem value="SUBMITTED">
                Submitted
              </MenuItem>

              <MenuItem value="UNDER_REVIEW">
                Under Review
              </MenuItem>

              <MenuItem value="APPROVED">
                Approved
              </MenuItem>

              <MenuItem value="REJECTED">
                Rejected
              </MenuItem>

            </TextField>

          </Grid>

        </Grid>

      </Paper>

      <Paper>

        <DataGrid
          rows={filtered}
          columns={columns}
          autoHeight
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
        />

      </Paper>
            <Dialog
        open={openReject}
        onClose={() => setOpenReject(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Reject Application
        </DialogTitle>

        <DialogContent>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Rejection Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            margin="normal"
          />

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() => {
              setOpenReject(false);
              setReason("");
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            disabled={!reason.trim()}
            onClick={submitReject}
          >
            Reject
          </Button>

        </DialogActions>

      </Dialog>

    </Box>
  );
}

export default WelfareApplications;
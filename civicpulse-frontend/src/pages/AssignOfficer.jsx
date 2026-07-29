import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Chip,
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { DataGrid } from "@mui/x-data-grid";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AssignOfficerDialog from "../components/AssignOfficerDialog";

import { getAllGrievances } from "../services/grievanceService";

function AssignOfficer() {
  const [grievances, setGrievances] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadGrievances();
  }, []);

  const loadGrievances = async () => {
    try {
      const data = await getAllGrievances();

      setGrievances(data);
      setFiltered(data);
    } catch (error) {
      console.error(error);
    }
  };

  const search = (value) => {
    const text = value.toLowerCase();

    setFiltered(
      grievances.filter(
        (g) =>
          g.title.toLowerCase().includes(text) ||
          g.department.toLowerCase().includes(text) ||
          g.category.toLowerCase().includes(text) ||
          g.status.toLowerCase().includes(text)
      )
    );
  };

  const columns = [
    {
      field: "citizenId",
      headerName: "Citizen",
      width: 110,
    },
    {
      field: "title",
      headerName: "Complaint",
      flex: 1,
    },
    {
      field: "department",
      headerName: "Department",
      width: 160,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      field: "category",
      headerName: "Complaint Type",
      width: 220,
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "HIGH"
              ? "error"
              : params.value === "MEDIUM"
              ? "warning"
              : "success"
          }
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "RESOLVED"
              ? "success"
              : params.value === "IN_PROGRESS"
              ? "info"
              : "warning"
          }
        />
      ),
    },
    {
      field: "assignedOfficer",
      headerName: "Assigned Officer",
      width: 180,
      renderCell: (params) =>
        params.value ? (
          params.value
        ) : (
          <Chip
            label="Not Assigned"
            color="warning"
            size="small"
          />
        ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 170,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          startIcon={<AssignmentIndIcon />}
          disabled={params.row.status === "RESOLVED"}
          onClick={() => {
            setSelectedGrievance(params.row);
            setOpen(true);
          }}
        >
          Assign
        </Button>
      ),
    },
  ];

  const total = grievances.length;
  const openCount = grievances.filter(
    (g) => g.status === "OPEN"
  ).length;

  const progressCount = grievances.filter(
    (g) => g.status === "IN_PROGRESS"
  ).length;

  const resolvedCount = grievances.filter(
    (g) => g.status === "RESOLVED"
  ).length;

  return (
    <>
      <Sidebar />

      <Box
        sx={{
          ml: "270px",
          background: "#F4F6F9",
          minHeight: "100vh",
          p: 4,
        }}
      >
        <Header />

        <Typography
          variant="h4"
          fontWeight="bold"
          mt={2}
        >
          Assign Officers
        </Typography>

        <Typography color="text.secondary" mb={3}>
          Assign complaints to department officers
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  Total Complaints
                </Typography>
                <Typography variant="h3">
                  {total}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  Open
                </Typography>
                <Typography variant="h3" color="warning.main">
                  {openCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  In Progress
                </Typography>
                <Typography variant="h3" color="info.main">
                  {progressCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  Resolved
                </Typography>
                <Typography variant="h3" color="success.main">
                  {resolvedCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper
          sx={{
            mt: 4,
            p: 2,
            borderRadius: 3,
          }}
        >
          <TextField
  fullWidth
  placeholder="Search complaint..."
  onChange={(e) => search(e.target.value)}
  slotProps={{
    input: {
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
    },
  }}

/>
        </Paper>

        <Paper
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 3,
          }}
        >
          <DataGrid
            rows={filtered}
            columns={columns}
            autoHeight
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
          />
        </Paper>
      </Box>

      <AssignOfficerDialog
        open={open}
        grievance={selectedGrievance}
        onClose={() => {
          setOpen(false);
          loadGrievances();
        }}
      />
    </>
  );
}

export default AssignOfficer;
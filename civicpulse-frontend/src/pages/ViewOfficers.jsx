import { useEffect, useState } from "react";
import {
  Box,
  Card,
 CardContent,
  Typography,
  Grid,
  TextField,
  Chip,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import BadgeIcon from "@mui/icons-material/Badge";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  getAllOfficers,
  deleteOfficer,
  updateOfficer,
  approveOfficer,
  rejectOfficer,
} from "../services/officerService";

export default function ViewOfficers() {

  const [officers, setOfficers] = useState([]);
  const [search, setSearch] = useState("");
const [selectedOfficer, setSelectedOfficer] = useState(null);
const [viewOpen, setViewOpen] = useState(false);
const [editOpen, setEditOpen] = useState(false);
const [editOfficer, setEditOfficer] = useState({});
  useEffect(() => {
    loadOfficers();
  }, []);

  const loadOfficers = async () => {

    try {

      const data = await getAllOfficers();

      const rows = (Array.isArray(data) ? data : []).map((o, i) => ({
        id: o.id ?? i + 1,
        employeeId: o.employeeId ?? "",
        fullName: o.fullName ?? "",
        email: o.email ?? "",
        phone: o.phone ?? "",
        department: o.department ?? "",
        designation: o.designation ?? "",
        status: o.status ?? "PENDING",
        active: o.active,
      }));

      setOfficers(rows);

    } catch (error) {
      console.error(error);
    }

  };

  const filtered = officers.filter((o) =>
    `${o.employeeId} ${o.fullName} ${o.email} ${o.department} ${o.designation}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

const handleView = (officer) => {
  setSelectedOfficer(officer);
  setViewOpen(true);
};

const handleEdit = (officer) => {
  setEditOfficer(officer);
  setEditOpen(true);
};
const handleDelete = async (id) => {

  if (!window.confirm("Are you sure you want to delete this officer?"))
    return;

  try {

    await deleteOfficer(id);

    loadOfficers();

    alert("Officer deleted successfully.");

  } catch (error) {

    console.error(error);

    alert("Failed to delete officer.");

  }

};
const handleApprove = async (id) => {

  try {

    await approveOfficer(id);

    alert("Officer approved successfully.");

    loadOfficers();

  } catch (error) {

    console.error(error);

    alert("Failed to approve officer.");

  }

};
const handleReject = async (id) => {

  try {

    await rejectOfficer(id);

    alert("Officer rejected successfully.");

    loadOfficers();

  } catch (error) {

    console.error(error);

    alert("Failed to reject officer.");

  }

};
  const columns = [

    {
      field: "employeeId",
      headerName: "Employee ID",
      width: 170,
    },

    {
      field: "fullName",
      headerName: "Officer",
      flex: 1,
    },

    {
      field: "email",
      headerName: "Email",
      flex: 1.3,
    },

    {
      field: "phone",
      headerName: "Phone",
      width: 150,
    },

    {
      field: "department",
      headerName: "Department",
      width: 180,
      renderCell: (params) => (
        <Chip
          label={params.value || "N/A"}
          color="primary"
          variant="outlined"
          size="small"
        />
      ),
    },

    {
      field: "designation",
      headerName: "Designation",
      width: 180,
    },

    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {

        const color =
          params.value === "APPROVED"
            ? "success"
            : params.value === "PENDING"
            ? "warning"
            : params.value === "REJECTED"
            ? "error"
            : "default";

        return (
          <Chip
            label={params.value}
            color={color}
            size="small"
          />
        );

      },
    },

   {
  field: "actions",
  headerName: "Actions",
  width: 250,
  sortable: false,

  renderCell: (params) => (

    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
      }}
    >

      {/* View */}
      <IconButton
        color="primary"
        onClick={() => handleView(params.row)}
      >
        <VisibilityIcon />
      </IconButton>

      {/* Edit */}
      <IconButton
        color="warning"
        onClick={() => handleEdit(params.row)}
      >
        <EditIcon />
      </IconButton>

      {/* Show only for Pending officers */}
      {params.row.status === "PENDING" && (
        <>
          <IconButton
            color="success"
            onClick={() => handleApprove(params.row.id)}
          >
            <CheckCircleIcon />
          </IconButton>

          <IconButton
            color="error"
            onClick={() => handleReject(params.row.id)}
          >
            <CancelIcon />
          </IconButton>
        </>
      )}

      {/* Delete */}
      <IconButton
        color="error"
        onClick={() => handleDelete(params.row.id)}
      >
        <DeleteIcon />
      </IconButton>

    </Box>

  ),
},

  ];
const handleSave = async () => {

  try {

    await updateOfficer(editOfficer.id, editOfficer);

    alert("Officer updated successfully.");

    setEditOpen(false);

    loadOfficers();

  } catch (error) {

    console.error(error);

    alert("Failed to update officer.");

  }

};
  return (
    <>
      <Sidebar />
<Dialog
  open={viewOpen}
  onClose={() => setViewOpen(false)}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle>Officer Details</DialogTitle>

  <DialogContent>
    {selectedOfficer && (
      <Box sx={{ mt: 2 }}>
        <Typography><b>Employee ID:</b> {selectedOfficer.employeeId}</Typography>
        <Typography><b>Name:</b> {selectedOfficer.fullName}</Typography>
        <Typography><b>Email:</b> {selectedOfficer.email}</Typography>
        <Typography><b>Phone:</b> {selectedOfficer.phone}</Typography>
        <Typography><b>Department:</b> {selectedOfficer.department}</Typography>
        <Typography><b>Designation:</b> {selectedOfficer.designation}</Typography>
        <Typography><b>Status:</b> {selectedOfficer.status}</Typography>
      </Box>
    )}
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setViewOpen(false)}>
      Close
    </Button>
  </DialogActions>
</Dialog>
<Dialog
  open={editOpen}
  onClose={() => setEditOpen(false)}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle>Edit Officer</DialogTitle>

  <DialogContent>

    <TextField
      fullWidth
      margin="normal"
      label="Full Name"
      value={editOfficer.fullName || ""}
      onChange={(e) =>
        setEditOfficer({
          ...editOfficer,
          fullName: e.target.value,
        })
      }
    />

    <TextField
      fullWidth
      margin="normal"
      label="Email"
      value={editOfficer.email || ""}
      onChange={(e) =>
        setEditOfficer({
          ...editOfficer,
          email: e.target.value,
        })
      }
    />

    <TextField
      fullWidth
      margin="normal"
      label="Phone"
      value={editOfficer.phone || ""}
      onChange={(e) =>
        setEditOfficer({
          ...editOfficer,
          phone: e.target.value,
        })
      }
    />

  </DialogContent>

  <DialogActions>

    <Button onClick={() => setEditOpen(false)}>
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={handleSave}
    >
      Save
    </Button>

  </DialogActions>
</Dialog>
      <Box
        sx={{
          ml: "270px",
          p: 4,
          bgcolor: "#F4F6F9",
          minHeight: "100vh",
        }}
      >

        <Header />

        <Typography variant="h4" fontWeight="bold" mb={3}>
          👮 Officer Management
        </Typography>

        <Grid container spacing={3} mb={3}>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <BadgeIcon color="primary" sx={{ fontSize: 45 }} />

                <Typography variant="h4">
                  {officers.length}
                </Typography>

                <Typography>
                  Total Officers
                </Typography>

              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <VerifiedUserIcon
                  color="success"
                  sx={{ fontSize: 45 }}
                />

                <Typography variant="h4">
  {
    officers.filter(
      (o) => o.status === "ACTIVE"
    ).length
  }
</Typography>

<Typography>
  Active Officers
</Typography>

              </CardContent>
            </Card>
          </Grid>

        </Grid>

        <TextField
          fullWidth
          label="Search Officer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Card>

          <CardContent>

            <DataGrid
              rows={filtered}
              columns={columns}
              autoHeight
              pageSizeOptions={[5, 10, 20]}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              disableRowSelectionOnClick
            />

          </CardContent>

        </Card>

      </Box>
    </>
  );
}
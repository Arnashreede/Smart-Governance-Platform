import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  TextField,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import {
  getAllCitizens,
  
  deleteCitizen,
} from "../services/citizenService";

function ViewCitizens() {

  const [citizens, setCitizens] = useState([]);

  const [search, setSearch] = useState("");

  const [selectedCitizen, setSelectedCitizen] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);


  useEffect(() => {
    loadCitizens();
  }, []);

  const loadCitizens = async () => {

    try {

      const data = await getAllCitizens();

      setCitizens(Array.isArray(data) ? data : []);

    } catch (err) {

      console.error(err);

    }

  };

  const handleView = (citizen) => {

    setSelectedCitizen(citizen);

    setViewOpen(true);

  };

 

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this citizen?"))
      return;

    try {

      await deleteCitizen(id);

      loadCitizens();

    } catch (err) {

      console.error(err);

      alert("Delete failed");

    }

  };


  const filtered = citizens.filter((citizen) =>
    `${citizen.fullName} ${citizen.email} ${citizen.phone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );
    const columns = [
  {
    field: "id",
    headerName: "Citizen ID",
    width: 110,
  },

  {
    field: "fullName",
    headerName: "Citizen",
    flex: 1,
    renderCell: (params) => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          height: "100%",
        }}
      >
        <Avatar sx={{ bgcolor: "#1565C0" }}>
          {params.value?.charAt(0)}
        </Avatar>

        <Typography fontWeight="bold">
          {params.value}
        </Typography>
      </Box>
    ),
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
  field: "status",
  headerName: "Status",
  width: 130,
  renderCell: () => (
    <Chip
      label="Active"
      color="success"
      size="small"
    />
  ),
},

  {
    field: "actions",
    headerName: "Actions",
    width: 120,
    sortable: false,
    renderCell: (params) => (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          width: "100%",
        }}
      >
        <IconButton
          color="primary"
          onClick={() => handleView(params.row)}
        >
          <VisibilityIcon />
        </IconButton>

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

        <Typography
          variant="h4"
          fontWeight="bold"
          mb={3}
        >
          👥 Citizen Management
        </Typography>

        <Grid container spacing={3} mb={3}>

          <Grid size={{ xs: 12, md: 3 }}>
            <Card sx={{ borderRadius: 4 }}>
              <CardContent sx={{ textAlign: "center" }}>

                <PeopleIcon
                  sx={{
                    fontSize: 45,
                    color: "#1565C0",
                  }}
                />

                <Typography
                  variant="h4"
                  fontWeight="bold"
                >
                  {citizens.length}
                </Typography>

                <Typography>
                  Registered Citizens
                </Typography>

              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Card sx={{ borderRadius: 4 }}>
              <CardContent sx={{ textAlign: "center" }}>

                <VerifiedUserIcon
                  sx={{
                    fontSize: 45,
                    color: "#2E7D32",
                  }}
                />

                <Typography
                  variant="h4"
                  fontWeight="bold"
                >
                  {citizens.length}
                </Typography>

                <Typography>
                  Active Citizens
                </Typography>

              </CardContent>
            </Card>
          </Grid>

        </Grid>

        <TextField
          fullWidth
          label="Search Citizen"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Card sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: 3 }}>

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
                <Dialog
          open={viewOpen}
          onClose={() => setViewOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Citizen Details</DialogTitle>

          <DialogContent>

            {selectedCitizen && (

              <Box sx={{ mt: 2 }}>

                <Typography><b>Name:</b> {selectedCitizen.fullName}</Typography>

                <Typography><b>Email:</b> {selectedCitizen.email}</Typography>

                <Typography><b>Phone:</b> {selectedCitizen.phone}</Typography>

                <Typography>
                  <b>Status:</b>{" "}
                  {selectedCitizen.active ? "Active" : "Inactive"}
                </Typography>

              </Box>

            )}

          </DialogContent>

          <DialogActions>

            <Button
              onClick={() => setViewOpen(false)}
            >
              Close
            </Button>

          </DialogActions>

        </Dialog>


      </Box>

    </>

  );

}

export default ViewCitizens;
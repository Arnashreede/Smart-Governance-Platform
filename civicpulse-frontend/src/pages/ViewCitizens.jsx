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
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import { getAllCitizens } from "../services/citizenService";

function ViewCitizens() {

  const [citizens, setCitizens] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCitizens();
  }, []);

  const loadCitizens = async () => {
    try {
      const data = await getAllCitizens();
      setCitizens(data);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = citizens.filter((citizen) =>
    citizen.fullName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    {
      field: "id",
      headerName: "Citizen ID",
      width: 120,
    },
    {
      field: "fullName",
      headerName: "Full Name",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
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
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      renderCell: () => (
        <>
          <IconButton color="primary">
            <VisibilityIcon />
          </IconButton>

          <IconButton color="warning">
            <EditIcon />
          </IconButton>

          <IconButton color="error">
            <DeleteIcon />
          </IconButton>
        </>
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
      </Grid>

      <TextField
        fullWidth
        label="Search Citizen"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <DataGrid
            rows={filtered}
            columns={columns}
            autoHeight
            pageSizeOptions={[5, 10, 20]}
          />
        </CardContent>
      </Card>
    </Box>
  </>
);
}
export default ViewCitizens;
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
import BadgeIcon from "@mui/icons-material/Badge";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { getAllOfficers } from "../services/officerService";

export default function ViewOfficers() {
  const [officers, setOfficers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadOfficers();
  }, []);

  const loadOfficers = async () => {
    try {
      const data = await getAllOfficers();
      const rows = (Array.isArray(data) ? data : []).map((o, i) => ({
        id: o.id ?? o.officerId ?? i + 1,
        fullName: o.fullName ?? "",
        email: o.email ?? "",
        phone: o.phone ?? "",
        department: o.department ?? "",
        designation: o.designation ?? "",
      }));
      setOfficers(rows);
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = officers.filter(o =>
    `${o.fullName} ${o.email} ${o.department} ${o.designation}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "fullName", headerName: "Officer", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.3 },
    { field: "phone", headerName: "Phone", width: 140 },
    {
      field: "department",
      headerName: "Department",
      width: 180,
      renderCell: p => <Chip label={p.value || "N/A"} color="primary" variant="outlined" size="small" />,
    },
    { field: "designation", headerName: "Designation", width: 180 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: () => <Chip label="Active" color="success" size="small" />,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: () => (
        <>
          <IconButton color="primary"><VisibilityIcon /></IconButton>
          <IconButton color="warning"><EditIcon /></IconButton>
          <IconButton color="error"><DeleteIcon /></IconButton>
        </>
      ),
    },
  ];

  return (
    <>
      <Sidebar />
      <Box sx={{ ml: "270px", p: 4, bgcolor: "#F4F6F9", minHeight: "100vh" }}>
        <Header />
        <Typography variant="h4" fontWeight="bold" mb={3}>👮 Officer Management</Typography>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={3}>
            <Card><CardContent sx={{textAlign:"center"}}>
              <BadgeIcon color="primary" sx={{fontSize:45}} />
              <Typography variant="h4">{officers.length}</Typography>
              <Typography>Total Officers</Typography>
            </CardContent></Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card><CardContent sx={{textAlign:"center"}}>
              <VerifiedUserIcon color="success" sx={{fontSize:45}} />
              <Typography variant="h4">{officers.length}</Typography>
              <Typography>Active Officers</Typography>
            </CardContent></Card>
          </Grid>
        </Grid>

        <TextField
          fullWidth
          label="Search Officer"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          sx={{mb:3}}
        />

        <Card>
          <CardContent>
            <DataGrid
              rows={filtered}
              columns={columns}
              autoHeight
              pageSizeOptions={[5,10,20]}
              initialState={{
                pagination:{paginationModel:{pageSize:5}}
              }}
              disableRowSelectionOnClick
            />
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

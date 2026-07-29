import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import ApartmentIcon from "@mui/icons-material/Apartment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";

import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../services/departmentService";

function DepartmentManagement() {

  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [editing, setEditing] = useState(false);

  const [department, setDepartment] = useState({
    id: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setDepartment({
      ...department,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {

      if (editing) {
        await updateDepartment(department.id, department);
      } else {
        await createDepartment(department);
      }

      setDepartment({
        id: "",
        name: "",
        description: "",
      });

      setEditing(false);
      setOpen(false);

      loadDepartments();

    } catch (err) {
      console.error(err);
      alert("Failed");
    }
  };

  const handleEdit = (row) => {

    setDepartment(row);

    setEditing(true);

    setOpen(true);

  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this department?")) return;

    try {

      await deleteDepartment(id);

      loadDepartments();

    } catch (err) {

      console.error(err);

    }

  };

  const filtered = departments.filter((department) =>
    department.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [

    {
      field: "id",
      headerName: "ID",
      width: 80,
    },

    {
      field: "name",
      headerName: "Department",
      flex: 1,
    },

    {
      field: "description",
      headerName: "Description",
      flex: 1,
    },

    {
      field: "status",
      headerName: "Status",
      width: 120,

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

      renderCell: (params) => (

        <>

          <IconButton
            color="primary"
            onClick={() =>
              navigate(`/departments/${params.row.id}`)
            }
          >
            <VisibilityIcon />
          </IconButton>

          <IconButton
            color="warning"
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
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
        🏢 Department Management
      </Typography>

      <Grid container spacing={3} mb={3}>

        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent sx={{ textAlign: "center" }}>

              <ApartmentIcon
                sx={{
                  fontSize: 45,
                  color: "#1565C0",
                }}
              />

              <Typography
                variant="h4"
                fontWeight="bold"
              >
                {departments.length}
              </Typography>

              <Typography>
                Departments
              </Typography>

            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >

              <TextField
                label="Search Department"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                sx={{ width: "60%" }}
              />

              <Button
                variant="contained"
                startIcon={<AddBusinessIcon />}
                onClick={() => {

                  setEditing(false);

                  setDepartment({
                    id: "",
                    name: "",
                    description: "",
                  });

                  setOpen(true);

                }}
              >
                Add Department
              </Button>

            </CardContent>
          </Card>
        </Grid>

      </Grid>

      <Card sx={{ borderRadius: 4 }}>
        <CardContent>

          <DataGrid
            rows={filtered}
            columns={columns}
            autoHeight
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 20]}
          />

        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >

        <DialogTitle>

          {editing
            ? "Edit Department"
            : "Add Department"}

        </DialogTitle>

        <DialogContent>

          <TextField
            fullWidth
            margin="normal"
            label="Department Name"
            name="name"
            value={department.name}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            multiline
            rows={4}
            label="Description"
            name="description"
            value={department.description}
            onChange={handleChange}
          />

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
          >
            {editing ? "Update" : "Save"}
          </Button>

        </DialogActions>

      </Dialog>

    </Box>
  </>
);
}

export default DepartmentManagement;
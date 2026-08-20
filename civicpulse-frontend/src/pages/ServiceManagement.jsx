import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Alert,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import BusinessIcon from "@mui/icons-material/Business";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import { getDepartments } from "../services/departmentService";

import {
  getAllServices,
  createService,
} from "../services/governmentService";


function ServiceManagement() {
const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ============================
  // ADD SERVICE DIALOG
  // ============================

  const [openDialog, setOpenDialog] = useState(false);

  const [form, setForm] = useState({
    name: "",
    departmentId: "",
    serviceType: "Certificate",
    description: "",
    eligibility: "",
  });

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");


  // ============================
  // LOAD DATA
  // ============================

  useEffect(() => {
    loadData();
  }, []);


  const loadData = async () => {

    try {

      setLoading(true);

      // ----------------------------
      // DEPARTMENTS
      // ----------------------------

      try {

        const departmentData =
          await getDepartments();

        console.log(
          "DEPARTMENTS:",
          departmentData
        );

        setDepartments(
          Array.isArray(departmentData)
            ? departmentData
            : []
        );

      } catch (error) {

        console.error(
          "Failed to load departments:",
          error
        );

        setDepartments([]);

      }


      // ----------------------------
      // SERVICES
      // ----------------------------

      try {

        const serviceData =
          await getAllServices();

        console.log(
          "SERVICES:",
          serviceData
        );

        setServices(
          Array.isArray(serviceData)
            ? serviceData
            : []
        );

      } catch (error) {

        console.error(
          "Failed to load services:",
          error
        );

        setServices([]);

      }

    } finally {

      setLoading(false);

    }

  };


  // ============================
  // SERVICES BY DEPARTMENT
  // ============================

  const getDepartmentServices = (departmentId) => {

    return services.filter(
      (service) =>
        Number(service.departmentId) ===
        Number(departmentId)
    );

  };
  // ============================
// VIEW SERVICES
// ============================

const handleViewServices = (department) => {

  navigate(
    `/department-services?departmentId=${department.id}`
  );

};


  // ============================
  // SEARCH
  // ============================

  const filteredDepartments =
    departments.filter((department) => {

      const departmentServices =
        getDepartmentServices(
          department.id
        );

      const text =
        search.toLowerCase();

      return (
        department.name
          ?.toLowerCase()
          .includes(text) ||

        departmentServices.some(
          (service) =>
            service.name
              ?.toLowerCase()
              .includes(text)
        )
      );

    });


  // ============================
  // OPEN ADD SERVICE
  // ============================

  const handleOpenDialog = () => {

    setForm({
      name: "",
      departmentId: "",
      serviceType: "Certificate",
      description: "",
      eligibility: "",
    });

    setFormError("");

    setOpenDialog(true);

  };


  // ============================
  // CLOSE ADD SERVICE
  // ============================

  const handleCloseDialog = () => {

    if (saving) return;

    setOpenDialog(false);

  };


  // ============================
  // FORM CHANGE
  // ============================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // ============================
  // CREATE SERVICE
  // ============================

  const handleCreateService = async () => {

    setFormError("");

    if (!form.name.trim()) {

      setFormError(
        "Please enter a service name."
      );

      return;

    }

    if (!form.departmentId) {

      setFormError(
        "Please select a department."
      );

      return;

    }

    if (!form.serviceType) {

      setFormError(
        "Please select a service type."
      );

      return;

    }


    try {

      setSaving(true);

      const newService = {

        name: form.name.trim(),

        departmentId:
          Number(form.departmentId),

        serviceType:
          form.serviceType,

        description:
          form.description.trim(),

        eligibility:
          form.eligibility.trim(),

        active: true,

      };


      console.log(
        "CREATING SERVICE:",
        newService
      );


      await createService(
        newService
      );


      alert(
        "Government service created successfully."
      );


      setOpenDialog(false);

      await loadData();


    } catch (error) {

      console.error(
        "Failed to create service:",
        error
      );

      const message =
        error?.response?.data ||
        "Failed to create service.";

      setFormError(
        typeof message === "string"
          ? message
          : "Failed to create service."
      );

    } finally {

      setSaving(false);

    }

  };


  return (

    <>

      <Sidebar />

      <Box
        sx={{
          ml: "270px",
          minHeight: "100vh",
          bgcolor: "#F5F7FA",
          p: 4,
        }}
      >

        <Header />


        {/* ============================
            PAGE HEADER
        ============================ */}

        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >

          <Box>

            <Typography
              variant="h4"
              fontWeight="bold"
            >
              Service Management
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Manage government services,
              certificates, licenses and permits.
            </Typography>

          </Box>


          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.2,
            }}
          >
            Add New Service
          </Button>

        </Box>


        {/* ============================
            SEARCH
        ============================ */}

        <TextField
          fullWidth
          placeholder="Search department or service..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          sx={{
            mt: 4,
            mb: 4,
            bgcolor: "white",
            borderRadius: 2,
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            },
          }}
        />


        {/* ============================
            LOADING
        ============================ */}

        {loading ? (

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 8,
            }}
          >
            <CircularProgress />
          </Box>

        ) : filteredDepartments.length === 0 ? (

          <Card
            sx={{
              borderRadius: 4,
              p: 5,
              textAlign: "center",
            }}
          >

            <Typography
              variant="h6"
              color="text.secondary"
            >
              No departments or services found
            </Typography>

          </Card>

        ) : (

          <Grid container spacing={3}>

            {filteredDepartments.map(
              (department) => {

                const departmentServices =
                  getDepartmentServices(
                    department.id
                  );


                return (

                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    key={department.id}
                  >

                    <Card
                      sx={{
                        height: "100%",
                        borderRadius: 4,
                        boxShadow: 2,
                        transition: "0.2s",

                        "&:hover": {
                          transform:
                            "translateY(-3px)",
                          boxShadow: 5,
                        },
                      }}
                    >

                      <CardContent
                        sx={{ p: 3 }}
                      >

                        {/* DEPARTMENT HEADER */}

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >

                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 3,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor:
                                "primary.light",
                            }}
                          >

                            <BusinessIcon
                              color="primary"
                            />

                          </Box>


                          <Box>

                            <Typography
                              variant="h6"
                              fontWeight="bold"
                            >
                              {department.name}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              Department
                            </Typography>

                          </Box>

                        </Box>


                        {/* SERVICE COUNT */}

                        <Box
                          sx={{
                            mt: 3,
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                              "space-between",
                          }}
                        >

                          <Typography
                            color="text.secondary"
                          >
                            Available Services
                          </Typography>

                          <Chip
                            label={
                              departmentServices.length
                            }
                            color="primary"
                            size="small"
                          />

                        </Box>


                        {/* SERVICE LIST */}

                        <Box sx={{ mt: 2 }}>

                          {departmentServices.length ===
                          0 ? (

                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              No services added yet.
                            </Typography>

                          ) : (

                            departmentServices
                              .slice(0, 4)
                              .map((service) => (

                                <Box
                                  key={service.id}
                                  sx={{
                                    py: 1.2,
                                    borderBottom:
                                      "1px solid #eee",
                                    display: "flex",
                                    justifyContent:
                                      "space-between",
                                    alignItems:
                                      "center",
                                  }}
                                >

                                  <Typography
                                    variant="body2"
                                    fontWeight="medium"
                                  >
                                    {service.name}
                                  </Typography>

                                  <Chip
                                    label={
                                      service.serviceType
                                    }
                                    size="small"
                                    variant="outlined"
                                  />

                                </Box>

                              ))

                          )}


                          {departmentServices.length >
                            4 && (

                            <Typography
                              variant="body2"
                              color="primary"
                              sx={{ mt: 1 }}
                            >
                              +
                              {" "}
                              {departmentServices.length - 4}
                              {" "}
                              more services
                            </Typography>

                          )}

                        </Box>


                        {/* VIEW BUTTON */}

                        <Button
  fullWidth
  variant="text"
  endIcon={<ArrowForwardIcon />}
  onClick={() => handleViewServices(department)}
  sx={{ mt: 2 }}
>
  View Services
</Button>

                      </CardContent>

                    </Card>

                  </Grid>

                );

              }
            )}

          </Grid>

        )}

      </Box>


      {/* =================================================
          ADD SERVICE DIALOG
      ================================================= */}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >

        <DialogTitle
          sx={{
            fontWeight: "bold",
          }}
        >
          Add New Government Service
        </DialogTitle>


        <DialogContent>

          <Typography
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Create a new certificate, license,
            permit or other government service.
          </Typography>


          {formError && (

            <Alert
              severity="error"
              sx={{ mb: 3 }}
            >
              {formError}
            </Alert>

          )}


          {/* SERVICE NAME */}

          <TextField
            fullWidth
            required
            label="Service Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Example: Birth Certificate"
            sx={{ mb: 3 }}
          />


          {/* DEPARTMENT */}

          <TextField
            select
            fullWidth
            required
            label="Department"
            name="departmentId"
            value={form.departmentId}
            onChange={handleChange}
            sx={{ mb: 3 }}
          >

            <MenuItem value="">
              Select Department
            </MenuItem>

            {departments.map(
              (department) => (

                <MenuItem
                  key={department.id}
                  value={department.id}
                >
                  {department.name}
                </MenuItem>

              )
            )}

          </TextField>


          {/* SERVICE TYPE */}

          <TextField
            select
            fullWidth
            required
            label="Service Type"
            name="serviceType"
            value={form.serviceType}
            onChange={handleChange}
            sx={{ mb: 3 }}
          >

            <MenuItem value="Certificate">
              Certificate
            </MenuItem>

            <MenuItem value="License">
              License
            </MenuItem>

            <MenuItem value="Permit">
              Permit
            </MenuItem>

            <MenuItem value="Registration">
              Registration
            </MenuItem>

            <MenuItem value="Scheme">
              Scheme
            </MenuItem>

            <MenuItem value="Other">
              Other
            </MenuItem>

          </TextField>


          {/* DESCRIPTION */}

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe this government service..."
            sx={{ mb: 3 }}
          />


          {/* ELIGIBILITY */}

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Eligibility"
            name="eligibility"
            value={form.eligibility}
            onChange={handleChange}
            placeholder="Who is eligible to apply?"
          />

        </DialogContent>


        <DialogActions
          sx={{ p: 3 }}
        >

          <Button
            onClick={handleCloseDialog}
            disabled={saving}
          >
            Cancel
          </Button>


          <Button
            variant="contained"
            startIcon={
              saving ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              ) : (
                <AddIcon />
              )
            }
            onClick={handleCreateService}
            disabled={saving}
          >
            {saving
              ? "Creating..."
              : "Create Service"}
          </Button>

        </DialogActions>

      </Dialog>

    </>

  );

}

export default ServiceManagement;
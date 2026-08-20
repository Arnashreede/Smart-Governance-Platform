import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import TitleOutlinedIcon from "@mui/icons-material/TitleOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

import Navbar from "../components/Navbar";

import { registerGrievance } from "../services/grievanceService";
import { getDepartments } from "../services/departmentService";

function RegisterGrievance() {
  const [departments, setDepartments] = useState([]);

  const [grievance, setGrievance] = useState({
    department: "",
    category: "",
    priority: "",
    title: "",
    description: "",
  });

  const [loadingDepartments, setLoadingDepartments] =
    useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
   * ==========================================================
   * LOGGED-IN CITIZEN
   * ==========================================================
   *
   * Citizen ID is obtained automatically.
   * The citizen does NOT enter it manually.
   */
  const citizenId =
    localStorage.getItem("citizenId") ||
    localStorage.getItem("userId");

  /*
   * ==========================================================
   * LOAD DEPARTMENTS FROM BACKEND
   * ==========================================================
   */

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setLoadingDepartments(true);
        setError("");

        const data = await getDepartments();

        if (Array.isArray(data)) {
          setDepartments(
            data.filter(
              (department) =>
                department.active !== false
            )
          );
        } else {
          setDepartments([]);
        }
      } catch (err) {
        console.error(
          "Failed to load departments:",
          err
        );

        setError(
          "Unable to load departments. Please try again."
        );
      } finally {
        setLoadingDepartments(false);
      }
    };

    loadDepartments();
  }, []);

  /*
   * ==========================================================
   * HANDLE INPUT
   * ==========================================================
   */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setGrievance((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  /*
   * ==========================================================
   * SUBMIT GRIEVANCE
   * ==========================================================
   */

  const handleSubmit = async (event) => {
  event.preventDefault();

  setError("");
  setSuccess("");

  if (!citizenId) {
    setError(
      "Your citizen account could not be identified. Please log in again."
    );
    return;
  }

  if (!grievance.department) {
    setError("Please select a department.");
    return;
  }

  if (!grievance.category.trim()) {
    setError("Please enter the complaint type.");
    return;
  }

  if (!grievance.priority) {
    setError("Please select the complaint priority.");
    return;
  }

  if (!grievance.title.trim()) {
    setError("Please enter a complaint title.");
    return;
  }

  if (!grievance.description.trim()) {
    setError("Please describe your complaint.");
    return;
  }

  try {
    setSubmitting(true);

    const complaintData = {
      citizenId: Number(citizenId),
      department: grievance.department,
      category: grievance.category.trim(),
      title: grievance.title.trim(),
      description: grievance.description.trim(),
      priority: grievance.priority,
      status: "OPEN",
    };

    console.log("SENDING GRIEVANCE:", complaintData);

    await registerGrievance(complaintData);

    setSuccess(
      "Your complaint has been registered successfully."
    );

    setGrievance({
      department: "",
      category: "",
      priority: "",
      title: "",
      description: "",
    });

  } catch (err) {

    console.error(
      "FAILED STATUS:",
      err.response?.status
    );

    console.error(
      "FAILED DATA:",
      err.response?.data
    );

    console.error(
      "FAILED HEADERS:",
      err.response?.headers
    );

    console.error(
      "FAILED REQUEST:",
      err.config?.data
    );

    setError(
      err.response?.data?.message ||
      err.response?.data ||
      "Failed to register complaint."
    );

  } finally {
    setSubmitting(false);
  }
};

  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #f5f8fc 0%, #edf4fa 100%)",
          py: 6,
          px: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: 850,
            mx: "auto",
          }}
        >
          {/* ==================================================
              PAGE HEADER
          ================================================== */}

          <Box
            sx={{
              textAlign: "center",
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "20px",
                mx: "auto",
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, #1565c0, #42a5f5)",
                boxShadow:
                  "0 10px 25px rgba(21,101,192,0.25)",
              }}
            >
              <ReportProblemOutlinedIcon
                sx={{
                  color: "#fff",
                  fontSize: 40,
                }}
              />
            </Box>

            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                color: "#172b4d",
                mb: 1,
              }}
            >
              Register a Complaint
            </Typography>

            <Typography
              sx={{
                color: "#667085",
                maxWidth: 650,
                mx: "auto",
              }}
            >
              Report a civic issue to the appropriate
              government department.
            </Typography>
          </Box>

          {/* ==================================================
              FORM CARD
          ================================================== */}

          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              border: "1px solid #e2e8f0",
              boxShadow:
                "0 12px 35px rgba(15,23,42,0.08)",
            }}
          >
            <Box
              sx={{
                height: 5,
                background:
                  "linear-gradient(90deg, #1565c0, #42a5f5)",
              }}
            />

            <CardContent
              sx={{
                p: {
                  xs: 3,
                  md: 5,
                },
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  color: "#172b4d",
                }}
              >
                Complaint Details
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  mb: 3,
                }}
              >
                Provide the details of the issue you want
                to report.
              </Typography>

              <Divider sx={{ mb: 4 }} />

              {/* ERROR */}

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                  }}
                  onClose={() => setError("")}
                >
                  {error}
                </Alert>
              )}

             

              <Box
                component="form"
                onSubmit={handleSubmit}
              >
                {/* ==================================================
                    DEPARTMENT
                ================================================== */}

                <FormControl
                  fullWidth
                  required
                  disabled={loadingDepartments}
                  sx={fieldStyle}
                >
                  <InputLabel>
                    Department
                  </InputLabel>

                  <Select
                    name="department"
                    value={grievance.department}
                    label="Department"
                    onChange={handleChange}
                    startAdornment={
                      <LocationCityOutlinedIcon
                        sx={{
                          mr: 1,
                          color: "#64748b",
                        }}
                      />
                    }
                  >
                    {departments.map(
                      (department) => (
                        <MenuItem
                          key={department.id}
                          value={department.name}
                        >
                          {department.name}
                        </MenuItem>
                      )
                    )}
                  </Select>

                  <Typography
                    variant="caption"
                    sx={{
                      color: "#7b8794",
                      mt: 0.7,
                      ml: 1.5,
                    }}
                  >
                    Example: Water Supply Department
                  </Typography>
                </FormControl>

                {/* ==================================================
                    COMPLAINT TYPE
                ================================================== */}

                <TextField
                  fullWidth
                  required
                  label="Complaint Type"
                  name="category"
                  value={grievance.category}
                  onChange={handleChange}
                  placeholder="e.g., Water Leakage"
                  helperText="Example: Water Leakage, No Water Supply, Pipeline Damage"
                  sx={fieldStyle}
                  InputProps={{
                    startAdornment: (
                      <CategoryOutlinedIcon
                        sx={{
                          mr: 1,
                          color: "#64748b",
                        }}
                      />
                    ),
                  }}
                />

                {/* ==================================================
                    PRIORITY
                ================================================== */}

                <FormControl
                  fullWidth
                  required
                  sx={fieldStyle}
                >
                  <InputLabel>
                    Priority
                  </InputLabel>

                  <Select
                    name="priority"
                    value={grievance.priority}
                    label="Priority"
                    onChange={handleChange}
                    startAdornment={
                      <PriorityHighOutlinedIcon
                        sx={{
                          mr: 1,
                          color: "#64748b",
                        }}
                      />
                    }
                  >
                    <MenuItem value="HIGH">
                      High
                    </MenuItem>

                    <MenuItem value="MEDIUM">
                      Medium
                    </MenuItem>

                    <MenuItem value="LOW">
                      Low
                    </MenuItem>
                  </Select>

                  <Typography
                    variant="caption"
                    sx={{
                      color: "#7b8794",
                      mt: 0.7,
                      ml: 1.5,
                    }}
                  >
                    Example: High for an urgent public
                    safety or essential service issue.
                  </Typography>
                </FormControl>

                {/* ==================================================
                    TITLE
                ================================================== */}

                <TextField
                  fullWidth
                  required
                  label="Complaint Title"
                  name="title"
                  value={grievance.title}
                  onChange={handleChange}
                  placeholder="e.g., Major water leakage near Ward 5"
                  helperText="Give your complaint a short, clear title."
                  sx={fieldStyle}
                  InputProps={{
                    startAdornment: (
                      <TitleOutlinedIcon
                        sx={{
                          mr: 1,
                          color: "#64748b",
                        }}
                      />
                    ),
                  }}
                />

                {/* ==================================================
                    DESCRIPTION
                ================================================== */}

                <TextField
                  fullWidth
                  required
                  multiline
                  minRows={5}
                  label="Complaint Description"
                  name="description"
                  value={grievance.description}
                  onChange={handleChange}
                  placeholder="e.g., Water has been leaking continuously from the main pipeline near Ward 5 since yesterday evening..."
                  helperText="Include the location, duration and other relevant details."
                  sx={fieldStyle}
                  InputProps={{
                    startAdornment: (
                      <DescriptionOutlinedIcon
                        sx={{
                          mr: 1,
                          mt: 1,
                          color: "#64748b",
                        }}
                      />
                    ),
                  }}
                />

                {/* ==================================================
                    SUBMIT BUTTON
                ================================================== */}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={
                    submitting ||
                    loadingDepartments
                  }
                  startIcon={
                    submitting ? (
                      <CircularProgress
                        size={20}
                        color="inherit"
                      />
                    ) : (
                      <SendRoundedIcon />
                    )
                  }
                  sx={{
                    mt: 2,
                    py: 1.7,
                    borderRadius: 2.5,
                    textTransform: "none",
                    fontSize: "16px",
                    fontWeight: 700,
                    background:
                      "linear-gradient(135deg, #1565c0, #1976d2)",
                    boxShadow:
                      "0 7px 18px rgba(21,101,192,0.25)",

                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #0d47a1, #1565c0)",
                    },
                  }}
                >
                  {submitting
                    ? "Registering Complaint..."
                    : "Register Complaint"}
                </Button>

                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    textAlign: "center",
                    color: "#7b8794",
                    mt: 2.5,
                  }}
                >
                  Your complaint will automatically be
                  linked to your citizen account.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
        
      </Box>
      <Snackbar
        open={Boolean(success)}
        autoHideDuration={4000}
        onClose={() => setSuccess("")}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={() => setSuccess("")}
          severity="success"
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          {success}
        </Alert>
      </Snackbar>
    </>
  );
}

const fieldStyle = {
  mb: 2.5,

  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    backgroundColor: "#fff",

    "& fieldset": {
      borderColor: "#d7dee8",
    },

    "&:hover fieldset": {
      borderColor: "#90caf9",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#1976d2",
      borderWidth: 2,
    },
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#1565c0",
  },
};

export default RegisterGrievance;
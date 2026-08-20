import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  AccessTime,
  AccountBalance,
  Apps,
  ArrowBack,
  ArrowForward,
  CheckCircle,
  CloudUpload,
  Description,
  FilterList,
  InfoOutlined,
  Person,
  Search,
  Send,
  VerifiedUser,
} from "@mui/icons-material";

import { getAllServices } from "../services/governmentService";
import { getFormFields } from "../services/serviceFormFieldService";

import {
  submitApplication,
  uploadDocument,
  getCitizenApplications,
} from "../services/applicationService";


function CitizenApplication() {

  // =========================================================
  // LOGGED-IN CITIZEN
  // =========================================================

  const userId =
    
    localStorage.getItem("userId") ||
    "";

  const applicantName =
    localStorage.getItem("fullName") ||
    localStorage.getItem("applicantName") ||
    localStorage.getItem("name") ||
    "";

  const username =
    localStorage.getItem("username") || "";


  // =========================================================
  // STATE
  // =========================================================

  const [services, setServices] = useState([]);

  const [selectedService, setSelectedService] =
    useState(null);

  const [fields, setFields] = useState([]);

  const [formData, setFormData] = useState({});

  const [documents, setDocuments] = useState({});

  const [applications, setApplications] = useState([]);

  const [loadingServices, setLoadingServices] =
    useState(true);

  const [loadingFields, setLoadingFields] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [serviceFilter, setServiceFilter] =
    useState("ALL");


  // =========================================================
  // LOAD SERVICES + APPLICATIONS
  // =========================================================

  useEffect(() => {
    loadServices();
    loadApplications();
  }, []);


  // =========================================================
  // LOAD SERVICES FROM DATABASE
  // =========================================================

  const loadServices = async () => {

    try {

      setLoadingServices(true);
      setError("");

      const data = await getAllServices();

      const activeServices =
        Array.isArray(data)
          ? data.filter(
              (service) =>
                service.active !== false
            )
          : [];

      setServices(activeServices);

    } catch (err) {

      console.error(
        "Failed to load services:",
        err
      );

      setError(
        "Unable to load government services. Please try again."
      );

    } finally {

      setLoadingServices(false);

    }
  };


  // =========================================================
  // LOAD CITIZEN APPLICATIONS
  // =========================================================

  const loadApplications = async () => {

    if (!userId) {
  return;
}

    try {

      const data =
        await getCitizenApplications(
           userId
        );

      setApplications(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Failed to load applications:",
        err
      );

      setApplications([]);

    }
  };


  // =========================================================
  // SERVICE TYPE HELPER
  // =========================================================

  const getServiceType = (service) => {

    return (
      service?.serviceType ||
      service?.type ||
      "SERVICE"
    )
      .toString()
      .trim();
  };


  // =========================================================
  // SERVICE NAME HELPER
  // =========================================================

  const getServiceName = (service) => {

    return (
      service?.name ||
      service?.serviceName ||
      "Government Service"
    );
  };


  // =========================================================
  // SERVICE DESCRIPTION HELPER
  // =========================================================

  const getServiceDescription = (service) => {

    return (
      service?.description ||
      "Application details will be provided after selecting this service."
    );
  };


  // =========================================================
  // DEPARTMENT NAME HELPER
  // =========================================================

  const getDepartmentName = (service) => {

    return (
      service?.departmentName ||
      service?.department?.name ||
      service?.department ||
      ""
    );
  };


  // =========================================================
  // DYNAMIC SERVICE TYPES
  // =========================================================

  const serviceTypes = useMemo(() => {

    const types = services
      .map((service) =>
        getServiceType(service)
      )
      .filter(Boolean);

    return [
      ...new Set(types),
    ];

  }, [services]);


  // =========================================================
  // FILTER SERVICES
  // =========================================================

  const filteredServices = useMemo(() => {

    const search =
      searchTerm
        .trim()
        .toLowerCase();

    return services.filter(
      (service) => {

        const name =
          getServiceName(service)
            .toLowerCase();

        const description =
          getServiceDescription(service)
            .toLowerCase();

        const department =
          getDepartmentName(service)
            .toLowerCase();

        const type =
          getServiceType(service)
            .toLowerCase();

        const matchesSearch =
          !search ||
          name.includes(search) ||
          description.includes(search) ||
          department.includes(search) ||
          type.includes(search);

        const matchesFilter =
          serviceFilter === "ALL" ||
          getServiceType(service) ===
            serviceFilter;

        return (
          matchesSearch &&
          matchesFilter
        );
      }
    );

  }, [
    services,
    searchTerm,
    serviceFilter,
  ]);


  // =========================================================
  // SELECT SERVICE
  // =========================================================

  const handleSelectService =
    async (service) => {

      try {

        setSelectedService(service);

        setFields([]);

        setFormData({});

        setDocuments({});

        setError("");

        setSuccess("");

        setLoadingFields(true);

        const data =
          await getFormFields(
            service.id
          );

        const sortedFields =
          Array.isArray(data)
            ? [...data].sort(
                (a, b) =>
                  (a.fieldOrder || 0) -
                  (b.fieldOrder || 0)
              )
            : [];

        setFields(sortedFields);

      } catch (err) {

        console.error(
          "Failed to load form fields:",
          err
        );

        setError(
          "Unable to load the application form for this service."
        );

        setSelectedService(null);

      } finally {

        setLoadingFields(false);

      }
    };


  // =========================================================
  // FIELD VALUE CHANGE
  // =========================================================

  const handleFieldChange = (
    field,
    value
  ) => {

    setFormData(
      (previous) => ({
        ...previous,
        [field.id]: value,
      })
    );
  };


  // =========================================================
  // FILE CHANGE
  // =========================================================

  const handleFileChange = (
    field,
    file
  ) => {

    if (!file) {
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {

      setError(
        `${field.fieldName} must be smaller than 5 MB.`
      );

      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {

      setError(
        `${field.fieldName} must be a PDF, JPG or PNG file.`
      );

      return;
    }

    setError("");

    setDocuments(
      (previous) => ({
        ...previous,
        [field.id]: file,
      })
    );

    handleFieldChange(
      field,
      file
    );
  };


  // =========================================================
  // VALIDATE FORM
  // =========================================================

  const validateForm = () => {

    for (const field of fields) {

      if (!field.required) {
        continue;
      }

      if (
        field.fieldType ===
        "FILE"
      ) {

        if (
          !documents[field.id]
        ) {

          setError(
            `${field.fieldName} is required.`
          );

          return false;
        }

        continue;
      }

      const value =
        formData[field.id];

      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {

        setError(
          `${field.fieldName} is required.`
        );

        return false;
      }
    }

    return true;
  };


  // =========================================================
  // SUBMIT APPLICATION
  // =========================================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");
      setSuccess("");

      if (!userId) {

        setError(
          "Citizen information was not found. Please login again."
        );

        return;
      }

      if (!selectedService) {

        setError(
          "Please select a service."
        );

        return;
      }

      if (!validateForm()) {
        return;
      }

      try {

        setSubmitting(true);

        const dynamicFormData = {};

        fields.forEach(
          (field) => {

            if (
              field.fieldType ===
              "FILE"
            ) {
              return;
            }

            dynamicFormData[
              field.id
            ] =
              formData[field.id] ??
              null;

          }
        );


        const request = {

          citizenId:
            Number(userId),

          applicantName,

          applicationType:
            getServiceName(
              selectedService
            ),

          serviceId:
            selectedService.id,

          formData:
            dynamicFormData,

          remarks: "",
        };


        console.log(
          "APPLICATION REQUEST:",
          request
        );


        const savedApplication =
          await submitApplication(
            request
          );


        // Upload files
        for (
          const field of fields
        ) {

          if (
            field.fieldType !==
            "FILE"
          ) {
            continue;
          }

          const file =
            documents[field.id];

          if (file) {

            await uploadDocument(
              savedApplication.id,
              file
            );

          }
        }


        setSuccess(
          "Your application has been submitted successfully."
        );


        setSelectedService(null);

        setFields([]);

        setFormData({});

        setDocuments({});


        await loadApplications();


        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

      } catch (err) {

        console.error(
          "Application submission failed:",
          err
        );

        console.error(
          "Status:",
          err.response?.status
        );

        console.error(
          "Response:",
          err.response?.data
        );


        const message =
          err.response?.data;

        setError(
          typeof message ===
            "string"
            ? message
            : "Failed to submit the application. Please try again."
        );

      } finally {

        setSubmitting(false);

      }
    };


  // =========================================================
  // BACK TO SERVICES
  // =========================================================

  const handleBack = () => {

    setSelectedService(null);

    setFields([]);

    setFormData({});

    setDocuments({});

    setError("");

    setSuccess("");

  };


  // =========================================================
  // RENDER DYNAMIC FIELD
  // =========================================================

  const renderField = (
    field
  ) => {

    const value =
      formData[field.id] ??
      "";


    switch (
      field.fieldType
    ) {

      // -----------------------------------------------------
      // TEXT
      // -----------------------------------------------------

      case "TEXT":

        return (
          <TextField
            fullWidth
            label={
              field.fieldName
            }
            placeholder={
              field.placeholder ||
              ""
            }
            value={value}
            required={
              field.required
            }
            onChange={(event) =>
              handleFieldChange(
                field,
                event.target.value
              )
            }
          />
        );


      // -----------------------------------------------------
      // NUMBER
      // -----------------------------------------------------

      case "NUMBER":

        return (
          <TextField
            fullWidth
            type="number"
            label={
              field.fieldName
            }
            placeholder={
              field.placeholder ||
              ""
            }
            value={value}
            required={
              field.required
            }
            onChange={(event) =>
              handleFieldChange(
                field,
                event.target.value
              )
            }
          />
        );


      // -----------------------------------------------------
      // EMAIL
      // -----------------------------------------------------

      case "EMAIL":

        return (
          <TextField
            fullWidth
            type="email"
            label={
              field.fieldName
            }
            placeholder={
              field.placeholder ||
              ""
            }
            value={value}
            required={
              field.required
            }
            onChange={(event) =>
              handleFieldChange(
                field,
                event.target.value
              )
            }
          />
        );


      // -----------------------------------------------------
      // PHONE
      // -----------------------------------------------------

      case "PHONE":

        return (
          <TextField
            fullWidth
            type="tel"
            label={
              field.fieldName
            }
            placeholder={
              field.placeholder ||
              ""
            }
            value={value}
            required={
              field.required
            }
            onChange={(event) =>
              handleFieldChange(
                field,
                event.target.value
              )
            }
          />
        );


      // -----------------------------------------------------
      // DATE
      // -----------------------------------------------------

      case "DATE":

        return (
          <TextField
            fullWidth
            type="date"
            label={
              field.fieldName
            }
            value={value}
            required={
              field.required
            }
            onChange={(event) =>
              handleFieldChange(
                field,
                event.target.value
              )
            }
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
        );


      // -----------------------------------------------------
      // TEXTAREA
      // -----------------------------------------------------

      case "TEXTAREA":

        return (
          <TextField
            fullWidth
            multiline
            minRows={4}
            label={
              field.fieldName
            }
            placeholder={
              field.placeholder ||
              ""
            }
            value={value}
            required={
              field.required
            }
            onChange={(event) =>
              handleFieldChange(
                field,
                event.target.value
              )
            }
          />
        );


      // -----------------------------------------------------
      // DROPDOWN
      // -----------------------------------------------------

      case "DROPDOWN": {

        const options =
          Array.isArray(
            field.options
          )
            ? field.options
            : (
                field.options ||
                ""
              )
                .split(",")
                .map(
                  (option) =>
                    option.trim()
                )
                .filter(Boolean);


        return (
          <TextField
            select
            fullWidth
            label={
              field.fieldName
            }
            value={value}
            required={
              field.required
            }
            onChange={(event) =>
              handleFieldChange(
                field,
                event.target.value
              )
            }
          >

            <MenuItem value="">
              Select{" "}
              {field.fieldName}
            </MenuItem>

            {options.map(
              (option) => (

                <MenuItem
                  key={option}
                  value={option}
                >
                  {option}
                </MenuItem>

              )
            )}

          </TextField>
        );
      }


      // -----------------------------------------------------
      // CHECKBOX
      // -----------------------------------------------------

      case "CHECKBOX":

        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={
                  value === true
                }
                onChange={(event) =>
                  handleFieldChange(
                    field,
                    event.target.checked
                  )
                }
              />
            }
            label={
              <Typography>
                {
                  field.fieldName
                }

                {field.required && (
                  <Box
                    component="span"
                    sx={{
                      color:
                        "error.main",
                      ml: 0.5,
                    }}
                  >
                    *
                  </Box>
                )}
              </Typography>
            }
          />
        );


      // -----------------------------------------------------
      // FILE
      // -----------------------------------------------------

      case "FILE": {

        const selectedFile =
          documents[field.id];


        return (
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3,
              borderStyle:
                "dashed",
              backgroundColor:
                "#fafcff",
            }}
          >

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
              alignItems={{
                xs: "flex-start",
                sm: "center",
              }}
            >

              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  backgroundColor:
                    "primary.light",
                  color:
                    "primary.main",
                  flexShrink: 0,
                }}
              >
                <CloudUpload />
              </Box>


              <Box
                sx={{
                  flex: 1,
                  width: "100%",
                }}
              >

                <Typography
                  fontWeight="bold"
                >
                  {
                    field.fieldName
                  }

                  {field.required && (
                    <Box
                      component="span"
                      sx={{
                        color:
                          "error.main",
                        ml: 0.5,
                      }}
                    >
                      *
                    </Box>
                  )}
                </Typography>


                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  PDF, JPG or PNG
                  {" • "}
                  Maximum 5 MB
                </Typography>


                {selectedFile && (

                  <Typography
                    variant="body2"
                    color="success.main"
                    sx={{
                      mt: 1,
                      fontWeight: 600,
                    }}
                  >
                    {selectedFile.name}
                  </Typography>

                )}

              </Box>


              <Button
                component="label"
                variant="outlined"
                startIcon={
                  <CloudUpload />
                }
                sx={{
                  borderRadius: 2,
                  flexShrink: 0,
                }}
              >

                Choose File

                <input
                  hidden
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(event) =>
                    handleFileChange(
                      field,
                      event.target
                        .files?.[0]
                    )
                  }
                />

              </Button>

            </Stack>

          </Paper>
        );
      }


      // -----------------------------------------------------
      // FALLBACK
      // -----------------------------------------------------

      default:

        return (
          <TextField
            fullWidth
            label={
              field.fieldName
            }
            placeholder={
              field.placeholder ||
              ""
            }
            value={value}
            required={
              field.required
            }
            onChange={(event) =>
              handleFieldChange(
                field,
                event.target.value
              )
            }
          />
        );
    }
  };


  // =========================================================
  // RECENT APPLICATIONS
  // =========================================================

  const recentApplications =
    useMemo(
      () =>
        [...applications]
          .reverse()
          .slice(0, 5),
      [applications]
    );


  // =========================================================
  // LOADING
  // =========================================================

  if (loadingServices) {

    return (
      <Box
        sx={{
          minHeight:
            "100vh",
          backgroundColor:
            "#f6f8fc",
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
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
        minHeight:
          "100vh",
        backgroundColor:
          "#f6f8fc",
        py: 4,
      }}
    >

      <Container
        maxWidth="xl"
        sx={{
          px: {
            xs: 2,
            sm: 3,
            md: 5,
          },
        }}
      >

        {/* ===================================================
            PAGE HEADER
        =================================================== */}

        {!selectedService && (

          <Box
            sx={{
              mb: 3,
            }}
          >

            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                color:
                  "#172033",
              }}
            >
              Government Services
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,
                maxWidth: 720,
              }}
            >
              Apply for government services
              online. Select a service to
              view its requirements and
              complete your application.
            </Typography>

          </Box>

        )}


        {/* ===================================================
            ALERTS
        =================================================== */}

        {error && (

          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
            }}
            onClose={() =>
              setError("")
            }
          >
            {error}
          </Alert>

        )}


        {success && (

          <Alert
            severity="success"
            icon={
              <CheckCircle />
            }
            sx={{
              mb: 3,
              borderRadius: 2,
            }}
          >
            {success}
          </Alert>

        )}


        {/* ===================================================
            SERVICE LIST
        =================================================== */}

        {!selectedService && (

          <Box>

            {/* ===============================================
                HERO
            =============================================== */}

            <Paper
              elevation={0}
              sx={{
                position:
                  "relative",
                overflow:
                  "hidden",
                borderRadius:
                  5,
                mb: 4,
                p: {
                  xs: 3,
                  md: 5,
                },
                color: "white",
                background:
                  "linear-gradient(135deg, #0d47a1 0%, #1565c0 48%, #42a5f5 100%)",
              }}
            >

              <Box
                sx={{
                  position:
                    "absolute",
                  width: 260,
                  height: 260,
                  borderRadius:
                    "50%",
                  background:
                    "rgba(255,255,255,0.08)",
                  right: -80,
                  top: -100,
                }}
              />

              <Box
                sx={{
                  position:
                    "absolute",
                  width: 160,
                  height: 160,
                  borderRadius:
                    "50%",
                  background:
                    "rgba(255,255,255,0.06)",
                  right: 120,
                  bottom: -110,
                }}
              />


              <Box
                sx={{
                  position:
                    "relative",
                  zIndex: 1,
                  maxWidth: 850,
                }}
              >

                <Chip
                  icon={
                    <VerifiedUser
                      sx={{
                        color:
                          "white !important",
                      }}
                    />
                  }
                  label="Online Government Services"
                  sx={{
                    mb: 2,
                    color:
                      "white",
                    borderColor:
                      "rgba(255,255,255,0.45)",
                    backgroundColor:
                      "rgba(255,255,255,0.1)",
                    fontWeight: 600,
                  }}
                  variant="outlined"
                />


                <Typography
                  variant="h3"
                  fontWeight={800}
                  sx={{
                    fontSize: {
                      xs: "2rem",
                      md: "2.8rem",
                    },
                    lineHeight:
                      1.15,
                  }}
                >
                  Government services,
                  <br />
                  made simple.
                </Typography>


                <Typography
                  sx={{
                    mt: 2,
                    maxWidth: 680,
                    fontSize:
                      "1.05rem",
                    lineHeight:
                      1.7,
                    color:
                      "rgba(255,255,255,0.88)",
                  }}
                >
                  Apply online, provide the
                  required information and
                  documents, and track the
                  progress of your application.
                </Typography>


                {/* SEARCH */}

                <Box
                  sx={{
                    mt: 4,
                    maxWidth: 650,
                    position:
                      "relative",
                  }}
                >

                  <Search
                    sx={{
                      position:
                        "absolute",
                      left: 18,
                      top: "50%",
                      transform:
                        "translateY(-50%)",
                      color:
                        "text.secondary",
                      zIndex: 2,
                    }}
                  />


                  <TextField
                    fullWidth
                    placeholder="Search services..."
                    value={
                      searchTerm
                    }
                    onChange={(
                      event
                    ) =>
                      setSearchTerm(
                        event.target
                          .value
                      )
                    }
                    sx={{
                      backgroundColor:
                        "white",
                      borderRadius:
                        3,

                      "& .MuiOutlinedInput-root":
                        {
                          borderRadius:
                            3,
                          pl: 5,
                        },

                      "& fieldset":
                        {
                          border:
                            "none",
                        },
                    }}
                  />

                </Box>

              </Box>

            </Paper>


            {/* ===============================================
                SUMMARY
            =============================================== */}

            <Grid
              container
              spacing={2}
              sx={{
                mb: 4,
              }}
            >

              <Grid
                size={{
                  xs: 12,
                  sm: 4,
                }}
              >

                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border:
                      "1px solid",
                    borderColor:
                      "divider",
                  }}
                >

                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >

                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2.5,
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        backgroundColor:
                          "rgba(25,118,210,0.1)",
                        color:
                          "primary.main",
                      }}
                    >
                      <Apps />
                    </Box>


                    <Box>

                      <Typography
                        variant="h5"
                        fontWeight={800}
                      >
                        {
                          services.length
                        }
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Available Services
                      </Typography>

                    </Box>

                  </Stack>

                </Paper>

              </Grid>


              <Grid
                size={{
                  xs: 12,
                  sm: 4,
                }}
              >

                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border:
                      "1px solid",
                    borderColor:
                      "divider",
                  }}
                >

                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >

                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2.5,
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        backgroundColor:
                          "rgba(46,125,50,0.1)",
                        color:
                          "success.main",
                      }}
                    >
                      <VerifiedUser />
                    </Box>


                    <Box>

                      <Typography
                        variant="h5"
                        fontWeight={800}
                      >
                        {
                          serviceTypes.length
                        }
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Service Categories
                      </Typography>

                    </Box>

                  </Stack>

                </Paper>

              </Grid>


              <Grid
                size={{
                  xs: 12,
                  sm: 4,
                }}
              >

                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border:
                      "1px solid",
                    borderColor:
                      "divider",
                  }}
                >

                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >

                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2.5,
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        backgroundColor:
                          "rgba(237,108,2,0.1)",
                        color:
                          "warning.main",
                      }}
                    >
                      <AccountBalance />
                    </Box>


                    <Box>

                      <Typography
                        variant="h5"
                        fontWeight={800}
                      >
                        {
                          applications.length
                        }
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Your Applications
                      </Typography>

                    </Box>

                  </Stack>

                </Paper>

              </Grid>

            </Grid>


            {/* ===============================================
                SERVICES HEADER
            =============================================== */}

            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              justifyContent="space-between"
              alignItems={{
                xs: "flex-start",
                md: "center",
              }}
              spacing={2}
              sx={{
                mb: 3,
              }}
            >

              <Box>

                <Typography
                  variant="h5"
                  fontWeight={800}
                >
                  Explore Services
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                  }}
                >
                  Choose a service to begin
                  your application.
                </Typography>

              </Box>


              {/* DYNAMIC FILTERS */}

              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
              >

                <Button
                  size="small"
                  variant={
                    serviceFilter ===
                    "ALL"
                      ? "contained"
                      : "outlined"
                  }
                  startIcon={
                    <FilterList />
                  }
                  onClick={() =>
                    setServiceFilter(
                      "ALL"
                    )
                  }
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  All
                </Button>


                {serviceTypes.map(
                  (type) => (

                    <Button
                      key={type}
                      size="small"
                      variant={
                        serviceFilter ===
                        type
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() =>
                        setServiceFilter(
                          type
                        )
                      }
                      sx={{
                        borderRadius: 2,
                      }}
                    >
                      {type}
                    </Button>

                  )
                )}

              </Stack>

            </Stack>


            {/* ===============================================
                NO SERVICES
            =============================================== */}

            {services.length === 0 ? (

              <Paper
                elevation={0}
                sx={{
                  textAlign:
                    "center",
                  py: 8,
                  px: 3,
                  borderRadius: 4,
                  border:
                    "1px solid",
                  borderColor:
                    "divider",
                }}
              >

                <Description
                  sx={{
                    fontSize: 55,
                    color:
                      "text.disabled",
                    mb: 2,
                  }}
                />

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  No services available
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    mt: 1,
                  }}
                >
                  There are currently no
                  active services available
                  for applications.
                </Typography>

              </Paper>

            ) : filteredServices.length ===
              0 ? (

              <Paper
                elevation={0}
                sx={{
                  textAlign:
                    "center",
                  py: 8,
                  px: 3,
                  borderRadius: 4,
                  border:
                    "1px solid",
                  borderColor:
                    "divider",
                }}
              >

                <Search
                  sx={{
                    fontSize: 55,
                    color:
                      "text.disabled",
                    mb: 2,
                  }}
                />

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  No services found
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    mt: 1,
                  }}
                >
                  Try another search term
                  or category.
                </Typography>

              </Paper>

            ) : (

              /* =============================================
                 SERVICE CARDS
              ============================================= */

              <Grid
                container
                spacing={3}
              >

                {filteredServices.map(
                  (service) => {

                    const serviceName =
                      getServiceName(
                        service
                      );

                    const description =
                      getServiceDescription(
                        service
                      );

                    const type =
                      getServiceType(
                        service
                      );

                    const department =
                      getDepartmentName(
                        service
                      );

                    const processingTime =
                      service?.processingTime ||
                      service?.processingDays ||
                      service?.processingDuration ||
                      "";


                    return (

                      <Grid
                        size={{
                          xs: 12,
                          sm: 6,
                          lg: 4,
                        }}
                        key={
                          service.id
                        }
                      >

                        <Card
                          elevation={0}
                          sx={{
                            height:
                              "100%",
                            display:
                              "flex",
                            flexDirection:
                              "column",
                            borderRadius:
                              4,
                            border:
                              "1px solid",
                            borderColor:
                              "divider",
                            overflow:
                              "hidden",
                            transition:
                              "all 0.25s ease",

                            "&:hover":
                              {
                                transform:
                                  "translateY(-6px)",
                                boxShadow:
                                  "0 14px 35px rgba(0,0,0,0.10)",
                                borderColor:
                                  "primary.main",
                              },
                          }}
                        >

                          {/* TOP ACCENT */}

                          <Box
                            sx={{
                              height: 6,
                              background:
                                "linear-gradient(90deg,#1565c0,#42a5f5)",
                            }}
                          />


                          <CardContent
                            sx={{
                              p: 3,
                              display:
                                "flex",
                              flexDirection:
                                "column",
                              flexGrow: 1,
                            }}
                          >

                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="flex-start"
                            >

                              <Box
                                sx={{
                                  width: 56,
                                  height: 56,
                                  borderRadius: 3,
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  justifyContent:
                                    "center",
                                  backgroundColor:
                                    "rgba(25,118,210,0.1)",
                                  color:
                                    "primary.main",
                                }}
                              >
                                <Description
                                  sx={{
                                    fontSize:
                                      28,
                                  }}
                                />
                              </Box>


                              <Chip
                                label={
                                  type
                                }
                                size="small"
                                variant="outlined"
                                sx={{
                                  fontWeight:
                                    600,
                                }}
                              />

                            </Stack>


                            <Typography
                              variant="h6"
                              fontWeight={800}
                              sx={{
                                mt: 3,
                              }}
                            >
                              {
                                serviceName
                              }
                            </Typography>


                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mt: 1,
                                lineHeight:
                                  1.7,
                                minHeight:
                                  70,
                              }}
                            >
                              {
                                description
                              }
                            </Typography>


                            <Divider
                              sx={{
                                my: 2.5,
                              }}
                            />


                            {/* DATABASE INFORMATION */}

                            <Stack
                              spacing={1.4}
                              sx={{
                                mb: 3,
                                flexGrow: 1,
                              }}
                            >

                              {department && (

                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                >

                                  <AccountBalance
                                    sx={{
                                      fontSize:
                                        18,
                                      color:
                                        "text.secondary",
                                    }}
                                  />

                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {
                                      department
                                    }
                                  </Typography>

                                </Stack>

                              )}


                              {processingTime && (

                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                >

                                  <AccessTime
                                    sx={{
                                      fontSize:
                                        18,
                                      color:
                                        "text.secondary",
                                    }}
                                  />

                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {
                                      processingTime
                                    }
                                  </Typography>

                                </Stack>

                              )}


                              {!department &&
                                !processingTime && (

                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                  >

                                    <InfoOutlined
                                      sx={{
                                        fontSize:
                                          18,
                                        color:
                                          "text.secondary",
                                      }}
                                    />

                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Service
                                      details
                                      available
                                      after
                                      selection
                                    </Typography>

                                  </Stack>

                                )}

                            </Stack>


                            <Button
                              fullWidth
                              variant="contained"
                              endIcon={
                                <ArrowForward />
                              }
                              onClick={() =>
                                handleSelectService(
                                  service
                                )
                              }
                              sx={{
                                borderRadius:
                                  2.5,
                                py: 1.3,
                                fontWeight:
                                  700,
                                boxShadow:
                                  "none",

                                "&:hover":
                                  {
                                    boxShadow:
                                      "0 6px 16px rgba(25,118,210,0.25)",
                                  },
                              }}
                            >
                              Start Application
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

        )}


        {/* ===================================================
            APPLICATION FORM
        =================================================== */}

        {selectedService && (

          <Box>

            {/* BACK */}

            <Button
              startIcon={
                <ArrowBack />
              }
              onClick={
                handleBack
              }
              sx={{
                mb: 2,
                borderRadius: 2,
              }}
            >
              Back to Services
            </Button>


            {/* SERVICE HEADER */}

            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                mb: 3,
                overflow:
                  "hidden",
              }}
            >

              <Box
                sx={{
                  p: {
                    xs: 3,
                    md: 4,
                  },
                  background:
                    "linear-gradient(135deg, #0d47a1, #1565c0, #42a5f5)",
                  color: "white",
                }}
              >

                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  spacing={2}
                  alignItems={{
                    xs: "flex-start",
                    sm: "center",
                  }}
                >

                  <Box
                    sx={{
                      width: 58,
                      height: 58,
                      borderRadius: 3,
                      backgroundColor:
                        "rgba(255,255,255,0.18)",
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                    }}
                  >
                    <Description
                      sx={{
                        fontSize: 30,
                      }}
                    />
                  </Box>


                  <Box>

                    <Typography
                      variant="h4"
                      fontWeight={800}
                    >
                      {
                        getServiceName(
                          selectedService
                        )
                      }
                    </Typography>


                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                      sx={{
                        mt: 1,
                      }}
                    >

                      <Chip
                        label={
                          getServiceType(
                            selectedService
                          )
                        }
                        size="small"
                        sx={{
                          color:
                            "white",
                          borderColor:
                            "rgba(255,255,255,0.6)",
                        }}
                        variant="outlined"
                      />


                      {getDepartmentName(
                        selectedService
                      ) && (

                        <Chip
                          label={
                            getDepartmentName(
                              selectedService
                            )
                          }
                          size="small"
                          sx={{
                            color:
                              "white",
                            borderColor:
                              "rgba(255,255,255,0.6)",
                          }}
                          variant="outlined"
                        />

                      )}

                    </Stack>

                  </Box>

                </Stack>


                {getServiceDescription(
                  selectedService
                ) && (

                  <Typography
                    sx={{
                      mt: 2,
                      opacity: 0.92,
                      maxWidth: 850,
                      lineHeight: 1.7,
                    }}
                  >
                    {
                      getServiceDescription(
                        selectedService
                      )
                    }
                  </Typography>

                )}

              </Box>


              {selectedService
                .eligibility && (

                <Box
                  sx={{
                    p: 3,
                  }}
                >

                  <Alert
                    severity="info"
                    icon={
                      <InfoOutlined />
                    }
                  >
                    <strong>
                      Eligibility:
                    </strong>{" "}
                    {
                      selectedService
                        .eligibility
                    }
                  </Alert>

                </Box>

              )}

            </Card>


            {/* FORM LAYOUT */}

            <Grid
              container
              spacing={3}
            >

              {/* =============================================
                  APPLICANT INFORMATION
              ============================================= */}

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >

                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    position: {
                      md: "sticky",
                    },
                    top: {
                      md: 20,
                    },
                    border:
                      "1px solid",
                    borderColor:
                      "divider",
                  }}
                >

                  <CardContent
                    sx={{
                      p: 3,
                    }}
                  >

                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                    >

                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 3,
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          backgroundColor:
                            "rgba(25,118,210,0.1)",
                          color:
                            "primary.main",
                        }}
                      >
                        <Person />
                      </Box>


                      <Box>

                        <Typography
                          variant="h6"
                          fontWeight={700}
                        >
                          Applicant
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Your account information
                        </Typography>

                      </Box>

                    </Stack>


                    <Divider
                      sx={{
                        my: 3,
                      }}
                    />


                    <Stack spacing={2.5}>

                      <Box>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Full Name
                        </Typography>

                        <Typography
                          fontWeight={600}
                        >
                          {applicantName ||
                            "Not available"}
                        </Typography>

                      </Box>


                      <Box>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          User ID
                        </Typography>

                        <Typography
                          fontWeight={600}
                        >
                          {userId ||
                            "Not available"}
                        </Typography>

                      </Box>


                      <Box>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Account
                        </Typography>

                        <Typography
                          fontWeight={600}
                          sx={{
                            wordBreak:
                              "break-word",
                          }}
                        >
                          {username ||
                            "Not available"}
                        </Typography>

                      </Box>

                    </Stack>


                    <Alert
                      severity="info"
                      sx={{
                        mt: 3,
                        borderRadius: 2,
                      }}
                    >
                      Your citizen information
                      is taken from your account.
                      You do not need to enter
                      your citizen ID manually.
                    </Alert>

                  </CardContent>

                </Card>

              </Grid>


              {/* =============================================
                  DYNAMIC FORM
              ============================================= */}

              <Grid
                size={{
                  xs: 12,
                  md: 8,
                }}
              >

                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    border:
                      "1px solid",
                    borderColor:
                      "divider",
                  }}
                >

                  <CardContent
                    sx={{
                      p: {
                        xs: 2.5,
                        sm: 4,
                      },
                    }}
                  >

                    <Typography
                      variant="h5"
                      fontWeight={700}
                    >
                      Application Details
                    </Typography>


                    <Typography
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                        mb: 3,
                      }}
                    >
                      Complete the fields
                      configured for this
                      service.
                    </Typography>


                    <Divider
                      sx={{
                        mb: 4,
                      }}
                    />


                    {loadingFields ? (

                      <Box
                        sx={{
                          py: 8,
                          display:
                            "flex",
                          justifyContent:
                            "center",
                        }}
                      >
                        <CircularProgress />
                      </Box>

                    ) : fields.length ===
                      0 ? (

                      <Alert
                        severity="warning"
                        sx={{
                          borderRadius: 2,
                        }}
                      >
                        No application fields
                        have been configured
                        for this service yet.
                      </Alert>

                    ) : (

                      <Box
                        component="form"
                        onSubmit={
                          handleSubmit
                        }
                      >

                        <Grid
                          container
                          spacing={3}
                        >

                          {fields.map(
                            (field) => (

                              <Grid
                                size={12}
                                key={
                                  field.id
                                }
                              >

                                {renderField(
                                  field
                                )}

                              </Grid>

                            )
                          )}

                        </Grid>


                        <Divider
                          sx={{
                            my: 4,
                          }}
                        />


                        <Stack
                          direction={{
                            xs: "column-reverse",
                            sm: "row",
                          }}
                          justifyContent="flex-end"
                          spacing={2}
                        >

                          <Button
                            variant="outlined"
                            onClick={
                              handleBack
                            }
                            disabled={
                              submitting
                            }
                            sx={{
                              borderRadius: 2,
                              px: 3,
                            }}
                          >
                            Cancel
                          </Button>


                          <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={
                              submitting ||
                              fields.length ===
                                0
                            }
                            startIcon={
                              submitting ? (
                                <CircularProgress
                                  size={20}
                                  color="inherit"
                                />
                              ) : (
                                <Send />
                              )
                            }
                            sx={{
                              minWidth: 220,
                              borderRadius: 2,
                              py: 1.4,
                            }}
                          >
                            {submitting
                              ? "Submitting..."
                              : "Submit Application"}
                          </Button>

                        </Stack>

                      </Box>

                    )}

                  </CardContent>

                </Card>

              </Grid>

            </Grid>


            {/* =================================================
                RECENT APPLICATIONS
            ================================================= */}

            {recentApplications.length >
              0 && (

              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  mt: 4,
                  border:
                    "1px solid",
                  borderColor:
                    "divider",
                }}
              >

                <CardContent
                  sx={{
                    p: 3,
                  }}
                >

                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    Recent Applications
                  </Typography>


                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 3,
                    }}
                  >
                    Your latest submitted
                    applications.
                  </Typography>


                  <Stack spacing={2}>

                    {recentApplications.map(
                      (application) => (

                        <Paper
                          key={
                            application.id
                          }
                          variant="outlined"
                          sx={{
                            p: 2,
                            borderRadius: 3,
                          }}
                        >

                          <Stack
                            direction={{
                              xs: "column",
                              sm: "row",
                            }}
                            spacing={2}
                            justifyContent="space-between"
                            alignItems={{
                              sm: "center",
                            }}
                          >

                            <Box>

                              <Typography
                                fontWeight={700}
                              >
                                {
                                  application.applicationType ||
                                  application.serviceName ||
                                  "Application"
                                }
                              </Typography>


                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Application #
                                {
                                  application.id
                                }
                              </Typography>

                            </Box>


                            <Chip
                              label={
                                application.status ||
                                "SUBMITTED"
                              }
                              color={
                                application.status ===
                                "APPROVED"
                                  ? "success"
                                  : application.status ===
                                    "REJECTED"
                                  ? "error"
                                  : "warning"
                              }
                            />

                          </Stack>

                        </Paper>

                      )
                    )}

                  </Stack>

                </CardContent>

              </Card>

            )}

          </Box>

        )}

      </Container>

    </Box>
  );
}


export default CitizenApplication;
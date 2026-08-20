import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  ArrowBack,
  AttachFile,
  Description,
  KeyboardArrowDown,
  Send,
  VolunteerActivism,
} from "@mui/icons-material";

import {
  getScheme,
  applyScheme,
} from "../../api/welfareApi";

export default function ApplyScheme() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
const userId = localStorage.getItem("userId") || "";
  const schemeId = searchParams.get("id");
 

  const [scheme, setScheme] = useState(null);
  const [documents, setDocuments] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    // ================= COMMON =================
    userId,
    fullName: "",
    age: "",
    gender: "",
    aadhaarNumber: "",
    mobileNumber: "",
    email: "",
    district: "",
    currentAddress: "",
    annualIncome: "",
    occupation: "",

    // ================= STUDENT =================
    collegeName: "",
    course: "",
    year: "",
    rollNumber: "",

    // ================= HOUSING =================
    houseType: "",
    familyMembers: "",
    landOwnership: "",
    existingHouse: "",

    // ================= FARMER =================
    landArea: "",
    cropType: "",

    // ================= PENSION =================
    maritalStatus: "",
    pensionCategory: "",
    disabilityPercentage: "",

    // ================= BANK =================
    accountHolderName: "",
    bankName: "",
    bankAccount: "",
    ifscCode: "",

    remarks: "",
  });

  // =========================================================
  // LOAD SCHEME
  // =========================================================

  useEffect(() => {
    if (!schemeId) {
      setLoading(false);
      return;
    }

    loadScheme();
  }, [schemeId]);

  const loadScheme = async () => {
    try {
      setLoading(true);

      const response = await getScheme(schemeId);

      setScheme(response.data || null);
    } catch (error) {
      console.error(
        "Failed to load scheme:",
        error
      );

      alert("Failed to load scheme.");
      setScheme(null);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // REQUIRED DOCUMENTS
  // =========================================================

  const requiredDocuments = useMemo(() => {
  if (!scheme) return [];

  const documents = Array.isArray(
    scheme.requiredDocuments
  )
    ? [...scheme.requiredDocuments]
    : [];

  const hasBankStatement = documents.some(
    (documentName) =>
      String(documentName)
        .trim()
        .toLowerCase() ===
      "bank statement / passbook"
  );

  if (!hasBankStatement) {
    documents.push("Bank Statement / Passbook");
  }

  return documents;
}, [scheme]);

  // =========================================================
  // DOCUMENT-BASED CONDITIONS
  // =========================================================

  const hasDocument = (documentName) => {
    return requiredDocuments.some(
      (doc) =>
        String(doc)
          .trim()
          .toLowerCase() ===
        documentName
          .trim()
          .toLowerCase()
    );
  };

  const needsBankDetails = true;

  const needsIncome =
    hasDocument("Income Certificate");

  const needsLandDetails =
    hasDocument("Land Ownership Document") ||
    hasDocument("Land Record");

  const needsFarmerIdentity =
    hasDocument("Farmer ID Card") ||
    hasDocument(
      "Farmer Registration Certificate"
    );

  const needsCropDetails =
    hasDocument("Crop Details");

  // =========================================================
  // CHANGE HANDLER
  // =========================================================

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // DOCUMENT UPLOAD
  // =========================================================

  const handleDocumentUpload = (
    documentName,
    file
  ) => {
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Only PDF, JPG, JPEG and PNG files are allowed."
      );
      return;
    }

    if (
      file.size >
      2 * 1024 * 1024
    ) {
      alert(
        "Maximum file size is 2 MB."
      );
      return;
    }

    setDocuments((previous) => ({
      ...previous,
      [documentName]: file,
    }));
  };

  // =========================================================
  // VALIDATION
  // =========================================================

  const validateForm = () => {
    if (!userId) {
      alert(
        "Citizen information was not found. Please login again."
      );
      return false;
    }

    const commonFields = [
      ["fullName", "Full Name"],
      ["age", "Age"],
      ["gender", "Gender"],
      [
        "aadhaarNumber",
        "Aadhaar Number",
      ],
      [
        "mobileNumber",
        "Mobile Number",
      ],
      ["district", "District"],
      [
        "currentAddress",
        "Residential Address",
      ],
    ];

    for (
      const [key, label] of commonFields
    ) {
      if (
        form[key] === null ||
        form[key] === undefined ||
        String(form[key]).trim() === ""
      ) {
        alert(
          `Please enter ${label}.`
        );
        return false;
      }
    }

    // Income only when required by scheme
    if (
      needsIncome &&
      String(
        form.annualIncome
      ).trim() === ""
    ) {
      alert(
        "Please enter Annual Income."
      );
      return false;
    }

    // Student
    if (
      scheme?.schemeType ===
      "STUDENT"
    ) {
      const studentFields = [
        [
          "collegeName",
          "College / School Name",
        ],
        ["course", "Course"],
        ["year", "Current Year"],
        [
          "rollNumber",
          "Roll / Registration Number",
        ],
      ];

      for (
        const [key, label] of studentFields
      ) {
        if (
          form[key] === null ||
          form[key] === undefined ||
          String(form[key]).trim() ===
            ""
        ) {
          alert(
            `Please enter ${label}.`
          );
          return false;
        }
      }
    }

    // Housing
    if (
      scheme?.schemeType ===
      "HOUSING"
    ) {
      const housingFields = [
        ["houseType", "House Type"],
        [
          "familyMembers",
          "Family Members",
        ],
        [
          "landOwnership",
          "Land Ownership",
        ],
        [
          "existingHouse",
          "Existing House Status",
        ],
      ];

      for (
        const [key, label] of housingFields
      ) {
        if (
          form[key] === null ||
          form[key] === undefined ||
          String(form[key]).trim() ===
            ""
        ) {
          alert(
            `Please enter ${label}.`
          );
          return false;
        }
      }
    }

    // Farmer
    if (
      scheme?.schemeType ===
      "FARMER"
    ) {
      if (
        needsLandDetails &&
        String(
          form.landArea
        ).trim() === ""
      ) {
        alert(
          "Please enter Land Area."
        );
        return false;
      }

      if (
        needsCropDetails &&
        String(
          form.cropType
        ).trim() === ""
      ) {
        alert(
          "Please select Crop Type."
        );
        return false;
      }
    }

    // Pension
    if (
      scheme?.schemeType ===
      "PENSION"
    ) {
      if (
        String(
          form.maritalStatus
        ).trim() === ""
      ) {
        alert(
          "Please select Marital Status."
        );
        return false;
      }

      if (
        String(
          form.pensionCategory
        ).trim() === ""
      ) {
        alert(
          "Please select Pension Category."
        );
        return false;
      }

      if (
        form.pensionCategory ===
          "Disability" &&
        String(
          form.disabilityPercentage
        ).trim() === ""
      ) {
        alert(
          "Please enter Disability Percentage."
        );
        return false;
      }
    }

    // Bank
    if (needsBankDetails) {
      const bankFields = [
        [
          "accountHolderName",
          "Account Holder Name",
        ],
        ["bankName", "Bank Name"],
        [
          "bankAccount",
          "Bank Account Number",
        ],
        ["ifscCode", "IFSC Code"],
      ];

      for (
        const [key, label] of bankFields
      ) {
        if (
          form[key] === null ||
          form[key] === undefined ||
          String(form[key]).trim() ===
            ""
        ) {
          alert(
            `Please enter ${label}.`
          );
          return false;
        }
      }
    }

    // Documents
    const missingDocuments =
      requiredDocuments.filter(
        (documentName) =>
          !documents[documentName]
      );

    if (
      missingDocuments.length > 0
    ) {
      alert(
        `Please upload all required documents.\n\nMissing:\n${missingDocuments.join(
          "\n"
        )}`
      );

      return false;
    }

    return true;
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const application = {
  citizenId: Number(userId),
  schemeId: Number(schemeId),

  fullName: form.fullName,
  age: Number(form.age),
  gender: form.gender,
  aadhaarNumber: form.aadhaarNumber,
  mobileNumber: form.mobileNumber,
  email: form.email,
  district: form.district,
  currentAddress: form.currentAddress,

        occupation:
          form.occupation || null,

        annualIncome:
          form.annualIncome !== ""
            ? Number(
                form.annualIncome
              )
            : null,

        // Student
        collegeName:
          scheme.schemeType ===
          "STUDENT"
            ? form.collegeName ||
              null
            : null,

        course:
          scheme.schemeType ===
          "STUDENT"
            ? form.course || null
            : null,

        year:
          scheme.schemeType ===
            "STUDENT" &&
          form.year !== ""
            ? Number(form.year)
            : null,

        rollNumber:
          scheme.schemeType ===
          "STUDENT"
            ? form.rollNumber ||
              null
            : null,

        // Housing
        houseType:
          scheme.schemeType ===
          "HOUSING"
            ? form.houseType ||
              null
            : null,

        familyMembers:
          scheme.schemeType ===
            "HOUSING" &&
          form.familyMembers !== ""
            ? Number(
                form.familyMembers
              )
            : null,

        landOwnership:
          scheme.schemeType ===
            "HOUSING" &&
          form.landOwnership !== ""
            ? form.landOwnership ===
              "true"
            : null,

        existingHouse:
          scheme.schemeType ===
            "HOUSING" &&
          form.existingHouse !== ""
            ? form.existingHouse ===
              "true"
            : null,

        // Farmer
        landArea:
          scheme.schemeType ===
            "FARMER" &&
          form.landArea !== ""
            ? Number(form.landArea)
            : null,

        cropType:
          scheme.schemeType ===
          "FARMER"
            ? form.cropType || null
            : null,

        // Pension
        maritalStatus:
          scheme.schemeType ===
          "PENSION"
            ? form.maritalStatus ||
              null
            : null,

        pensionCategory:
          scheme.schemeType ===
          "PENSION"
            ? form.pensionCategory ||
              null
            : null,

        disabilityPercentage:
          scheme.schemeType ===
            "PENSION" &&
          form
            .disabilityPercentage !==
            ""
            ? Number(
                form.disabilityPercentage
              )
            : null,

        // Bank
        accountHolderName:
          needsBankDetails
            ? form.accountHolderName ||
              null
            : null,

        bankName:
          needsBankDetails
            ? form.bankName ||
              null
            : null,

        bankAccount:
          needsBankDetails
            ? form.bankAccount ||
              null
            : null,

        ifscCode:
          needsBankDetails
            ? form.ifscCode || null
            : null,

        remarks:
          form.remarks || null,
      };

      const formData =
        new FormData();

      formData.append(
        "application",
        new Blob(
          [
            JSON.stringify(
              application
            ),
          ],
          {
            type: "application/json",
          }
        )
      );

      requiredDocuments.forEach(
        (documentName) => {
          const file =
            documents[documentName];

          if (file) {
            formData.append(
              "documents",
              file
            );
          }
        }
      );

      await applyScheme(formData);

      alert(
        "Application submitted successfully."
      );

      navigate(
        "/welfare/applications"
      );
    } catch (error) {
      console.error(
        "Application submission failed:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Application submission failed."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent:
            "center",
          background:
            "#F4F7FB",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
        >
          Loading Scheme...
        </Typography>
      </Box>
    );
  }

  if (!scheme) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent:
            "center",
          background:
            "#F4F7FB",
          px: 2,
        }}
      >
        <Paper
          sx={{
            p: 4,
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            gutterBottom
          >
            Welfare Scheme Not Found
          </Typography>

          <Button
            variant="contained"
            onClick={() =>
              navigate(
                "/welfare/schemes"
              )
            }
          >
            Back to Schemes
          </Button>
        </Paper>
      </Box>
    );
  }

  // =========================================================
  // FIELD STYLE
  // =========================================================

  const fieldSx = {
    width: "100%",

    "& .MuiInputLabel-root": {
      fontWeight: 600,
      color: "#475569",
    },

    "& .MuiInputLabel-root.Mui-focused":
      {
        color: "#6A1B9A",
      },

    "& .MuiOutlinedInput-root": {
      width: "100%",
      minWidth: 0,
      minHeight: 58,
      borderRadius: "11px",
      backgroundColor:
        "#FFFFFF",
      boxSizing: "border-box",

      "& fieldset": {
        borderColor:
          "#CBD5E1",
      },

      "&:hover fieldset": {
        borderColor:
          "#94A3B8",
      },

      "&.Mui-focused fieldset":
        {
          borderColor:
            "#7B1FA2",
          borderWidth: 2,
        },
    },

    "& .MuiOutlinedInput-input":
      {
        width: "100%",
        height: "58px",
        boxSizing:
          "border-box",
        padding:
          "0 16px",
        fontSize:
          "15px",
      },

    "& .MuiSelect-select":
      {
        width: "100%",
        height:
          "58px !important",
        minHeight:
          "58px !important",
        boxSizing:
          "border-box",
        display:
          "flex",
        alignItems:
          "center",
        padding:
          "0 52px 0 16px !important",
        fontSize:
          "15px",
        lineHeight:
          "normal",
      },

    "& .MuiSelect-icon":
      {
        right: 14,
        color:
          "#475569",
      },
  };

  const textareaSx = {
    ...fieldSx,

    "& .MuiOutlinedInput-root":
      {
        height: "auto",
        minHeight: 115,
        alignItems:
          "flex-start",
      },

    "& .MuiOutlinedInput-input":
      {
        height: "auto",
        padding:
          "16px",
        lineHeight: 1.6,
      },
  };

  // =========================================================
  // SECTION STYLE
  // =========================================================

  const sectionSx = {
    p: {
      xs: 2,
      sm: 2.5,
      md: 3,
      lg: 3.5,
    },

    mb: 3,

    border:
      "1px solid #E2E8F0",

    borderRadius:
      "18px",

    background:
      "#FFFFFF",

    width: "100%",
    boxSizing:
      "border-box",
  };

  const sectionTitleSx = {
    fontSize: {
      xs: "1.2rem",
      md: "1.35rem",
    },

    fontWeight: 800,

    color:
      "#1E293B",
  };

  // =========================================================
  // CSS GRID
  // =========================================================

  const twoColumnGridSx = {
    display: "grid",

    gridTemplateColumns: {
      xs: "1fr",
      md:
        "repeat(2, minmax(0, 1fr))",
    },

    columnGap: {
      xs: 0,
      md: 2.5,
    },

    rowGap: 2.5,

    width: "100%",
  };

  const fullWidthFieldSx = {
    gridColumn:
      "1 / -1",
    minWidth: 0,
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#F4F7FB 0%,#EEF2FF 100%)",

        px: {
          xs: 1.5,
          sm: 2.5,
          md: 4,
          lg: 5,
        },

        py: {
          xs: 2,
          md: 4,
        },

        boxSizing:
          "border-box",
      }}
    >
      {/* =====================================================
          FULL WIDTH APPLICATION CARD
      ===================================================== */}

      <Paper
        elevation={2}
        sx={{
          width: "100%",
          maxWidth:
            "1600px",
          mx: "auto",
          borderRadius: 4,
          overflow: "hidden",
          boxSizing:
            "border-box",
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <Box
          sx={{
            px: {
              xs: 2.5,
              sm: 3.5,
              md: 5,
            },

            py: {
              xs: 3,
              md: 4,
            },

            color: "#FFFFFF",

            background:
              "linear-gradient(135deg,#6A1B9A,#AB47BC)",
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
            <Avatar
              sx={{
                width: 66,
                height: 66,
                bgcolor:
                  "rgba(255,255,255,0.18)",
                color:
                  "#FFFFFF",
              }}
            >
              <VolunteerActivism
                sx={{
                  fontSize: 38,
                }}
              />
            </Avatar>

            <Box
              sx={{
                minWidth: 0,
              }}
            >
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  fontSize: {
                    xs: "1.55rem",
                    sm: "1.8rem",
                    md: "2.1rem",
                  },

                  overflowWrap:
                    "anywhere",
                }}
              >
                {scheme.schemeName}
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  opacity: 0.9,
                }}
              >
                Welfare Scheme Application
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* =================================================
            SCHEME SUMMARY
        ================================================= */}

        <Box
          sx={{
            px: {
              xs: 2,
              sm: 3,
              md: 5,
            },

            pt: 3,
          }}
        >
          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                sm:
                  "repeat(2, minmax(0,1fr))",
                md:
                  "repeat(4, minmax(0,1fr))",
              },

              gap: 2,
            }}
          >
            <InfoCard
              label="Type"
              value={
                scheme.schemeType
              }
            />

            <InfoCard
              label="Category"
              value={
                scheme.category ||
                "Not Available"
              }
            />

            <InfoCard
              label="Benefit Amount"
              value={
                scheme.benefitAmount
                  ? `₹${Number(
                      scheme.benefitAmount
                    ).toLocaleString(
                      "en-IN"
                    )}`
                  : "As Per Scheme Rules"
              }
              highlight
            />

            <InfoCard
              label="Application Status"
              value={
                scheme.active
                  ? "Open"
                  : "Closed"
              }
              status
            />
          </Box>
        </Box>

        {/* =================================================
            FORM CONTENT
        ================================================= */}

        <Box
          sx={{
            p: {
              xs: 2,
              sm: 3,
              md: 5,
            },
          }}
        >
          {/* =================================================
              APPLICANT INFORMATION
          ================================================= */}

          <Box sx={sectionSx}>
            <Typography
              sx={sectionTitleSx}
            >
              Applicant Information
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                mb: 3,
              }}
            >
              Information associated with
              the logged-in citizen.
            </Typography>

            <Box
              sx={twoColumnGridSx}
            >
              {/* Citizen ID */}

              <Box
                sx={{
                  minWidth: 0,
                }}
              >
                <TextField
                  fullWidth
                  label="Citizen ID"
                  value={
                    userId
                  }
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    ...fieldSx,

                    "& .MuiOutlinedInput-root":
                      {
                        backgroundColor:
                          "#F8FAFC",
                      },
                  }}
                />
              </Box>

              {/* Full Name */}

              <Box
                sx={{
                  minWidth: 0,
                }}
              >
                <TextField
                  fullWidth
                  required
                  label="Full Name"
                  name="fullName"
                  value={
                    form.fullName
                  }
                  onChange={
                    handleChange
                  }
                  sx={fieldSx}
                />
              </Box>

              {/* Age */}

              <Box
                sx={{
                  minWidth: 0,
                }}
              >
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Age"
                  name="age"
                  value={
                    form.age
                  }
                  onChange={
                    handleChange
                  }
                  inputProps={{
                    min: 1,
                    max: 120,
                  }}
                  sx={fieldSx}
                />
              </Box>

              {/* Gender */}

              <Box
                sx={{
                  minWidth: 0,
                }}
              >
                <TextField
                  fullWidth
                  required
                  select
                  label="Gender"
                  name="gender"
                  value={
                    form.gender
                  }
                  onChange={
                    handleChange
                  }
                  sx={fieldSx}
                  SelectProps={{
                    IconComponent:
                      KeyboardArrowDown,
                  }}
                >
                  <MenuItem value="">
                    Select Gender
                  </MenuItem>

                  <MenuItem value="Male">
                    Male
                  </MenuItem>

                  <MenuItem value="Female">
                    Female
                  </MenuItem>

                  <MenuItem value="Other">
                    Other
                  </MenuItem>
                </TextField>
              </Box>

              {/* Aadhaar */}

              <Box
                sx={{
                  minWidth: 0,
                }}
              >
                <TextField
                  fullWidth
                  required
                  label="Aadhaar Number"
                  name="aadhaarNumber"
                  value={
                    form.aadhaarNumber
                  }
                  onChange={
                    handleChange
                  }
                  inputProps={{
                    maxLength: 12,
                  }}
                  sx={fieldSx}
                />
              </Box>

              {/* Mobile */}

              <Box
                sx={{
                  minWidth: 0,
                }}
              >
                <TextField
                  fullWidth
                  required
                  label="Mobile Number"
                  name="mobileNumber"
                  value={
                    form.mobileNumber
                  }
                  onChange={
                    handleChange
                  }
                  inputProps={{
                    maxLength: 10,
                  }}
                  sx={fieldSx}
                />
              </Box>

              {/* Email */}

              <Box
                sx={{
                  ...fullWidthFieldSx,
                }}
              >
                <TextField
                  fullWidth
                  type="email"
                  label="Email Address"
                  name="email"
                  value={
                    form.email
                  }
                  onChange={
                    handleChange
                  }
                  sx={fieldSx}
                />
              </Box>

              {/* District */}

              <Box
                sx={{
                  minWidth: 0,
                }}
              >
                <TextField
                  fullWidth
                  required
                  select
                  label="District"
                  name="district"
                  value={
                    form.district
                  }
                  onChange={
                    handleChange
                  }
                  sx={fieldSx}
                  SelectProps={{
                    IconComponent:
                      KeyboardArrowDown,
                  }}
                >
                  <MenuItem value="">
                    Select District
                  </MenuItem>

                  <MenuItem value="Alipurduar">
                    Alipurduar
                  </MenuItem>

                  <MenuItem value="Bankura">
                    Bankura
                  </MenuItem>

                  <MenuItem value="Birbhum">
                    Birbhum
                  </MenuItem>

                  <MenuItem value="Cooch Behar">
                    Cooch Behar
                  </MenuItem>

                  <MenuItem value="Darjeeling">
                    Darjeeling
                  </MenuItem>

                  <MenuItem value="Hooghly">
                    Hooghly
                  </MenuItem>

                  <MenuItem value="Howrah">
                    Howrah
                  </MenuItem>

                  <MenuItem value="Jalpaiguri">
                    Jalpaiguri
                  </MenuItem>

                  <MenuItem value="Jhargram">
                    Jhargram
                  </MenuItem>

                  <MenuItem value="Kalimpong">
                    Kalimpong
                  </MenuItem>

                  <MenuItem value="Kolkata">
                    Kolkata
                  </MenuItem>

                  <MenuItem value="Malda">
                    Malda
                  </MenuItem>

                  <MenuItem value="Murshidabad">
                    Murshidabad
                  </MenuItem>

                  <MenuItem value="Nadia">
                    Nadia
                  </MenuItem>

                  <MenuItem value="North 24 Parganas">
                    North 24 Parganas
                  </MenuItem>

                  <MenuItem value="Paschim Bardhaman">
                    Paschim Bardhaman
                  </MenuItem>

                  <MenuItem value="Paschim Medinipur">
                    Paschim Medinipur
                  </MenuItem>

                  <MenuItem value="Purba Bardhaman">
                    Purba Bardhaman
                  </MenuItem>

                  <MenuItem value="Purba Medinipur">
                    Purba Medinipur
                  </MenuItem>

                  <MenuItem value="Purulia">
                    Purulia
                  </MenuItem>

                  <MenuItem value="South 24 Parganas">
                    South 24 Parganas
                  </MenuItem>

                  <MenuItem value="Uttar Dinajpur">
                    Uttar Dinajpur
                  </MenuItem>

                  <MenuItem value="Dakshin Dinajpur">
                    Dakshin Dinajpur
                  </MenuItem>
                </TextField>
              </Box>

              {/* Income */}

              {needsIncome && (
                <Box
                  sx={{
                    minWidth: 0,
                  }}
                >
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Annual Income (₹)"
                    name="annualIncome"
                    value={
                      form.annualIncome
                    }
                    onChange={
                      handleChange
                    }
                    inputProps={{
                      min: 0,
                    }}
                    sx={fieldSx}
                  />
                </Box>
              )}

              {/* Occupation - farmer only */}

              {scheme.schemeType ===
                "FARMER" && (
                <Box
                  sx={{
                    minWidth: 0,
                  }}
                >
                  <TextField
                    fullWidth
                    label="Occupation"
                    name="occupation"
                    value={
                      form.occupation
                    }
                    onChange={
                      handleChange
                    }
                    sx={fieldSx}
                  />
                </Box>
              )}

              {/* Address */}

              <Box
                sx={{
                  ...fullWidthFieldSx,
                }}
              >
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={3}
                  label="Residential Address"
                  name="currentAddress"
                  value={
                    form.currentAddress
                  }
                  onChange={
                    handleChange
                  }
                  sx={textareaSx}
                />
              </Box>
            </Box>
          </Box>

          {/* =================================================
              STUDENT
          ================================================= */}

          {scheme.schemeType ===
            "STUDENT" && (
            <Box sx={sectionSx}>
              <Typography
                sx={sectionTitleSx}
              >
                Student Information
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  mb: 3,
                }}
              >
                Provide the academic
                information required for
                this scheme.
              </Typography>

              <Box
                sx={twoColumnGridSx}
              >
                <Box
                  sx={{
                    ...fullWidthFieldSx,
                  }}
                >
                  <TextField
                    fullWidth
                    required
                    label="College / School Name"
                    name="collegeName"
                    value={
                      form.collegeName
                    }
                    onChange={
                      handleChange
                    }
                    sx={fieldSx}
                  />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <TextField
                    fullWidth
                    required
                    select
                    label="Course"
                    name="course"
                    value={
                      form.course
                    }
                    onChange={
                      handleChange
                    }
                    sx={fieldSx}
                    SelectProps={{
                      IconComponent:
                        KeyboardArrowDown,
                    }}
                  >
                    <MenuItem value="">
                      Select Course
                    </MenuItem>

                    <MenuItem value="B.Tech">
                      B.Tech
                    </MenuItem>

                    <MenuItem value="B.Sc">
                      B.Sc
                    </MenuItem>

                    <MenuItem value="B.Com">
                      B.Com
                    </MenuItem>

                    <MenuItem value="B.A">
                      B.A
                    </MenuItem>

                    <MenuItem value="M.Tech">
                      M.Tech
                    </MenuItem>

                    <MenuItem value="M.Sc">
                      M.Sc
                    </MenuItem>

                    <MenuItem value="MBA">
                      MBA
                    </MenuItem>

                    <MenuItem value="Diploma">
                      Diploma
                    </MenuItem>

                    <MenuItem value="Others">
                      Others
                    </MenuItem>
                  </TextField>
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <TextField
                    fullWidth
                    required
                    select
                    label="Current Year"
                    name="year"
                    value={
                      form.year
                    }
                    onChange={
                      handleChange
                    }
                    sx={fieldSx}
                    SelectProps={{
                      IconComponent:
                        KeyboardArrowDown,
                    }}
                  >
                    <MenuItem value="">
                      Select Year
                    </MenuItem>

                    <MenuItem value="1">
                      1st Year
                    </MenuItem>

                    <MenuItem value="2">
                      2nd Year
                    </MenuItem>

                    <MenuItem value="3">
                      3rd Year
                    </MenuItem>

                    <MenuItem value="4">
                      4th Year
                    </MenuItem>

                    <MenuItem value="5">
                      5th Year
                    </MenuItem>
                  </TextField>
                </Box>

                <Box
                  sx={{
                    ...fullWidthFieldSx,
                  }}
                >
                  <TextField
                    fullWidth
                    required
                    label="Roll / Registration Number"
                    name="rollNumber"
                    value={
                      form.rollNumber
                    }
                    onChange={
                      handleChange
                    }
                    sx={fieldSx}
                  />
                </Box>
              </Box>
            </Box>
          )}

          {/* =================================================
              HOUSING
          ================================================= */}

          {scheme.schemeType ===
            "HOUSING" && (
            <Box sx={sectionSx}>
              <Typography
                sx={sectionTitleSx}
              >
                Housing Information
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  mb: 3,
                }}
              >
                Provide the household
                information required for
                this scheme.
              </Typography>

              <Box
                sx={twoColumnGridSx}
              >
                <Box sx={{ minWidth: 0 }}>
                  <TextField
                    fullWidth
                    required
                    select
                    label="House Type"
                    name="houseType"
                    value={
                      form.houseType
                    }
                    onChange={
                      handleChange
                    }
                    sx={fieldSx}
                    SelectProps={{
                      IconComponent:
                        KeyboardArrowDown,
                    }}
                  >
                    <MenuItem value="">
                      Select House Type
                    </MenuItem>

                    <MenuItem value="Kutcha">
                      Kutcha House
                    </MenuItem>

                    <MenuItem value="Semi-Pucca">
                      Semi-Pucca House
                    </MenuItem>

                    <MenuItem value="Pucca">
                      Pucca House
                    </MenuItem>

                    <MenuItem value="Homeless">
                      No House
                    </MenuItem>
                  </TextField>
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Family Members"
                    name="familyMembers"
                    value={
                      form.familyMembers
                    }
                    onChange={
                      handleChange
                    }
                    inputProps={{
                      min: 1,
                      max: 20,
                    }}
                    sx={fieldSx}
                  />
                </Box>

                <Box
                  sx={{
                    minWidth: 0,
                  }}
                >
                  <FormControl
                    fullWidth
                    sx={{
                      minHeight: 58,
                      border:
                        "1px solid #CBD5E1",
                      borderRadius:
                        "11px",
                      px: 2,
                      py: 0.75,
                      justifyContent:
                        "center",
                      background:
                        "#FFFFFF",
                      boxSizing:
                        "border-box",
                    }}
                  >
                    <FormLabel
                      sx={{
                        fontWeight: 600,
                        color:
                          "#475569",
                        fontSize:
                          "0.85rem",
                      }}
                    >
                      Land Ownership
                    </FormLabel>

                    <RadioGroup
                      row
                      name="landOwnership"
                      value={
                        form.landOwnership
                      }
                      onChange={
                        handleChange
                      }
                      sx={{
                        height: 28,
                        alignItems:
                          "center",
                      }}
                    >
                      <FormControlLabel
                        value="true"
                        control={
                          <Radio size="small" />
                        }
                        label="Yes"
                      />

                      <FormControlLabel
                        value="false"
                        control={
                          <Radio size="small" />
                        }
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>

                <Box
                  sx={{
                    minWidth: 0,
                  }}
                >
                  <FormControl
                    fullWidth
                    sx={{
                      minHeight: 58,
                      border:
                        "1px solid #CBD5E1",
                      borderRadius:
                        "11px",
                      px: 2,
                      py: 0.75,
                      justifyContent:
                        "center",
                      background:
                        "#FFFFFF",
                      boxSizing:
                        "border-box",
                    }}
                  >
                    <FormLabel
                      sx={{
                        fontWeight: 600,
                        color:
                          "#475569",
                        fontSize:
                          "0.85rem",
                      }}
                    >
                      Do you already own a
                      house?
                    </FormLabel>

                    <RadioGroup
                      row
                      name="existingHouse"
                      value={
                        form.existingHouse
                      }
                      onChange={
                        handleChange
                      }
                      sx={{
                        height: 28,
                        alignItems:
                          "center",
                      }}
                    >
                      <FormControlLabel
                        value="true"
                        control={
                          <Radio size="small" />
                        }
                        label="Yes"
                      />

                      <FormControlLabel
                        value="false"
                        control={
                          <Radio size="small" />
                        }
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>

                {needsLandDetails && (
                  <Box
                    sx={{
                      ...fullWidthFieldSx,
                    }}
                  >
                    <Alert
                      severity="info"
                      sx={{
                        borderRadius: 2.5,
                      }}
                    >
                      Land ownership
                      documentation is required
                      for this scheme.
                    </Alert>
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {/* =================================================
              FARMER
          ================================================= */}

          {scheme.schemeType ===
            "FARMER" && (
            <Box sx={sectionSx}>
              <Typography
                sx={sectionTitleSx}
              >
                Farmer Information
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  mb: 3,
                }}
              >
                Provide the agricultural
                information applicable to
                this scheme.
              </Typography>

              <Box
                sx={twoColumnGridSx}
              >
                {needsLandDetails && (
                  <Box
                    sx={{
                      minWidth: 0,
                    }}
                  >
                    <TextField
                      fullWidth
                      required
                      type="number"
                      label="Land Area (Acres)"
                      name="landArea"
                      value={
                        form.landArea
                      }
                      onChange={
                        handleChange
                      }
                      inputProps={{
                        min: 0.1,
                        step: 0.1,
                      }}
                      sx={fieldSx}
                    />
                  </Box>
                )}

                {needsCropDetails && (
                  <Box
                    sx={{
                      minWidth: 0,
                    }}
                  >
                    <TextField
                      fullWidth
                      required
                      select
                      label="Crop Type"
                      name="cropType"
                      value={
                        form.cropType
                      }
                      onChange={
                        handleChange
                      }
                      sx={fieldSx}
                      SelectProps={{
                        IconComponent:
                          KeyboardArrowDown,
                      }}
                    >
                      <MenuItem value="">
                        Select Crop
                      </MenuItem>

                      <MenuItem value="Rice">
                        Rice
                      </MenuItem>

                      <MenuItem value="Wheat">
                        Wheat
                      </MenuItem>

                      <MenuItem value="Maize">
                        Maize
                      </MenuItem>

                      <MenuItem value="Potato">
                        Potato
                      </MenuItem>

                      <MenuItem value="Vegetables">
                        Vegetables
                      </MenuItem>

                      <MenuItem value="Pulses">
                        Pulses
                      </MenuItem>

                      <MenuItem value="Sugarcane">
                        Sugarcane
                      </MenuItem>

                      <MenuItem value="Jute">
                        Jute
                      </MenuItem>

                      <MenuItem value="Tea">
                        Tea
                      </MenuItem>

                      <MenuItem value="Cotton">
                        Cotton
                      </MenuItem>

                      <MenuItem value="Others">
                        Others
                      </MenuItem>
                    </TextField>
                  </Box>
                )}

                {needsFarmerIdentity && (
                  <Box
                    sx={{
                      ...fullWidthFieldSx,
                    }}
                  >
                    <Alert
                      severity="info"
                      sx={{
                        borderRadius: 2.5,
                      }}
                    >
                      Farmer registration or
                      identity documentation is
                      required for this scheme.
                    </Alert>
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {/* =================================================
              PENSION
          ================================================= */}

          {scheme.schemeType ===
            "PENSION" && (
            <Box sx={sectionSx}>
              <Typography
                sx={sectionTitleSx}
              >
                Pension Information
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  mb: 3,
                }}
              >
                Provide the pension
                information applicable to
                this scheme.
              </Typography>

              <Box
                sx={twoColumnGridSx}
              >
                <Box
                  sx={{
                    minWidth: 0,
                  }}
                >
                  <TextField
                    fullWidth
                    required
                    select
                    label="Marital Status"
                    name="maritalStatus"
                    value={
                      form.maritalStatus
                    }
                    onChange={
                      handleChange
                    }
                    sx={fieldSx}
                    SelectProps={{
                      IconComponent:
                        KeyboardArrowDown,
                    }}
                  >
                    <MenuItem value="">
                      Select Marital Status
                    </MenuItem>

                    <MenuItem value="Single">
                      Single
                    </MenuItem>

                    <MenuItem value="Married">
                      Married
                    </MenuItem>

                    <MenuItem value="Widowed">
                      Widowed
                    </MenuItem>

                    <MenuItem value="Divorced">
                      Divorced
                    </MenuItem>

                    <MenuItem value="Separated">
                      Separated
                    </MenuItem>
                  </TextField>
                </Box>

                <Box
                  sx={{
                    minWidth: 0,
                  }}
                >
                  <TextField
                    fullWidth
                    required
                    select
                    label="Pension Category"
                    name="pensionCategory"
                    value={
                      form.pensionCategory
                    }
                    onChange={
                      handleChange
                    }
                    sx={fieldSx}
                    SelectProps={{
                      IconComponent:
                        KeyboardArrowDown,
                    }}
                  >
                    <MenuItem value="">
                      Select Category
                    </MenuItem>

                    <MenuItem value="Old Age">
                      Old Age Pension
                    </MenuItem>

                    <MenuItem value="Widow">
                      Widow Pension
                    </MenuItem>

                    <MenuItem value="Disability">
                      Disability Pension
                    </MenuItem>

                    <MenuItem value="Family">
                      Family Pension
                    </MenuItem>
                  </TextField>
                </Box>

                {form.pensionCategory ===
                  "Disability" && (
                  <Box
                    sx={{
                      minWidth: 0,
                    }}
                  >
                    <TextField
                      fullWidth
                      required
                      type="number"
                      label="Disability Percentage"
                      name="disabilityPercentage"
                      value={
                        form.disabilityPercentage
                      }
                      onChange={
                        handleChange
                      }
                      inputProps={{
                        min: 0,
                        max: 100,
                      }}
                      sx={fieldSx}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {/* =================================================
              BANK DETAILS
          ================================================= */}

          {needsBankDetails && (
            <Box sx={sectionSx}>
              <Typography
                sx={sectionTitleSx}
              >
                Bank Details
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  mb: 3,
                }}
              >
                Bank information is required
                because this scheme requires a
                Bank Passbook.
              </Typography>

              <Box
                sx={twoColumnGridSx}
              >
                <Box
                  sx={{
                    minWidth: 0,
                  }}
                >
                  <TextField
                    fullWidth
                    required
                    label="Account Holder Name"
                    name="accountHolderName"
                    value={
                      form.accountHolderName
                    }
                    onChange={
                      handleChange
                    }
                    sx={fieldSx}
                  />
                </Box>

                <Box
                  sx={{
                    minWidth: 0,
                  }}
                >
                  <TextField
                    fullWidth
                    required
                    label="Bank Name"
                    name="bankName"
                    value={
                      form.bankName
                    }
                    onChange={
                      handleChange
                    }
                    sx={fieldSx}
                  />
                </Box>

                <Box
                  sx={{
                    minWidth: 0,
                  }}
                >
                  <TextField
                    fullWidth
                    required
                    label="Bank Account Number"
                    name="bankAccount"
                    value={
                      form.bankAccount
                    }
                    onChange={
                      handleChange
                    }
                    sx={fieldSx}
                  />
                </Box>

                <Box
                  sx={{
                    minWidth: 0,
                  }}
                >
                  <TextField
                    fullWidth
                    required
                    label="IFSC Code"
                    name="ifscCode"
                    value={
                      form.ifscCode
                    }
                    onChange={
                      handleChange
                    }
                    sx={fieldSx}
                  />
                </Box>
              </Box>
            </Box>
          )}

          {/* =================================================
              REQUIRED DOCUMENTS
          ================================================= */}

          <Box sx={sectionSx}>
            <Typography
              sx={sectionTitleSx}
            >
              Required Documents
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                mb: 3,
                lineHeight: 1.7,
              }}
            >
              These documents are loaded from the
              selected welfare scheme.
            </Typography>

            {requiredDocuments.length ===
            0 ? (
              <Alert severity="warning">
                No required documents are
                configured for this scheme.
              </Alert>
            ) : (
              <Box
                sx={{
                  display: "grid",

                  gridTemplateColumns: {
                    xs: "1fr",
                    md:
                      "repeat(2, minmax(0, 1fr))",
                    lg:
                      "repeat(3, minmax(0, 1fr))",
                  },

                  gap: 2.5,
                }}
              >
                {requiredDocuments.map(
                  (documentName) => {
                    const selectedFile =
                      documents[
                        documentName
                      ];

                    return (
                      <Card
                        key={documentName}
                        elevation={0}
                        sx={{
                          height: "100%",
                          border:
                            "1px solid #E2E8F0",
                          borderRadius: 3,
                          background:
                            "#FFFFFF",
                        }}
                      >
                        <CardContent
                          sx={{
                            p: 2.5,
                            height:
                              "100%",
                            boxSizing:
                              "border-box",
                          }}
                        >
                          <Stack
                            spacing={2}
                            sx={{
                              height:
                                "100%",
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={1.5}
                              alignItems="flex-start"
                            >
                              <Avatar
                                sx={{
                                  width: 42,
                                  height: 42,
                                  flexShrink: 0,
                                  bgcolor:
                                    "#F3E8FF",
                                  color:
                                    "#7B1FA2",
                                }}
                              >
                                <Description fontSize="small" />
                              </Avatar>

                              <Box
                                sx={{
                                  minWidth: 0,
                                }}
                              >
                                <Typography
                                  fontWeight={800}
                                  sx={{
                                    overflowWrap:
                                      "anywhere",
                                  }}
                                >
                                  {
                                    documentName
                                  }
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    mt: 0.5,
                                  }}
                                >
                                  Mandatory document
                                </Typography>
                              </Box>
                            </Stack>

                            <Box
                              sx={{
                                mt: "auto",
                              }}
                            >
                              <Button
                                fullWidth
                                component="label"
                                variant={
                                  selectedFile
                                    ? "contained"
                                    : "outlined"
                                }
                                startIcon={
                                  <AttachFile />
                                }
                                sx={{
                                  minHeight: 46,
                                  borderRadius:
                                    2.5,
                                  textTransform:
                                    "none",
                                  fontWeight: 700,
                                }}
                              >
                                {selectedFile
                                  ? "Change File"
                                  : "Choose File"}

                                <input
                                  hidden
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(
                                    event
                                  ) =>
                                    handleDocumentUpload(
                                      documentName,
                                      event
                                        .target
                                        .files?.[0]
                                    )
                                  }
                                />
                              </Button>

                              {selectedFile && (
                                <Alert
                                  severity="success"
                                  sx={{
                                    mt: 1.5,
                                    borderRadius:
                                      2,
                                    "& .MuiAlert-message":
                                      {
                                        minWidth: 0,
                                        overflowWrap:
                                          "anywhere",
                                      },
                                  }}
                                >
                                  <strong>
                                    Selected:
                                  </strong>{" "}
                                  {
                                    selectedFile.name
                                  }
                                </Alert>
                              )}
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    );
                  }
                )}
              </Box>
            )}
          </Box>

          {/* =================================================
              REMARKS
          ================================================= */}

          <Box sx={sectionSx}>
            <Typography
              sx={sectionTitleSx}
            >
              Additional Information
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                mb: 3,
              }}
            >
              Optional remarks for your application.
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Remarks"
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              sx={textareaSx}
            />
          </Box>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <Stack
            direction={{
              xs: "column-reverse",
              sm: "row",
            }}
            justifyContent="flex-end"
            spacing={2}
            sx={{
              mt: 2,
            }}
          >
            <Button
              variant="outlined"
              startIcon={
                <ArrowBack />
              }
              onClick={() =>
                navigate(
                  "/welfare/schemes"
                )
              }
              disabled={submitting}
              sx={{
                minHeight: 50,
                minWidth: {
                  xs: "100%",
                  sm: 150,
                },
                borderRadius: 2.5,
                textTransform:
                  "none",
                fontWeight: 700,
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              startIcon={<Send />}
              onClick={handleSubmit}
              disabled={submitting}
              sx={{
                minHeight: 50,
                minWidth: {
                  xs: "100%",
                  sm: 220,
                },
                borderRadius: 2.5,
                textTransform:
                  "none",
                fontWeight: 700,
                background:
                  "linear-gradient(135deg,#6A1B9A,#8E24AA)",
                boxShadow:
                  "0 6px 16px rgba(123,31,162,.22)",

                "&:hover": {
                  background:
                    "linear-gradient(135deg,#4A148C,#7B1FA2)",
                },
              }}
            >
              {submitting
                ? "Submitting..."
                : "Submit Application"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
  label,
  value,
  highlight = false,
  status = false,
}) {
  return (
    <Box
      sx={{
        border:
          "1px solid #E2E8F0",
        borderRadius: 2.5,
        background:
          "#FFFFFF",
        p: 2,
        minWidth: 0,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          display: "block",
          fontWeight: 800,
          color: "#64748B",
          textTransform:
            "uppercase",
          letterSpacing:
            "0.03em",
          mb: 0.5,
        }}
      >
        {label}
      </Typography>

      {status ? (
        <Chip
          label={value}
          size="small"
          color={
            value === "Open"
              ? "success"
              : "error"
          }
          sx={{
            fontWeight: 700,
          }}
        />
      ) : (
        <Typography
          fontWeight={
            highlight
              ? 800
              : 600
          }
          color={
            highlight
              ? "#7B1FA2"
              : "#1E293B"
          }
          sx={{
            overflowWrap:
              "anywhere",
          }}
        >
          {value}
        </Typography>
      )}
    </Box>
  );
}
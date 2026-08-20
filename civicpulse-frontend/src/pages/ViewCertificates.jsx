import { useEffect, useState } from "react";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Chip,
  Divider,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VerifiedIcon from "@mui/icons-material/Verified";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import {
  getAllCertificates,
  downloadCertificate,
} from "../services/certificateService";

function ViewCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const data = await getAllCertificates();

      console.log("ALL CERTIFICATES:", data);

      setCertificates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load certificates:", error);
      setCertificates([]);
    }
  };

  const filtered = certificates.filter((certificate) => {
    const text = search.toLowerCase();

    return (
      certificate.serviceName?.toLowerCase().includes(text) ||
      certificate.certificateNumber?.toLowerCase().includes(text) ||
      certificate.citizenName?.toLowerCase().includes(text) ||
      certificate.departmentName?.toLowerCase().includes(text) ||
      certificate.officerName?.toLowerCase().includes(text)
    );
  });

  const handleDownload = async (certificateId) => {
    try {
      await downloadCertificate(certificateId);
    } catch (error) {
      console.error("Certificate download failed:", error);
      alert("Failed to download certificate.");
    }
  };

  const handlePreview = (certificate) => {
    alert(
      `Certificate: ${certificate.certificateNumber}\n\n` +
      `Service: ${certificate.serviceName}\n` +
      `Citizen: ${certificate.citizenName}\n` +
      `Department: ${certificate.departmentName}\n` +
      `Officer: ${certificate.officerName}`
    );
  };

  return (
    <>
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <Box
        sx={{
          ml: "270px",
          p: 4,
          bgcolor: "#F5F7FA",
          minHeight: "100vh",
        }}
      >
        <Header />

        {/* PAGE HEADER */}
        <Box sx={{ mt: 3, mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
          >
            📜 Certificates
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            View and manage issued certificates
          </Typography>
        </Box>

        {/* SEARCH */}
        <TextField
          fullWidth
          label="Search Certificate"
          placeholder="Search by certificate, citizen, department or officer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            mb: 4,
            background: "white",
            borderRadius: 2,
          }}
        />

        {/* CERTIFICATE COUNT */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
          >
            Certificates ({filtered.length})
          </Typography>
        </Box>

        {/* CERTIFICATES */}
        {filtered.length === 0 ? (
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
              No certificates found
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Try changing your search.
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filtered.map((certificate) => (
              <Grid
                item
                xs={12}
                md={6}
                lg={4}
                key={certificate.certificateId}
              >
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    boxShadow: 3,
                    transition: "0.2s",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>

                    {/* SERVICE NAME */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                      >
                        {certificate.serviceName || "Certificate"}
                      </Typography>

                      <Chip
                        icon={<VerifiedIcon />}
                        label="Verified"
                        color="success"
                        size="small"
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* CERTIFICATE NUMBER */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Certificate Number
                    </Typography>

                    <Typography
                      fontWeight="bold"
                      color="primary"
                      sx={{ mt: 0.5 }}
                    >
                      {certificate.certificateNumber}
                    </Typography>

                    {/* CITIZEN */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        mt: 2,
                      }}
                    >
                      <PersonIcon color="primary" />

                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Citizen
                        </Typography>

                        <Typography fontWeight="medium">
                          {certificate.citizenName || "N/A"}
                        </Typography>
                      </Box>
                    </Box>

                    {/* DEPARTMENT */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        mt: 2,
                      }}
                    >
                      <BusinessIcon color="primary" />

                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Department
                        </Typography>

                        <Typography fontWeight="medium">
                          {certificate.departmentName || "N/A"}
                        </Typography>
                      </Box>
                    </Box>

                    {/* OFFICER */}
                    <Box
                      sx={{
                        mt: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Issued By
                      </Typography>

                      <Typography fontWeight="medium">
                        {certificate.officerName || "N/A"}
                      </Typography>
                    </Box>

                    {/* DATES */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      <CalendarMonthIcon color="primary" />

                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Issue Date
                        </Typography>

                        <Typography fontWeight="medium">
                          {certificate.issueDate || "N/A"}
                        </Typography>
                      </Box>

                      <Box sx={{ ml: "auto" }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Valid Till
                        </Typography>

                        <Typography fontWeight="medium">
                          {certificate.validTill || "N/A"}
                        </Typography>
                      </Box>
                    </Box>

                    {/* VERIFICATION CODE */}
                    <Box
                      sx={{
                        mt: 2,
                        p: 1.5,
                        background: "#F5F7FA",
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Verification Code
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          wordBreak: "break-all",
                          mt: 0.5,
                        }}
                      >
                        {certificate.verificationCode || "N/A"}
                      </Typography>
                    </Box>

                    {/* BUTTONS */}
                    <Box
                      sx={{
                        mt: 3,
                        display: "flex",
                        gap: 1.5,
                      }}
                    >
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() =>
                          handlePreview(certificate)
                        }
                      >
                        Preview
                      </Button>

                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={() =>
                          handleDownload(
                            certificate.certificateId
                          )
                        }
                      >
                        Download
                      </Button>
                    </Box>

                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </>
  );
}

export default ViewCertificates;
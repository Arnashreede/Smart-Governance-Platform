import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  Download as DownloadIcon,
  Search as SearchIcon,
  Verified as VerifiedIcon,
  Visibility as VisibilityIcon,
  Print as PrintIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import { getAllCertificates } from "../services/certificateService";

import api from "../api/axios";

import indiaLogo from "../assets/india-logo.png";

export default function MyCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCertificate, setSelectedCertificate] =
    useState(null);

  const [previewOpen, setPreviewOpen] = useState(false);

  // =========================================================
  // LOAD CERTIFICATES
  // =========================================================

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      setError("");

      const email = localStorage.getItem("email");

      if (!email) {
        throw new Error(
          "Your account information is unavailable. Please log in again."
        );
      }

      // Find actual Citizen Service ID
      const citizenResponse = await api.get("/citizens");

      const citizens = Array.isArray(citizenResponse.data)
        ? citizenResponse.data
        : [];

      const currentCitizen = citizens.find(
        (citizen) =>
          citizen?.email?.toLowerCase() ===
          email.toLowerCase()
      );

      if (!currentCitizen) {
        throw new Error(
          "Citizen profile could not be found."
        );
      }

      const loggedInCitizenId = currentCitizen.id;

      console.log(
        "MY CERTIFICATES - actual Citizen ID:",
        loggedInCitizenId
      );

      // Get all certificates
      const data = await getAllCertificates();

      const allCertificates = Array.isArray(data)
        ? data
        : [];

      // Filter current citizen's certificates
      const filteredByCitizen =
        allCertificates.filter(
          (certificate) =>
            certificate?.citizenId !== undefined &&
            certificate?.citizenId !== null &&
            String(certificate.citizenId) ===
              String(loggedInCitizenId)
        );

      console.log(
        "MY CERTIFICATES - FILTERED:",
        filteredByCitizen
      );

      setCertificates(filteredByCitizen);
    } catch (err) {
      console.error(
        "Failed to load my certificates:",
        err
      );

      setCertificates([]);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load your certificates."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredCertificates = useMemo(() => {
    const text = search.trim().toLowerCase();

    if (!text) {
      return certificates;
    }

    return certificates.filter((certificate) => {
      return (
        certificate?.serviceName
          ?.toLowerCase()
          .includes(text) ||
        certificate?.certificateNumber
          ?.toLowerCase()
          .includes(text) ||
        certificate?.departmentName
          ?.toLowerCase()
          .includes(text) ||
        certificate?.officerName
          ?.toLowerCase()
          .includes(text)
      );
    });
  }, [certificates, search]);

  // =========================================================
  // PREVIEW
  // =========================================================

  const handlePreview = (certificate) => {
    setSelectedCertificate(certificate);
    setPreviewOpen(true);
  };

  // =========================================================
  // CLOSE
  // =========================================================

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setSelectedCertificate(null);
  };

  // =========================================================
  // DOWNLOAD NEW CERTIFICATE
  // =========================================================

  const handleDownload = (certificate) => {
    if (!certificate) return;

    const html = buildPrintableCertificate(
      certificate,
      indiaLogo
    );

    const downloadWindow = window.open(
      "",
      "_blank",
      "width=1000,height=1000"
    );

    if (!downloadWindow) {
      alert(
        "Please allow pop-ups to download the certificate."
      );
      return;
    }

    downloadWindow.document.open();
    downloadWindow.document.write(html);
    downloadWindow.document.close();

    downloadWindow.onload = () => {
      setTimeout(() => {
        downloadWindow.focus();
        downloadWindow.print();
      }, 500);
    };
  };

  // =========================================================
  // PRINT FROM PREVIEW
  // =========================================================

  const handlePrint = () => {
    if (!selectedCertificate) return;

    const html = buildPrintableCertificate(
      selectedCertificate,
      indiaLogo
    );

    const printWindow = window.open(
      "",
      "_blank",
      "width=1000,height=1000"
    );

    if (!printWindow) {
      alert(
        "Please allow pop-ups to print the certificate."
      );
      return;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 500);
    };
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #F4F7FB 0%, #EEF4FF 100%)",
      }}
    >
      <Sidebar />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <Box
        sx={{
          marginLeft: "270px",
          minHeight: "100vh",
          width: "calc(100% - 270px)",
          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          pb: 6,
        }}
      >
        <Header title="My Certificates" />

        <Box
          sx={{
            maxWidth: "1500px",
            mx: "auto",
            mt: 3,
          }}
        >
          {/* =================================================
              PAGE HEADER
          ================================================== */}

          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              fontWeight={800}
            >
              📜 My Certificates
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              View and download your issued certificates.
            </Typography>
          </Box>

          {/* =================================================
              SEARCH
          ================================================== */}

          <TextField
            fullWidth
            label="Search My Certificates"
            placeholder="Search by certificate or service..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            sx={{
              mb: 4,
              background: "#fff",
              borderRadius: 2,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* =================================================
              LOADING
          ================================================== */}

          {loading && (
            <Box
              sx={{
                py: 10,
                textAlign: "center",
              }}
            >
              <CircularProgress size={45} />

              <Typography
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                Loading your certificates...
              </Typography>
            </Box>
          )}

          {/* =================================================
              ERROR
          ================================================== */}

          {!loading && error && (
            <Alert
              severity="error"
              sx={{
                borderRadius: 3,
                mb: 3,
              }}
            >
              {error}
            </Alert>
          )}

          {/* =================================================
              CERTIFICATES
          ================================================== */}

          {!loading && !error && (
            <>
              <Typography
                variant="h6"
                fontWeight={800}
                sx={{ mb: 3 }}
              >
                My Certificates (
                {filteredCertificates.length})
              </Typography>

              {filteredCertificates.length === 0 ? (
                <Card
                  sx={{
                    p: 6,
                    borderRadius: 4,
                    textAlign: "center",
                  }}
                >
                  <VerifiedIcon
                    sx={{
                      fontSize: 70,
                      color: "#9E9E9E",
                      mb: 2,
                    }}
                  />

                  <Typography
                    variant="h6"
                    color="text.secondary"
                  >
                    {search
                      ? "No matching certificates found"
                      : "No certificates issued yet"}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {search
                      ? "Try a different search."
                      : "Your issued certificates will appear here."}
                  </Typography>
                </Card>
              ) : (
                <Grid container spacing={3}>
                  {filteredCertificates.map(
                    (certificate) => (
                      <Grid
                        key={certificate.certificateId}
                        size={{
                          xs: 12,
                          md: 6,
                          lg: 4,
                        }}
                      >
                        <Card
                          sx={{
                            height: "100%",
                            p: 3,
                            borderRadius: 4,
                            background: "#fff",
                            boxShadow:
                              "0 5px 22px rgba(0,0,0,0.08)",
                            transition:
                              "transform .2s ease, box-shadow .2s ease",
                            "&:hover": {
                              transform:
                                "translateY(-4px)",
                              boxShadow:
                                "0 10px 28px rgba(0,0,0,0.12)",
                            },
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            spacing={2}
                          >
                            <Typography
                              variant="h6"
                              fontWeight={800}
                            >
                              {certificate.serviceName ||
                                "Certificate"}
                            </Typography>

                            <Chip
                              icon={
                                <VerifiedIcon />
                              }
                              label="Issued"
                              color="success"
                              size="small"
                            />
                          </Stack>

                          <Divider
                            sx={{ my: 2 }}
                          />

                          <CertificateField
                            label="Certificate Number"
                            value={
                              certificate.certificateNumber
                            }
                          />

                          <CertificateField
                            label="Department"
                            value={
                              certificate.departmentName
                            }
                          />

                          <CertificateField
                            label="Issued By"
                            value={
                              certificate.officerName
                            }
                          />

                          <Stack
                            direction="row"
                            spacing={2}
                            sx={{ mb: 2 }}
                          >
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Issue Date
                              </Typography>

                              <Typography
                                fontWeight={700}
                              >
                                {certificate.issueDate ||
                                  "N/A"}
                              </Typography>
                            </Box>

                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Valid Till
                              </Typography>

                              <Typography
                                fontWeight={700}
                              >
                                {certificate.validTill ||
                                  "N/A"}
                              </Typography>
                            </Box>
                          </Stack>

                          {/* ACTIONS */}

                          <Stack
                            direction={{
                              xs: "column",
                              sm: "row",
                            }}
                            spacing={1.5}
                            sx={{ mt: 3 }}
                          >
                            <Button
                              fullWidth
                              variant="outlined"
                              startIcon={
                                <VisibilityIcon />
                              }
                              onClick={() =>
                                handlePreview(
                                  certificate
                                )
                              }
                            >
                              Preview
                            </Button>

                            <Button
                              fullWidth
                              variant="contained"
                              startIcon={
                                <DownloadIcon />
                              }
                              onClick={() =>
                                handleDownload(
                                  certificate
                                )
                              }
                            >
                              Download
                            </Button>
                          </Stack>
                        </Card>
                      </Grid>
                    )
                  )}
                </Grid>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* =====================================================
          CERTIFICATE PREVIEW
      ====================================================== */}

      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            background: "#dfe3e8",
            borderRadius: 2,
          },
        }}
      >
        {/* TOOLBAR */}

        <Box
          sx={{
            px: 3,
            py: 1.5,
            background: "#263238",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
          >
            Certificate Preview
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              sx={{
                textTransform: "none",
                background: "#fff",
                color: "#263238",
                "&:hover": {
                  background: "#eeeeee",
                },
              }}
            >
              Print
            </Button>

            <Button
              variant="text"
              startIcon={<CloseIcon />}
              onClick={handleClosePreview}
              sx={{
                textTransform: "none",
                color: "#fff",
              }}
            >
              Close
            </Button>
          </Stack>
        </Box>

        {/* PREVIEW AREA */}

        <DialogContent
          sx={{
            p: {
              xs: 1,
              sm: 3,
              md: 5,
            },
            background:
              "linear-gradient(135deg, #e5e7eb, #dfe3e8)",
          }}
        >
          {selectedCertificate && (
            <Box
              sx={{
                width: "210mm",
                minHeight: "297mm",
                maxWidth: "100%",
                mx: "auto",
                background: "#fff",
                position: "relative",
                overflow: "hidden",
                boxShadow:
                  "0 10px 32px rgba(0,0,0,0.20)",
                p: "18mm",
              }}
            >
              <CertificateInner
                certificate={selectedCertificate}
                logo={indiaLogo}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

// =============================================================
// CERTIFICATE BODY
// =============================================================

function CertificateInner({
  certificate,
  logo,
}) {
  const config = getCertificateConfig(
    certificate.serviceName
  );

  const citizenName =
    certificate.citizenName ||
    localStorage.getItem("fullName") ||
    "Citizen";

  return (
    <>
      {/* OUTER BORDER */}

      <Box
        sx={{
          position: "absolute",
          top: "8mm",
          left: "8mm",
          right: "8mm",
          bottom: "8mm",
          border:
            "3px solid #173F6F",
          pointerEvents: "none",
        }}
      />

      {/* INNER BORDER */}

      <Box
        sx={{
          position: "absolute",
          top: "11mm",
          left: "11mm",
          right: "11mm",
          bottom: "11mm",
          border:
            "1px solid #B18B35",
          pointerEvents: "none",
        }}
      />

      {/* CONTENT */}

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* HEADER */}

        <Box
          sx={{
            textAlign: "center",
            pb: 2.5,
            borderBottom:
              "2px solid #173F6F",
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="India"
            sx={{
              width: 190,
              height: "auto",
              maxHeight: 72,
              objectFit: "contain",
              display: "block",
              mx: "auto",
              mb: 1.5,
            }}
          />

          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: 1.8,
              color: "#333",
            }}
          >
            SMART GOVERNANCE PLATFORM
          </Typography>

          <Typography
            sx={{
              fontSize: 12,
              mt: 0.5,
              color: "#555",
              letterSpacing: 1,
            }}
          >
            DIGITAL CITIZEN SERVICES
          </Typography>

          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: 1,
              color: "#173F6F",
              mt: 2,
              textTransform: "uppercase",
            }}
          >
            {config.title}
          </Typography>

          <Typography
            sx={{
              fontSize: 11,
              color: "#666",
              mt: 0.7,
            }}
          >
            {config.subtitle}
          </Typography>
        </Box>

        {/* META */}

        <Box
          sx={{
            mt: 3,
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: 4,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 10,
                color: "#777",
              }}
            >
              Certificate Number
            </Typography>

            <Typography
              fontSize={13}
              fontWeight={800}
            >
              {certificate.certificateNumber ||
                "N/A"}
            </Typography>
          </Box>

          <Box
            sx={{
              textAlign: "right",
            }}
          >
            <Typography
              sx={{
                fontSize: 10,
                color: "#777",
              }}
            >
              Verification Code
            </Typography>

            <Typography
              fontSize={11}
              fontWeight={700}
              sx={{
                wordBreak: "break-all",
              }}
            >
              {certificate.verificationCode ||
                "N/A"}
            </Typography>
          </Box>
        </Box>

        {/* CERTIFICATION */}

        <Box
          sx={{
            mt: 5,
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 15,
              lineHeight: 1.8,
            }}
          >
            {config.introduction}
          </Typography>

          <Typography
            sx={{
              mt: 1,
              fontSize: 32,
              fontWeight: 900,
              letterSpacing: 1.1,
              textTransform: "uppercase",
              color: "#263238",
            }}
          >
            {citizenName}
          </Typography>

          <Box
            sx={{
              width: "65%",
              mx: "auto",
              mt: 1,
              borderBottom:
                "1px solid #444",
            }}
          />
        </Box>

        {/* STATEMENT */}

        <Typography
          sx={{
            mt: 4,
            fontSize: 14,
            lineHeight: 2,
            textAlign: "justify",
          }}
        >
          {config.statement}
        </Typography>

        {/* DETAILS */}

        <Box
          sx={{
            mt: 4,
            border:
              "1px solid #bdbdbd",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.4,
              background: "#f3f3f3",
              borderBottom:
                "1px solid #bdbdbd",
            }}
          >
            <Typography
              fontWeight={800}
              color="#173F6F"
            >
              Certificate Particulars
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "42% 58%",
            }}
          >
            <DetailCell
              label="Citizen Name"
              value={citizenName}
            />

            <DetailCell
              label="Certificate Type"
              value={certificate.serviceName}
            />

            <DetailCell
              label="Issuing Department"
              value={
                certificate.departmentName
              }
            />

            <DetailCell
              label="Certificate Number"
              value={
                certificate.certificateNumber
              }
            />

            <DetailCell
              label="Issue Date"
              value={certificate.issueDate}
            />

            <DetailCell
              label="Valid Till"
              value={certificate.validTill}
            />

            <DetailCell
              label="Issuing Authority"
              value={
                certificate.officerName
              }
            />
          </Box>
        </Box>

        {/* SERVICE-SPECIFIC */}

        <Box
          sx={{
            mt: 3,
            p: 2,
            background: "#f8f9fb",
            borderLeft:
              "4px solid #B18B35",
          }}
        >
          <Typography
            fontWeight={800}
            color="#173F6F"
            sx={{ mb: 0.8 }}
          >
            {config.sectionTitle}
          </Typography>

          <Typography
            sx={{
              fontSize: 12,
              lineHeight: 1.8,
            }}
          >
            {config.sectionText}
          </Typography>
        </Box>

        {/* VERIFICATION */}

        <Box
          sx={{
            mt: 3,
            p: 2,
            background: "#fafafa",
            border: "1px solid #ddd",
          }}
        >
          <Typography
            fontWeight={800}
            color="#173F6F"
            sx={{ mb: 0.8 }}
          >
            Certificate Verification
          </Typography>

          <Typography
            sx={{
              fontSize: 12,
              lineHeight: 1.8,
            }}
          >
            This certificate may be verified using
            the certificate number and verification
            code shown above through the Smart
            Governance Platform.
          </Typography>
        </Box>

        {/* SIGNATURES */}

        <Box
          sx={{
            mt: 8,
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr 1fr",
            gap: 5,
            alignItems: "end",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Box
              sx={{
                height: 55,
                borderBottom:
                  "1px solid #444",
              }}
            />

            <Typography
              fontWeight={700}
              sx={{
                fontSize: 11,
                mt: 1,
              }}
            >
              Citizen
            </Typography>

            <Typography
              sx={{
                fontSize: 9,
                color: "#777",
              }}
            >
              Signature
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: 90,
                height: 90,
                border:
                  "2px solid #173F6F",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: "#173F6F",
                fontSize: 10,
                fontWeight: 900,
                lineHeight: 1.35,
                background: "#fafafa",
              }}
            >
              AUTHORIZED
              <br />
              OFFICE
              <br />
              SEAL
            </Box>
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Box
              sx={{
                height: 55,
                borderBottom:
                  "1px solid #444",
              }}
            />

            <Typography
              fontWeight={700}
              sx={{
                fontSize: 11,
                mt: 1,
              }}
            >
              {certificate.officerName ||
                "Certifying Authority"}
            </Typography>

            <Typography
              sx={{
                fontSize: 9,
                color: "#777",
              }}
            >
              Issuing Authority
            </Typography>
          </Box>
        </Box>

        {/* FOOTER */}

        <Box
          sx={{
            mt: 6,
            pt: 2,
            borderTop:
              "1px solid #bbb",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 10,
              color: "#555",
            }}
          >
            Issuing Department:{" "}
            {certificate.departmentName ||
              "N/A"}
          </Typography>

          <Typography
            sx={{
              fontSize: 9,
              color: "#777",
              mt: 0.5,
            }}
          >
            Certificate ID:{" "}
            {certificate.certificateId ||
              "N/A"}
          </Typography>

          <Typography
            sx={{
              fontSize: 9,
              color: "#777",
              mt: 0.5,
            }}
          >
            Digitally generated through the Smart
            Governance Platform
          </Typography>
        </Box>
      </Box>
    </>
  );
}

// =============================================================
// CERTIFICATE CONFIGURATION
// =============================================================

function getCertificateConfig(serviceName = "") {
  const type = serviceName
    .toLowerCase()
    .trim();

  if (type.includes("domicile")) {
    return {
      title: "DOMICILE CERTIFICATE",
      subtitle:
        "Certificate of Domicile / Permanent Residence Record",
      introduction:
        "This is to certify that the following citizen record is maintained in the civic administrative system:",
      statement:
        "The above-named citizen is recorded in the administrative service system in connection with the domicile certificate service. This certificate represents the corresponding digitally issued certificate record.",
      sectionTitle:
        "Domicile Certificate Record",
      sectionText:
        "The certificate confirms the registered citizen details associated with the domicile service and remains subject to the validity period shown above.",
    };
  }

  if (
    type.includes("residence") ||
    type.includes("residance")
  ) {
    return {
      title: "RESIDENCE CERTIFICATE",
      subtitle:
        "Certificate of Residential Record",
      introduction:
        "This is to certify that the following citizen record is maintained for residential service purposes:",
      statement:
        "The above-named citizen is recorded in the administrative service system for the residence certificate service. This certificate represents the corresponding digitally issued residential record.",
      sectionTitle:
        "Residential Record",
      sectionText:
        "The certificate records the residential service associated with the citizen and is valid for the period specified above.",
    };
  }

  if (type.includes("income")) {
    return {
      title: "INCOME CERTIFICATE",
      subtitle:
        "Certificate of Income Record",
      introduction:
        "This is to certify that the following citizen record has been processed under the income certificate service:",
      statement:
        "The above-named citizen has an income certificate record maintained in the administrative service system. The certificate details and validity are represented by the issued service record.",
      sectionTitle:
        "Income Certificate Record",
      sectionText:
        "This certificate corresponds to the income-related service application and its digitally issued certificate record.",
    };
  }

  if (type.includes("birth")) {
    return {
      title: "BIRTH CERTIFICATE",
      subtitle:
        "Certificate of Birth Record",
      introduction:
        "This is to certify that the following citizen record is associated with the birth certificate service:",
      statement:
        "The above-named citizen has a birth certificate record maintained through the administrative certificate service. The certificate number and verification information uniquely identify the issued record.",
      sectionTitle:
        "Birth Record",
      sectionText:
        "This certificate represents the digitally issued birth-record certificate associated with the citizen service account.",
    };
  }

  if (type.includes("death")) {
    return {
      title: "DEATH CERTIFICATE",
      subtitle:
        "Certificate of Death Record",
      introduction:
        "This is to certify that the following certificate record has been issued through the death certificate service:",
      statement:
        "The certificate record associated with this service has been digitally generated and registered in the certificate management system.",
      sectionTitle:
        "Death Certificate Record",
      sectionText:
        "The certificate number, issue date and verification information identify this certificate record within the platform.",
    };
  }

  if (type.includes("trade")) {
    return {
      title: "TRADE LICENSE",
      subtitle:
        "Certificate of Trade / Commercial Service Record",
      introduction:
        "This is to certify that the following citizen service record has been processed under the trade licensing service:",
      statement:
        "The above-named citizen has a certificate record associated with the trade licensing service maintained by the administrative system.",
      sectionTitle:
        "Trade License Record",
      sectionText:
        "This certificate corresponds to the digitally issued trade-license service record and its stated validity period.",
    };
  }

  if (
    type.includes("water") ||
    type.includes("connection")
  ) {
    return {
      title: "WATER CONNECTION CERTIFICATE",
      subtitle:
        "Certificate of Water Service Connection",
      introduction:
        "This is to certify that the following citizen service record has been processed under the water connection service:",
      statement:
        "The above-named citizen has a certificate record associated with the water connection service maintained in the administrative system.",
      sectionTitle:
        "Water Connection Record",
      sectionText:
        "The certificate represents the digitally issued water-service certificate associated with the citizen record.",
    };
  }

  return {
    title:
      serviceName
        ? serviceName.toUpperCase()
        : "CERTIFICATE",
    subtitle:
      "Certificate of Official Administrative Record",
    introduction:
      "This is to certify that the following citizen record has been processed through the administrative service:",
    statement:
      "The above-named citizen has a digitally issued certificate record associated with the service identified above.",
    sectionTitle:
      "Administrative Certificate Record",
    sectionText:
      "This certificate represents the corresponding digitally issued service record maintained by the platform.",
  };
}

// =============================================================
// DETAIL FIELD
// =============================================================

function CertificateField({
  label,
  value,
}) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="body2"
        color="text.secondary"
      >
        {label}
      </Typography>

      <Typography
        fontWeight={700}
        sx={{ mt: 0.4 }}
      >
        {value || "N/A"}
      </Typography>
    </Box>
  );
}

// =============================================================
// DETAIL CELL
// =============================================================

function DetailCell({
  label,
  value,
}) {
  return (
    <>
      <Box
        sx={{
          px: 2,
          py: 1.4,
          background: "#fafafa",
          borderRight:
            "1px solid #ddd",
          borderBottom:
            "1px solid #ddd",
        }}
      >
        <Typography
          sx={{
            fontSize: 11,
            color: "#666",
          }}
        >
          {label}
        </Typography>
      </Box>

      <Box
        sx={{
          px: 2,
          py: 1.4,
          borderBottom:
            "1px solid #ddd",
        }}
      >
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {value || "N/A"}
        </Typography>
      </Box>
    </>
  );
}

// =============================================================
// PRINTABLE CERTIFICATE
// =============================================================

function buildPrintableCertificate(
  certificate,
  logo
) {
  const config = getCertificateConfig(
    certificate.serviceName
  );

  const citizenName =
    certificate.citizenName ||
    localStorage.getItem("fullName") ||
    "Citizen";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${config.title}</title>

<style>

@page {
  size: A4;
  margin: 0;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: #ffffff;
}

body {
  font-family:
    Georgia,
    "Times New Roman",
    serif;
  color: #263238;
}

.page {
  width: 210mm;
  height: 297mm;
  margin: 0;
  padding: 12mm 14mm;
  position: relative;
  background: #fffdf7;
  overflow: hidden;
}

.outer-border {
  position: absolute;
  top: 8mm;
  left: 8mm;
  right: 8mm;
  bottom: 8mm;
  border: 3px solid #173F6F;
}

.inner-border {
  position: absolute;
  top: 11mm;
  left: 11mm;
  right: 11mm;
  bottom: 11mm;
  border: 1px solid #B18B35;
}

.content {
  position: relative;
  z-index: 2;

  transform: scale(0.90);
  transform-origin: top center;

  width: 111.111%;
  margin-left: -5.555%;
}

.header {
  text-align: center;
  padding-bottom: 17px;
  border-bottom: 2px solid #173F6F;
}

.logo {
  width: 190px;
  max-height: 72px;
  object-fit: contain;
  display: block;
  margin: 0 auto 12px;
}

.platform {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 1.8px;
  color: #333;
}

.digital {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
  margin-top: 5px;
  color: #555;
  letter-spacing: 1px;
}

.title {
  font-size: 28px;
  font-weight: 900;
  letter-spacing: 1px;
  color: #173F6F;
  margin-top: 18px;
  text-transform: uppercase;
}

.subtitle {
  font-size: 11px;
  color: #666;
  margin-top: 6px;
}

.meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 25px;
}

.meta-right {
  text-align: right;
}

.meta-label {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 10px;
  color: #777;
}

.meta-value {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 13px;
  font-weight: 800;
  margin-top: 3px;
}

.certification {
  margin-top: 28px;
  text-align: center;
}

.introduction {
  font-size: 15px;
  line-height: 1.8;
}

.name {
  font-size: 32px;
  font-weight: 900;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-top: 8px;
  color: #263238;
}

.name-line {
  width: 65%;
  margin: 10px auto 0;
  border-bottom: 1px solid #444;
}

.statement {
  margin-top: 22px;
  font-size: 14px;
  line-height: 2;
  text-align: justify;
}

.details {
  width: 100%;
  border-collapse: collapse;
  margin-top: 30px;
  font-size: 13px;
}

.details td {
  border-bottom: 1px solid #dddddd;
  padding: 11px 12px;
}

.details .label {
  width: 42%;
  font-weight: 700;
  color: #173F6F;
  background: #fafafa;
}

.service-box {
  margin-top: 14px;
  padding: 14px;
  background: #f8f9fb;
  border-left: 4px solid #B18B35;
}

.service-title {
  color: #173F6F;
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 7px;
}

.service-text {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 11px;
  line-height: 1.7;
}

.verify-box {
  margin-top: 14px;
  padding: 14px;
  border: 1px solid #dddddd;
  background: #fafafa;
}

.verify-title {
  color: #173F6F;
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 7px;
}

.verify-text {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 11px;
  line-height: 1.7;
}

.signatures {
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 40px;
  align-items: end;
}

.signature {
  text-align: center;
}

.signature-line {
  height: 55px;
  border-bottom: 1px solid #444;
}

.signature-name {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 11px;
  font-weight: 700;
  margin-top: 8px;
}

.signature-role {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 9px;
  color: #777;
  margin-top: 3px;
}

.seal {
  width: 90px;
  height: 90px;
  margin: 0 auto;
  border: 2px solid #173F6F;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #173F6F;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 9px;
  font-weight: 900;
  line-height: 1.35;
}

.footer {
  text-align: center;
  margin-top: 25px;
  padding-top: 10px;
  border-top: 1px solid #bbbbbb;
  font-family: Arial, Helvetica, sans-serif;
  color: #777;
}

.footer-main {
  font-size: 10px;
}

.footer-small {
  font-size: 9px;
  margin-top: 4px;
}

@media print {
  @page {
    size: A4;
    margin: 0;
  }

  html,
  body {
    width: 210mm;
    height: 297mm;
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
  }

  .page {
    width: 210mm;
    height: 297mm;
    margin: 0 !important;
    padding: 12mm 14mm !important;
    overflow: hidden !important;
  }
}

</style>
</head>

<body>

<div class="page">

  <div class="outer-border"></div>
  <div class="inner-border"></div>

  <div class="content">

    <div class="header">

      <img
        src="${logo}"
        class="logo"
        alt="India"
      />

      <div class="platform">
        SMART GOVERNANCE PLATFORM
      </div>

      <div class="digital">
        DIGITAL CITIZEN SERVICES
      </div>

      <div class="title">
        ${config.title}
      </div>

      <div class="subtitle">
        ${config.subtitle}
      </div>

    </div>

    <div class="meta">

      <div>
        <div class="meta-label">
          CERTIFICATE NUMBER
        </div>

        <div class="meta-value">
          ${certificate.certificateNumber || "N/A"}
        </div>
      </div>

      <div class="meta-right">
        <div class="meta-label">
          VERIFICATION CODE
        </div>

        <div class="meta-value">
          ${certificate.verificationCode || "N/A"}
        </div>
      </div>

    </div>

    <div class="certification">

      <div class="introduction">
        ${config.introduction}
      </div>

      <div class="name">
        ${citizenName}
      </div>

      <div class="name-line"></div>

    </div>

    <div class="statement">
      ${config.statement}
    </div>

    <table class="details">

      <tr>
        <td class="label">
          Citizen Name
        </td>
        <td>
          ${citizenName}
        </td>
      </tr>

      <tr>
        <td class="label">
          Certificate Type
        </td>
        <td>
          ${certificate.serviceName || "N/A"}
        </td>
      </tr>

      <tr>
        <td class="label">
          Issuing Department
        </td>
        <td>
          ${certificate.departmentName || "N/A"}
        </td>
      </tr>

      <tr>
        <td class="label">
          Certificate Number
        </td>
        <td>
          ${certificate.certificateNumber || "N/A"}
        </td>
      </tr>

      <tr>
        <td class="label">
          Issue Date
        </td>
        <td>
          ${certificate.issueDate || "N/A"}
        </td>
      </tr>

      <tr>
        <td class="label">
          Valid Till
        </td>
        <td>
          ${certificate.validTill || "N/A"}
        </td>
      </tr>

      <tr>
        <td class="label">
          Issuing Authority
        </td>
        <td>
          ${certificate.officerName || "Certifying Authority"}
        </td>
      </tr>

    </table>

    <div class="service-box">

      <div class="service-title">
        ${config.sectionTitle}
      </div>

      <div class="service-text">
        ${config.sectionText}
      </div>

    </div>

    <div class="verify-box">

      <div class="verify-title">
        CERTIFICATE VERIFICATION
      </div>

      <div class="verify-text">
        This certificate may be verified using the
        certificate number and verification code
        shown above through the Smart Governance
        Platform.
      </div>

    </div>

    <div class="signatures">

      <div class="signature">

        <div class="signature-line"></div>

        <div class="signature-name">
          Citizen
        </div>

        <div class="signature-role">
          Signature
        </div>

      </div>

      <div>
        <div class="seal">
          AUTHORIZED
          <br />
          OFFICE
          <br />
          SEAL
        </div>
      </div>

      <div class="signature">

        <div class="signature-line"></div>

        <div class="signature-name">
          ${certificate.officerName || "Certifying Authority"}
        </div>

        <div class="signature-role">
          Issuing Authority
        </div>

      </div>

    </div>

    <div class="footer">

      <div class="footer-main">
        Issuing Department:
        ${certificate.departmentName || "N/A"}
      </div>

      <div class="footer-small">
        Certificate ID:
        ${certificate.certificateId || "N/A"}
      </div>

      <div class="footer-small">
        Digitally generated through the Smart Governance Platform
      </div>

    </div>

  </div>

</div>

</body>
</html>
`;
}
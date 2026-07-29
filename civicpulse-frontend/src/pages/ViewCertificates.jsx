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
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VerifiedIcon from "@mui/icons-material/Verified";

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
      setCertificates(data);
    } catch (error) {
      console.error(error);
    }
  };

  const filtered = certificates.filter((c) =>
    c.certificateType
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

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
          📜 My Certificates
        </Typography>

        <TextField
          fullWidth
          label="Search Certificate"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 4 }}
        />

        <Grid container spacing={3}>

          {filtered.map((certificate) => (

            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              key={certificate.id}
            >

              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 3,
                }}
              >

                <CardContent>

                  <Typography
                    variant="h6"
                    fontWeight="bold"
                  >
                    {certificate.certificateType}
                  </Typography>

                  <Typography mt={1}>
                    Certificate No
                  </Typography>

                  <Typography color="primary">
                    {certificate.certificateNumber}
                  </Typography>

                  <Typography mt={2}>
                    Application ID :
                    {certificate.applicationId}
                  </Typography>

                  <Chip
                    icon={<VerifiedIcon />}
                    label="Verified"
                    color="success"
                    sx={{ mt: 2 }}
                  />

                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      gap: 2,
                    }}
                  >

                    <Button
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                    >
                      Preview
                    </Button>

                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={() =>
                        downloadCertificate(
                          certificate.id
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

      </Box>

    </>
  );
}

export default ViewCertificates;
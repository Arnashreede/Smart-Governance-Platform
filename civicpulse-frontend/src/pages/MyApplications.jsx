import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  TextField,
} from "@mui/material";

import {
  DataGrid,
} from "@mui/x-data-grid";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import {
  getCitizenApplications,
} from "../services/applicationService";
function MyApplications() {

  const citizenId = localStorage.getItem("citizenId");

  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await getCitizenApplications(citizenId);
      setApplications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = applications.filter(app =>
    app.applicationType
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    {
      field: "id",
      headerName: "Application ID",
      width: 120,
    },
    {
      field: "applicationType",
      headerName: "Service",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      width: 170,
      renderCell: (params) => {
        const status = params.value;

        let color = "default";

        if (status === "APPROVED")
          color = "success";

        if (status === "REJECTED")
          color = "error";

        if (status === "SUBMITTED")
          color = "warning";

        if (status === "VERIFIED")
          color = "info";

        return (
          <Chip
            label={status}
            color={color}
          />
        );
      },
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
          📄 My Applications
        </Typography>

        <Grid container spacing={3} mb={3}>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h5">
                  {applications.length}
                </Typography>

                <Typography>
                  Total Applications
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h5">
                  {
                    applications.filter(
                      a => a.status === "APPROVED"
                    ).length
                  }
                </Typography>

                <Typography>
                  Approved
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h5">
                  {
                    applications.filter(
                      a => a.status === "SUBMITTED"
                    ).length
                  }
                </Typography>

                <Typography>
                  Pending
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h5">
                  {
                    applications.filter(
                      a => a.status === "REJECTED"
                    ).length
                  }
                </Typography>

                <Typography>
                  Rejected
                </Typography>
              </CardContent>
            </Card>
          </Grid>

        </Grid>

        <TextField
          fullWidth
          label="Search Application"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          sx={{ mb: 3 }}
        />

        <div
          style={{
            background: "white",
            borderRadius: 15,
          }}
        >
          <DataGrid
            rows={filtered}
            columns={columns}
            autoHeight
            pageSizeOptions={[5, 10, 20]}
          />
        </div>

      </Box>
    </>
  );
}

export default MyApplications;
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import {
  getOfficersByDepartment,
  updateOfficer,
} from "../services/officerService";

function DepartmentDetails() {
  const { department } = useParams();

  const [officers, setOfficers] = useState([]);

  const designations = [
    "Department Manager",
    "Senior Officer",
    "Officer",
    "Junior Officer",
    "Trainee Officer",
  ];

  useEffect(() => {
    loadOfficers();
  }, []);

  const loadOfficers = async () => {
    try {
        const departmentName = decodeURIComponent(department);

        console.log("Department:", departmentName);

        const data = await getOfficersByDepartment(departmentName);

        console.log("Officers:", data);

        setOfficers(data);
    } catch (err) {
        console.error("Failed to load officers:", err);
        setOfficers([]);
    }
};

  const updateDesignation = async (officer, designation) => {
    try {
      const updatedOfficer = {
        ...officer,
        designation,
      };

      await updateOfficer(officer.id, updatedOfficer);

      setOfficers((prev) =>
        prev.map((o) =>
          o.id === officer.id
            ? { ...o, designation }
            : o
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update designation.");
    }
  };

  return (
    <>
      <Sidebar />

      <Box
        sx={{
          ml: "260px",
          p: 4,
          background: "#F4F6F9",
          minHeight: "100vh",
        }}
      >
        <Header />

        <Typography
          variant="h4"
          fontWeight="bold"
          mb={4}
        >
          🏛 {decodeURIComponent(department)}
        </Typography>

        <Typography
          variant="h5"
          mb={3}
        >
          Officers
        </Typography>

        <Grid container spacing={3}>
          {officers.map((officer) => (
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              key={officer.id}
            >
              <Card
                elevation={4}
                sx={{
                  borderRadius: 3,
                  height: "100%",
                }}
              >
                <CardContent>

                  <Typography
                    variant="h6"
                    fontWeight="bold"
                  >
                    {officer.fullName}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    📧 {officer.email}
                  </Typography>

                  <Typography sx={{ mt: 1 }}>
                    📱 {officer.phone}
                  </Typography>

                  <Typography sx={{ mt: 1 }}>
                    🏢 {officer.department}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <FormControl fullWidth>
                    <InputLabel>
                      Designation
                    </InputLabel>

                    <Select
                      value={officer.designation || ""}
                      label="Designation"
                      onChange={(e) =>
                        updateDesignation(
                          officer,
                          e.target.value
                        )
                      }
                    >
                      {designations.map((designation) => (
                        <MenuItem
                          key={designation}
                          value={designation}
                        >
                          {designation}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

export default DepartmentDetails;
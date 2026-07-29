import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

import { services } from "../../data/services";

function ServiceCards({ application, setApplication }) {
  return (
    <>
      {/* Certificates */}
      <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
        📜 Certificates
      </Typography>

      <Grid container spacing={2}>
        {services
          .filter((service) => service.category === "Certificates")
          .map((service) => (
<Grid
  size={{
    xs: 12,
    sm: 6,
    md: 4,
  }}
  key={service.name}
>              <Card
                onClick={() =>
                  setApplication({
                    ...application,
                    applicationType: service.name,
                  })
                }
                sx={{
                  cursor: "pointer",
                  transition: "0.3s",
                  borderRadius: 3,
                  textAlign: "center",
                  border:
                    application.applicationType === service.name
                      ? "2px solid #1976d2"
                      : "1px solid #ddd",

                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h3">
                    {service.icon}
                  </Typography>

                  <Typography fontWeight="bold">
                    {service.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      {/* Licences & Permits */}

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        📄 Licences & Permits
      </Typography>

      <Grid container spacing={2}>
        {services
          .filter(
            (service) =>
              service.category === "Licences & Permits"
          )
          .map((service) => (
<Grid
  size={{
    xs: 12,
    sm: 6,
    md: 4,
  }}
  key={service.name}
>              <Card
                onClick={() =>
                  setApplication({
                    ...application,
                    applicationType: service.name,
                  })
                }
                sx={{
                  cursor: "pointer",
                  transition: "0.3s",
                  borderRadius: 3,
                  textAlign: "center",
                  border:
                    application.applicationType === service.name
                      ? "2px solid #1976d2"
                      : "1px solid #ddd",

                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h3">
                    {service.icon}
                  </Typography>

                  <Typography fontWeight="bold">
                    {service.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </>
  );
}

export default ServiceCards;
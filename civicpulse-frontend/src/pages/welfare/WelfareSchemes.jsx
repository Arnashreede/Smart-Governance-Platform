import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  TextField,
  CircularProgress,
  Alert,
  Stack,
  MenuItem,
  Box,
  Divider,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import {
  Search,
  Assignment,
} from "@mui/icons-material";

import { getAllSchemes } from "../../api/welfareApi";

function WelfareSchemes() {

  const navigate = useNavigate();

  const [schemes, setSchemes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");

  const [status, setStatus] = useState("");

  useEffect(() => {

    loadSchemes();

  }, []);

  const loadSchemes = async () => {

    try {

      const response = await getAllSchemes();

      setSchemes(response.data);

    } catch (err) {

      console.error(err);

      setError("Failed to load welfare schemes.");

    } finally {

      setLoading(false);

    }

  };

  const filteredSchemes = useMemo(() => {

    return schemes.filter((scheme) => {

      const matchesSearch =
        scheme.schemeName
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        !category ||
        scheme.category === category;

      const matchesStatus =
        !status ||
        (status === "ACTIVE"
          ? scheme.active
          : !scheme.active);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );

    });

  }, [
    schemes,
    search,
    category,
    status,
  ]);

  if (loading) {

    return (

      <Box
        display="flex"
        justifyContent="center"
        mt={8}
      >

        <CircularProgress />

      </Box>

    );

  }

  if (error) {

    return (

      <Container maxWidth="xl">

        <Alert severity="error">

          {error}

        </Alert>

      </Container>

    );

  }
  return (

<Container maxWidth="xl" sx={{ py:4 }}>

<Box
display="flex"
justifyContent="space-between"
alignItems="center"
mb={4}
>

<Box>

<Typography
variant="h4"
fontWeight="bold"
>

Welfare Schemes

</Typography>

<Typography color="text.secondary">

Browse available government welfare schemes and apply online.

</Typography>

</Box>

</Box>

<Grid
container
spacing={2}
sx={{ mb:4 }}
>

<Grid item xs={12} md={5}>

<TextField
fullWidth
label="Search Scheme"
placeholder="Search by scheme name..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
InputProps={{
startAdornment:<Search sx={{mr:1,color:"gray"}}/>
}}
/>

</Grid>

<Grid item xs={12} md={3}>

<TextField
select
fullWidth
label="Category"
value={category}
onChange={(e)=>setCategory(e.target.value)}
>

<MenuItem value="">
All Categories
</MenuItem>

{[...new Set(
schemes.map(
(s)=>s.category
)
)].map(category=>(

<MenuItem
key={category}
value={category}
>

{category}

</MenuItem>

))}

</TextField>

</Grid>

<Grid item xs={12} md={2}>

<TextField
select
fullWidth
label="Status"
value={status}
onChange={(e)=>setStatus(e.target.value)}
>

<MenuItem value="">
All
</MenuItem>

<MenuItem value="ACTIVE">
Active
</MenuItem>

<MenuItem value="INACTIVE">
Closed
</MenuItem>

</TextField>

</Grid>

<Grid item xs={12} md={2}>

<Card
sx={{
height:"100%",
display:"flex",
alignItems:"center",
justifyContent:"center",
borderRadius:3
}}
>

<CardContent>

<Typography
variant="subtitle2"
color="text.secondary"
>

Available

</Typography>

<Typography
variant="h4"
fontWeight="bold"
color="primary"
>

{filteredSchemes.length}

</Typography>

</CardContent>

</Card>

</Grid>

</Grid>

<Grid container spacing={3}>

{filteredSchemes.length > 0 ? (

  filteredSchemes.map((scheme) => {

    const today = new Date();
today.setHours(0, 0, 0, 0);

const endDate = new Date(scheme.endDate);
endDate.setHours(0, 0, 0, 0);

const remainingDays = scheme.endDate
  ? Math.ceil(
      (
        new Date(scheme.endDate).setHours(0, 0, 0, 0) -
        new Date().setHours(0, 0, 0, 0)
      ) /
      (1000 * 60 * 60 * 24)
    )
  : null;

    return (

      <Grid item xs={12} md={6} lg={4} key={scheme.id}>

        <Card
          elevation={4}
          sx={{
            height: "100%",
            borderRadius: 3,
            transition: "0.3s",
            "&:hover": {
              transform: "translateY(-6px)",
              boxShadow: 8,
            },
          }}
        >

          <CardContent>

            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
            >
              {scheme.schemeName}
            </Typography>

            <Typography
              color="text.secondary"
              gutterBottom
            >
              {scheme.department}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mb: 2,
                minHeight: 60,
              }}
            >
              {scheme.description}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              sx={{ mb: 2 }}
            >

              <Chip
                label={scheme.schemeType}
                color="primary"
                size="small"
              />

              <Chip
                label={scheme.category}
                color="secondary"
                size="small"
              />

              <Chip
                label={
                  scheme.active
                    ? "Active"
                    : "Closed"
                }
                color={
                  scheme.active
                    ? "success"
                    : "error"
                }
                size="small"
              />

            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Typography>
              <strong>Benefit:</strong>{" "}
              ₹{Number(
                scheme.benefitAmount
              ).toLocaleString()}
            </Typography>

            <Typography>
              <strong>Age:</strong>{" "}
              {scheme.minimumAge} - {scheme.maximumAge}
            </Typography>

            <Typography>
              <strong>Income:</strong>{" "}
              ₹{Number(
                scheme.maxIncome
              ).toLocaleString()}
            </Typography>

            <Typography>
              <strong>Last Date:</strong>{" "}
              {scheme.endDate}
            </Typography>

            <Typography
              color={
  remainingDays === null
    ? "text.secondary"
    : remainingDays >= 0
      ? "success.main"
      : "error.main"
}
              fontWeight="bold"
              mt={1}
            >
              {remainingDays === null
  ? "No Expiry Date"
  : remainingDays >= 0
    ? `${remainingDays} Days Left`
    : "Expired"}
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              sx={{ mt: 3 }}
            >

              <Button
                fullWidth
                variant="outlined"
                onClick={() =>
                  navigate(
                    `/welfare/scheme/${scheme.id}`
                  )
                }
              >
                View Details
              </Button>

              <Button
                fullWidth
                variant="contained"
                startIcon={<Assignment />}
                disabled={!scheme.active}
                onClick={() =>
                  navigate(
                    `/welfare/apply?id=${scheme.id}`
                  )
                }
              >
                Apply
              </Button>

            </Stack>

          </CardContent>

        </Card>

      </Grid>

    );

  })

) : (
              <Grid item xs={12}>

            <Card
              sx={{
                py: 8,
                textAlign: "center",
                borderRadius: 3,
              }}
            >

              <CardContent>

                <Typography
                  variant="h5"
                  gutterBottom
                >
                  No Welfare Schemes Found
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Try changing your search or filter criteria.
                </Typography>

                <Button
                  variant="contained"
                  onClick={() => {

                    setSearch("");
                    setCategory("");
                    setStatus("");

                  }}
                >
                  Clear Filters
                </Button>

              </CardContent>

            </Card>

          </Grid>

        )}

      </Grid>

    </Container>

  );

}

export default WelfareSchemes;
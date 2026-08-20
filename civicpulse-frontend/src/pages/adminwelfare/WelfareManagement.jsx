import {
  Box,
  Typography,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";
import { useEffect, useState } from "react";
import { getAllSchemes } from "../../api/welfareApi";
import { deleteScheme } from "../../api/welfareApi";
function WelfareManagement() {
  const navigate = useNavigate();

const [schemes, setSchemes] = useState([]);
const [filtered, setFiltered] = useState([]);
const [search, setSearch] = useState("");
useEffect(() => {
  loadSchemes();
}, []);
const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this scheme?"
  );

  if (!confirmDelete) return;

  try {
    await deleteScheme(id);

    alert("Scheme deleted successfully.");

    loadSchemes();
  } catch (error) {
    console.error(error);
    alert("Failed to delete scheme.");
  }
};

const loadSchemes = async () => {
  try {
    const response = await getAllSchemes();
    setSchemes(response.data);
    setFiltered(response.data);
  } catch (error) {
    console.error(error);
  }
};
useEffect(() => {
  setFiltered(
    schemes.filter((scheme) =>
      (scheme.schemeName || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  );
}, [search, schemes]);

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Welfare Scheme Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/welfare/add")}
        >
          Add Scheme
        </Button>
      </Stack>

     <TextField
    fullWidth
    placeholder="Search by scheme name..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    sx={{ mb: 3 }}
    InputProps={{
        startAdornment: (
            <InputAdornment position="start">
                <SearchIcon />
            </InputAdornment>
        ),
    }}
/>

      <TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
      <TableCell><b>#</b></TableCell>
        <TableCell><b>Scheme Name</b></TableCell>
        <TableCell><b>Department</b></TableCell>
        <TableCell><b>Category</b></TableCell>
        <TableCell><b>Type</b></TableCell>
        <TableCell><b>Benefit</b></TableCell>
        <TableCell><b>Budget</b></TableCell>
        <TableCell><b>Status</b></TableCell>
        <TableCell align="center"><b>Actions</b></TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {filtered.map((scheme, index) => (
        <TableRow key={scheme.id}>
        <TableCell>{index + 1}</TableCell>
          <TableCell>{scheme.schemeName}</TableCell>
          <TableCell>{scheme.schemeCode}</TableCell>
          <TableCell>{scheme.department}</TableCell>
          <TableCell>{scheme.category}</TableCell>
          <TableCell>{scheme.schemeType}</TableCell>
          <TableCell>₹{Number(scheme.benefitAmount).toLocaleString()}</TableCell>
          <TableCell>₹{Number(scheme.allocatedBudget).toLocaleString()}</TableCell>
          <TableCell>
    <Chip
        label={scheme.active ? "ACTIVE" : "INACTIVE"}
        color={scheme.active ? "success" : "default"}
        size="small"
    />
</TableCell>

          <TableCell align="center">
            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate(`/admin/welfare/edit/${scheme.id}`)}
            >
              Edit
            </Button>

            <Button
    size="small"
    color="error"
    variant="outlined"
    sx={{ ml: 1 }}
    onClick={() => handleDelete(scheme.id)}
>
    Delete
</Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
    </Box>
  );
}

export default WelfareManagement;
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Paper,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getScheme, updateScheme } from "../../api/welfareApi";

function EditScheme() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    schemeName: "",
    category: "",
    schemeType: "",
    description: "",
    benefitAmount: "",
    allocatedBudget: "",
    minimumAge: "",
    maximumAge: "",
    maxIncome: "",
  });

  useEffect(() => {
    loadScheme();
  }, []);

  const loadScheme = async () => {
    try {
      const response = await getScheme(id);
      setForm(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      await updateScheme(id, form);
      alert("Scheme updated successfully.");
      navigate("/admin/welfare");
    } catch (error) {
      console.error(error);
      alert("Failed to update scheme.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Edit Welfare Scheme
        </Typography>

        <Grid container spacing={2}>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Scheme Name"
              name="schemeName"
              value={form.schemeName}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Scheme Type"
              name="schemeType"
              value={form.schemeType}
              onChange={handleChange}
            >
              <MenuItem value="STUDENT">Student</MenuItem>
              <MenuItem value="HOUSING">Housing</MenuItem>
              <MenuItem value="FARMER">Farmer</MenuItem>
              <MenuItem value="PENSION">Pension</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Benefit Amount"
              name="benefitAmount"
              type="number"
              value={form.benefitAmount}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Allocated Budget"
              name="allocatedBudget"
              type="number"
              value={form.allocatedBudget}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Maximum Income"
              name="maxIncome"
              type="number"
              value={form.maxIncome}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Minimum Age"
              name="minimumAge"
              type="number"
              value={form.minimumAge}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Maximum Age"
              name="maximumAge"
              type="number"
              value={form.maximumAge}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" onClick={handleSubmit}>
              Update Scheme
            </Button>
          </Grid>

        </Grid>
      </Paper>
    </Box>
  );
}

export default EditScheme;
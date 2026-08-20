import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createScheme } from "../../api/welfareApi";

function AddScheme() {
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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      await createScheme(form);
      alert("Scheme added successfully!");
      navigate("/admin/welfare");
    } catch (error) {
      console.error(error);
      alert("Failed to add scheme.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Add Welfare Scheme
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
              type="number"
              label="Benefit Amount"
              name="benefitAmount"
              value={form.benefitAmount}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Allocated Budget"
              name="allocatedBudget"
              value={form.allocatedBudget}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Maximum Income"
              name="maxIncome"
              value={form.maxIncome}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Minimum Age"
              name="minimumAge"
              value={form.minimumAge}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Maximum Age"
              name="maximumAge"
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
            <Button
              variant="contained"
              onClick={handleSubmit}
            >
              Save Scheme
            </Button>
          </Grid>

        </Grid>
      </Paper>
    </Box>
  );
}

export default AddScheme;
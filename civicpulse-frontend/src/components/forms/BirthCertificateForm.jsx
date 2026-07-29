import { Grid, TextField, Typography } from "@mui/material";

function BirthCertificateForm() {
  return (
    <>
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        👶 Birth Certificate Details
      </Typography>

      <Grid container spacing={2}>

        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Child Name" />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Date of Birth" type="date"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Father Name" />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Mother Name" />
        </Grid>

        <Grid item xs={12}>
          <TextField fullWidth label="Place of Birth" />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Purpose of Application"
          />
        </Grid>

      </Grid>
    </>
  );
}

export default BirthCertificateForm;
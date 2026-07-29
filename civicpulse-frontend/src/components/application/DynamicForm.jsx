import {
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { formFields } from "../../data/formFields";

function DynamicForm({ application, setApplication }) {
  if (!application.applicationType) return null;

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {application.applicationType} Application
        </Typography>

        <Grid container spacing={2}>
          {formFields[application.applicationType]?.map((field) => (
            <Grid
              key={field.name}
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <TextField
                fullWidth
                label={field.label}
                type={field.type || "text"}
                value={application[field.name] || ""}
                slotProps={
                  field.type === "date"
                    ? {
                        inputLabel: {
                          shrink: true,
                        },
                      }
                    : undefined
                }
                onChange={(e) =>
                  setApplication({
                    ...application,
                    [field.name]: e.target.value,
                  })
                }
              />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default DynamicForm;
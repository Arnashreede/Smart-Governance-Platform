import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Box,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";

import { getFormFields } from "../../services/formFieldService";

function DynamicForm({ application, setApplication }) {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!application.applicationType) {
      setFields([]);
      return;
    }

    loadFields();
  }, [application.applicationType, application.serviceId]);

  const loadFields = async () => {
    try {
      setLoading(true);
      setError("");

      const serviceId = application.serviceId;

      if (!serviceId) {
        setError("Service information is missing.");
        setFields([]);
        return;
      }

      const data = await getFormFields(serviceId);

      console.log("DATABASE FORM FIELDS:", data);

      setFields(data || []);
    } catch (err) {
      console.error("Failed to load form fields:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to load application form."
      );

      setFields([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    const fieldName =
      field.fieldName ||
      field.field_name;

    setApplication((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const renderField = (field) => {
    const fieldName =
      field.fieldName ||
      field.field_name;

    const fieldLabel =
      field.fieldLabel ||
      field.field_label ||
      field.fieldName ||
      field.field_name;

    const fieldType = (
      field.fieldType ||
      field.field_type ||
      "TEXT"
    ).toUpperCase();

    const optionsValue =
      field.options || "";

    const options =
      typeof optionsValue === "string"
        ? optionsValue
            .split(",")
            .map((option) => option.trim())
            .filter(Boolean)
        : Array.isArray(optionsValue)
        ? optionsValue
        : [];

    const placeholder =
      field.placeholder || "";

    const required =
      field.required === true;

    const readonly =
      field.readonly === true;

    const value =
      application[fieldName] || "";

    /*
     * ============================
     * FILE
     * ============================
     */
    if (fieldType === "FILE") {
      return (
        <Box>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ mb: 1 }}
          >
            {fieldLabel}

            {required && (
              <span
                style={{
                  color: "red",
                  marginLeft: 4,
                }}
              >
                *
              </span>
            )}
          </Typography>

          {field.helpText && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mb: 1,
              }}
            >
              {field.helpText}
            </Typography>
          )}

          <Box
            sx={{
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 2,
              p: 2,
              backgroundColor: "#fafafa",
              transition: "0.2s",
              "&:hover": {
                backgroundColor: "#f5f5f5",
                borderColor: "primary.main",
              },
            }}
          >
            <input
              type="file"
              required={required}
              disabled={readonly}
              onChange={(e) =>
                handleChange(
                  field,
                  e.target.files?.[0] || null
                )
              }
            />
          </Box>
        </Box>
      );
    }

    /*
     * ============================
     * DROPDOWN
     * ============================
     */
    if (fieldType === "DROPDOWN") {
      return (
        <TextField
          fullWidth
          select
          label={fieldLabel}
          value={value}
          required={required}
          disabled={readonly}
          onChange={(e) =>
            handleChange(
              field,
              e.target.value
            )
          }
          helperText={placeholder}
        >
          <MenuItem value="">
            Select {fieldLabel}
          </MenuItem>

          {options.map((option) => (
            <MenuItem
              key={option}
              value={option}
            >
              {option}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    /*
     * ============================
     * TEXTAREA
     * ============================
     */
    if (fieldType === "TEXTAREA") {
      return (
        <TextField
          fullWidth
          multiline
          minRows={4}
          label={fieldLabel}
          placeholder={placeholder}
          value={value}
          required={required}
          disabled={readonly}
          onChange={(e) =>
            handleChange(
              field,
              e.target.value
            )
          }
        />
      );
    }

    /*
     * ============================
     * DATE
     * ============================
     */
    if (fieldType === "DATE") {
      return (
        <TextField
          fullWidth
          type="date"
          label={fieldLabel}
          value={value}
          required={required}
          disabled={readonly}
          onChange={(e) =>
            handleChange(
              field,
              e.target.value
            )
          }
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          helperText={placeholder}
        />
      );
    }

    /*
     * ============================
     * PHONE
     * ============================
     */
    if (fieldType === "PHONE") {
      return (
        <TextField
          fullWidth
          type="tel"
          label={fieldLabel}
          placeholder={placeholder}
          value={value}
          required={required}
          disabled={readonly}
          onChange={(e) =>
            handleChange(
              field,
              e.target.value
            )
          }
        />
      );
    }

    /*
     * ============================
     * DEFAULT TEXT
     * ============================
     */
    return (
      <TextField
        fullWidth
        label={fieldLabel}
        placeholder={placeholder}
        value={value}
        required={required}
        disabled={readonly}
        onChange={(e) =>
          handleChange(
            field,
            e.target.value
          )
        }
      />
    );
  };

  /*
   * ============================
   * GROUP FIELDS BY SECTION
   * ============================
   */

  const groupedSections = fields.reduce(
    (groups, field) => {
      const sectionId =
        field.sectionId ||
        field.section_id ||
        "default";

      const sectionName =
        field.sectionName ||
        field.section_name ||
        "Application Information";

      if (!groups[sectionId]) {
        groups[sectionId] = {
          id: sectionId,
          name: sectionName,
          fields: [],
        };
      }

      groups[sectionId].fields.push(field);

      return groups;
    },
    {}
  );

  /*
   * ============================
   * NO APPLICATION SELECTED
   * ============================
   */

  if (!application.applicationType) {
    return null;
  }

  return (
    <Card
      sx={{
        mt: 4,
        borderRadius: 3,
        boxShadow:
          "0 8px 30px rgba(0,0,0,0.08)",
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      <CardContent
        sx={{
          p: {
            xs: 2,
            sm: 3,
            md: 4,
          },
        }}
      >
        {/* ============================
            FORM HEADER
        ============================ */}

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ mb: 1 }}
          >
            {application.applicationType} Application
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Please provide the required information
            and supporting documents to submit your
            application.
          </Typography>
        </Box>

        {/* ============================
            LOADING
        ============================ */}

        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 6,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {/* ============================
            ERROR
        ============================ */}

        {!loading && error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        {/* ============================
            SECTIONS
        ============================ */}

        {!loading &&
          !error &&
          Object.values(groupedSections).map(
            (section, index) => (
              <Box
                key={section.id}
                sx={{
                  mb:
                    index ===
                    Object.values(
                      groupedSections
                    ).length -
                      1
                      ? 0
                      : 4,
                }}
              >
                {/* Section separator */}

                {index > 0 && (
                  <Divider
                    sx={{ mb: 4 }}
                  />
                )}

                {/* Section heading */}

                <Box
                  sx={{
                    mb: 3,
                    pl: 2,
                    borderLeft:
                      "4px solid",
                    borderColor:
                      "primary.main",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    {section.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Please provide the
                    information requested
                    in this section.
                  </Typography>
                </Box>

                {/* Fields */}

                <Grid
                  container
                  spacing={3}
                >
                  {section.fields.map(
                    (field) => {
                      const type = (
                        field.fieldType ||
                        field.field_type ||
                        "TEXT"
                      ).toUpperCase();

                      return (
                        <Grid
                          key={field.id}
                          size={{
                            xs: 12,
                            md:
                              type ===
                                "TEXTAREA" ||
                              type === "FILE"
                                ? 12
                                : 6,
                          }}
                        >
                          {renderField(field)}
                        </Grid>
                      );
                    }
                  )}
                </Grid>
              </Box>
            )
          )}

        {/* ============================
            NO FIELDS
        ============================ */}

        {!loading &&
          !error &&
          fields.length === 0 && (
            <Alert severity="info">
              No application fields are
              currently configured for this
              service.
            </Alert>
          )}
      </CardContent>
    </Card>
  );
}

export default DynamicForm;
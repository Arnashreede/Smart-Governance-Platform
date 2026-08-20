import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Button,
    CircularProgress,
    Alert,
    Divider,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import { getServiceById } from "../services/governmentService";
import { getFormFields } from "../services/serviceFormFieldService";

function ServiceApplicationForm() {

    const { serviceId } = useParams();
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [fields, setFields] = useState([]);
    const [formData, setFormData] = useState({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadForm();
    }, [serviceId]);

    const loadForm = async () => {

        try {

            setLoading(true);
            setError("");

            const serviceData =
                await getServiceById(serviceId);

            const fieldData =
                await getFormFields(serviceId);

            setService(serviceData);
            setFields(fieldData || []);

        } catch (error) {

            console.error(
                "Failed to load application form:",
                error
            );

            setError(
                "Failed to load application form."
            );

        } finally {

            setLoading(false);

        }
    };

    const handleChange = (field, value) => {

        setFormData((previous) => ({
            ...previous,
            [field.id]: value,
        }));

    };

    const renderField = (field) => {

        const value =
            formData[field.id] ?? "";

        switch (field.fieldType) {

            case "TEXT":

                return (
                    <TextField
                        fullWidth
                        label={field.fieldName}
                        value={value}
                        placeholder={field.placeholder || ""}
                        required={field.required}
                        onChange={(e) =>
                            handleChange(
                                field,
                                e.target.value
                            )
                        }
                    />
                );

            case "NUMBER":

                return (
                    <TextField
                        fullWidth
                        type="number"
                        label={field.fieldName}
                        value={value}
                        placeholder={field.placeholder || ""}
                        required={field.required}
                        onChange={(e) =>
                            handleChange(
                                field,
                                e.target.value
                            )
                        }
                    />
                );

            case "EMAIL":

                return (
                    <TextField
                        fullWidth
                        type="email"
                        label={field.fieldName}
                        value={value}
                        placeholder={field.placeholder || ""}
                        required={field.required}
                        onChange={(e) =>
                            handleChange(
                                field,
                                e.target.value
                            )
                        }
                    />
                );

            case "PHONE":

                return (
                    <TextField
                        fullWidth
                        type="tel"
                        label={field.fieldName}
                        value={value}
                        placeholder={field.placeholder || ""}
                        required={field.required}
                        onChange={(e) =>
                            handleChange(
                                field,
                                e.target.value
                            )
                        }
                    />
                );

            case "DATE":

                return (
                    <TextField
                        fullWidth
                        type="date"
                        label={field.fieldName}
                        value={value}
                        required={field.required}
                        onChange={(e) =>
                            handleChange(
                                field,
                                e.target.value
                            )
                        }
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                );

            case "TEXTAREA":

                return (
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label={field.fieldName}
                        value={value}
                        placeholder={field.placeholder || ""}
                        required={field.required}
                        onChange={(e) =>
                            handleChange(
                                field,
                                e.target.value
                            )
                        }
                    />
                );

            case "DROPDOWN":

                return (
                    <TextField
                        select
                        fullWidth
                        label={field.fieldName}
                        value={value}
                        required={field.required}
                        onChange={(e) =>
                            handleChange(
                                field,
                                e.target.value
                            )
                        }
                    >

                        <MenuItem value="">
                            Select {field.fieldName}
                        </MenuItem>

                        {(field.options || "")
                            .split(",")
                            .map((option) => {

                                const cleanOption =
                                    option.trim();

                                if (!cleanOption) {
                                    return null;
                                }

                                return (
                                    <MenuItem
                                        key={cleanOption}
                                        value={cleanOption}
                                    >
                                        {cleanOption}
                                    </MenuItem>
                                );
                            })}

                    </TextField>
                );

            case "CHECKBOX":

                return (
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={
                                    value === true
                                }
                                onChange={(e) =>
                                    handleChange(
                                        field,
                                        e.target.checked
                                    )
                                }
                            />
                        }
                        label={field.fieldName}
                    />
                );

            case "FILE":

                return (
                    <Box>

                        <Typography
                            variant="subtitle2"
                            sx={{ mb: 1 }}
                        >
                            {field.fieldName}
                            {field.required && " *"}
                        </Typography>

                        <Button
                            variant="outlined"
                            component="label"
                        >
                            Choose File

                            <input
                                hidden
                                type="file"
                                onChange={(e) =>
                                    handleChange(
                                        field,
                                        e.target.files?.[0] || null
                                    )
                                }
                            />
                        </Button>

                        {value?.name && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 1 }}
                            >
                                {value.name}
                            </Typography>
                        )}

                    </Box>
                );

            default:

                return (
                    <TextField
                        fullWidth
                        label={field.fieldName}
                        value={value}
                        required={field.required}
                        onChange={(e) =>
                            handleChange(
                                field,
                                e.target.value
                            )
                        }
                    />
                );
        }
    };

    const handleSubmit = (event) => {

        event.preventDefault();

        console.log(
            "APPLICATION DATA:",
            formData
        );

        alert(
            "Form data collected successfully."
        );

    };

    if (loading) {

        return (
            <Box
                sx={{
                    ml: "270px",
                    minHeight: "100vh",
                    bgcolor: "#F5F7FA",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {

        return (
            <Box
                sx={{
                    ml: "270px",
                    p: 4,
                    minHeight: "100vh",
                    bgcolor: "#F5F7FA",
                }}
            >
                <Header />

                <Alert
                    severity="error"
                    sx={{ mt: 4 }}
                >
                    {error}
                </Alert>
            </Box>
        );
    }

    return (

        <Box
            sx={{
                ml: "270px",
                p: 4,
                minHeight: "100vh",
                bgcolor: "#F5F7FA",
            }}
        >

            <Header />

            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() =>
                    navigate(-1)
                }
                sx={{
                    mt: 3,
                    mb: 3,
                }}
            >
                Back
            </Button>

            <Card
                sx={{
                    maxWidth: 900,
                    mx: "auto",
                    borderRadius: 4,
                }}
            >

                <CardContent sx={{ p: 4 }}>

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        {service?.name}
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        {service?.description ||
                            "Please provide the required information."}
                    </Typography>

                    {service?.eligibility && (

                        <Alert
                            severity="info"
                            sx={{ mt: 3 }}
                        >
                            <strong>
                                Eligibility:
                            </strong>{" "}
                            {service.eligibility}
                        </Alert>

                    )}

                    <Divider
                        sx={{ my: 4 }}
                    />

                    {fields.length === 0 ? (

                        <Alert severity="warning">
                            No application fields have
                            been configured for this
                            service yet.
                        </Alert>

                    ) : (

                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                        >

                            {fields.map((field) => (

                                <Box
                                    key={field.id}
                                    sx={{ mb: 3 }}
                                >
                                    {renderField(field)}
                                </Box>

                            ))}

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                sx={{
                                    mt: 2,
                                    borderRadius: 2,
                                }}
                            >
                                Submit Application
                            </Button>

                        </Box>

                    )}

                </CardContent>

            </Card>

        </Box>
    );
}

export default ServiceApplicationForm;
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    TextField,
    MenuItem,
    FormControlLabel,
    Checkbox,
    IconButton,
    Divider,
    Chip,
    Alert,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";

import Header from "../components/Header";

import {
    getAllServices,
} from "../services/governmentService";

import {
    getFormFields,
    addFormField,
    updateFormField,
    deleteFormField,
} from "../services/serviceFormFieldService";


function ServiceFormBuilder() {

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const serviceId = searchParams.get("serviceId");


    // ============================
    // STATE
    // ============================

    const [services, setServices] = useState([]);

    const [selectedService, setSelectedService] = useState(null);

    const [fields, setFields] = useState([]);

    const [showForm, setShowForm] = useState(false);

    const [editingField, setEditingField] = useState(null);

    const [fieldName, setFieldName] = useState("");

    const [fieldType, setFieldType] = useState("TEXT");

    const [required, setRequired] = useState(false);

    const [placeholder, setPlaceholder] = useState("");

    const [options, setOptions] = useState("");

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");


    // ============================
    // LOAD SERVICES
    // ============================

    useEffect(() => {

        loadServices();

    }, [serviceId]);


    const loadServices = async () => {

        try {

            const data = await getAllServices();

            const serviceList = data || [];

            setServices(serviceList);


            // --------------------------------
            // OPEN SERVICE FROM URL
            // --------------------------------

            if (serviceId) {

                const service = serviceList.find(
                    (item) =>
                        Number(item.id) === Number(serviceId)
                );


                if (service) {

                    setSelectedService(service);

                    setShowForm(false);

                    setEditingField(null);


                    try {

                        const fieldData =
                            await getFormFields(service.id);

                        setFields(fieldData || []);

                    } catch (error) {

                        console.error(
                            "Failed to load form fields:",
                            error
                        );

                        setFields([]);

                        setMessage(
                            "Failed to load form fields."
                        );
                    }

                } else {

                    setMessage(
                        "Service not found."
                    );

                }

            }

        } catch (error) {

            console.error(
                "Failed to load services:",
                error
            );

            setMessage(
                "Failed to load services."
            );
        }
    };


    // ============================
    // SELECT SERVICE
    // ============================

    const selectService = async (service) => {

        setSelectedService(service);

        setShowForm(false);

        setEditingField(null);

        setMessage("");


        try {

            const data =
                await getFormFields(service.id);

            setFields(data || []);

        } catch (error) {

            console.error(
                "Failed to load form fields:",
                error
            );

            setFields([]);

            setMessage(
                "Failed to load form fields."
            );
        }
    };


    // ============================
    // RESET FORM
    // ============================

    const resetForm = () => {

        setFieldName("");

        setFieldType("TEXT");

        setRequired(false);

        setPlaceholder("");

        setOptions("");

        setEditingField(null);

        setShowForm(false);
    };


    // ============================
    // ADD FIELD
    // ============================

    const handleAddField = async () => {

        if (!fieldName.trim()) {

            setMessage(
                "Please enter a field name."
            );

            return;
        }


        if (!selectedService) {

            setMessage(
                "Please select a service."
            );

            return;
        }


        setLoading(true);

        setMessage("");


        try {

            const newField = {

                fieldName:
                    fieldName.trim(),

                fieldType,

                required,

                placeholder,

                options:
                    fieldType === "DROPDOWN"
                        ? options
                        : "",

                fieldOrder:
                    fields.length + 1,
            };


            await addFormField(
                selectedService.id,
                newField
            );


            const updatedFields =
                await getFormFields(
                    selectedService.id
                );


            setFields(
                updatedFields || []
            );


            resetForm();


            setMessage(
                "Form field added successfully."
            );

        } catch (error) {

            console.error(
                "Failed to add form field:",
                error
            );

            setMessage(
                "Failed to add form field."
            );

        } finally {

            setLoading(false);
        }
    };


    // ============================
    // EDIT FIELD
    // ============================

    const handleEdit = (field) => {

        setEditingField(field);

        setFieldName(
            field.fieldName || ""
        );

        setFieldType(
            field.fieldType || "TEXT"
        );

        setRequired(
            field.required || false
        );

        setPlaceholder(
            field.placeholder || ""
        );

        setOptions(
            field.options || ""
        );

        setShowForm(true);

        setMessage("");
    };


    // ============================
    // UPDATE FIELD
    // ============================

    const handleUpdateField = async () => {

        if (!fieldName.trim()) {

            setMessage(
                "Please enter a field name."
            );

            return;
        }


        setLoading(true);

        setMessage("");


        try {

            const updatedField = {

                fieldName:
                    fieldName.trim(),

                fieldType,

                required,

                placeholder,

                options:
                    fieldType === "DROPDOWN"
                        ? options
                        : "",

                fieldOrder:
                    editingField.fieldOrder,
            };


            await updateFormField(
                editingField.id,
                updatedField
            );


            const updatedFields =
                await getFormFields(
                    selectedService.id
                );


            setFields(
                updatedFields || []
            );


            resetForm();


            setMessage(
                "Form field updated successfully."
            );

        } catch (error) {

            console.error(
                "Failed to update form field:",
                error
            );

            setMessage(
                "Failed to update form field."
            );

        } finally {

            setLoading(false);
        }
    };


    // ============================
    // DELETE FIELD
    // ============================

    const handleDelete = async (fieldId) => {

        if (
            !window.confirm(
                "Are you sure you want to delete this field?"
            )
        ) {
            return;
        }


        try {

            await deleteFormField(
                fieldId
            );


            const updatedFields =
                await getFormFields(
                    selectedService.id
                );


            setFields(
                updatedFields || []
            );


            setMessage(
                "Form field deleted successfully."
            );

        } catch (error) {

            console.error(
                "Failed to delete form field:",
                error
            );

            setMessage(
                "Failed to delete form field."
            );
        }
    };


    // ============================
    // PREVIEW FORM
    // ============================

    const handlePreview = () => {

        if (!selectedService) {
            return;
        }


        navigate(
            `/service-application/${selectedService.id}`
        );
    };


    // ============================
    // BACK TO SERVICE MANAGEMENT
    // ============================

    const handleBackToServiceManagement = () => {

        navigate("/admin/services");
    };


    // ============================
    // BACK TO SERVICE LIST
    // ============================

    const handleBackToServices = () => {

        setSelectedService(null);

        resetForm();

        setMessage("");

        navigate("/service-form-builder");
    };


    // ============================
    // UI
    // ============================

    return (

        <Box
            sx={{
                ml: "270px",
                p: 4,
                bgcolor: "#F5F7FA",
                minHeight: "100vh",
            }}
        >

            <Header />


            {/* ============================
                PAGE HEADER
            ============================ */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                }}
            >

                <Typography
                    variant="h4"
                    fontWeight="bold"
                >
                    Application Form Builder
                </Typography>


                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={
                        handleBackToServiceManagement
                    }
                >
                    Back to Service Management
                </Button>

            </Box>


            <Typography
                color="text.secondary"
                mb={4}
            >
                Create and manage application forms
                for government services.
            </Typography>


            {/* ============================
                MESSAGE
            ============================ */}

            {message && (

                <Alert
                    severity={
                        message.includes(
                            "successfully"
                        )
                            ? "success"
                            : "error"
                    }
                    sx={{ mb: 3 }}
                    onClose={() =>
                        setMessage("")
                    }
                >
                    {message}
                </Alert>

            )}


            {/* ==================================================
                NO SERVICE SELECTED
            ================================================== */}

            {!selectedService ? (

                <>

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        mb={2}
                    >
                        Select a Service
                    </Typography>


                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fill, minmax(280px, 1fr))",
                            gap: 3,
                        }}
                    >

                        {services.map(
                            (service) => (

                                <Card
                                    key={service.id}
                                    sx={{
                                        borderRadius: 3,
                                        cursor: "pointer",
                                        transition:
                                            "0.2s",

                                        "&:hover": {
                                            transform:
                                                "translateY(-4px)",
                                            boxShadow: 5,
                                        },
                                    }}

                                    onClick={() =>
                                        selectService(
                                            service
                                        )
                                    }
                                >

                                    <CardContent>

                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                        >
                                            {service.name}
                                        </Typography>


                                        <Chip
                                            label={
                                                service.serviceType
                                            }
                                            size="small"
                                            sx={{
                                                mt: 1,
                                            }}
                                        />


                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            mt={2}
                                        >
                                            {service.description ||
                                                "No description available."}
                                        </Typography>


                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            sx={{
                                                mt: 3,
                                            }}

                                            onClick={(
                                                event
                                            ) => {

                                                event.stopPropagation();

                                                selectService(
                                                    service
                                                );
                                            }}
                                        >
                                            Manage Form
                                        </Button>

                                    </CardContent>

                                </Card>

                            )
                        )}

                    </Box>

                </>

            ) : (

                <>

                    {/* ============================
                        SELECTED SERVICE HEADER
                    ============================ */}

                    <Card
                        sx={{
                            borderRadius: 3,
                            mb: 3,
                        }}
                    >

                        <CardContent>

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems:
                                        "flex-start",
                                    gap: 2,
                                }}
                            >

                                <Box>

                                    <Typography
                                        variant="h5"
                                        fontWeight="bold"
                                    >
                                        {selectedService.name}
                                    </Typography>


                                    <Typography
                                        color="text.secondary"
                                        mt={1}
                                    >
                                        {selectedService.description ||
                                            "No description available."}
                                    </Typography>


                                    <Chip
                                        label={
                                            selectedService.serviceType
                                        }
                                        sx={{
                                            mt: 2,
                                        }}
                                    />

                                </Box>


                                <Button
                                    variant="outlined"
                                    startIcon={
                                        <VisibilityIcon />
                                    }
                                    onClick={
                                        handlePreview
                                    }
                                >
                                    Preview Form
                                </Button>

                            </Box>

                        </CardContent>

                    </Card>


                    {/* ============================
                        FORM FIELDS
                    ============================ */}

                    <Card
                        sx={{
                            borderRadius: 3,
                            mb: 3,
                        }}
                    >

                        <CardContent>

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems:
                                        "center",
                                    mb: 2,
                                }}
                            >

                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                >
                                    Application Form Fields
                                </Typography>


                                {!showForm && (

                                    <Button
                                        variant="contained"
                                        startIcon={
                                            <AddIcon />
                                        }
                                        onClick={() =>
                                            setShowForm(
                                                true
                                            )
                                        }
                                    >
                                        Add Form Field
                                    </Button>

                                )}

                            </Box>


                            <Divider
                                sx={{
                                    mb: 3,
                                }}
                            />


                            {/* ============================
                                NO FIELDS
                            ============================ */}

                            {fields.length === 0 ? (

                                <Box
                                    sx={{
                                        textAlign:
                                            "center",
                                        py: 5,
                                    }}
                                >

                                    <Typography
                                        color="text.secondary"
                                        mb={2}
                                    >
                                        No form fields have
                                        been added yet.
                                    </Typography>


                                    <Button
                                        variant="contained"
                                        startIcon={
                                            <AddIcon />
                                        }
                                        onClick={() =>
                                            setShowForm(
                                                true
                                            )
                                        }
                                    >
                                        Add First Field
                                    </Button>

                                </Box>

                            ) : (

                                /* ============================
                                   FIELD LIST
                                ============================ */

                                fields
                                    .sort(
                                        (a, b) =>
                                            a.fieldOrder -
                                            b.fieldOrder
                                    )
                                    .map(
                                        (field) => (

                                            <Box
                                                key={
                                                    field.id
                                                }
                                                sx={{
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "space-between",
                                                    p: 2,
                                                    mb: 2,
                                                    border:
                                                        "1px solid #E0E0E0",
                                                    borderRadius:
                                                        2,
                                                    bgcolor:
                                                        "#FAFAFA",
                                                }}
                                            >

                                                <Box>

                                                    <Typography
                                                        fontWeight="bold"
                                                    >
                                                        {
                                                            field.fieldOrder
                                                        }
                                                        .{" "}
                                                        {
                                                            field.fieldName
                                                        }
                                                    </Typography>


                                                    <Box
                                                        sx={{
                                                            display:
                                                                "flex",
                                                            gap: 1,
                                                            mt: 1,
                                                            flexWrap:
                                                                "wrap",
                                                        }}
                                                    >

                                                        <Chip
                                                            label={
                                                                field.fieldType
                                                            }
                                                            size="small"
                                                        />


                                                        {field.required && (

                                                            <Chip
                                                                label="Required"
                                                                size="small"
                                                                color="error"
                                                            />

                                                        )}

                                                    </Box>


                                                    {field.placeholder && (

                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                mt: 1,
                                                            }}
                                                        >
                                                            Placeholder:{" "}
                                                            {
                                                                field.placeholder
                                                            }
                                                        </Typography>

                                                    )}

                                                    {field.fieldType ===
                                                        "DROPDOWN" &&
                                                        field.options && (

                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{
                                                                    mt: 1,
                                                                }}
                                                            >
                                                                Options:{" "}
                                                                {
                                                                    field.options
                                                                }
                                                            </Typography>

                                                        )}

                                                </Box>


                                                <Box>

                                                    <IconButton
                                                        color="primary"
                                                        onClick={() =>
                                                            handleEdit(
                                                                field
                                                            )
                                                        }
                                                    >
                                                        <EditIcon />
                                                    </IconButton>


                                                    <IconButton
                                                        color="error"
                                                        onClick={() =>
                                                            handleDelete(
                                                                field.id
                                                            )
                                                        }
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>

                                                </Box>

                                            </Box>

                                        )
                                    )

                            )}

                        </CardContent>

                    </Card>


                    {/* ============================
                        ADD / EDIT FORM
                    ============================ */}

                    {showForm && (

                        <Card
                            sx={{
                                borderRadius: 3,
                                mb: 3,
                            }}
                        >

                            <CardContent>

                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    mb={3}
                                >
                                    {editingField
                                        ? "Edit Form Field"
                                        : "Add Form Field"}
                                </Typography>


                                {/* FIELD NAME */}

                                <TextField
                                    fullWidth
                                    label="Field Name"
                                    value={fieldName}
                                    onChange={(e) =>
                                        setFieldName(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Example: Applicant Name"
                                    sx={{
                                        mb: 3,
                                    }}
                                />


                                {/* FIELD TYPE */}

                                <TextField
                                    select
                                    fullWidth
                                    label="Field Type"
                                    value={fieldType}
                                    onChange={(e) =>
                                        setFieldType(
                                            e.target.value
                                        )
                                    }
                                    sx={{
                                        mb: 3,
                                    }}
                                >

                                    <MenuItem value="TEXT">
                                        Text
                                    </MenuItem>

                                    <MenuItem value="NUMBER">
                                        Number
                                    </MenuItem>

                                    <MenuItem value="EMAIL">
                                        Email
                                    </MenuItem>

                                    <MenuItem value="PHONE">
                                        Phone
                                    </MenuItem>

                                    <MenuItem value="DATE">
                                        Date
                                    </MenuItem>

                                    <MenuItem value="DROPDOWN">
                                        Dropdown
                                    </MenuItem>

                                    <MenuItem value="TEXTAREA">
                                        Long Text
                                    </MenuItem>

                                    <MenuItem value="FILE">
                                        File Upload
                                    </MenuItem>

                                    <MenuItem value="CHECKBOX">
                                        Checkbox
                                    </MenuItem>

                                </TextField>


                                {/* PLACEHOLDER */}

                                <TextField
                                    fullWidth
                                    label="Placeholder"
                                    value={placeholder}
                                    onChange={(e) =>
                                        setPlaceholder(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Example: Enter applicant name"
                                    sx={{
                                        mb: 2,
                                    }}
                                />


                                {/* DROPDOWN OPTIONS */}

                                {fieldType ===
                                    "DROPDOWN" && (

                                    <TextField
                                        fullWidth
                                        label="Dropdown Options"
                                        value={options}
                                        onChange={(e) =>
                                            setOptions(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Male,Female,Other"
                                        helperText="Separate options with commas."
                                        sx={{
                                            mb: 2,
                                        }}
                                    />

                                )}


                                {/* REQUIRED */}

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                required
                                            }
                                            onChange={(e) =>
                                                setRequired(
                                                    e.target
                                                        .checked
                                                )
                                            }
                                        />
                                    }
                                    label="Required field"
                                />


                                {/* BUTTONS */}

                                <Box
                                    sx={{
                                        display:
                                            "flex",
                                        gap: 2,
                                        mt: 3,
                                    }}
                                >

                                    <Button
                                        variant="outlined"
                                        onClick={
                                            resetForm
                                        }
                                    >
                                        Cancel
                                    </Button>


                                    <Button
                                        variant="contained"
                                        onClick={
                                            editingField
                                                ? handleUpdateField
                                                : handleAddField
                                        }
                                        disabled={
                                            loading
                                        }
                                    >

                                        {loading
                                            ? "Saving..."
                                            : editingField
                                            ? "Update Field"
                                            : "Add Field"}

                                    </Button>

                                </Box>

                            </CardContent>

                        </Card>

                    )}


                    {/* ============================
                        BOTTOM ACTIONS
                    ============================ */}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems: "center",
                            mt: 3,
                        }}
                    >

                        <Button
                            startIcon={
                                <ArrowBackIcon />
                            }
                            onClick={
                                handleBackToServices
                            }
                        >
                            Back to Services
                        </Button>


                        <Button
                            variant="contained"
                            size="large"
                            startIcon={
                                <VisibilityIcon />
                            }
                            onClick={
                                handlePreview
                            }
                            disabled={
                                fields.length === 0
                            }
                        >
                            Preview Application Form
                        </Button>

                    </Box>

                </>

            )}

        </Box>
    );
}


export default ServiceFormBuilder;
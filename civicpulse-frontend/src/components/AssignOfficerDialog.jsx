import { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    MenuItem,
    TextField,
    Chip,
    Divider
} from "@mui/material";

import {
    getOfficersByDepartment
} from "../services/officerService";

import {
    assignOfficer
} from "../services/assignService";

function AssignOfficerDialog({

    open,
    grievance,
    onClose

}) {

    const [officers, setOfficers] = useState([]);

const [assignedOfficer, setAssignedOfficer] = useState("");
    const [priority, setPriority] = useState("MEDIUM");

    const [status, setStatus] = useState("IN_PROGRESS");

    useEffect(() => {

        if (grievance) {

    loadOfficers(grievance.department);

    setAssignedOfficer(
        grievance.assignedOfficer || ""
    );

            setPriority(
                grievance.priority || "MEDIUM"
            );

            setStatus(
                grievance.status || "OPEN"
            );

        }

    }, [grievance]);

    const loadOfficers = async (department) => {

    if (!department) {
        setOfficers([]);
        return;
    }

    try {

        const data = await getOfficersByDepartment(
            encodeURIComponent(department)
        );

        setOfficers(data || []);

    } catch (error) {

        console.error("Failed to load officers:", error);
        setOfficers([]);

    }
};

    const handleAssign = async () => {

    try {

        const selectedOfficer = officers.find(
            (officer) => String(officer.id) === String(assignedOfficer)
        );

        if (!selectedOfficer) {
            alert("Please select an officer");
            return;
        }

        await assignOfficer(grievance.id, {

            officerId: selectedOfficer.id,

            assignedOfficer: selectedOfficer.fullName,

            priority,

            status

        });

        alert("Officer Assigned Successfully");

        onClose();

    } catch (error) {

        console.error("Assignment failed:", error);

        alert(
            error.response?.data?.message ||
            "Assignment Failed"
        );

    }

};

    if (!grievance) return null;

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>

                Assign Officer

            </DialogTitle>

            <DialogContent>

                <Grid container spacing={2} mt={1}>

                    <Grid item xs={12}>

                        <Typography variant="subtitle2">

                            Complaint

                        </Typography>

                        <Typography>

                            {grievance.title}

                        </Typography>

                    </Grid>

                    <Grid item xs={12}>

                        <Typography variant="subtitle2">

                            Department

                        </Typography>

                        <Chip
    color="primary"
    label={grievance.department || "Department not assigned"}
/>

                    </Grid>

                </Grid>

                <Divider sx={{ my: 3 }} />

                <TextField
    select
    fullWidth
    label="Select Officer"
    value={assignedOfficer}
    onChange={(e) => setAssignedOfficer(e.target.value)}
    sx={{ mb: 3 }}
>
    {officers.map((officer) => (
        <MenuItem
            key={officer.id}
            value={officer.id}
        >
            {officer.fullName}
            {" — "}
            {officer.designation}
        </MenuItem>
    ))}
</TextField>

                <TextField
                    select
                    fullWidth
                    label="Priority"
                    value={priority}
                    onChange={(e) =>
                        setPriority(e.target.value)
                    }
                    sx={{ mb: 3 }}
                >

                    <MenuItem value="HIGH">

                        HIGH

                    </MenuItem>

                    <MenuItem value="MEDIUM">

                        MEDIUM

                    </MenuItem>

                    <MenuItem value="LOW">

                        LOW

                    </MenuItem>

                </TextField>

                <TextField
                    select
                    fullWidth
                    label="Status"
                    value={status}
                    onChange={(e) =>
                        setStatus(e.target.value)
                    }
                >

                    <MenuItem value="OPEN">

                        OPEN

                    </MenuItem>

                    <MenuItem value="IN_PROGRESS">

                        IN PROGRESS

                    </MenuItem>

                    <MenuItem value="RESOLVED">

                        RESOLVED

                    </MenuItem>

                </TextField>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleAssign}
                >
                    Assign Officer
                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default AssignOfficerDialog;
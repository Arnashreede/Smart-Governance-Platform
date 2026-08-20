import {
    Card,
    CardContent,
    Typography,
    Stack,
    Button
} from "@mui/material";

import {
    AddCircle,
    Assignment,
    Groups,
    Assessment
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

export default function QuickActions() {

    const navigate = useNavigate();

    return (

        <Card sx={{ height: "100%" }}>

            <CardContent>

                <Typography
                    variant="h6"
                    gutterBottom>

                    Quick Actions

                </Typography>

                <Stack spacing={2} sx={{ mt: 2 }}>

                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<AddCircle />}
                        onClick={() => navigate("/admin/welfare/add")}
                    >
                        Add Welfare Scheme
                    </Button>

                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Assignment />}
                        onClick={() => navigate("/admin/welfare/applications")}
                    >
                        Welfare Applications
                    </Button>

                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Groups />}
                        onClick={() => navigate("/admin/welfare/beneficiaries")}
                    >
                        Beneficiaries
                    </Button>

                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Assessment />}
                        onClick={() => navigate("/admin/welfare/reports")}
                    >
                        Reports
                    </Button>

                </Stack>

            </CardContent>

        </Card>

    );

}
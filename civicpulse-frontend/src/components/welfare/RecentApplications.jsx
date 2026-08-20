import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAllApplications } from "../../api/welfareApplicationApi";



const columns = [
    {
       field: "applicationNumber",
        headerName: "Application No",
        flex: 1.4
    },
    {
        field: "fullName",
        headerName: "Citizen",
        flex: 1.3
    },
    {
        field: "schemeName",
        headerName: "Scheme",
        flex: 1.5
    },
    {
        field: "status",
        headerName: "Status",
        flex: 1,
        renderCell: (params) => (
            <Chip
                label={params.value}
                color={
                    params.value === "APPROVED"
                        ? "success"
                        : params.value === "REJECTED"
                        ? "error"
                        : "warning"
                }
                size="small"
            />
        )
    },
    {
        field: "date",
        headerName: "Date",
        flex: 1
    },
    {
        field: "action",
        headerName: "Action",
        flex: 1,
        sortable: false,
        renderCell: () => (
           <Button
    variant="contained"
    size="small"
    onClick={() =>
        navigate(`/admin/welfare/application/${params.row.id}`)
    }
>
    View
</Button>
        )
    }
];
export default function RecentApplications() {

    const navigate = useNavigate();

    const [rows, setRows] = useState([]);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {

        try {

            const response = await getAllApplications();

            setRows(response.data);

        } catch (error) {

            console.error(error);

        }

    };

    return (

        <Card sx={{ mt: 3 }}>

            <CardContent>

                <Typography
                    variant="h6"
                    gutterBottom>

                    Recent Applications

                </Typography>

                <DataGrid
                    rows={rows}
                    columns={columns}
                    autoHeight
                    pageSizeOptions={[5,10]}
                    disableRowSelectionOnClick
                />

            </CardContent>

        </Card>

    );

}
import { useEffect, useMemo, useState } from "react";
import {
  getAllApplications,
  approveApplication,
  rejectApplication,
  verifyApplication,
  getDocumentPreviewUrl,
} from "../services/applicationService";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  Grid,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

function OfficerApplicationDashboard() {
  const [applications, setApplications] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [serviceFilter, setServiceFilter] = useState("ALL");

  const [openPreview, setOpenPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
const [zoom, setZoom] = useState(1);
const [isPdf, setIsPdf] = useState(false);
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await getAllApplications();

      if (Array.isArray(data)) {
        setApplications(data);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.error(err);
      setApplications([]);
    }
  };

  const handlePreviewDocument = (id) => {
    setZoom(1);
    setPreviewUrl(getDocumentPreviewUrl(id));
    setOpenPreview(true);
  };
const [selectedDocuments, setSelectedDocuments] = useState([]);
const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
const handlePreviousDocument = () => {
    if (currentDocumentIndex > 0) {
        const newIndex = currentDocumentIndex - 1;
        setCurrentDocumentIndex(newIndex);
        handlePreviewDocument(selectedDocuments[newIndex].id);
    }
};

const handleNextDocument = () => {
    if (currentDocumentIndex < selectedDocuments.length - 1) {
        const newIndex = currentDocumentIndex + 1;
        setCurrentDocumentIndex(newIndex);
        handlePreviewDocument(selectedDocuments[newIndex].id);
    }
};
  const handleVerify = async (id) => {
    try {
      await verifyApplication(id);
      alert("Application Verified");
      loadApplications();
    } catch {
      alert("Verification Failed");
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveApplication(id);
      alert("Application Approved");
      loadApplications();
    } catch (err) {
      alert(err.response?.data || "Approval Failed");
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason");

    if (!reason) return;

    try {
      await rejectApplication(id, reason);
      alert("Application Rejected");
      loadApplications();
    } catch {
      alert("Rejection Failed");
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.applicantName
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        app.applicationType
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || app.status === statusFilter;

      const matchesService =
        serviceFilter === "ALL" ||
        app.applicationType === serviceFilter;

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [applications, search, statusFilter, serviceFilter]);

  const total = applications.length;

  const submitted = applications.filter(
    (a) => a.status === "SUBMITTED"
  ).length;

  const verified = applications.filter(
    (a) => a.status === "VERIFIED"
  ).length;

  const approved = applications.filter(
    (a) => a.status === "APPROVED"
  ).length;

  const rejected = applications.filter(
    (a) => a.status === "REJECTED"
  ).length;
  return (
<Box sx={{ p: 4, background: "#f5f7fb", minHeight: "100vh" }}>

<Typography
variant="h4"
fontWeight="bold"
mb={3}
color="#1565c0"
>
Application Management Dashboard
</Typography>

<Grid container spacing={3} mb={4}>

<Grid item xs={12} md={2.4}>
<Card>
<CardContent>
<Typography variant="h6">Total</Typography>
<Typography variant="h4">{total}</Typography>
</CardContent>
</Card>
</Grid>

<Grid item xs={12} md={2.4}>
<Card>
<CardContent>
<Typography variant="h6">Submitted</Typography>
<Typography variant="h4" color="warning.main">
{submitted}
</Typography>
</CardContent>
</Card>
</Grid>

<Grid item xs={12} md={2.4}>
<Card>
<CardContent>
<Typography variant="h6">Verified</Typography>
<Typography variant="h4" color="info.main">
{verified}
</Typography>
</CardContent>
</Card>
</Grid>

<Grid item xs={12} md={2.4}>
<Card>
<CardContent>
<Typography variant="h6">Approved</Typography>
<Typography variant="h4" color="success.main">
{approved}
</Typography>
</CardContent>
</Card>
</Grid>

<Grid item xs={12} md={2.4}>
<Card>
<CardContent>
<Typography variant="h6">Rejected</Typography>
<Typography variant="h4" color="error.main">
{rejected}
</Typography>
</CardContent>
</Card>
</Grid>

</Grid>

<Paper sx={{ p:3, mb:3 }}>

<Grid container spacing={2}>

<Grid item xs={12} md={5}>
<TextField
fullWidth
label="Search Applicant / Service"
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>
</Grid>

<Grid item xs={12} md={3}>
<FormControl fullWidth>

<InputLabel>Status</InputLabel>

<Select
value={statusFilter}
label="Status"
onChange={(e)=>setStatusFilter(e.target.value)}
>

<MenuItem value="ALL">All</MenuItem>
<MenuItem value="SUBMITTED">Submitted</MenuItem>
<MenuItem value="VERIFIED">Verified</MenuItem>
<MenuItem value="APPROVED">Approved</MenuItem>
<MenuItem value="REJECTED">Rejected</MenuItem>

</Select>

</FormControl>
</Grid>

<Grid size={{ xs: 12, md: 4 }}>
    
<FormControl fullWidth>

<InputLabel>Service</InputLabel>

<Select
value={serviceFilter}
label="Service"
onChange={(e)=>setServiceFilter(e.target.value)}
>

<MenuItem value="ALL">All</MenuItem>

{[
...new Set(
applications.map(
(a)=>a.applicationType
)
)
].map(service=>(
<MenuItem
key={service}
value={service}
>
{service}
</MenuItem>
))}

</Select>

</FormControl>

</Grid>

</Grid>

</Paper>
<Card elevation={3} sx={{ borderRadius: 3 }}>

<CardContent>

<Box sx={{ height: 650, width: "100%" }}>

<DataGrid
rows={filteredApplications}
getRowId={(row) => row.id}
pageSizeOptions={[5,10,20]}
initialState={{
pagination:{
paginationModel:{
pageSize:10,
page:0
}
}
}}
columns={[

{
field:"id",
headerName:"ID",
width:80
},

{
field:"applicantName",
headerName:"Applicant",
flex:1.3
},

{
field:"applicationType",
headerName:"Service",
flex:1.4
},

{
field:"status",
headerName:"Status",
width:140,
renderCell:(params)=>{

let color="warning";

if(params.value==="VERIFIED")
color="info";

if(params.value==="APPROVED")
color="success";

if(params.value==="REJECTED")
color="error";

return(
<Chip
label={params.value}
color={color}
size="small"
/>
);

}
},

{
field:"certificateNumber",
headerName:"Certificate",
flex:1.3,
renderCell:(params)=>params.value||"-"
},

{
field:"documents",
headerName:"Documents",
width:180,
sortable:false,
renderCell:(params)=>{

const docs=params.row.documents||[];

if(docs.length===0)
return(
<Typography variant="body2">
No Documents
</Typography>
);

return(
<Button
    size="small"
    variant="outlined"
    onClick={() => {
        setSelectedDocuments(docs);
        setCurrentDocumentIndex(0);
        handlePreviewDocument(docs[0].id);
    }}
>
    📎 {docs.length} Files
</Button>
);

}
},

{
field:"actions",
headerName:"Actions",
width:420,
sortable:false,
renderCell:(params)=>(

<Stack
direction="row"
spacing={1}
>

<Button
variant="contained"
size="small"
onClick={()=>handleVerify(params.row.id)}
disabled={
params.row.status!=="SUBMITTED"
}
>
Verify
</Button>

<Button
variant="contained"
color="success"
size="small"
onClick={()=>handleApprove(params.row.id)}
disabled={
params.row.status!=="VERIFIED"
}
>
Approve
</Button>

<Button
variant="contained"
color="error"
size="small"
onClick={()=>handleReject(params.row.id)}
disabled={
params.row.status==="APPROVED"||
params.row.status==="REJECTED"
}
>
Reject
</Button>

{params.row.certificateNumber&&(

<Button
variant="outlined"
color="success"
size="small"
onClick={()=>
window.open(
`http://localhost:8089/certificates/${params.row.id}/preview`,
"_blank"
)
}
>

Certificate

</Button>

)}

</Stack>

)

}

]}
/>

</Box>

</CardContent>

</Card>

<Dialog
open={openPreview}
onClose={()=>setOpenPreview(false)}
maxWidth="lg"
fullWidth
>

<DialogTitle>

Document Preview

</DialogTitle>

<DialogContent dividers sx={{ textAlign: "center" }}>

    {isPdf ? (

        <iframe
            src={previewUrl}
            title="preview"
            width="100%"
            height="700"
            style={{ border: "none" }}
        />

    ) : (

        <Box
            sx={{
                overflow: "auto",
                height: 700,
            }}
        >
            <img
                src={previewUrl}
                alt="Document"
                style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: "top center",
                    transition: "0.2s",
                    maxWidth: "100%",
                }}
            />
        </Box>

    )}

</DialogContent>

<DialogActions>

<Button
    onClick={handlePreviousDocument}
    disabled={currentDocumentIndex === 0}
>
    ◀ Previous
</Button>

<Typography sx={{ mx: 2 }}>
    {selectedDocuments.length > 0
        ? `${currentDocumentIndex + 1} / ${selectedDocuments.length}`
        : "0 / 0"}
</Typography>

<Button
    onClick={handleNextDocument}
    disabled={currentDocumentIndex === selectedDocuments.length - 1}
>
    Next ▶
</Button>
<Button onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}>
    Zoom -
</Button>

<Button onClick={() => setZoom((z) => Math.min(3, z + 0.25))}>
    Zoom +
</Button>

<Button onClick={() => setZoom(1)}>
    Reset
</Button>
<Button
    variant="contained"
    onClick={() => window.open(previewUrl, "_blank")}
>
    Download
</Button>

<Button
    variant="outlined"
    onClick={() => setOpenPreview(false)}
>
    Close
</Button>

</DialogActions>

</Dialog>

</Box>
);
}

export default OfficerApplicationDashboard;
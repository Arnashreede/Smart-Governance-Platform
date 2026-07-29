import {
  Box,
  Typography,
  Button,
} from "@mui/material";

function DocumentUpload({
  application,
  info,
  documents,
  setDocuments,
  handleSubmit,
}){

  if (!application.applicationType || !info) return null;

  return (
    <Box
      sx={{
        mt: 3,
        p: 4,
        borderRadius: 3,
        bgcolor: "#f8fbff",
        border: "2px dashed #1976d2",
      }}
    >
      <Typography variant="h6" gutterBottom>
        📎 Upload Required Documents
      </Typography>

      {info.documents.map((doc) => (
        <Box key={doc} sx={{ mb: 3 }}>
          <Typography sx={{ mb: 1 }}>
            📄 {doc}
          </Typography>

          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) =>
              setDocuments({
                ...documents,
                [doc]: e.target.files[0],
              })
            }
          />

          {documents[doc] && (
            <Typography
              sx={{
                color: "green",
                fontWeight: "bold",
                mt: 1,
              }}
            >
              ✔ {documents[doc].name}
            </Typography>
          )}
        </Box>
      ))}

     <Button
  variant="contained"
  fullWidth
  size="large"
  sx={{ mt: 3 }}
  onClick={handleSubmit}
>
  Submit Application
</Button>
    </Box>
  );
}

export default DocumentUpload;
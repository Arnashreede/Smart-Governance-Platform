import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

function PreviewDialog({
  open,
  handleClose,
  fileUrl,
  title = "Preview",
}) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        <iframe
          src={fileUrl}
          title="Preview"
          width="100%"
          height="700"
          style={{
            border: "none",
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          href={fileUrl}
          download
        >
          Download
        </Button>

        <Button
          variant="outlined"
          onClick={handleClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PreviewDialog;
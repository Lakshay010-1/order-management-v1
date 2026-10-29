import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function AlertDialog({
  open,
  title,
  message,
  setDecision,
}: {
  open: boolean;
  title: string;
  message: string;
  setDecision: (val: boolean) => void;
}) {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={() => {
          setDecision(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        role="alertdialog"
      >
        <DialogTitle id="alert-dialog-title" style={{ whiteSpace: "pre-line" }}>
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div style={{ whiteSpace: "pre-line" }}>{message}</div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDecision(false);
            }}
            autoFocus
          >
            Cancel
          </Button>
          <Button
            style={{ color: "red" }}
            onClick={() => {
              setDecision(true);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

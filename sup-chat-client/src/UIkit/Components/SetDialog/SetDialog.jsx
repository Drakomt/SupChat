import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";

export const SetDialog = ({
  action,
  startOpen,
  close,
  data,
  object,
  setObject,
}) => {
  const [input, setInput] = useState(object[data.field]);
  const handleClose = () => {
    close();
  };

  const handleConfirm = () => {
    if (input === object[data.field]) {
      close();
      return;
    }
    action();
    const copy = { ...object };
    copy[data.field] = input;
    setObject(copy);
    close();
  };

  return (
    <div>
      <Dialog open={startOpen} onClose={handleClose}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>{data.field}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            variant="standard"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

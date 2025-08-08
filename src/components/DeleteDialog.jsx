import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import React from "react";

const DeleteDialog = ({
  deleteOpen,
  handleClose,
  handleDelete,
  closeDeleteDialog,
}) => {
  return (
    <Dialog
      open={deleteOpen}
      handleClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>Are Sure Delete</DialogTitle>
      <DialogActions>
        <Button onClick={() => handleDelete(deleteOpen)}>Yes</Button>
        <Button onClick={closeDeleteDialog}>No</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;

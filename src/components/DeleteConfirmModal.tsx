"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  DialogContentText,
  useMediaQuery,
  useTheme,
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<Props> = ({ open, onClose, onConfirm }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm")); // small screen hole fullscreen

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
        ❗ Confirm Deletion
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ textAlign: "center", fontSize: "1rem" }}>
          Are you sure you want to delete this row? <br />
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="primary">
          ❌ Not Sure
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          🗑️ Sure Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmModal;

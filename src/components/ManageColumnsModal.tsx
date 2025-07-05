"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  Checkbox,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleColumn,
  setVisibleColumns,
} from "../features/table/visibleColumnsSlice";
import { RootState } from "../app/store";
import toast from "react-hot-toast";

const defaultColumns = [
  "name",
  "email",
  "age",
  "role",
  "department",
  "location",
];

interface Props {
  open: boolean;
  onClose: () => void;
}

const ManageColumnsModal: React.FC<Props> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const visibleColumns = useSelector(
    (state: RootState) => state.visibleColumns.visibleColumns
  );
  const [newColumn, setNewColumn] = useState("");

  const handleToggle = (col: string) => {
    dispatch(toggleColumn(col));
  };

  const handleAddColumn = () => {
    const trimmed = newColumn.trim();
    if (!trimmed) return;

    if (visibleColumns.includes(trimmed)) {
      toast.error("Column already exists");
    } else {
      const updated = [...visibleColumns, trimmed];
      dispatch(setVisibleColumns(updated));
      toast.success(`➕ Column "${trimmed}" added`);
    }

    setNewColumn("");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Manage Columns</DialogTitle>
      <DialogContent>
        {defaultColumns.map((col) => (
          <FormControlLabel
            key={col}
            control={
              <Checkbox
                checked={visibleColumns.includes(col)}
                onChange={() => handleToggle(col)}
              />
            }
            label={col.charAt(0).toUpperCase() + col.slice(1)}
          />
        ))}

        {/* ➕ Add New Column */}
        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
          <TextField
            label="New Column"
            variant="outlined"
            value={newColumn}
            onChange={(e) => setNewColumn(e.target.value)}
            size="small"
          />
          <Button onClick={handleAddColumn} variant="contained">
            Add
          </Button>
        </Box>

        <Button variant="outlined" onClick={onClose} sx={{ mt: 3 }}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ManageColumnsModal;

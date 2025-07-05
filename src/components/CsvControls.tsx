"use client";

import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { addRow } from "../features/table/tableSlice";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { Button, Box } from "@mui/material";
import toast from "react-hot-toast";

export const CsvControls: React.FC = () => {
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const rows = useSelector((state: RootState) => state.table.rows);
  const visibleColumns = useSelector(
    (state: RootState) => state.visibleColumns.visibleColumns
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const data = results.data;
        const expectedColumns = ["id", "name", "email", "age", "role"];

        const hasAllColumns = expectedColumns.every((col) =>
          Object.keys(data[0] || {}).includes(col)
        );

        if (!hasAllColumns) {
          toast.error("❌ Invalid CSV format. Required columns missing.");
          return;
        }

        data.forEach((row) => {
          dispatch(
            addRow({
              id: row.id,
              name: row.name,
              email: row.email,
              age: Number(row.age),
              role: row.role,
              department: row.department || "",
              location: row.location || "",
            })
          );
        });
        toast.success("✅ CSV imported successfully!");
      },
      error: function () {
        toast.error("❌ Error parsing CSV file.");
      },
    });

    e.target.value = "";
  };

  const handleExport = () => {
    const exportData = rows.map((row) => {
      const filtered: Record<string, string | number> = {};
      visibleColumns.forEach((col) => {
        const value = row[col as keyof typeof row];
        if (value !== undefined) {
          filtered[col] = value as string | number;
        }
      });
      return filtered;
    });

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "table_export.csv");
    toast.success("CSV exported successfully!");
  };

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        hidden
        onChange={handleFileUpload}
      />
      <Button variant="outlined" onClick={() => inputRef.current?.click()}>
        📥 Import CSV
      </Button>
      <Button variant="contained" color="success" onClick={handleExport}>
        📤 Export CSV
      </Button>
    </Box>
  );
};

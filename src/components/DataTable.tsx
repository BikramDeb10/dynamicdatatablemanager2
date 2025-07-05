"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import {
  deleteRow,
  sortRows,
  setSearchQuery,
  setCurrentPage,
  startEditing,
  updateEditingRow,
  saveAllEdits,
  cancelAllEdits,
  addRow,
} from "../features/table/tableSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TableSortLabel,
  Box,
  TablePagination,
  Button,
  createTheme,
  ThemeProvider,
  CssBaseline,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import type { TableRow as TableRowType } from "../features/table/tableSlice";
import ManageColumnsModal from "./ManageColumnsModal";
import { CsvControls } from "./CsvControls";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import toast from "react-hot-toast";
import DeleteConfirmModal from "./DeleteConfirmModal";

const DataTable: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const validationErrors = useSelector(
    (state: RootState) => state.table.validationErrors
  );
  const editingRows = useSelector(
    (state: RootState) => state.table.editingRows
  );
  const visibleColumns = useSelector(
    (state: RootState) => state.visibleColumns.visibleColumns
  );
  const { rows, sortBy, sortDirection, searchQuery, currentPage, rowsPerPage } =
    useSelector((state: RootState) => state.table);
  const dispatch = useDispatch();

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#1976d2" },
      secondary: { main: "#ff4081" },
    },
  });

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleEdit = (row: TableRowType) => {
    dispatch(startEditing(row.id));
  };

  const createSortHandler = (column: keyof TableRowType) => () => {
    dispatch(sortRows(column));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    dispatch(setCurrentPage(newPage));
  };

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleAddNewRow = () => {
    const newRow: TableRowType = {
      id: Date.now().toString(),
      name: "",
      email: "",
      age: 0,
      role: "",
      department: "",
      location: "",
    };
    dispatch(addRow(newRow));
    dispatch(startEditing(newRow.id));
    toast.success("🆕 New row added");
  };

  const paginatedRows = filteredRows.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(visibleColumns);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    dispatch({ type: "visibleColumns/setVisibleColumns", payload: reordered });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          p: { xs: 2, md: 3 },
          bgcolor: "background.paper",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mb: 3,
          }}
        >
          <h2 style={{ fontWeight: 600, fontSize: "1.5rem" }}>
            📊 Data Table Manager
          </h2>
          <CsvControls />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "background.paper",
              borderRadius: 8,
              boxShadow: 2,
              px: 2,
              py: 1,
              width: "100%",
              maxWidth: 400,
            }}
          >
            <span style={{ fontSize: "1.2rem", marginRight: 8 }}>🔍</span>
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={handleSearch}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "1rem",
                backgroundColor: "transparent",
              }}
            />
          </Box>

          <Button
            variant="contained"
            onClick={toggleTheme}
            color="secondary"
            sx={{ width: { xs: "60%", sm: "250px" } }}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"} Theme
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            onClick={() => setIsModalOpen(true)}
            sx={{ width: { xs: "100%", sm: "250px" } }}
          >
            🧩 Manage Columns
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddNewRow}
            sx={{ width: { xs: "100%", sm: "250px" } }}
          >
            + Add New Row
          </Button>
        </Box>

        <TableContainer
          component={Paper}
          sx={{ borderRadius: 3, boxShadow: 4 }}
        >
          <Table>
            <TableHead
              sx={{ background: darkMode ? "#5e5c5c36" : "#8ac72148" }}
            >
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="columns" direction="horizontal">
                  {(provided) => (
                    <TableRow
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <TableCell sx={{ color: "#ff0077", fontWeight: "700" }}>
                        SL
                      </TableCell>
                      {visibleColumns.map((column, index) => (
                        <Draggable
                          key={column}
                          draggableId={column}
                          index={index}
                        >
                          {(provided) => (
                            <TableCell
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sortDirection={
                                sortBy === column ? sortDirection : false
                              }
                            >
                              <TableSortLabel
                                active={sortBy === column}
                                direction={
                                  sortBy === column ? sortDirection : "asc"
                                }
                                onClick={createSortHandler(
                                  column as keyof TableRowType
                                )}
                                sx={{
                                  color: "#548800",
                                  fontWeight: "700",
                                  fontSize: "1rem",
                                }}
                              >
                                {column.charAt(0).toUpperCase() +
                                  column.slice(1)}
                              </TableSortLabel>
                            </TableCell>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      <TableCell
                        align="center"
                        sx={{ color: "#ff0077", fontWeight: "700" }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  )}
                </Droppable>
              </DragDropContext>
            </TableHead>

            <TableBody>
              {paginatedRows.map((row: TableRowType, index) => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ color: "#ff0077" }}>
                    {currentPage * rowsPerPage + index + 1}
                  </TableCell>
                  {visibleColumns.map((column) => {
                    const editing = editingRows.find((r) => r.id === row.id);
                    const isEditing = !!editing;

                    const value = isEditing
                      ? editing.data[column as keyof TableRowType]
                      : row[column as keyof TableRowType];

                    const errorMessage = validationErrors.find(
                      (e) => e.id === row.id
                    )?.errors[column as keyof TableRowType];

                    return (
                      <TableCell
                        key={column}
                        onDoubleClick={() => dispatch(startEditing(row.id))}
                        sx={{
                          borderBottom: "1px solid #ddd",
                          borderRadius: "8px",
                          transition: "all 0.2s",
                          wordBreak: "break-word",
                          maxWidth: "200px",
                          "&:hover": {
                            backgroundColor: darkMode ? "#333" : "#f9f9f9",
                          },
                        }}
                      >
                        {isEditing ? (
                          <Box>
                            <input
                              value={value ?? ""}
                              onChange={(e) =>
                                dispatch(
                                  updateEditingRow({
                                    id: row.id,
                                    key: column as keyof TableRowType,
                                    value: e.target.value,
                                  })
                                )
                              }
                              style={{
                                width: "100%",
                                border: errorMessage
                                  ? "1px solid red"
                                  : "1px solid #ccc",
                                borderRadius: 4,
                                padding: "4px",
                              }}
                            />
                            {errorMessage && (
                              <div style={{ color: "red", fontSize: "12px" }}>
                                {errorMessage}
                              </div>
                            )}
                          </Box>
                        ) : (
                          value
                        )}
                      </TableCell>
                    );
                  })}

                  <TableCell align="center">
                    <IconButton onClick={() => handleEdit(row)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(row.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              my: 2,
              justifyContent: "flex-end",
              px: 2,
            }}
          >
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                color: "#fff",
                "&:hover": {
                  background: "linear-gradient(to right, #ff4b2b, #ff416c)",
                },
              }}
              onClick={async () => {
                setSaving(true); // Start loader
                await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate save delay (1 sec)
                dispatch(saveAllEdits());
                setSaving(false); // End loader
                toast.success("✅ Edits saved!");
              }}
              disabled={
                editingRows.length === 0 ||
                validationErrors.length > 0 ||
                saving
              }
            >
              {saving ? (
                <CircularProgress size={20} sx={{ color: "#fff", mr: 1 }} />
              ) : (
                "💾 Save All"
              )}
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              onClick={() => dispatch(cancelAllEdits())}
              disabled={editingRows.length === 0}
            >
              Cancel All
            </Button>
          </Box>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredRows.length}
          page={currentPage}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10]}
        />

        <ManageColumnsModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        <DeleteConfirmModal
          open={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={() => {
            if (deleteId) {
              dispatch(deleteRow(deleteId));
              toast.success("🗑️ Row deleted successfully");
            }
            setDeleteId(null);
          }}
        />
      </Box>
    </ThemeProvider>
  );
};

export default DataTable;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TableRow {
  id: string;
  name?: string;
  email?: string;
  age?: number;
  role?: string;
  department?: string;
  location?: string;
}

export interface EditingRow {
  id: string;
  data: Partial<TableRow>;
}

export interface ValidationError {
  id: string;
  errors: {
    [key in keyof TableRow]?: string;
  };
}

export interface TableState {
  rows: TableRow[];
  sortBy: keyof TableRow | null;
  sortDirection: "asc" | "desc";
  searchQuery: string;
  currentPage: number;
  rowsPerPage: number;
  editingRows: EditingRow[];
  validationErrors: ValidationError[];
}

const initialState: TableState = {
  rows: [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      age: 28,
      role: "Developer",
      department: "Engineering",
      location: "Mumbai",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      age: 32,
      role: "Designer",
      department: "Design",
      location: "Delhi",
    },
    {
      id: "3",
      name: "Bikram Debnath",
      email: "bikram@example.com",
      age: 27,
      role: "Designer",
      department: "Design",
      location: "Delhi",
    },
    {
      id: "4",
      name: "Amit Roy",
      email: "amit.roy@example.com",
      age: 30,
      role: "Product Manager",
      department: "Product",
      location: "Kolkata",
    },
    {
      id: "5",
      name: "Neha Verma",
      email: "neha.verma@example.com",
      age: 25,
      role: "QA Engineer",
      department: "Quality",
      location: "Pune",
    },
    {
      id: "6",
      name: "Ravi Kumar",
      email: "ravi.k@example.com",
      age: 29,
      role: "Backend Developer",
      department: "Engineering",
      location: "Chennai",
    },
    {
      id: "7",
      name: "Sneha Sharma",
      email: "sneha.sharma@example.com",
      age: 31,
      role: "UI/UX Designer",
      department: "Design",
      location: "Noida",
    },
    {
      id: "8",
      name: "Vikash Singh",
      email: "vikash.s@example.com",
      age: 33,
      role: "DevOps Engineer",
      department: "Engineering",
      location: "Bangalore",
    },
    {
      id: "9",
      name: "Kriti Mehra",
      email: "kriti.m@example.com",
      age: 26,
      role: "Data Analyst",
      department: "Analytics",
      location: "Hyderabad",
    },
    {
      id: "10",
      name: "Arjun Mehta",
      email: "arjun.mehta@example.com",
      age: 34,
      role: "Frontend Developer",
      department: "Engineering",
      location: "Ahmedabad",
    },
    {
      id: "11",
      name: "Isha Kapoor",
      email: "isha.kapoor@example.com",
      age: 29,
      role: "HR Manager",
      department: "Human Resources",
      location: "Jaipur",
    },
    {
      id: "12",
      name: "Rajeev Ranjan",
      email: "rajeev.r@example.com",
      age: 36,
      role: "Technical Lead",
      department: "Engineering",
      location: "Bhubaneswar",
    },
    {
      id: "13",
      name: "Meera Nair",
      email: "meera.nair@example.com",
      age: 27,
      role: "Marketing Executive",
      department: "Marketing",
      location: "Trivandrum",
    },
    {
      id: "14",
      name: "Karan Thakur",
      email: "karan.t@example.com",
      age: 30,
      role: "Business Analyst",
      department: "Strategy",
      location: "Surat",
    },
    {
      id: "15",
      name: "Divya Joshi",
      email: "divya.joshi@example.com",
      age: 24,
      role: "Intern",
      department: "Engineering",
      location: "Indore",
    },
    {
      id: "16",
      name: "Rohit Das",
      email: "rohit.das@example.com",
      age: 35,
      role: "System Architect",
      department: "Engineering",
      location: "Nagpur",
    },
    {
      id: "17",
      name: "Tanya Agarwal",
      email: "tanya.agarwal@example.com",
      age: 28,
      role: "SEO Specialist",
      department: "Marketing",
      location: "Patnaa",
    },
    {
      id: "18",
      name: "Manoj Sinha",
      email: "manoj.sinha@example.com",
      age: 32,
      role: "Support Engineer",
      department: "Customer Support",
      location: "Lucknow",
    },
  ],
  sortBy: null,
  sortDirection: "asc",
  searchQuery: "",
  currentPage: 0,
  rowsPerPage: 10,
  editingRows: [],
  validationErrors: [],
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    updateRow(state, action: PayloadAction<TableRow>) {
      const index = state.rows.findIndex((row) => row.id === action.payload.id);
      if (index !== -1) {
        state.rows[index] = action.payload;
      }
    },
    deleteRow(state, action: PayloadAction<string>) {
      state.rows = state.rows.filter((row) => row.id !== action.payload);
    },
    addRow(state, action: PayloadAction<TableRow>) {
      state.rows.push(action.payload);
    },
    sortRows(state, action: PayloadAction<keyof TableRow>) {
      const { payload: sortBy } = action;
      const isSameColumn = state.sortBy === sortBy;
      const sortDirection =
        isSameColumn && state.sortDirection === "asc" ? "desc" : "asc";

      state.sortBy = sortBy;
      state.sortDirection = sortDirection;

      state.rows.sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];

        if (valA == null || valB == null) return 0;

        if (typeof valA === "number" && typeof valB === "number") {
          return sortDirection === "asc" ? valA - valB : valB - valA;
        }

        return sortDirection === "asc"
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.currentPage = 0;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },

    startEditing(state, action: PayloadAction<string>) {
      const id = action.payload;
      const row = state.rows.find((r) => r.id === id);
      if (row && !state.editingRows.find((r) => r.id === id)) {
        state.editingRows.push({ id, data: { ...row } });
      }
    },
    updateEditingRow(
      state,
      action: PayloadAction<{
        id: string;
        key: keyof TableRow;
        value: string | number;
      }>
    ) {
      const { id, key, value } = action.payload;
      const editingRow = state.editingRows.find((r) => r.id === id);
      if (!editingRow) return;

      // editingRow.data[key] = value;

      if (typeof key === "string") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (editingRow.data as any)[key] = value;
      }

      // Handle validation
      let error: string | null = null;

      if (key === "age") {
        if (value === "" || isNaN(Number(value))) {
          error = "Age must be a number";
        }
      }

      if (key === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof value !== "string" || !emailRegex.test(value)) {
          error = "Invalid email address";
        }
      }

      const existingError = state.validationErrors.find((e) => e.id === id);
      if (error) {
        if (existingError) {
          existingError.errors[key] = error;
        } else {
          state.validationErrors.push({
            id,
            errors: { [key]: error },
          });
        }
      } else {
        if (existingError) {
          delete existingError.errors[key];
          if (Object.keys(existingError.errors).length === 0) {
            state.validationErrors = state.validationErrors.filter(
              (e) => e.id !== id
            );
          }
        }
      }
    },

    saveAllEdits(state) {
      state.editingRows.forEach(({ id, data }) => {
        const index = state.rows.findIndex((row) => row.id === id);
        if (index !== -1) {
          state.rows[index] = { ...state.rows[index], ...data };
        }
      });
      state.editingRows = [];
    },
    cancelAllEdits(state) {
      state.editingRows = [];
    },
  },
});

export const {
  updateRow,
  deleteRow,
  addRow,
  sortRows,
  setSearchQuery,
  setCurrentPage,
  startEditing,
  updateEditingRow,
  saveAllEdits,
  cancelAllEdits,
} = tableSlice.actions;
export default tableSlice.reducer;

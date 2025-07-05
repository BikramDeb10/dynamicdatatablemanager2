import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const DEFAULT_COLUMNS = [
  "name",
  "email",
  "age",
  "role",
  "department",
  "location",
];

export interface VisibleColumnsState {
  visibleColumns: string[];
}

const initialState: VisibleColumnsState = {
  visibleColumns: DEFAULT_COLUMNS,
};

const visibleColumnsSlice = createSlice({
  name: "visibleColumns",
  initialState,
  reducers: {
    toggleColumn(state, action: PayloadAction<string>) {
      const column = action.payload;
      if (state.visibleColumns.includes(column)) {
        state.visibleColumns = state.visibleColumns.filter(
          (col) => col !== column
        );
      } else {
        state.visibleColumns.push(column);
      }
    },
    setVisibleColumns(state, action: PayloadAction<string[]>) {
      state.visibleColumns = action.payload;
    },
  },
});

export const { toggleColumn, setVisibleColumns } = visibleColumnsSlice.actions;
export default visibleColumnsSlice.reducer;

// app/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import tableReducer from "../features/table/tableSlice";
import visibleColumnsReducer from "../features/table/visibleColumnsSlice";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["visibleColumns", "table"],
};

const rootReducer = combineReducers({
  table: tableReducer,
  visibleColumns: visibleColumnsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

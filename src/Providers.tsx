// Providers.tsx
"use client";

import React from "react";
import { Provider } from "react-redux";
import { store, persistor } from "./app/store";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
        <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
      </PersistGate>
    </Provider>
  );
}

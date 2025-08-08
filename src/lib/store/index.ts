import { configureStore } from "@reduxjs/toolkit";
import driversReducer from "./slices/driversSlice";
import deliveriesReducer from "./slices/deliveriesSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    drivers: driversReducer,
    deliveries: deliveriesReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["drivers/updateDriverLocation"],
        ignoredPaths: ["drivers.drivers"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

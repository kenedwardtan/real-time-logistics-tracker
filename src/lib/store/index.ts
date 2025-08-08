import { configureStore } from "@reduxjs/toolkit";
import driversReducer from "./slices/driversSlice";
import deliveriesReducer from "./slices/deliveriesSlice";
import uiReducer from "./slices/uiSlice";
import { logisticsApi } from "./api/logisticsApi";

export const store = configureStore({
  reducer: {
    drivers: driversReducer,
    deliveries: deliveriesReducer,
    ui: uiReducer,
    [logisticsApi.reducerPath]: logisticsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["drivers/updateDriverLocation"],
        ignoredPaths: ["drivers.drivers"],
      },
    }).concat(logisticsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

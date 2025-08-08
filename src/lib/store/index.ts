import { configureStore } from "@reduxjs/toolkit";
import driversReducer from "./slices/driversSlice";
import deliveriesReducer from "./slices/deliveriesSlice";
import uiReducer from "./slices/uiSlice";
import websocketReducer from "./slices/websocketSlice";
import { logisticsApi } from "./api/logisticsApi";
import { websocketMiddleware } from "./middleware/websocketMiddleware";

export const store = configureStore({
  reducer: {
    drivers: driversReducer,
    deliveries: deliveriesReducer,
    ui: uiReducer,
    websocket: websocketReducer,
    [logisticsApi.reducerPath]: logisticsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["drivers/updateDriverLocation"],
        ignoredPaths: ["drivers.drivers"],
      },
    }).concat(logisticsApi.middleware, websocketMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

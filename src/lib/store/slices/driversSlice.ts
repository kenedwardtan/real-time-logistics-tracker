import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Driver } from "@/lib/types";

interface DriversState {
  drivers: Driver[];
  selectedDriver: Driver | null;
  loading: boolean;
  error: string | null;
}

const initialState: DriversState = {
  drivers: [],
  selectedDriver: null,
  loading: false,
  error: null,
};

const driversSlice = createSlice({
  name: "drivers",
  initialState,
  reducers: {
    setDrivers: (state, action: PayloadAction<Driver[]>) => {
      state.drivers = action.payload;
    },
    updateDriver: (
      state,
      action: PayloadAction<{ driverId: string; updates: Partial<Driver> }>
    ) => {
      const { driverId, updates } = action.payload;
      const driverIndex = state.drivers.findIndex((d) => d.id === driverId);
      if (driverIndex !== -1) {
        state.drivers[driverIndex] = {
          ...state.drivers[driverIndex],
          ...updates,
        };
      }
    },
    setSelectedDriver: (state, action: PayloadAction<Driver | null>) => {
      state.selectedDriver = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setDrivers,
  updateDriver,
  setSelectedDriver,
  setLoading,
  setError,
} = driversSlice.actions;
export default driversSlice.reducer;

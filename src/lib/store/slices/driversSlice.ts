import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Driver } from "@/lib/types";

// Mock data for development
const mockDrivers: Driver[] = [
  {
    id: "1",
    name: "Tony Stark",
    status: "online",
    currentLocation: { lat: 45.4215, lng: -75.6972 }, // Parliament Hill, Ottawa
    lastUpdated: new Date().toISOString(),
    vehicleInfo: { make: "Audi", model: "R8", plateNumber: "IRON-1" },
  },
  {
    id: "2",
    name: "Black Widow",
    status: "busy",
    currentLocation: { lat: 45.4048, lng: -75.7146 }, // Kanata, Ottawa
    lastUpdated: new Date(Date.now() - 30000).toISOString(), // 30 seconds ago
    vehicleInfo: { make: "BMW", model: "X5", plateNumber: "WIDOW-2" },
  },
  {
    id: "3",
    name: "Captain America",
    status: "offline",
    currentLocation: { lat: 45.3876, lng: -75.696 }, // Airport area, Ottawa
    lastUpdated: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    vehicleInfo: {
      make: "Harley",
      model: "Street Glide",
      plateNumber: "CAP-3",
    },
  },
];

export const fetchDrivers = createAsyncThunk(
  "drivers/fetchDrivers",
  async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockDrivers;
  }
);

export const updateDriverLocation = createAsyncThunk(
  "drivers/updateLocation",
  async ({
    driverId,
    location,
  }: {
    driverId: string;
    location: { lat: number; lng: number };
  }) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { driverId, location };
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers = action.payload;
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch drivers";
      })
      .addCase(updateDriverLocation.fulfilled, (state, action) => {
        const { driverId, location } = action.payload;
        const driver = state.drivers.find((d) => d.id === driverId);
        if (driver) {
          driver.currentLocation = location;
          driver.lastUpdated = new Date().toISOString();
        }
      });
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

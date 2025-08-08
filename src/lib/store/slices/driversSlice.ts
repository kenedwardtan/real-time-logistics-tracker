import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Driver } from "@/lib/types";

// Mock data for development with delivery status and ETAs
const mockDrivers: Driver[] = [
  {
    id: "1",
    name: "Tony Stark",
    status: "busy",
    deliveryStatus: "delivering",
    currentLocation: { lat: 45.4274, lng: -75.6919 }, // Rideau Centre (pickup location)
    lastUpdated: new Date().toISOString(),
    vehicleInfo: { make: "Audi", model: "R8", plateNumber: "IRON-1" },
    estimatedTimeArrival: new Date(Date.now() + 480000).toISOString(), // 8 min ETA to Byward Market
  },
  {
    id: "2",
    name: "Black Widow",
    status: "busy",
    deliveryStatus: "delivering",
    currentLocation: { lat: 43.6426, lng: -79.3871 }, // CN Tower area (Toronto)
    lastUpdated: new Date(Date.now() - 30000).toISOString(), // 30 seconds ago
    vehicleInfo: { make: "BMW", model: "X5", plateNumber: "WIDOW-2" },
    estimatedTimeArrival: new Date(Date.now() + 720000).toISOString(), // 12 min ETA to Casa Loma
  },
  {
    id: "3",
    name: "Captain America",
    status: "online",
    deliveryStatus: "idle",
    currentLocation: { lat: 45.4215, lng: -75.6972 }, // Parliament Hill, Ottawa
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
    return { driverId, location, timestamp: new Date().toISOString() };
  }
);

// Simulate dynamic driver movement along routes
export const startDriverMovementSimulation = createAsyncThunk(
  "drivers/startMovementSimulation",
  async (_, { dispatch, getState }) => {
    const simulateMovement = () => {
      const state = getState() as { drivers: DriversState };
      const drivers = state.drivers.drivers;

      drivers.forEach((driver) => {
        if (driver.deliveryStatus === "delivering") {
          // Calculate new position moving towards destination
          const currentLat = driver.currentLocation.lat;
          const currentLng = driver.currentLocation.lng;

          // Define destinations for each driver
          const destinations = {
            "1": { lat: 45.4287, lng: -75.6903 }, // Tony -> Byward Market
            "2": { lat: 43.6789, lng: -79.4094 }, // Black Widow -> Casa Loma
          };

          const destination =
            destinations[driver.id as keyof typeof destinations];
          if (destination) {
            // Move driver closer to destination (simple linear interpolation)
            const progress = 0.02; // 2% closer each update
            const newLat =
              currentLat + (destination.lat - currentLat) * progress;
            const newLng =
              currentLng + (destination.lng - currentLng) * progress;

            // Add some random variation to simulate realistic movement
            const randomVariation = 0.0002;
            const finalLat = newLat + (Math.random() - 0.5) * randomVariation;
            const finalLng = newLng + (Math.random() - 0.5) * randomVariation;

            dispatch(
              updateDriverLocation({
                driverId: driver.id,
                location: { lat: finalLat, lng: finalLng },
              })
            );
          }
        }
      });
    };

    // Start the simulation interval
    const interval = setInterval(simulateMovement, 5000); // Update every 5 seconds

    // Store interval ID in a way that can be accessed later
    (
      window as unknown as { driverMovementInterval: NodeJS.Timeout }
    ).driverMovementInterval = interval;

    return "Movement simulation started";
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
        const { driverId, location, timestamp } = action.payload;
        const driver = state.drivers.find((d) => d.id === driverId);
        if (driver) {
          driver.currentLocation = location;
          driver.lastUpdated = timestamp;
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

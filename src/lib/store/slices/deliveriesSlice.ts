import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Delivery } from "@/lib/types";

// Mock delivery data with Ottawa/Toronto locations
const mockDeliveries: Delivery[] = [
  {
    id: "del-001",
    driverId: "1", // Tony Stark
    status: "delivering",
    pickupLocation: {
      address: "Rideau Centre, Ottawa, ON",
      lat: 45.4274,
      lng: -75.6919,
    },
    dropoffLocation: {
      address: "Byward Market, Ottawa, ON",
      lat: 45.4287,
      lng: -75.6903,
    },
    customerInfo: {
      name: "Steve Rogers",
      phone: "(613) 555-0101",
    },
    estimatedPickupTime: new Date(Date.now() - 900000).toISOString(), // 15 min ago
    estimatedDeliveryTime: new Date(Date.now() + 600000).toISOString(), // 10 min from now
    actualPickupTime: new Date(Date.now() - 900000).toISOString(),
    estimatedTimeArrival: new Date(Date.now() + 480000).toISOString(), // 8 min ETA
    notes: "Handle with care - fragile items",
  },
  {
    id: "del-002",
    driverId: "2", // Black Widow
    status: "picked-up",
    pickupLocation: {
      address: "CN Tower, Toronto, ON",
      lat: 43.6426,
      lng: -79.3871,
    },
    dropoffLocation: {
      address: "Casa Loma, Toronto, ON",
      lat: 43.6789,
      lng: -79.4094,
    },
    customerInfo: {
      name: "Bruce Banner",
      phone: "(416) 555-0202",
    },
    estimatedPickupTime: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
    estimatedDeliveryTime: new Date(Date.now() + 900000).toISOString(), // 15 min from now
    actualPickupTime: new Date(Date.now() - 1200000).toISOString(), // 20 min ago
    estimatedTimeArrival: new Date(Date.now() + 720000).toISOString(), // 12 min ETA
    notes: "Customer prefers contactless delivery",
  },
  {
    id: "del-003",
    status: "pending", // Unassigned delivery
    pickupLocation: {
      address: "Parliament Hill, Ottawa, ON",
      lat: 45.4215,
      lng: -75.6972,
    },
    dropoffLocation: {
      address: "University of Ottawa, Ottawa, ON",
      lat: 45.4231,
      lng: -75.6831,
    },
    customerInfo: {
      name: "Wanda Maximoff",
      phone: "(613) 555-0303",
    },
    estimatedPickupTime: new Date(Date.now() + 1800000).toISOString(), // 30 min from now
    estimatedDeliveryTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    notes: "Important documents - signature required",
  },
];

interface DeliveriesState {
  deliveries: Delivery[];
  loading: boolean;
  error: string | null;
}

const initialState: DeliveriesState = {
  deliveries: [],
  loading: false,
  error: null,
};

export const fetchDeliveries = createAsyncThunk(
  "deliveries/fetchDeliveries",
  async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockDeliveries;
  }
);

const deliveriesSlice = createSlice({
  name: "deliveries",
  initialState,
  reducers: {
    setDeliveries: (state, action: PayloadAction<Delivery[]>) => {
      state.deliveries = action.payload;
    },
    updateDelivery: (
      state,
      action: PayloadAction<{ deliveryId: string; updates: Partial<Delivery> }>
    ) => {
      const { deliveryId, updates } = action.payload;
      const deliveryIndex = state.deliveries.findIndex(
        (d) => d.id === deliveryId
      );
      if (deliveryIndex !== -1) {
        state.deliveries[deliveryIndex] = {
          ...state.deliveries[deliveryIndex],
          ...updates,
        };
      }
    },
    setDeliveriesLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setDeliveriesError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeliveries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliveries.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveries = action.payload;
      })
      .addCase(fetchDeliveries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch deliveries";
      });
  },
});

export const {
  setDeliveries,
  updateDelivery,
  setDeliveriesLoading,
  setDeliveriesError,
} = deliveriesSlice.actions;

export default deliveriesSlice.reducer;

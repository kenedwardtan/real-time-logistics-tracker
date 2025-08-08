import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Delivery } from "@/lib/types";

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
});

export const {
  setDeliveries,
  updateDelivery,
  setDeliveriesLoading,
  setDeliveriesError,
} = deliveriesSlice.actions;
export default deliveriesSlice.reducer;

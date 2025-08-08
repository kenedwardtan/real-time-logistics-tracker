import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  sidebarCollapsed: boolean;
  mapBounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  } | null;
}

const initialState: UIState = {
  sidebarCollapsed: false,
  mapBounds: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setMapBounds: (state, action: PayloadAction<UIState["mapBounds"]>) => {
      state.mapBounds = action.payload;
    },
  },
});

export const { toggleSidebar, setMapBounds } = uiSlice.actions;
export default uiSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WebSocketMessage } from "@/lib/types";

interface WebSocketState {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  error: string | null;
}

const initialState: WebSocketState = {
  isConnected: false,
  lastMessage: null,
  error: null,
};

const websocketSlice = createSlice({
  name: "websocket",
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setLastMessage: (state, action: PayloadAction<WebSocketMessage>) => {
      state.lastMessage = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setConnected, setLastMessage, setError } =
  websocketSlice.actions;
export default websocketSlice.reducer;

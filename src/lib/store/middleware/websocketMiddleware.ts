import { Middleware } from "@reduxjs/toolkit";
import { updateDriver } from "../slices/driversSlice";
import { updateDelivery } from "../slices/deliveriesSlice";
import { WebSocketMessage } from "@/lib/types";

let ws: WebSocket | null = null;

export const websocketMiddleware: Middleware =
  (store) => (next) => (action) => {
    if (action.type === "websocket/connect") {
      if (ws) {
        ws.close();
      }

      ws = new WebSocket("ws://localhost:8080");

      ws.onopen = () => {
        console.log("Connected to WebSocket");
        store.dispatch({ type: "websocket/connected" });
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          handleWebSocketMessage(store, message);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        store.dispatch({ type: "websocket/disconnected" });
      };
    }

    if (action.type === "websocket/disconnect") {
      if (ws) {
        ws.close();
        ws = null;
      }
    }

    return next(action);
  };

function handleWebSocketMessage(store: any, message: WebSocketMessage) {
  switch (message.type) {
    case "driver_update":
      store.dispatch(
        updateDriver({
          driverId: message.payload.driverId,
          updates: message.payload.updates,
        })
      );
      break;
    case "delivery_update":
      store.dispatch(
        updateDelivery({
          deliveryId: message.payload.deliveryId,
          updates: message.payload.updates,
        })
      );
      break;
    default:
      console.warn("Unknown message type:", message.type);
  }
}

import { Middleware, AnyAction } from "@reduxjs/toolkit";
import { updateDriver } from "../slices/driversSlice";
import { updateDelivery } from "../slices/deliveriesSlice";
import { setConnected } from "../slices/websocketSlice";
import { WebSocketMessage } from "@/lib/types";

let ws: WebSocket | null = null;
let mockWebSocketInterval: NodeJS.Timeout | null = null;

export const websocketMiddleware: Middleware =
  (store) => (next) => (action) => {
    if ((action as AnyAction).type === "websocket/connect") {
      if (ws) {
        ws.close();
      }

      // Clear any existing mock interval
      if (mockWebSocketInterval) {
        clearInterval(mockWebSocketInterval);
      }

      // Try to connect to real WebSocket, fallback to mock
      try {
        ws = new WebSocket("ws://localhost:8080");

        ws.onopen = () => {
          console.log("Connected to WebSocket");
          store.dispatch(setConnected(true));
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
          store.dispatch(setConnected(false));
        };

        ws.onerror = () => {
          console.log("WebSocket connection failed, starting mock simulation");
          startMockWebSocket(store);
        };
      } catch (error) {
        console.log("WebSocket not available, starting mock simulation");
        startMockWebSocket(store);
      }
    }

    if ((action as AnyAction).type === "websocket/disconnect") {
      if (ws) {
        ws.close();
        ws = null;
      }
      if (mockWebSocketInterval) {
        clearInterval(mockWebSocketInterval);
        mockWebSocketInterval = null;
      }
    }

    return next(action);
  };

// Mock WebSocket for demonstration when real server isn't available
function startMockWebSocket(store: any) {
  store.dispatch(setConnected(true));

  // Simulate periodic delivery status updates
  mockWebSocketInterval = setInterval(() => {
    // Random delivery status updates
    const mockMessages: WebSocketMessage[] = [
      {
        type: "delivery_update",
        payload: {
          deliveryId: "del-001",
          updates: {
            estimatedTimeArrival: new Date(
              Date.now() + Math.random() * 900000
            ).toISOString(),
          },
        },
        timestamp: new Date().toISOString(),
      },
      {
        type: "driver_update",
        payload: {
          driverId: "3",
          updates: {
            status: Math.random() > 0.7 ? "online" : "busy",
            lastUpdated: new Date().toISOString(),
          },
        },
        timestamp: new Date().toISOString(),
      },
    ];

    // Send a random message
    const randomMessage =
      mockMessages[Math.floor(Math.random() * mockMessages.length)];
    handleWebSocketMessage(store, randomMessage);
  }, 10000); // Every 10 seconds
}

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
    case "status_change":
      store.dispatch(
        updateDriver({
          driverId: message.payload.driverId,
          updates: { status: message.payload.status },
        })
      );
      break;
    default:
      const exhaustiveCheck: never = message;
      console.warn("Unknown message type:", exhaustiveCheck);
  }
}

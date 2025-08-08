"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchDeliveries } from "@/lib/store/slices/deliveriesSlice";
import { LiveMap } from "../Map/LiveMap";
import { DriverList } from "./DriverList";
import { DriverDetails } from "./DriverDetails";

export function LogisticsDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const websocketConnected = useSelector(
    (state: RootState) => state.websocket.isConnected
  );

  useEffect(() => {
    // Load deliveries data
    dispatch(fetchDeliveries());

    // Connect to WebSocket for real-time updates
    dispatch({ type: "websocket/connect" });

    // Cleanup on unmount
    return () => {
      dispatch({ type: "websocket/disconnect" });
    };
  }, [dispatch]);

  return (
    <div className="flex h-screen">
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-blue-600">
                Logistics Tracker
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Real-time driver monitoring
              </p>
            </div>

            {/* WebSocket Connection Status */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  websocketConnected ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-xs text-gray-500">
                {websocketConnected ? "Live" : "Offline"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <DriverList />
        </div>

        <DriverDetails />
      </div>

      <div className="flex-1 bg-gray-100">
        <LiveMap />
      </div>
    </div>
  );
}

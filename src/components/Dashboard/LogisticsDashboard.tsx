"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchDeliveries } from "@/lib/store/slices/deliveriesSlice";
import { LiveMap } from "../Map/LiveMap";
import { DriverList } from "./DriverList";
import { DriverDetails } from "./DriverDetails";
import { DispatchActions } from "../Dispatch/DispatchActions";

export function LogisticsDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const websocketConnected = useSelector(
    (state: RootState) => state.websocket.isConnected
  );
  const drivers = useSelector((state: RootState) => state.drivers.drivers);

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
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Drivers */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
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
                className={`w-3 h-3 rounded-full shadow-sm ${
                  websocketConnected ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-xs text-gray-500 font-medium">
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

      {/* Center - Map */}
      <div className="flex-1 bg-gray-100 relative">
        <LiveMap />

        {/* Map Overlay Info */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3 z-10">
          <div className="text-xs text-gray-600">
            <p className="font-medium">Live Tracking</p>
            <p>
              🚗{" "}
              {drivers.filter((d) => d.deliveryStatus === "delivering").length}{" "}
              delivering
            </p>
            <p>
              🟢 {drivers.filter((d) => d.status === "online").length} online
            </p>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Dispatch Actions */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-sm">
        <DispatchActions />
      </div>
    </div>
  );
}

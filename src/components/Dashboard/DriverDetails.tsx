"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export function DriverDetails() {
  const selectedDriver = useSelector(
    (state: RootState) => state.drivers.selectedDriver
  );

  if (!selectedDriver) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-600 bg-green-100";
      case "busy":
        return "text-yellow-600 bg-yellow-100";
      case "offline":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 shadow-lg max-h-80 overflow-y-auto">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Driver Details
        </h3>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-600">Name</label>
            <p className="text-gray-900">{selectedDriver.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Status</label>
            <div>
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                  selectedDriver.status
                )}`}
              >
                {selectedDriver.status.charAt(0).toUpperCase() +
                  selectedDriver.status.slice(1)}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Vehicle</label>
            <p className="text-gray-900">
              {selectedDriver.vehicleInfo.make}{" "}
              {selectedDriver.vehicleInfo.model}
            </p>
            <p className="text-sm text-gray-600">
              Plate: {selectedDriver.vehicleInfo.plateNumber}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Location
            </label>
            <p className="text-gray-900">
              {selectedDriver.currentLocation.lat.toFixed(4)},{" "}
              {selectedDriver.currentLocation.lng.toFixed(4)}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Last Updated
            </label>
            <p className="text-gray-900">
              {new Date(selectedDriver.lastUpdated).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

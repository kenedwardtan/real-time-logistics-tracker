"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { setSelectedDriver } from "@/lib/store/slices/driversSlice";
import { Driver } from "@/lib/types";

function DriverCard({
  driver,
  isSelected,
}: {
  driver: Driver;
  isSelected: boolean;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const handleSelect = () => {
    // Toggle driver selection: if already selected, deselect; otherwise select
    if (isSelected) {
      dispatch(setSelectedDriver(null));
    } else {
      dispatch(setSelectedDriver(driver));
    }
  };

  const getStatusColor = (status: Driver["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "busy":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: Driver["status"]) => {
    switch (status) {
      case "online":
        return "Online";
      case "busy":
        return "Busy";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  return (
    <div
      onClick={handleSelect}
      className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
        isSelected ? "bg-blue-50 border-blue-200" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-3 h-3 rounded-full ${getStatusColor(driver.status)}`}
          ></div>
          <div>
            <h3 className="font-semibold text-gray-900">{driver.name}</h3>
            <p className="text-sm text-gray-600">
              {getStatusText(driver.status)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            {driver.vehicleInfo.plateNumber}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(driver.lastUpdated).toLocaleTimeString()}
          </p>
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-600">
        {driver.vehicleInfo.make} {driver.vehicleInfo.model}
      </div>

      {driver.currentDelivery && (
        <div className="mt-2 text-xs text-blue-600">
          On delivery: {driver.currentDelivery.status}
        </div>
      )}
    </div>
  );
}

export function DriverList() {
  const drivers = useSelector((state: RootState) => state.drivers.drivers);
  const selectedDriver = useSelector(
    (state: RootState) => state.drivers.selectedDriver
  );
  const loading = useSelector((state: RootState) => state.drivers.loading);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (drivers.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No drivers available</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto">
      {drivers.map((driver) => (
        <DriverCard
          key={driver.id}
          driver={driver}
          isSelected={selectedDriver?.id === driver.id}
        />
      ))}
    </div>
  );
}

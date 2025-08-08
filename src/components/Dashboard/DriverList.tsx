"use client";

import React, { useState } from "react";
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

      {/* Delivery Status Badge */}
      <div className="mt-2 flex items-center justify-between">
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            driver.deliveryStatus === "delivering"
              ? "bg-blue-100 text-blue-800"
              : driver.deliveryStatus === "paused"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {driver.deliveryStatus.charAt(0).toUpperCase() +
            driver.deliveryStatus.slice(1)}
        </span>

        {driver.estimatedTimeArrival &&
          driver.deliveryStatus === "delivering" && (
            <span className="text-xs text-green-600 font-medium">
              ETA:{" "}
              {new Date(driver.estimatedTimeArrival).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
      </div>
    </div>
  );
}

export function DriverList() {
  const drivers = useSelector((state: RootState) => state.drivers.drivers);
  const selectedDriver = useSelector(
    (state: RootState) => state.drivers.selectedDriver
  );
  const loading = useSelector((state: RootState) => state.drivers.loading);

  // Filter state for PDF requirement: "Allow filtering or sorting of drivers based on their delivery status"
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState<
    "all" | "idle" | "delivering" | "paused"
  >("all");
  const [sortBy, setSortBy] = useState<"name" | "status" | "lastUpdated">(
    "name"
  );

  // Filter and sort drivers
  const filteredAndSortedDrivers = React.useMemo(() => {
    let filtered = drivers;

    // Filter by delivery status
    if (deliveryStatusFilter !== "all") {
      filtered = drivers.filter(
        (driver) => driver.deliveryStatus === deliveryStatusFilter
      );
    }

    // Sort drivers
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "status":
          return a.status.localeCompare(b.status);
        case "lastUpdated":
          return (
            new Date(b.lastUpdated).getTime() -
            new Date(a.lastUpdated).getTime()
          );
        default:
          return 0;
      }
    });

    return sorted;
  }, [drivers, deliveryStatusFilter, sortBy]);

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
    <div className="flex flex-col h-full">
      {/* Filter and Sort Controls */}
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <div className="space-y-2">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Delivery Status
            </label>
            <select
              value={deliveryStatusFilter}
              onChange={(e) => setDeliveryStatusFilter(e.target.value as any)}
              className="w-full text-xs border border-gray-300 rounded px-2 py-1"
            >
              <option value="all">All Statuses</option>
              <option value="idle">Idle</option>
              <option value="delivering">Delivering</option>
              <option value="paused">Paused</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs border border-gray-300 rounded px-2 py-1"
            >
              <option value="name">Name</option>
              <option value="status">Status</option>
              <option value="lastUpdated">Last Updated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Driver List */}
      <div className="flex-1 overflow-y-auto">
        {filteredAndSortedDrivers.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>No drivers match the selected filter</p>
          </div>
        ) : (
          filteredAndSortedDrivers.map((driver) => (
            <DriverCard
              key={driver.id}
              driver={driver}
              isSelected={selectedDriver?.id === driver.id}
            />
          ))
        )}
      </div>
    </div>
  );
}

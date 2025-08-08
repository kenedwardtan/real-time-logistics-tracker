"use client";

import { LiveMap } from "../Map/LiveMap";
import { DriverList } from "./DriverList";
import { DriverDetails } from "./DriverDetails";

export function LogisticsDashboard() {
  return (
    <div className="flex h-screen">
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-blue-600">
            Logistics Tracker
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Real-time driver monitoring
          </p>
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

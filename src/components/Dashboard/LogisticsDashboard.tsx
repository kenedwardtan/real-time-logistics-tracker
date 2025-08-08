"use client";

import { LiveMap } from "../Map/LiveMap";

export function LogisticsDashboard() {
  return (
    <div className="flex h-screen">
      <div className="w-80 bg-white border-r border-gray-200">
        <div className="p-4">
          <h1 className="text-xl font-semibold text-blue-600">
            Logistics Tracker
          </h1>
        </div>
        <div className="p-4">
          <p className="text-gray-500"> driver list </p>
        </div>
      </div>

      <div className="flex-1 bg-gray-100">
        <LiveMap />
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import {
  fetchDrivers,
  startDriverMovementSimulation,
  setSelectedDriver,
} from "@/lib/store/slices/driversSlice";
import { Driver } from "@/lib/types";
import dynamic from "next/dynamic";

// Dynamic imports for map components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// Leaflet for custom icons - loaded client-side only
let L: typeof import("leaflet") | null = null;

// Custom marker icons for different driver statuses
const createCustomIcon = (status: string) => {
  if (!L) return undefined;

  const color =
    status === "online" ? "#22c55e" : status === "busy" ? "#f59e0b" : "#6b7280";

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 20px;
      height: 20px;
      background-color: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Component to handle map updates when drivers change
function MapUpdater() {
  const selectedDriver = useSelector(
    (state: RootState) => state.drivers.selectedDriver
  );

  // We'll use a ref to store the map instance from the parent
  return null;
}

// Individual driver marker component
function DriverMarker({ driver }: { driver: Driver }) {
  const dispatch = useDispatch<AppDispatch>();

  const handleMarkerClick = () => {
    console.log("Selected driver:", driver.name);
    dispatch(setSelectedDriver(driver));
  };

  const customIcon = createCustomIcon(driver.status);

  return (
    <Marker
      position={[driver.currentLocation.lat, driver.currentLocation.lng]}
      icon={customIcon}
      eventHandlers={{
        click: handleMarkerClick,
      }}
    >
      <Popup>
        <div className="p-2">
          <h3 className="font-semibold text-lg">{driver.name}</h3>
          <p className="text-sm text-gray-600">Status: {driver.status}</p>
          <p className="text-sm text-gray-600">
            Vehicle: {driver.vehicleInfo.make} {driver.vehicleInfo.model}
          </p>
          <p className="text-sm text-gray-600">
            Plate: {driver.vehicleInfo.plateNumber}
          </p>
          <p className="text-xs text-gray-500">
            Last updated: {new Date(driver.lastUpdated).toLocaleTimeString()}
          </p>
        </div>
      </Popup>
    </Marker>
  );
}

export function LiveMap() {
  const dispatch = useDispatch<AppDispatch>();
  const drivers = useSelector((state: RootState) => state.drivers.drivers);
  const selectedDriver = useSelector(
    (state: RootState) => state.drivers.selectedDriver
  );
  const loading = useSelector((state: RootState) => state.drivers.loading);
  const error = useSelector((state: RootState) => state.drivers.error);
  const [isClient, setIsClient] = useState(false);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  useEffect(() => {
    setIsClient(true);
    // Load Leaflet client-side only
    if (typeof window !== "undefined") {
      import("leaflet").then((leaflet) => {
        L = leaflet.default;
        // Fix for default markers
        if (L?.Icon?.Default?.prototype) {
          delete (
            L.Icon.Default.prototype as unknown as Record<string, unknown>
          )._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl:
              "https://unpkg.com/leaflet@1.9.0/dist/images/marker-icon-2x.png",
            iconUrl:
              "https://unpkg.com/leaflet@1.9.0/dist/images/marker-icon.png",
            shadowUrl:
              "https://unpkg.com/leaflet@1.9.0/dist/images/marker-shadow.png",
          });
        }
      });
    }
    dispatch(fetchDrivers());

    // Start driver movement simulation after a short delay
    setTimeout(() => {
      dispatch(startDriverMovementSimulation());
    }, 2000);
  }, [dispatch]);

  // Center map on selected driver
  useEffect(() => {
    if (mapInstance && selectedDriver) {
      mapInstance.flyTo(
        [
          selectedDriver.currentLocation.lat,
          selectedDriver.currentLocation.lng,
        ],
        12,
        { duration: 1.5 }
      );
    }
  }, [mapInstance, selectedDriver]);

  if (!isClient || loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading drivers: {error}</p>
        </div>
      </div>
    );
  }

  const center: [number, number] = [45.4215, -75.6972];

  return (
    <div className="h-full w-full">
      <MapContainer
        center={center}
        zoom={8}
        className="h-full w-full"
        style={{ height: "100%", width: "100%" }}
        ref={setMapInstance}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater />

        {drivers.map((driver) => (
          <DriverMarker key={driver.id} driver={driver} />
        ))}
      </MapContainer>
    </div>
  );
}

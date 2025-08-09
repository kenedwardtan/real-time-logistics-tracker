"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { updateDriver } from "@/lib/store/slices/driversSlice";
import { updateDelivery } from "@/lib/store/slices/deliveriesSlice";
import { Driver, Delivery } from "@/lib/types";

export function DispatchActions() {
  const dispatch = useDispatch<AppDispatch>();
  const drivers = useSelector((state: RootState) => state.drivers.drivers);
  const deliveries = useSelector(
    (state: RootState) => state.deliveries.deliveries
  );
  const selectedDriver = useSelector(
    (state: RootState) => state.drivers.selectedDriver
  );

  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string>("");
  const [targetDriverId, setTargetDriverId] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Get available drivers (online but idle)
  const availableDrivers = drivers.filter(
    (d) => d.status === "online" && d.deliveryStatus === "idle"
  );

  // Get pending/assigned deliveries
  const availableDeliveries = deliveries.filter(
    (d) => d.status === "pending" || d.status === "assigned"
  );

  // Optimistic update with rollback capability
  const performOptimisticUpdate = async (
    action: () => Promise<void>,
    rollbackAction: () => void,
    successMessage: string,
    errorMessage: string
  ) => {
    setIsProcessing(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 90% success rate for demonstration
      if (Math.random() > 0.1) {
        await action();
        showNotification(successMessage, "success");
      } else {
        // Simulate server error
        rollbackAction();
        showNotification(errorMessage, "error");
      }
    } catch (error) {
      rollbackAction();
      showNotification("Network error occurred", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Simple notification system
  const showNotification = (message: string, type: "success" | "error") => {
    // Create a simple toast notification
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 px-4 py-2 rounded-md text-white font-medium z-50 ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  // Reassign delivery to another driver
  const handleReassignDelivery = async () => {
    if (!selectedDeliveryId || !targetDriverId) return;

    const delivery = deliveries.find((d) => d.id === selectedDeliveryId);
    const newDriver = drivers.find((d) => d.id === targetDriverId);
    const oldDriverId = delivery?.driverId;

    if (!delivery || !newDriver) return;

    // Optimistic update
    const optimisticUpdates = () => {
      dispatch(
        updateDelivery({
          deliveryId: selectedDeliveryId,
          updates: { driverId: targetDriverId, status: "assigned" },
        })
      );

      dispatch(
        updateDriver({
          driverId: targetDriverId,
          updates: { deliveryStatus: "delivering", status: "busy" },
        })
      );

      if (oldDriverId) {
        dispatch(
          updateDriver({
            driverId: oldDriverId,
            updates: { deliveryStatus: "idle", status: "online" },
          })
        );
      }
    };

    // Rollback function
    const rollback = () => {
      dispatch(
        updateDelivery({
          deliveryId: selectedDeliveryId,
          updates: { driverId: oldDriverId, status: delivery.status },
        })
      );

      dispatch(
        updateDriver({
          driverId: targetDriverId,
          updates: { deliveryStatus: "idle", status: "online" },
        })
      );

      if (oldDriverId) {
        dispatch(
          updateDriver({
            driverId: oldDriverId,
            updates: { deliveryStatus: "delivering", status: "busy" },
          })
        );
      }
    };

    // Apply optimistic update immediately
    optimisticUpdates();

    // Perform API call with rollback capability
    await performOptimisticUpdate(
      async () => {
        // API call would go here
        console.log("Delivery reassigned successfully");
      },
      rollback,
      `Delivery reassigned to ${newDriver.name}`,
      "Failed to reassign delivery"
    );

    // Reset form
    setSelectedDeliveryId("");
    setTargetDriverId("");
  };

  // Mark delivery as completed
  const handleCompleteDelivery = async (deliveryId: string) => {
    const delivery = deliveries.find((d) => d.id === deliveryId);
    if (!delivery || !delivery.driverId) return;

    const driver = drivers.find((d) => d.id === delivery.driverId);
    if (!driver) return;

    // Optimistic update
    const optimisticUpdates = () => {
      dispatch(
        updateDelivery({
          deliveryId,
          updates: {
            status: "completed",
            actualDeliveryTime: new Date().toISOString(),
          },
        })
      );

      dispatch(
        updateDriver({
          driverId: delivery.driverId!,
          updates: { deliveryStatus: "idle", status: "online" },
        })
      );
    };

    // Rollback function
    const rollback = () => {
      dispatch(
        updateDelivery({
          deliveryId,
          updates: {
            status: delivery.status,
            actualDeliveryTime: delivery.actualDeliveryTime,
          },
        })
      );

      dispatch(
        updateDriver({
          driverId: delivery.driverId!,
          updates: {
            deliveryStatus: driver.deliveryStatus,
            status: driver.status,
          },
        })
      );
    };

    // Apply optimistic update immediately
    optimisticUpdates();

    // Perform API call with rollback capability
    await performOptimisticUpdate(
      async () => {
        console.log("Delivery completed successfully");
      },
      rollback,
      `Delivery completed by ${driver.name}`,
      "Failed to complete delivery"
    );
  };

  // Pause/Resume driver
  const handleToggleDriverStatus = async (driverId: string) => {
    const driver = drivers.find((d) => d.id === driverId);
    if (!driver) return;

    const newDeliveryStatus =
      driver.deliveryStatus === "paused" ? "delivering" : "paused";
    const originalStatus = driver.deliveryStatus;

    // Optimistic update
    const optimisticUpdates = () => {
      dispatch(
        updateDriver({
          driverId,
          updates: { deliveryStatus: newDeliveryStatus },
        })
      );
    };

    // Rollback function
    const rollback = () => {
      dispatch(
        updateDriver({
          driverId,
          updates: { deliveryStatus: originalStatus },
        })
      );
    };

    // Apply optimistic update immediately
    optimisticUpdates();

    // Perform API call with rollback capability
    await performOptimisticUpdate(
      async () => {
        console.log(
          `Driver ${newDeliveryStatus === "paused" ? "paused" : "resumed"}`
        );
      },
      rollback,
      `Driver ${driver.name} ${
        newDeliveryStatus === "paused" ? "paused" : "resumed"
      }`,
      `Failed to ${newDeliveryStatus === "paused" ? "pause" : "resume"} driver`
    );
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Dispatch Actions
      </h3>

      {/* Reassign Delivery Section */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Reassign Delivery
        </h4>
        <div className="space-y-3">
          <select
            value={selectedDeliveryId}
            onChange={(e) => setSelectedDeliveryId(e.target.value)}
            className="w-full text-sm border border-gray-300 rounded px-3 py-2"
            disabled={isProcessing}
          >
            <option value="">Select delivery...</option>
            {availableDeliveries.map((delivery) => (
              <option key={delivery.id} value={delivery.id}>
                {delivery.customerInfo.name} - {delivery.pickupLocation.address}
              </option>
            ))}
          </select>

          <select
            value={targetDriverId}
            onChange={(e) => setTargetDriverId(e.target.value)}
            className="w-full text-sm border border-gray-300 rounded px-3 py-2"
            disabled={isProcessing}
          >
            <option value="">Select driver...</option>
            {availableDrivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name} ({driver.vehicleInfo.plateNumber})
              </option>
            ))}
          </select>

          <button
            onClick={handleReassignDelivery}
            disabled={!selectedDeliveryId || !targetDriverId || isProcessing}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : "Reassign Delivery"}
          </button>
        </div>
      </div>

      {/* Active Deliveries Section */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Active Deliveries
        </h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {deliveries
            .filter(
              (d) => d.status === "delivering" || d.status === "picked-up"
            )
            .map((delivery) => {
              const driver = drivers.find((d) => d.id === delivery.driverId);
              return (
                <div
                  key={delivery.id}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <div className="text-xs">
                    <p className="font-medium">{delivery.customerInfo.name}</p>
                    <p className="text-gray-600">{driver?.name}</p>
                  </div>
                  <button
                    onClick={() => handleCompleteDelivery(delivery.id)}
                    disabled={isProcessing}
                    className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium hover:bg-green-700 disabled:bg-gray-300"
                  >
                    Complete
                  </button>
                </div>
              );
            })}
        </div>
      </div>

      {/* Driver Controls Section */}
      {selectedDriver && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Driver Controls
          </h4>
          <div className="bg-gray-50 p-3 rounded">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{selectedDriver.name}</p>
                <p className="text-xs text-gray-600">
                  Status: {selectedDriver.deliveryStatus}
                </p>
              </div>
              {selectedDriver.deliveryStatus !== "idle" && (
                <button
                  onClick={() => handleToggleDriverStatus(selectedDriver.id)}
                  disabled={isProcessing}
                  className={`px-3 py-1 rounded text-xs font-medium ${
                    selectedDriver.deliveryStatus === "paused"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-yellow-600 hover:bg-yellow-700 text-white"
                  } disabled:bg-gray-300`}
                >
                  {selectedDriver.deliveryStatus === "paused"
                    ? "Resume"
                    : "Pause"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

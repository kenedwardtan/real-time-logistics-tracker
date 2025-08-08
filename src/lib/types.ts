export interface Driver {
  id: string;
  name: string;
  status: "online" | "offline" | "busy";
  currentLocation: {
    lat: number;
    lng: number;
  };
  lastUpdated: string; // ISO string instead of Date for Redux serialization
  vehicleInfo: {
    make: string;
    model: string;
    plateNumber: string;
  };
  currentDelivery?: Delivery;
}

export interface Delivery {
  id: string;
  driverId: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  pickupLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  dropoffLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  customerInfo: {
    name: string;
    phone: string;
  };
  estimatedPickupTime: string; // ISO string instead of Date
  estimatedDeliveryTime: string; // ISO string instead of Date
  actualPickupTime?: string; // ISO string instead of Date
  actualDeliveryTime?: string; // ISO string instead of Date
  notes?: string;
}

export interface DriverUpdatePayload {
  driverId: string;
  updates: Partial<Driver>;
}

export interface DeliveryUpdatePayload {
  deliveryId: string;
  updates: Partial<Delivery>;
}

export interface StatusChangePayload {
  driverId: string;
  status: Driver["status"];
}

export type WebSocketMessage =
  | {
      type: "driver_update";
      payload: DriverUpdatePayload;
      timestamp: string;
    }
  | {
      type: "delivery_update";
      payload: DeliveryUpdatePayload;
      timestamp: string;
    }
  | {
      type: "status_change";
      payload: StatusChangePayload;
      timestamp: string;
    };

export interface OptimisticUpdate {
  id: string;
  action: {
    type: string;
    payload: Driver | Delivery | { driverId: string; updates: Partial<Driver> };
  };
  timestamp: string; // ISO string instead of Date
}

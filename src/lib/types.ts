export interface Driver {
  id: string;
  name: string;
  status: "online" | "offline" | "busy";
  currentLocation: {
    lat: number;
    lng: number;
  };
  lastUpdated: Date;
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
  estimatedPickupTime: Date;
  estimatedDeliveryTime: Date;
  actualPickupTime?: Date;
  actualDeliveryTime?: Date;
  notes?: string;
}

export interface WebSocketMessage {
  type: "driver_update" | "delivery_update" | "status_change";
  payload: Driver | Delivery | { driverId: string; status: Driver["status"] };
  timestamp: Date;
}

export interface OptimisticUpdate {
  id: string;
  action: {
    type: string;
    payload: Driver | Delivery | { driverId: string; updates: Partial<Driver> };
  };
  timestamp: Date;
}
